"use client";
import { useEffect } from "react";

export default function Modal({ open, onClose, children, small }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={"mbox" + (small ? " sm" : "")} role="dialog" aria-modal="true">
        <button type="button" className="btn sm ghost mclose" onClick={onClose} aria-label="Tutup">✕</button>
        {children}
      </div>
    </div>
  );
}
