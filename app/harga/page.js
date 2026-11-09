"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RESELLER, rp } from "@/lib/invite";
import { useUser } from "@/lib/useUser";
import { toast } from "@/lib/ui";
import { PersonalCards } from "@/lib/pricing";
import UpgradeModal from "@/components/UpgradeModal";

function Harga() {
  const q = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [p, setP] = useState(q.get("p") === "reseller" ? "reseller" : "personal");
  const [bill, setBill] = useState("m");
  const [res, setRes] = useState(null);
  const y = bill === "y";
  const upgrade = () => { if (!user) return router.push("/masuk?daftar=1"); toast("Buka undangan yang ingin di-upgrade, lalu tekan Upgrade di editor."); router.push("/dashboard"); };
  const reseller = (id) => { if (!user) return router.push(`/masuk?daftar=1&lanjut=${encodeURIComponent("/harga?p=reseller")}`); setRes(id); };
  return (
    <div className="gut"><div className="in page">
      <span className="eyebrow">Harga</span>
      <h2 className="h2">Paket untuk setiap kebutuhan</h2>
      <p className="lead">Untuk acara pribadi, bayar sekali per undangan. Untuk WO dan jasa undangan, langganan bulanan atau tahunan.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
        <div className="seg"><button type="button" aria-pressed={p === "personal"} onClick={() => setP("personal")}>Pribadi</button><button type="button" aria-pressed={p === "reseller"} onClick={() => setP("reseller")}>Reseller</button></div>
        {p === "reseller" && <div className="seg"><button type="button" aria-pressed={!y} onClick={() => setBill("m")}>Bulanan</button><button type="button" aria-pressed={y} onClick={() => setBill("y")}>Tahunan · hemat 2 bulan</button></div>}
      </div>
      {p === "personal" ? (<>
        <div className="prices two"><PersonalCards onUpgrade={upgrade} loggedIn={!!user} /></div>
        <div className="scrollx"><table className="cmp"><thead><tr><th>Fitur</th><th>Basic</th><th>Premium</th></tr></thead><tbody>
          {[["Desain", "6", "Semua"], ["Jumlah tamu", "30", "Tanpa batas"], ["Foto galeri", "5", "Tanpa batas"], ["Link personal per tamu", "✓", "✓"], ["RSVP & ucapan", "✓", "✓"], ["Amplop digital", "✓", "✓"], ["Studio: susunan & warna", "✓", "✓"], ["Minta AI", "5 / hari", "50 / hari"], ["Label Undangku", "Ada", "Tidak ada"], ["Ekspor RSVP", "—", "✓"]].map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
        </tbody></table></div>
      </>) : (<>
        <div className="prices">{RESELLER.map((r) => (
          <div className={"price" + (r.hot ? " hot" : "")} key={r.id}>{r.hot && <span className="tag">Untuk WO</span>}<h3>{r.nama}</h3>
            <div className="amt">{rp(y ? r.m * 10 : r.m)} <small>/ {y ? "tahun" : "bulan"}</small></div>{y && <span className="was">Hemat {rp(r.m * 2)} per tahun</span>}
            <ul>{r.fit.map((x) => <li key={x}>{x}</li>)}</ul>
            <button type="button" className={"btn" + (r.hot ? " pri" : "")} onClick={() => reseller(r.id)}>Daftar {r.nama}</button></div>
        ))}</div>
        <p className="hint" style={{ marginTop: 16 }}>Undangan yang acaranya sudah selesai bisa diarsipkan supaya slot kembali kosong.</p>
      </>)}
      <UpgradeModal open={!!res} onClose={() => setRes(null)} item={res ? `reseller:${res}` : "premium"} />
    </div></div>
  );
}
export default function Page() { return <Suspense fallback={<div className="center">Memuat…</div>}><Harga /></Suspense>; }
