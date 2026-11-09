"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/lib/useInvitation";
import { toV, THEMES, stopMusic } from "@/lib/invite";
import InviteFrame from "@/components/InviteFrame";

function Lihat({ id }) {
  const qs = useSearchParams();
  const I = useInvitation(id, { withGuests: true, withRsvps: true });
  const { row, guests, rsvps, setRsvps, premium, sb } = I;
  const [guest, setGuest] = useState(qs.get("to") || "");
  const [theme, setTheme] = useState("");
  const v = useMemo(() => (row ? toV(row, { premium, rsvp: rsvps }) : null), [row, premium, rsvps]);
  if (I.error) return <div className="center">{I.error}</div>;
  if (I.loading || !v) return <div className="center">Memuat…</div>;
  const onRsvp = async (entry) => {
    const { data, error } = await sb.from("rsvps").insert({ ...entry, invitation_id: row.id }).select().single();
    if (error) throw error; setRsvps([data, ...rsvps]);
  };
  return (
    <div className="gut"><div className="in">
      <div className="lihat-bar">
        <label className="hint" htmlFor="asGuest">Lihat sebagai</label>
        <select id="asGuest" value={guest} onChange={(e) => { stopMusic(); setGuest(e.target.value); }}>
          <option value="">Tamu umum</option>{guests.map((g) => <option key={g.id}>{g.nama}</option>)}
        </select>
        <label className="hint" htmlFor="asTheme">Desain</label>
        <select id="asTheme" value={theme || row.theme} onChange={(e) => { stopMusic(); setTheme(e.target.value); }}>
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.nama}{t.pro ? " (Premium)" : ""}</option>)}
        </select>
        <Link className="btn sm" href={`/editor/${row.id}`}>Ubah undangan</Link>
      </div>
      <div className="lihat-frame"><InviteFrame v={v} guest={guest} theme={theme || row.theme} ikey="lihat" onRsvp={onRsvp} resetKey={guest + theme} /></div>
    </div></div>
  );
}
export default function Page({ params }) { return <Suspense fallback={<div className="center">Memuat…</div>}><Lihat id={params.id} /></Suspense>; }
