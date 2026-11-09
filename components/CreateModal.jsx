"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import Mini from "./Mini";
import { JENIS, THEMES, REKOM, sampleContent, sampleV, slugify } from "@/lib/invite";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast, RESERVED } from "@/lib/ui";

const SAMPLES = Object.fromEntries(Object.keys(JENIS).map((j) => [j, sampleV(j)]));

export default function CreateModal({ open, onClose, defaultTheme }) {
  const router = useRouter();
  const [j, setJ] = useState("nikah");
  const [t, setT] = useState(defaultTheme || "mocha");
  const [busy, setBusy] = useState(false);
  const rec = THEMES.filter((x) => x.untuk.includes(j)), rest = THEMES.filter((x) => !x.untuk.includes(j));
  const make = async () => {
    setBusy(true);
    const content = sampleContent(j);
    const base = slugify(j === "nikah" ? `${content.data.pria}-${content.data.wanita}` : content.data.nama) || j;
    const sb = supabaseBrowser();
    for (let i = 0; i < 4; i++) {
      let slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      if (RESERVED.includes(slug)) continue;
      const { data, error } = await sb.from("invitations").insert({ slug, jenis: j, theme: t, content }).select("id").single();
      if (!error) { setBusy(false); onClose(); toast(`Undangan ${JENIS[j].label.toLowerCase()} dibuat. Ganti contoh data dengan milikmu.`); router.push(`/editor/${data.id}`); return; }
      if (!/duplicate/i.test(error.message)) { setBusy(false); toast("Gagal membuat: " + error.message); return; }
    }
    setBusy(false); toast("Gagal membuat alamat unik, coba lagi.");
  };
  return (
    <Modal open={open} onClose={onClose}>
      <h2>Buat undangan baru</h2>
      <div><span className="eyebrow">1 · Jenis acara</span>
        <div className="jpick" style={{ marginTop: 8 }}>
          {Object.entries(JENIS).map(([k, J]) => (
            <button type="button" key={k} aria-pressed={j === k} onClick={() => { setJ(k); setT(REKOM[k]); }}><b>{J.label}</b><small>{J.desc}</small></button>
          ))}
        </div>
      </div>
      <div><span className="eyebrow">2 · Desain</span>
        <p className="hint" style={{ margin: "4px 0 8px" }}>Yang paling cocok untuk {JENIS[j].label.toLowerCase()} ditampilkan duluan.</p>
        <div className="tpick">
          {[...rec, ...rest].map((x) => (
            <button type="button" key={x.id} aria-pressed={t === x.id} onClick={() => setT(x.id)}>
              <Mini v={SAMPLES[j]} theme={x.id} cls="sq" />
              <span className="n">{x.nama}{x.pro && <span className="badge pro">PRO</span>}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" className="btn" onClick={onClose}>Batal</button>
        <button type="button" className="btn pri" disabled={busy} onClick={make}>{busy ? "Membuat…" : "Buat undangan"}</button>
      </div>
    </Modal>
  );
}
