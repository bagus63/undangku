"use client";
import { useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toV } from "@/lib/invite";
import InviteFrame from "@/components/InviteFrame";

export default function PublicInvite({ row, rsvps: initial, premium, guest }) {
  const [rsvps, setRsvps] = useState(initial);
  const v = useMemo(() => toV(row, { premium, rsvp: rsvps }), [row, premium, rsvps]);
  const onRsvp = async (entry) => {
    const { error } = await supabaseBrowser().from("rsvps").insert({ ...entry, invitation_id: row.id });
    if (error) throw error;
    setRsvps([{ ...entry, created_at: new Date().toISOString() }, ...rsvps]);
  };
  return (
    <div className="pubwrap" style={{ zIndex: 40 }}>
      <div><InviteFrame v={v} guest={guest} theme={row.theme} ikey="pub" onRsvp={onRsvp} /></div>
    </div>
  );
}
