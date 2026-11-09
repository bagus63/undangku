"use client";
import { useEffect, useRef } from "react";
import { miniHTML } from "@/lib/invite";

/* Sampul undangan asli yang diperkecil. tall = skala mengikuti tinggi. */
export default function Mini({ v, theme, cls = "", tall = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.innerHTML = miniHTML(v, theme || v.theme);
    const fit = () => el.style.setProperty("--s", tall ? el.clientHeight / 660 : el.clientWidth / 370);
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, [v, theme, tall]);
  return <div ref={ref} className={`mw ${cls}`} aria-hidden="true" />;
}
