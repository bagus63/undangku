# Undangku

Platform undangan digital untuk pernikahan, ulang tahun, khitanan, aqiqah, dan acara umum.
Dibangun dengan **Next.js 14**, **Supabase** (login, database, penyimpanan foto), dan di-hosting di **Vercel**.

## Fitur

- Daftar/masuk dengan email atau Google
- Dashboard "Undangan Saya": buat, duplikat, arsipkan, hapus
- 5 jenis acara dan 11 desain (6 gratis, 5 Premium)
- Editor dengan pratinjau langsung, simpan otomatis, unggah foto & lagu
- Studio: atur urutan bagian, sembunyikan bagian, warna aksen
- Minta AI (versi awal berbasis aturan, kuota harian dihitung di server)
- Link tamu personal `domainmu.com/alamat-undangan?to=Nama` + kirim WhatsApp
- RSVP & ucapan tamu, rekap, ekspor CSV (Premium)
- Paket Basic/Premium dan Reseller, pembayaran transfer manual
- Halaman admin: konfirmasi pembayaran, atur paket undangan & pengguna

## Cara memasang (sekali saja)

### 1. Supabase (database)
1. Buka https://supabase.com → **New project**. Pilih region **Southeast Asia (Singapore)**. Simpan kata sandi database.
2. Setelah proyek jadi, buka **SQL Editor → New query**, salin seluruh isi file `supabase/schema.sql`, tempel, lalu tekan **Run**.
3. Buka **Authentication → Providers → Email**. Untuk masa uji coba, matikan **Confirm email** supaya pengguna bisa langsung masuk setelah daftar.
4. Buka **Project Settings → API**. Catat **Project URL** dan **anon public key**.

### 2. Vercel (hosting)
1. Buka https://vercel.com → **Add New → Project** → pilih repository `undangku` → **Import**.
2. Di bagian **Environment Variables**, isi:

   | Nama | Isi |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key dari Supabase |
   | `NEXT_PUBLIC_SITE_URL` | alamat situs, misalnya `https://undangku.vercel.app` |
   | `NEXT_PUBLIC_BANK_INFO` | rekening untuk transfer, misalnya `BCA 1234567890 a.n. Nama Kamu` |
   | `NEXT_PUBLIC_ADMIN_WA` | nomor WhatsApp admin, format `6281234567890` |

3. Tekan **Deploy**. Setelah selesai, Vercel memberi alamat situs. Kalau alamatnya berbeda dari `NEXT_PUBLIC_SITE_URL`, perbarui variabel itu lalu **Redeploy**.

### 3. Sambungkan alamat situs ke Supabase
Di Supabase → **Authentication → URL Configuration**:
- **Site URL**: alamat situs dari Vercel
- **Redirect URLs**: tambahkan `https://alamat-situsmu/auth/callback`

### 4. Jadikan akunmu admin
Daftar di situsmu, lalu di Supabase **SQL Editor** jalankan:
```sql
update public.profiles set is_admin = true where email = 'emailkamu@gmail.com';
```
Menu **Admin** akan muncul setelah kamu masuk ulang.

### 5. (Opsional) Login dengan Google
1. Di https://console.cloud.google.com buat **OAuth client ID** tipe *Web application*.
2. **Authorized redirect URI**: `https://<project-id>.supabase.co/auth/v1/callback` (lihat di Supabase → Authentication → Providers → Google).
3. Tempel Client ID dan Client Secret di Supabase → Authentication → Providers → **Google** → Enable.

### 6. (Opsional) Domain sendiri
Vercel → Project → **Settings → Domains** → tambahkan domainmu, ikuti petunjuk DNS. Lalu perbarui `NEXT_PUBLIC_SITE_URL` dan URL di Supabase (langkah 3).

## Alur pembayaran (transfer manual)
1. Pengguna menekan **Upgrade** → melihat rekening → transfer → menekan **Saya sudah transfer**.
2. Kamu buka **/admin → Pembayaran**, cek mutasi rekening, lalu tekan **Lunas**.
3. Paket otomatis aktif (Premium untuk undangan itu, atau paket Reseller untuk akunnya).

Payment gateway otomatis (Midtrans/Xendit) bisa ditambahkan setelah akunnya disetujui.

## Menjalankan di komputer sendiri
```bash
npm install
cp .env.example .env.local   # isi dengan data Supabase
npm run dev                  # buka http://localhost:3000
```
Untuk mencoba tanpa Supabase, isi `NEXT_PUBLIC_SUPABASE_URL=mock` di `.env.local`. Data hanya tersimpan di browser (mode uji coba).

## Struktur
```
app/                  halaman (beranda, tema, harga, masuk, dashboard, editor, tamu, rsvp, lihat, admin, [slug] = halaman tamu)
components/           komponen bersama (pratinjau undangan, modal, navigasi)
lib/invite.js         data desain & jenis acara + mesin penampil undangan
lib/supabase/         koneksi Supabase (+ mock untuk uji coba)
supabase/schema.sql   tabel, aturan keamanan, dan penyimpanan
```

Halaman `/cek` menampilkan status koneksi ke Supabase untuk membantu mencari masalah saat pemasangan.
