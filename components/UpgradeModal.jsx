"use client";
import { useState } from "react";
import Modal from "./Modal";
import { supabaseBrowser } from "@/lib/supabase/client";
import { rp, PRICE, THEMES, RESELLER } from "@/lib/invite";
import { toast } from "@/lib/ui";

/* Pembayaran transfer manual: pengguna transfer, lalu admin mengonfirmasi di /admin.
   item: 'premium' (butuh invitation) atau 'reseller:mitra' dst. */
export default function UpgradeModal({ open, onClose, item = "premium", invitation, reason }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const res = item.startsWith("reseller:") ? RESELLER.find((r) => r.id === item.split(":")[1]) : null;
  const amount = res ? res.m : PRICE.premium;
  const title = res ? `Paket Reseller ${res.nama}` : "Upgrade ke Premium";
  const bank = process.env.NEXT_PUBLIC_BANK_INFO || "(isi NEXT_PUBLIC_BANK_INFO)";
  const wa = process.env.NEXT_PUBLIC_ADMIN_WA || "";
  const confirm = async () => {
    setBusy(true);
    const { error } = await supabaseBrowser().from("payments").insert({ item, amount, invitation_id: invitation?.id || null, note: invitation ? invitation.slug : null });
    setBusy(false);
    if (error) { toast("Gagal mencatat: " + error.message); return; }
    setDone(true);
  };
  const waText = encodeURIComponent(`Halo admin Undangku, saya sudah transfer ${rp(amount)} untuk ${title}${invitation ? ` (undangan: ${invitation.slug})` : ""}.`);
  return (
    <Modal open={open} onClose={() => { setDone(false); onClose(); }} small>
      <h2>{title}</h2>
      {reason && <p className="hint" style={{ margin: 0 }}>{reason}</p>}
      {done ? (<>
        <div className="banner" style={{ marginTop: 0 }}><span><b>Terima kasih!</b> Pembayaranmu sedang dicek admin. Paket aktif otomatis setelah dikonfirmasi.</span></div>
        {wa && <a className="btn pri" href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener">Kirim bukti transfer lewat WhatsApp</a>}
        <button type="button" className="btn" onClick={() => { setDone(false); onClose(); }}>Tutup</button>
      </>) : (<>
        <div className="panel" style={{ padding: 16 }}>
          {invitation && <b>{invitation.label}</b>}
          <ul className="ticks" style={{ margin: 0 }}>
            {(res ? res.fit : [`Semua ${THEMES.length} desain`, "Tamu & foto tanpa batas", "Tanpa label Undangku", "50 perintah Minta AI per hari", "Ekspor RSVP"]).map((x) => <li key={x}>{x}</li>)}
          </ul>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid var(--line)", paddingTop: 12 }}>
            <span>Total {res ? "/ bulan" : ""}</span><b style={{ fontSize: "1.3rem" }}>{rp(amount)}</b>
          </div>
        </div>
        <div className="panel" style={{ padding: 16, gap: 6 }}>
          <span className="hint">Transfer ke</span>
          <b style={{ fontSize: "1.05rem" }}>{bank}</b>
          <span className="hint">Setelah transfer, tekan tombol di bawah. Admin akan mengaktifkan paketmu.</span>
        </div>
        <button type="button" className="btn pri" disabled={busy} onClick={confirm}>{busy ? "Mencatat…" : "Saya sudah transfer"}</button>
      </>)}
    </Modal>
  );
}
