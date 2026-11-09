"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "./supabase/client";

export function useUser() {
  const [state, set] = useState({ user: null, profile: null, loading: true });
  useEffect(() => {
    const sb = supabaseBrowser();
    let alive = true;
    const load = async (user) => {
      let profile = null;
      if (user) { const { data } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle(); profile = data; }
      if (alive) set({ user, profile, loading: false });
    };
    sb.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => load(session?.user || null));
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return state;
}
