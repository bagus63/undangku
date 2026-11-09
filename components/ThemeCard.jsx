"use client";
import Mini from "./Mini";
import { JENIS } from "@/lib/invite";

export default function ThemeCard({ t, v, onPreview, onUse }) {
  return (
    <article className="tcard">
      <Mini v={v} theme={t.id} />
      <div className="meta">
        <div><h3>{t.nama}{t.baru && <span className="badge">BARU</span>}{t.pro && <span className="badge pro">PREMIUM</span>}</h3>
          <small>{t.desc}</small><div className="for">Cocok untuk {t.untuk.map((j) => JENIS[j].label).join(" · ")}</div></div>
        <div className="acts"><button type="button" className="btn sm" onClick={onPreview}>Pratinjau</button><button type="button" className="btn sm pri" onClick={onUse}>Pakai</button></div>
      </div>
    </article>
  );
}
