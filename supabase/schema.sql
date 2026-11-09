-- =====================================================================
-- Undangku: skema database Supabase
-- Jalankan sekali di Supabase > SQL Editor > New query > Run
-- =====================================================================


-- ---------- profil pengguna ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text,
  email text,
  plan text,                       -- null = pribadi; 'mitra' | 'studio' | 'agensi' = reseller
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, email)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
          new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- ---------- undangan ----------
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade default auth.uid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  jenis text not null default 'nikah' check (jenis in ('nikah','ultah','khitan','aqiqah','umum')),
  theme text not null default 'mocha',
  status text not null default 'draft' check (status in ('draft','terbit','arsip')),
  paket text not null default 'basic' check (paket in ('basic','premium')),
  content jsonb not null default '{}'::jsonb,
  ai_left int not null default 5,
  ai_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists invitations_owner_idx on public.invitations(owner);

-- ---------- tamu ----------
create table if not exists public.guests (
  id bigserial primary key,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  nama text not null check (length(nama) between 1 and 120),
  hp text,
  created_at timestamptz not null default now()
);
create index if not exists guests_inv_idx on public.guests(invitation_id);

-- ---------- RSVP & ucapan ----------
create table if not exists public.rsvps (
  id bigserial primary key,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  nama text not null check (length(nama) between 1 and 120),
  hadir text not null check (hadir in ('Hadir','Tidak hadir','Ragu')),
  jumlah int not null default 1 check (jumlah between 0 and 20),
  ucapan text check (length(ucapan) <= 1000),
  created_at timestamptz not null default now()
);
create index if not exists rsvps_inv_idx on public.rsvps(invitation_id);

-- ---------- permintaan pembayaran (transfer manual) ----------
create table if not exists public.payments (
  id bigserial primary key,
  invitation_id uuid references public.invitations(id) on delete set null,
  owner uuid not null references auth.users(id) on delete cascade default auth.uid(),
  item text not null,              -- 'premium' | 'reseller:mitra' | ...
  amount int not null,
  note text,
  status text not null default 'menunggu' check (status in ('menunggu','lunas','ditolak')),
  created_at timestamptz not null default now()
);

-- ---------- aturan paket ----------
create or replace function public.inv_is_premium(inv public.invitations) returns boolean
language sql stable security definer set search_path = public as $$
  select inv.paket = 'premium' or exists (select 1 from public.profiles p where p.id = inv.owner and p.plan is not null)
$$;

-- desain Premium hanya bisa diterbitkan oleh undangan Premium
create or replace function public.check_publish() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if new.status = 'terbit' and new.theme in ('sinema','bento','mono','plum','nusa') and not public.inv_is_premium(new) then
    raise exception 'Desain ini khusus Premium. Upgrade untuk menerbitkan.';
  end if;
  return new;
end $$;
drop trigger if exists invitations_check on public.invitations;
create trigger invitations_check before insert or update on public.invitations
  for each row execute function public.check_publish();

-- batas 30 tamu untuk Basic
create or replace function public.check_guest_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare inv public.invitations; n int;
begin
  select * into inv from public.invitations where id = new.invitation_id;
  if not public.inv_is_premium(inv) then
    select count(*) into n from public.guests where invitation_id = new.invitation_id;
    if n >= 30 then raise exception 'Paket Basic maksimal 30 tamu.'; end if;
  end if;
  return new;
end $$;
drop trigger if exists guests_limit on public.guests;
create trigger guests_limit before insert on public.guests
  for each row execute function public.check_guest_limit();


