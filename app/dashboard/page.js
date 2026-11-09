"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useUser } from "@/lib/useUser";
import { JENIS, RESELLER, toV, nmText, fmt } from "@/lib/invite";
import { toast } from "@/lib/ui";
import Mini from "@/components/Mini";
import CreateModal from "@/components/CreateModal";

function Dash() {
  const { user, profile, loading } = useUser();
  const router = useRouter();
  const q = useSearchParams();
  const [rows, setRows] = useState(null);
  const [creating, setCreating] = useState(false);
  const [ask, setAsk] = useState(null);
  const sb = supabaseBrowser();
  const load = useCallback(async () => {
    const { data, error } = await sb.from("invitations").select("*, guests(count), rsvps(hadir,jumlah)").order("created_at", { ascending: false });
    if (error) { toast("Gagal memuat: " + error.message); setRows([]); return; }
    setRows(data);
  }, [sb]);
  useEffect(() => { if (user) load(); }, [user, load]);
  useEffect(() => { if (q.get("baru")) setCreating(true); }, [q]);
  if (loading || !rows) return <div className="center">Memuat undangan…</div>;
  const plan = profile?.plan && RESELLER.find((r) => r.id === profile.plan);
  const prem = (r) => r.paket === "premium" || !!plan;
  const act = rows.filter((r) => r.status !== "arsip");
  const tamu = rows.reduce((a, r) => a + (r.guests?.[0]?.count || 0), 0);
  const rs = rows.reduce((a, r) => a + r.rsvps.length, 0);
  const hadir = rows.reduce((a, r) => a + r.rsvps.filter((x) => x.hadir === "Hadir").reduce((s, x) => s + (x.jumlah || 0), 0), 0);
  const basic = act.filter((r) => !prem(r));
  const act2 = async (a, r) => {
    if (a === "dup") {
      const slug = r.slug.replace(/-[a-z0-9]{4}$/, "") + "-" + Math.random().toString(36).slice(2, 6);
      const { error } = await sb.from("invitations").insert({ slug, jenis: r.jenis, theme: r.theme, content: r.content });
      error ? toast(error.message) : toast("Undangan diduplikat sebagai draft");
    }
    if (a === "arsip") {
      const st = r.status === "arsip" ? "draft" : "arsip";
      const { error } = await sb.from("invitations").update({ status: st }).eq("id", r.id);
      error ? toast(error.message) : toast(st === "arsip" ? "Diarsipkan, tidak bisa dibuka tamu" : "Undangan aktif lagi sebagai draft");
    }
    if (a === "del") {
      const { error } = await sb.from("invitations").delete().eq("id", r.id);
      setAsk(null); error ? toast(error.message) : toast("Undangan dihapus");
    }
    load();
  };
  const newInv = () => {
    if (plan && act.length >= plan.slot) { toast(`Slot ${plan.nama} penuh (${plan.slot}). Arsipkan undangan yang sudah selesai.`); return; }
    setCreating(true);
  };
  const st = (r) => r.status === "terbit" ? <span className="pill p-ok">Terbit</span> : r.status === "arsip" ? <span className="pill p-none">Arsip</span> : <span className="pill p-warn">Draft</span>;
  return (
    <div className="gut"><div className="in page">
      <div className="dhead">
        <div><span className="eyebrow">{plan ? `Paket Reseller ${plan.nama}` : "Akun pribadi"}</span><h2 className="h2" style={{ marginBottom: 0 }}>Halo, {profile?.nama || user.email}</h2></div>
        <button type="button" className="btn pri" onClick={newInv}>+ Buat undangan baru</button>
      </div>
      <div className="stats">
        <div className="stat tot"><b>{plan ? `${act.length}/${plan.slot}` : act.length}</b><span>{plan ? "Slot undangan aktif" : "Undangan aktif"}</span></div>
        <div className="stat"><b>{tamu}</b><span>Tamu diundang</span></div>
        <div className="stat"><b>{rs}</b><span>RSVP masuk</span></div>
        <div className="stat ok"><b>{hadir}</b><span>Perkiraan orang datang</span></div>
      </div>
      {!plan && basic.length > 0 && (
        <div className="banner"><span><b>{basic.length} undangan masih Basic.</b> Batas 30 tamu, 5 foto, dan ada label Undangku.</span>
          <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link className="btn sm" href="/harga">Bandingkan paket</Link><Link className="btn sm" href="/harga?p=reseller">Saya WO / reseller</Link></span></div>
      )}
      <div className="igrid">
        {rows.map((r) => {
          const v = toV(r); const ev = fmt(v.events[0]?.waktu);
          return (
            <article className="icard" key={r.id}>
              <Mini v={v} theme={v.theme} cls="tall" tall />
              <div className="body">
                <div className="pills">{st(r)}{prem(r) ? <span className="pill p-pro">Premium</span> : <span className="pill p-none">Basic</span>}</div>
                <h3>{nmText(v)}</h3>
                <div className="meta">{JENIS[v.jenis].label} · {ev.tgl}</div>
                <div className="nums"><span><b>{r.guests?.[0]?.count || 0}</b> tamu</span><span><b>{r.rsvps.length}</b> RSVP</span></div>
                <div className="acts">
                  {ask === r.id ? (<>
                    <span className="hint">Hapus undangan ini beserta tamu dan RSVP-nya?</span>
                    <button type="button" className="btn sm danger" onClick={() => act2("del", r)}>Ya, hapus</button>
                    <button type="button" className="btn sm" onClick={() => setAsk(null)}>Batal</button>
                  </>) : (<>
                    <Link className="btn sm pri" href={`/editor/${r.id}`}>Edit</Link>
                    <Link className="btn sm" href={`/tamu/${r.id}`}>Tamu</Link>
                    <Link className="btn sm" href={`/rsvp/${r.id}`}>RSVP</Link>
                    <Link className="btn sm" href={`/lihat/${r.id}`}>Lihat</Link>
                    <button type="button" className="btn sm ghost" onClick={() => act2("dup", r)}>Duplikat</button>
                    <button type="button" className="btn sm ghost" onClick={() => act2("arsip", r)}>{r.status === "arsip" ? "Aktifkan" : "Arsipkan"}</button>
                    <button type="button" className="btn sm ghost" onClick={() => setAsk(r.id)}>Hapus</button>
                  </>)}
                </div>
              </div>
            </article>
          );
        })}
        <button type="button" className="newcard" onClick={newInv}><b>+</b>Buat undangan baru<span className="hint" style={{ fontWeight: 500 }}>Pernikahan, ulang tahun, khitanan, aqiqah, atau acara umum</span></button>
      </div>
      <CreateModal open={creating} onClose={() => { setCreating(false); if (q.get("baru")) router.replace("/dashboard"); }} defaultTheme={q.get("tema") || undefined} />
    </div></div>
  );
}
export default function Page() { return <Suspense fallback={<div className="center">Memuat…</div>}><Dash /></Suspense>; }
