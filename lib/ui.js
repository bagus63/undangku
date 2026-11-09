"use client";
/* Notifikasi kecil di bawah layar */
export function toast(msg) {
  if (typeof document === "undefined") return;
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("on");
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 2600);
}
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");
export const RESERVED = ["tema", "harga", "masuk", "dashboard", "editor", "tamu", "rsvp", "lihat", "admin", "auth", "api", "_next", "favicon.ico"];

/* Perkecil foto sebelum diunggah */
export function shrinkToBlob(file, max) {
  return new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const r = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement("canvas"); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        c.toBlob((b) => res(b), "image/jpeg", 0.82);
      };
      im.onerror = () => res(null); im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
