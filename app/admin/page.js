"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useUser } from "@/lib/useUser";
import { JENIS, RESELLER, rp, toV, nmText } from "@/lib/invite";
import { toast } from "@/lib/ui";

export default function Admin() {
  const { profile, loading } = useUser();
  const [tab, setTab] = useState("bayar");
  const [pays, setPays] = useState([]), [invs, setInvs] = useState([]), [users, setUsers] = useState([]);
  const sb = supabaseBrowser();
  const load = useCallback(async () => {
    const [p, i, u] = await Promise.all([
      sb.from("payments").select("*").order("created_at", { ascending: false }).limit(200),
      sb.from("invitations").select("id,slug,jenis,status,paket,owner,content,created_at").order("created_at", { ascending: false }).limit(300),
      sb.from("profiles").select("*").order("created_at", { ascending: false }).limit(300),
    ]);
    setPays(p.data || []); setInvs(i.data || []); setUsers(u.data || []);
  }, [sb]);
  useEffect(() => { if (profile?.is_admin) load(); }, [profile, load]);
  if (loading) return <div className="center">Memuat…</div>;
  if (!profile?.is_admin) return <div className="center">Halaman ini khusus admin. <Link href="/dashboard">Kembali</Link></div>;
  const email = (id) => users.find((u) => u.id === id)?.email || id.slice(0, 8);
  const call = async (fn, args, msg) => { const { error } = await sb.rpc(fn, args); if (error) return toast(error.message); toast(msg); load(); };
  const wait = pays.filter((p) => p.status === "menunggu");
  return (
    <div className="gut"><div className="in page">
      <span className="eyebrow">Admin</span>
      <h2 className="h2">Kelola Undangku</h2>
      <div className="stats">
        <div className="stat warn"><b>{wait.length}</b><span>Pembayaran menunggu</span></div>
        <div className="stat"><b>{users.length}</b><span>Pengguna</span></div>
        <div className="stat"><b>{invs.length}</b><span>Undangan</span></div>
        <div className="stat ok"><b>{rp(pays.filter((p) => p.status === "lunas").reduce((a, p) => a + p.amount, 0))}</b><span>Pendapatan tercatat</span></div>
      </div>
      <div className="seg" style={{ margin: "24px 0 16px" }}>
        {[["bayar", "Pembayaran"], ["undangan", "Undangan"], ["pengguna", "Pengguna"]].map(([k, l]) => <button type="button" key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div className="panel scrollx">
        {tab === "bayar" && <table className="tbl"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Item</th><th>Jumlah</th><th>Status</th><th></th></tr></thead><tbody>
          {pays.length ? pays.map((p) => <tr key={p.id}><td>{new Date(p.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</td><td>{email(p.owner)}</td><td>{p.item}{p.note ? ` · ${p.note}` : ""}</td><td>{rp(p.amount)}</td>
            <td>{p.status === "lunas" ? <span className="pill p-ok">Lunas</span> : p.status === "ditolak" ? <span className="pill p-bad">Ditolak</span> : <span className="pill p-warn">Menunggu</span>}</td>
            <td style={{ whiteSpace: "nowrap" }}>{p.status === "menunggu" && <><button type="button" className="btn sm pri" onClick={() => call("admin_payment", { pay_id: p.id, st: "lunas" }, "Ditandai lunas, paket aktif")}>Lunas</button> <button type="button" className="btn sm" onClick={() => call("admin_payment", { pay_id: p.id, st: "ditolak" }, "Ditolak")}>Tolak</button></>}</td></tr>)
            : <tr><td colSpan={6} className="hint">Belum ada pembayaran.</td></tr>}
        </tbody></table>}
        {tab === "undangan" && <table className="tbl"><thead><tr><th>Undangan</th><th>Pemilik</th><th>Status</th><th>Paket</th><th></th></tr></thead><tbody>
          {invs.map((r) => { const v = toV(r); return <tr key={r.id}><td><b>{nmText(v)}</b><br /><span className="hint">{JENIS[r.jenis].label} · /{r.slug}</span></td><td>{email(r.owner)}</td><td>{r.status}</td><td>{r.paket}</td>
            <td style={{ whiteSpace: "nowrap" }}>{r.status === "terbit" && <a className="btn sm" href={`/${r.slug}`} target="_blank" rel="noopener">Buka</a>} <button type="button" className="btn sm" onClick={() => call("admin_set_paket", { inv_id: r.id, p: r.paket === "premium" ? "basic" : "premium" }, "Paket diubah")}>{r.paket === "premium" ? "Jadikan Basic" : "Jadikan Premium"}</button></td></tr>; })}
        </tbody></table>}
        {tab === "pengguna" && <table className="tbl"><thead><tr><th>Pengguna</th><th>Daftar</th><th>Paket reseller</th></tr></thead><tbody>
          {users.map((u) => <tr key={u.id}><td><b>{u.nama}</b>{u.is_admin && <span className="pill p-acc" style={{ marginLeft: 6 }}>Admin</span>}<br /><span className="hint">{u.email}</span></td><td>{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
            <td><select value={u.plan || ""} onChange={(e) => call("admin_set_plan", { user_id: u.id, p: e.target.value }, "Paket pengguna diubah")} style={{ width: "auto" }}><option value="">Pribadi</option>{RESELLER.map((r) => <option key={r.id} value={r.id}>Reseller {r.nama}</option>)}</select></td></tr>)}
        </tbody></table>}
      </div>
    </div></div>
  );
}
