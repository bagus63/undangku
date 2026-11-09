"use client";
import { useEffect, useRef } from "react";
import { mountInvite, tickCountdowns, stopMusic } from "@/lib/invite";
import { toast } from "@/lib/ui";

/* Menampilkan undangan hidup. "version" berubah setiap kali isi berubah supaya dirender ulang. */
export default function InviteFrame({ v, guest, theme, ikey = "inv", onRsvp, version, resetKey, className, style }) {
  const ref = useRef(null);
  const opened = useRef(false);
  useEffect(() => { opened.current = false; }, [resetKey, theme]);
  useEffect(() => {
    if (!v) return;
    mountInvite(ref.current, v, { key: ikey, guest, theme, opened: opened.current, onOpen: () => (opened.current = true), onRsvp, toast });
  }, [v, guest, theme, version, resetKey]); // eslint-disable-line
  useEffect(() => { const t = setInterval(tickCountdowns, 1000); return () => { clearInterval(t); stopMusic(); }; }, []);
  return <div ref={ref} className={className} style={{ width: "100%", height: "100%", ...style }} />;
}
