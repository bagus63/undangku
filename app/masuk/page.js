"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/ui";

function Auth() {
  const q = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState(q.get("daftar") ? "daftar" : "masuk");
  const [nama, setNama] = useState(""), [email, setEmail] = useState(""), [pass, setPass] = useState("");
  const [msg, setMsg] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const lanjut = q.get("lanjut") || "/dashboard";
  useEffect(() => { if (q.get("error")) setErr("Login gagal. Coba lagi."); }, [q]);
  const sb = supabaseBrowser();
  const google = async () => {
    setErr("");
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(lanjut)}` } });
    if (error) setErr(error.message.includes("provider is not enabled") ? "Login Google belum diaktifkan di Supabase. Pakai email dulu." : error.message);
  };
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setMsg(""); setBusy(true);
    if (mode === "daftar") {
      const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { full_name: nama || email.split("@")[0] }, emailRedirectTo: `${siteUrl()}/auth/callback` } });
      setBusy(false);
      if (error) { setErr(terjemah(error.message)); return; }
      if (!data.session) { setMsg("Cek email kamu dan klik link konfirmasi, lalu masuk."); return; }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password: pass });
      setBusy(false);
      if (error) { setErr(terjemah(error.message)); return; }
    }
    router.push(lanjut); router.refresh();
  };
  const d = mode === "daftar";
  return (
    <div className="gut"><div className="in page">
      <div className="auth">
        <div className="seg" style={{ justifySelf: "start" }}>
          <button type="button" aria-pressed={!d} onClick={() => setMode("masuk")}>Masuk</button>
          <button type="button" aria-pressed={d} onClick={() => setMode("daftar")}>Daftar</button>
        </div>
        <h2>{d ? "Buat akun gratis" : "Selamat datang kembali"}</h2>
        <button type="button" className="gbtn" onClick={google}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.6l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
          Lanjut dengan Google
        </button>
        <div className="or">atau dengan email</div>
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          {d && <label className="f">Nama<input id="aNama" value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="name" placeholder="Nama kamu" /></label>}
          <label className="f">Email<input id="aEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="nama@email.com" /></label>
          <label className="f">Kata sandi<input id="aPass" type="password" required minLength={6} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete={d ? "new-password" : "current-password"} placeholder="Minimal 6 karakter" /></label>
          {err && <p className="err" style={{ margin: 0 }}>{err}</p>}
          {msg && <div className="banner" style={{ marginTop: 0 }}>{msg}</div>}
          <button className="btn pri" type="submit" disabled={busy}>{busy ? "Memproses…" : d ? "Daftar" : "Masuk"}</button>
        </form>
      </div>
    </div></div>
  );
}
function terjemah(m) {
  if (/Invalid login credentials/i.test(m)) return "Email atau kata sandi salah.";
  if (/already registered/i.test(m)) return "Email ini sudah terdaftar. Silakan masuk.";
  if (/Email not confirmed/i.test(m)) return "Email belum dikonfirmasi. Cek kotak masuk emailmu.";
  if (/rate limit/i.test(m)) return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  return m;
}
export default function Page() { return <Suspense fallback={<div className="center">Memuat…</div>}><Auth /></Suspense>; }
