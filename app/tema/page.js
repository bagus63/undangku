"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { JENIS, THEMES, sampleV } from "@/lib/invite";
import { useUser } from "@/lib/useUser";
import ThemeCard from "@/components/ThemeCard";
import PreviewModal from "@/components/PreviewModal";

export default function Tema() {
  const router = useRouter();
  const { user } = useUser();
  const [tj, setTj] = useState("Semua"), [tf, setTf] = useState("Semua"), [pv, setPv] = useState(null);
  const S = useMemo(() => Object.fromEntries(Object.keys(JENIS).map((j) => [j, sampleV(j)])), []);
  const use = (id) => { const to = `/dashboard?baru=1&tema=${id}`; router.push(user ? to : `/masuk?daftar=1&lanjut=${encodeURIComponent(to)}`); };
  const tags = ["Semua", ...new Set(THEMES.map((t) => t.tag)), "Premium"];
  const list = THEMES.filter((t) => (tj === "Semua" || t.untuk.includes(tj)) && (tf === "Semua" || (tf === "Premium" ? t.pro : t.tag === tf)));
  const vOf = (t) => S[tj !== "Semua" ? tj : t.untuk[0]];
  return (
    <div className="gut"><div className="in page">
      <span className="eyebrow">Katalog</span>
      <h2 className="h2">Pilih desain undangan</h2>
      <p className="lead">Semua desain bisa dipakai untuk jenis acara apa pun. Desain bertanda Premium bisa dicoba gratis, terbitkan setelah upgrade.</p>
      <div className="chips" style={{ marginTop: 20 }}>{["Semua", ...Object.keys(JENIS)].map((j) => <button type="button" key={j} className="chip" aria-pressed={tj === j} onClick={() => setTj(j)}>{j === "Semua" ? "Semua acara" : JENIS[j].label}</button>)}</div>
      <div className="chips">{tags.map((t) => <button type="button" key={t} className="chip" aria-pressed={tf === t} onClick={() => setTf(t)}>{t === "Semua" ? "Semua gaya" : t}</button>)}</div>
      <div className="cat">{list.length ? list.map((t) => <ThemeCard key={t.id + tj} t={t} v={vOf(t)} onPreview={() => setPv(t.id)} onUse={() => use(t.id)} />) : <p className="hint">Belum ada desain untuk kombinasi ini.</p>}</div>
      <PreviewModal v={pv ? vOf({ untuk: THEMES.find((x) => x.id === pv).untuk }) : null} theme={pv} onClose={() => setPv(null)} onUse={() => use(pv)} />
    </div></div>
  );
}
