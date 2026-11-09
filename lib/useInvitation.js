"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "./supabase/client";
import { useUser } from "./useUser";

/* Memuat satu undangan milik pengguna + menyimpan perubahan otomatis */
export function useInvitation(id, { withGuests = false, withRsvps = false } = {}) {
  const { user, profile, loading: uLoading } = useUser();
  const [row, setRow] = useState(null);
  const [guests, setGuests] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("Tersimpan");
  const timer = useRef(null), pending = useRef(null);
  const sb = supabaseBrowser();

  const reload = useCallback(async () => {
    const { data, error } = await sb.from("invitations").select("*").eq("id", id).maybeSingle();
    if (error || !data) { setError(error ? error.message : "Undangan tidak ditemukan atau bukan milikmu."); return; }
    setRow(data);
    if (withGuests) { const g = await sb.from("guests").select("*").eq("invitation_id", id).order("created_at"); setGuests(g.data || []); }
    if (withRsvps) { const r = await sb.from("rsvps").select("*").eq("invitation_id", id).order("created_at", { ascending: false }); setRsvps(r.data || []); }
  }, [id, sb, withGuests, withRsvps]);
  useEffect(() => { if (user) reload(); }, [user, reload]);

  const flush = useCallback(async () => {
    if (!pending.current) return;
    const p = pending.current; pending.current = null;
    setSaveState("Menyimpan…");
    const { error } = await sb.from("invitations").update(p).eq("id", id);
    setSaveState(error ? "Gagal menyimpan: " + error.message : "Tersimpan");
  }, [id, sb]);

  /* ubah lokal + jadwalkan simpan */
  const patch = useCallback((fn) => {
    setRow((r) => {
      const n = fn(structuredClone(r));
      pending.current = { theme: n.theme, jenis: n.jenis, content: n.content };
      return n;
    });
    setSaveState("Belum tersimpan…");
    clearTimeout(timer.current); timer.current = setTimeout(flush, 700);
  }, [flush]);

  useEffect(() => {
    const before = () => { if (pending.current) flush(); };
    window.addEventListener("beforeunload", before);
    return () => { window.removeEventListener("beforeunload", before); clearTimeout(timer.current); before(); };
  }, [flush]);

  const premium = !!row && (row.paket === "premium" || !!profile?.plan);
  return { user, profile, loading: uLoading || (!row && !error), row, setRow, patch, flush, saveState, error, premium, guests, setGuests, rsvps, setRsvps, reload, sb };
}
