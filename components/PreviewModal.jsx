"use client";
import Modal from "./Modal";
import InviteFrame from "./InviteFrame";
import { TH } from "@/lib/invite";

export default function PreviewModal({ v, theme, onClose, onUse }) {
  return (
    <Modal open={!!theme} onClose={onClose} small>
      {theme && <>
        <h2>{TH[theme].nama}</h2>
        <div style={{ height: "min(640px, calc(100vh - 220px))", borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)" }}>
          <InviteFrame v={v} theme={theme} guest="Bapak Budi Santoso" ikey="pv" resetKey={theme} />
        </div>
        <button type="button" className="btn pri" onClick={onUse}>Pakai desain ini</button>
      </>}
    </Modal>
  );
}