-- status Premium sebuah undangan (dibaca halaman tamu untuk menyembunyikan label)
create or replace function public.invitation_premium(inv_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.inv_is_premium(i) from public.invitations i where i.id = inv_id and i.status = 'terbit'
$$;
grant execute on function public.invitation_premium(uuid) to anon, authenticated;

-- ---------- fungsi khusus admin ----------
create or replace function public.admin_set_paket(inv_id uuid, p text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Bukan admin'; end if;
  update public.invitations set paket = p where id = inv_id;
end $$;

create or replace function public.admin_set_plan(user_id uuid, p text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Bukan admin'; end if;
  update public.profiles set plan = nullif(p,'') where id = user_id;
end $$;

create or replace function public.admin_payment(pay_id bigint, st text) returns void
language plpgsql security definer set search_path = public as $$
declare pay public.payments;
begin
  if not public.is_admin() then raise exception 'Bukan admin'; end if;
  update public.payments set status = st where id = pay_id returning * into pay;
  if st = 'lunas' then
    if pay.item = 'premium' and pay.invitation_id is not null then
      update public.invitations set paket = 'premium', ai_left = greatest(ai_left, 50) where id = pay.invitation_id;
    elsif pay.item like 'reseller:%' then
      update public.profiles set plan = split_part(pay.item, ':', 2) where id = pay.owner;
    end if;
  end if;
end $$;

-- kuota Minta AI harian (dipotong di server)
create or replace function public.use_ai(inv_id uuid) returns int
language plpgsql security definer set search_path = public as $$
declare inv public.invitations; cap int;
begin
  select * into inv from public.invitations where id = inv_id and owner = auth.uid();
  if inv.id is null then raise exception 'Tidak ditemukan'; end if;
  cap := case when public.inv_is_premium(inv) then 50 else 5 end;
  if inv.ai_date <> current_date then
    update public.invitations set ai_left = cap, ai_date = current_date where id = inv_id;
    inv.ai_left := cap;
  end if;
  if inv.ai_left <= 0 then return -1; end if;
  update public.invitations set ai_left = ai_left - 1 where id = inv_id;
  return inv.ai_left - 1;
end $$;

-- ---------- hak akses kolom: pengguna tidak bisa mengubah paket sendiri ----------
revoke insert, update on public.invitations from authenticated, anon;
grant select, delete on public.invitations to authenticated;
grant insert (owner, slug, jenis, theme, status, content) on public.invitations to authenticated;
grant update (slug, jenis, theme, status, content) on public.invitations to authenticated;
grant select on public.invitations to anon;
revoke update on public.profiles from authenticated;
grant update (nama) on public.profiles to authenticated;

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.payments enable row level security;

drop policy if exists "profil sendiri" on public.profiles;
create policy "profil sendiri" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "ubah profil sendiri" on public.profiles;
create policy "ubah profil sendiri" on public.profiles for update using (id = auth.uid());

drop policy if exists "pemilik undangan" on public.invitations;
create policy "pemilik undangan" on public.invitations for all
  using (owner = auth.uid() or public.is_admin()) with check (owner = auth.uid());
drop policy if exists "undangan terbit publik" on public.invitations;
create policy "undangan terbit publik" on public.invitations for select using (status = 'terbit');

drop policy if exists "tamu milik pemilik" on public.guests;
create policy "tamu milik pemilik" on public.guests for all
  using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner = auth.uid()))
  with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner = auth.uid()));

drop policy if exists "rsvp dibaca" on public.rsvps;
create policy "rsvp dibaca" on public.rsvps for select
  using (exists (select 1 from public.invitations i where i.id = invitation_id and (i.status = 'terbit' or i.owner = auth.uid())));
drop policy if exists "rsvp dikirim tamu" on public.rsvps;
create policy "rsvp dikirim tamu" on public.rsvps for insert
  with check (exists (select 1 from public.invitations i where i.id = invitation_id and (i.status = 'terbit' or i.owner = auth.uid())));
drop policy if exists "rsvp dihapus pemilik" on public.rsvps;
create policy "rsvp dihapus pemilik" on public.rsvps for delete
  using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner = auth.uid()));
grant select, insert on public.rsvps to anon;
grant usage on sequence public.rsvps_id_seq to anon;

drop policy if exists "pembayaran sendiri" on public.payments;
create policy "pembayaran sendiri" on public.payments for select using (owner = auth.uid() or public.is_admin());
drop policy if exists "buat pembayaran" on public.payments;
create policy "buat pembayaran" on public.payments for insert with check (owner = auth.uid() and status = 'menunggu');

-- ---------- penyimpanan foto & lagu ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 10485760)
on conflict (id) do update set public = true;

drop policy if exists "media dibaca publik" on storage.objects;
create policy "media dibaca publik" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media diunggah pemilik" on storage.objects;
create policy "media diunggah pemilik" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "media dihapus pemilik" on storage.objects;
create policy "media dihapus pemilik" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================================
-- Setelah kamu mendaftar di aplikasi, jadikan akunmu admin:
--   update public.profiles set is_admin = true where email = 'emailkamu@gmail.com';
-- =====================================================================
