"use client";
import { useEffect, useState } from "react";

/* Halaman diagnosis koneksi Supabase. Aman ditampilkan: hanya nilai publik. */
export default function Cek() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const [ping, setPing] = useState("Mengecek…");
  const [db, setDb] = useState("Mengecek…");
  useEffect(() => {
    if (!url) { setPing("Dilewati: URL kosong"); setDb("Dilewati"); return; }
    fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, { headers: { apikey: key } })
      .then((r) => setPing(r.ok ? "Berhasil terhubung ✓" : `Terhubung, tapi ditolak (kode ${r.status}). Cek publishable key.`))
      .catch((e) => setPing("Gagal terhubung: " + e.message + ". Cek alamat Supabase."));
    fetch(`${url.replace(/\/$/, "")}/rest/v1/invitations?select=id&limit=1`, { headers: { apikey: key, Authorization: key.startsWith("eyJ") ? `Bearer ${key}` : undefined } })
      .then(async (r) => { const t = await r.text(); setDb(r.ok ? "Tabel ditemukan ✓" : /does not exist|42P01|PGRST205/.test(t) ? "Tabel belum ada: jalankan supabase/schema.sql di SQL Editor" : `Kode ${r.status}: ${t.slice(0, 160)}`); })
      .catch((e) => setDb("Gagal: " + e.message));
  }, [url, key]);
  const row = (k, v, ok) => <tr><td><b>{k}</b></td><td style={{ overflowWrap: "anywhere" }}>{v}</td><td>{ok ? <span className="pill p-ok">OK</span> : <span className="pill p-bad">Periksa</span>}</td></tr>;
  const urlOk = /^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(url);
  return (
    <div className="gut"><div className="in page">
      <h2 className="h2">Cek koneksi</h2>
      <div className="panel scrollx"><table className="tbl"><tbody>
        {row("NEXT_PUBLIC_SUPABASE_URL", url ? `"${url}"` : "(kosong)", urlOk)}
        {row("NEXT_PUBLIC_SUPABASE_ANON_KEY", key ? `${key.slice(0, 18)}… (${key.length} karakter)` : "(kosong)", key.length > 30 && !/\s/.test(key))}
        {row("NEXT_PUBLIC_SITE_URL", site || "(kosong)", /^https:\/\//.test(site))}
        {row("Koneksi ke Supabase", ping, ping.includes("✓"))}
        {row("Database", db, db.includes("✓"))}
      </tbody></table></div>
      {!urlOk && url && <p className="err">Alamat harus persis seperti https://xxxxxxxxxxxxxxxxxxxx.supabase.co tanpa spasi, tanpa garis miring tambahan, dan tidak terpotong.</p>}
    </div></div>
  );
}
