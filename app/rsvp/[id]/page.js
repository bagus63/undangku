"use client";
import { useState } from "react";
import Link from "next/link";
import { useInvitation } from "@/lib/useInvitation";
import { toV, nmText, copyText } from "@/lib/invite";
import { toast } from "@/lib/ui";
import UpgradeModal from "@/components/UpgradeModal";

export default function Rsvp({ params }) {
  const I = useInvitation(params.id, { withRsvps: true });
  const { row, rsvps, setRsvps, premium, sb } = I;
  const [f, setF] = useState("Semua");
  const [upg, setUpg] = useState(null);
  const [ask, setAsk] = useState(null);
  if (I.error) return <div className="center">{I.error}</div>;
  if (I.loading || !row) return <div className="center">Memuat RSVP…</div>;
  const v = toV(row);
  const c = (k) => rsvps.filter((r) => r.hadir === k).length;
  const tot = rsvps.filter((r) => r.hadir === "Hadir").reduce((a, r) => a + (r.jumlah || 0), 0);
  const list = rsvps.filter((r) => f === "Semua" || r.hadir === f);
  const pill = (h) => h === "Hadir" ? <span className="pill p-ok">Hadir</span> : h === "Tidak hadir" ? <span className="pill p-bad">Tidak hadir</span> : <span className="pill p-warn">Ragu</span>;
  const csv = () => {
    if (!premium) { setUpg("Ekspor RSVP tersedia di paket Premium."); return; }
    const q = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const out = ["Nama,Kehadiran,Jumlah,Ucapan,Waktu", ...rsvps.map((r) => [r.nama, r.hadir, r.jumlah, r.ucapan, new Date(r.created_at).toLocaleString("id-ID")].map(q).join(","))].join("\n");
    copyText(out).then(() => toast("CSV disalin. Tempel di Excel atau Google Sheets."));
  };
  const del = async (r) => { const { error } = await sb.from("rsvps").delete().eq("id", r.id); setAsk(null); if (error) return toast(error.message); setRsvps(rsvps.filter((x) => x.id !== r.id)); toast("Ucapan dihapus"); };
  return (
    <div className="gut"><div className="in page">
      <Link className="hint" href="/dashboard" style={{ textDecoration: "none" }}>← Undangan saya</Link>
      <h2 className="h2">RSVP &amp; ucapan · {nmText(v)}</h2>
      <p className="lead">Rekap konfirmasi kehadiran dan doa dari tamu. Ucapan yang tidak pantas bisa kamu hapus.</p>
      <div className="stats">
        <div className="stat ok"><b>{c("Hadir")}</b><span>Konfirmasi hadir</span></div>
        <div className="stat bad"><b>{c("Tidak hadir")}</b><span>Tidak hadir</span></div>
        <div className="stat warn"><b>{c("Ragu")}</b><span>Masih ragu</span></div>
        <div className="stat tot"><b>{tot}</b><span>Perkiraan orang datang</span></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "28px 0 12px" }}>
        <div className="chips" style={{ margin: 0 }}>{["Semua", "Hadir", "Tidak hadir", "Ragu"].map((x) => <button type="button" key={x} className="chip" aria-pressed={f === x} onClick={() => setF(x)}>{x}</button>)}</div>
        <button type="button" className="btn sm" onClick={csv}>Salin sebagai CSV</button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {list.length ? list.map((r) => (
          <div className="wish" key={r.id}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}><b>{r.nama}</b>{pill(r.hadir)}{r.hadir === "Hadir" && <small>· {r.jumlah} orang</small>}
              <span style={{ marginLeft: "auto" }}>{ask === r.id ? <><button type="button" className="btn sm danger" onClick={() => del(r)}>Ya, hapus</button> <button type="button" className="btn sm" onClick={() => setAsk(null)}>Batal</button></> : <button type="button" className="btn sm ghost" onClick={() => setAsk(r.id)}>Hapus</button>}</span></div>
            <p>{r.ucapan}</p><small>{new Date(r.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small>
          </div>
        )) : <p className="hint">Belum ada konfirmasi. Setelah undangan terbit dan dikirim, RSVP tamu muncul di sini.</p>}
      </div>
      <UpgradeModal open={upg !== null} onClose={() => setUpg(null)} reason={upg} invitation={{ id: row.id, slug: row.slug, label: nmText(v) }} />
    </div></div>
  );
}
