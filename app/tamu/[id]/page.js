"use client";
import { useState } from "react";
import Link from "next/link";
import { useInvitation } from "@/lib/useInvitation";
import { toV, nmText, LIMIT, slugify, esc } from "@/lib/invite";
import { toast, siteUrl, RESERVED } from "@/lib/ui";
import { copyText } from "@/lib/invite";
import UpgradeModal from "@/components/UpgradeModal";

export default function Tamu({ params }) {
  const I = useInvitation(params.id, { withGuests: true, withRsvps: true });
  const { row, guests, setGuests, rsvps, premium, sb, patch } = I;
  const [bulk, setBulk] = useState("");
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState(null);
  const [slugErr, setSlugErr] = useState("");
  const [upg, setUpg] = useState(null);
  const [busy, setBusy] = useState(false);
  if (I.error) return <div className="center">{I.error}</div>;
  if (I.loading || !row) return <div className="center">Memuat daftar tamu…</div>;
  const v = toV(row);
  const L = LIMIT[premium ? "premium" : "basic"];
  const link = (n) => `${siteUrl()}/${row.slug}${n ? "?to=" + encodeURIComponent(n).replace(/%20/g, "+") : ""}`;
  const waMsg = (n) => v.waTpl.replace(/\{nama\}/g, n).replace(/\{link\}/g, link(n));
  const waHref = (g) => { let hp = (g.hp || "").replace(/\D/g, ""); if (hp.startsWith("0")) hp = "62" + hp.slice(1); return `https://wa.me/${hp}?text=${encodeURIComponent(waMsg(g.nama))}`; };
  const statusOf = (n) => rsvps.find((r) => r.nama.trim().toLowerCase() === n.trim().toLowerCase())?.hadir;
  const pill = (h) => h === "Hadir" ? <span className="pill p-ok">Hadir</span> : h === "Tidak hadir" ? <span className="pill p-bad">Tidak hadir</span> : h === "Ragu" ? <span className="pill p-warn">Ragu</span> : <span className="pill p-none">Belum respon</span>;

  const add = async () => {
    let lines = bulk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) { toast("Tulis minimal satu nama"); return; }
    const room = L.tamu - guests.length; let cut = 0;
    if (lines.length > room) { cut = lines.length - Math.max(0, room); lines = lines.slice(0, Math.max(0, room)); }
    if (lines.length) {
      setBusy(true);
      const rows = lines.map((l) => { const [n, ...h] = l.split(","); return { invitation_id: row.id, nama: n.trim().slice(0, 120), hp: h.join(",").trim() || null }; });
      const { data, error } = await sb.from("guests").insert(rows).select();
      setBusy(false);
      if (error) { /30/.test(error.message) ? setUpg(error.message) : toast(error.message); return; }
      setGuests([...guests, ...data]); toast(lines.length + " tamu ditambahkan");
      if (!cut) setBulk("");
    }
    if (cut) setUpg(`Paket Basic maksimal ${L.tamu} tamu. ${cut} nama belum masuk.`);
  };
  const del = async (g) => { const { error } = await sb.from("guests").delete().eq("id", g.id); if (error) return toast(error.message); setGuests(guests.filter((x) => x.id !== g.id)); };
  const saveSlug = async () => {
    const s = slugify(slug); setSlugErr("");
    if (s === row.slug) { setSlug(null); return; }
    if (s.length < 3) { setSlugErr("Minimal 3 huruf atau angka."); return; }
    if (RESERVED.includes(s)) { setSlugErr("Alamat ini dipakai sistem, pilih yang lain."); return; }
    const { error } = await sb.from("invitations").update({ slug: s }).eq("id", row.id);
    if (error) { setSlugErr(/duplicate|unique/i.test(error.message) ? "Alamat ini sudah dipakai orang lain." : error.message); return; }
    I.setRow({ ...row, slug: s }); setSlug(null); toast("Alamat undangan diperbarui");
  };
  const list = guests.filter((g) => g.nama.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="gut"><div className="in page">
      <Link className="hint" href="/dashboard" style={{ textDecoration: "none" }}>← Undangan saya</Link>
      <h2 className="h2">Daftar tamu · {nmText(v)}</h2>
      <p className="lead">Setiap tamu mendapat link personal. Tekan "Kirim WA" untuk membuka WhatsApp dengan pesan yang sudah terisi.</p>
      {row.status !== "terbit" && <div className="banner"><span><b>Undangan belum terbit.</b> Tamu baru bisa membuka link setelah kamu menekan Terbitkan di editor.</span><Link className="btn sm pri" href={`/editor/${row.id}`}>Buka editor</Link></div>}
      <div className="tamu-grid">
        <div style={{ display: "grid", gap: 18 }}>
          <div className="panel">
            <h3>Tambah tamu</h3>
            <label className="f">Satu tamu per baris. Nomor WA boleh ditambahkan setelah koma.
              <textarea id="bulk" rows={5} value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"Budi Santoso, 081234567890\nKeluarga Bpk. Ahmad\nRina & Partner, 0857..."} /></label>
            <button type="button" className="btn pri" disabled={busy} onClick={add}>{busy ? "Menyimpan…" : "Tambahkan ke daftar"}</button>
            <span className="hint">{L.tamu === Infinity ? "Premium: tamu tanpa batas." : `Basic: ${guests.length} dari ${L.tamu} tamu terpakai.`}</span>
          </div>
          <div className="panel">
            <h3>Link undangan</h3>
            <label className="f">Alamat undangan
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="hint" style={{ whiteSpace: "nowrap" }}>{siteUrl().replace(/^https?:\/\//, "")}/</span>
                <input id="slug" value={slug ?? row.slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} onBlur={() => slug !== null && saveSlug()} onKeyDown={(e) => e.key === "Enter" && saveSlug()} /></div></label>
            {slugErr && <span className="err">{slugErr}</span>}
            <label className="f">Template pesan WhatsApp
              <textarea id="waTpl" rows={9} defaultValue={v.waTpl} onChange={(e) => patch((r) => { r.content = { ...r.content, waTpl: e.target.value }; return r; })} /></label>
            <p className="hint" style={{ margin: 0 }}>Gunakan <b>{"{nama}"}</b> untuk nama tamu dan <b>{"{link}"}</b> untuk link undangan. {I.saveState}</p>
          </div>
        </div>
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3>Tamu ({guests.length})</h3>
            <input id="gSearch" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama…" style={{ maxWidth: 220 }} />
          </div>
          <div className="glist">
            {list.length ? list.map((g) => (
              <div className="grow" key={g.id}>
                <div style={{ minWidth: 0 }}><div className="nm">{g.nama}{pill(statusOf(g.nama))}</div><div className="lk">{link(g.nama)}{g.hp ? " · " + g.hp : ""}</div></div>
                <div className="acts">
                  <a className="btn sm pri" href={waHref(g)} target="_blank" rel="noopener">Kirim WA</a>
                  <button type="button" className="btn sm" onClick={() => copyText(waMsg(g.nama)).then(() => toast("Pesan disalin, tinggal tempel di WhatsApp"))}>Salin pesan</button>
                  <a className="btn sm" href={`/lihat/${row.id}?to=${encodeURIComponent(g.nama)}`}>Lihat</a>
                  <button type="button" className="btn sm ghost" aria-label="Hapus tamu" onClick={() => del(g)}>✕</button>
                </div>
              </div>
            )) : <p className="hint">{guests.length ? "Tidak ada nama yang cocok." : "Belum ada tamu. Tempel daftar nama di kolom kiri."}</p>}
          </div>
        </div>
      </div>
      <UpgradeModal open={upg !== null} onClose={() => setUpg(null)} reason={upg} invitation={{ id: row.id, slug: row.slug, label: nmText(v) }} />
    </div></div>
  );
}
