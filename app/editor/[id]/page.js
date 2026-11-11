"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useInvitation } from "@/lib/useInvitation";
import { JENIS, THEMES, TH, SECL, ACCENTS, LIMIT, AIQ, PENUTUP, toV, nmText, isDua, sampleContent, aiApply, stopMusic, esc, parseYouTube } from "@/lib/invite";
import { toast, shrinkToBlob, siteUrl } from "@/lib/ui";
import InviteFrame from "@/components/InviteFrame";
import Mini from "@/components/Mini";
import UpgradeModal from "@/components/UpgradeModal";

const PF = {
  nikah: [["pria", "Panggilan pria"], ["wanita", "Panggilan wanita"], ["priaFull", "Nama lengkap pria"], ["wanitaFull", "Nama lengkap wanita"], ["ortuPria", "Keterangan orang tua pria"], ["ortuWanita", "Keterangan orang tua wanita"]],
  ultah: [["nama", "Nama panggilan"], ["usia", "Ulang tahun ke-"], ["namaFull", "Nama lengkap"], ["ortu", "Keterangan orang tua"]],
  khitan: [["nama", "Nama panggilan ananda"], ["namaFull", "Nama lengkap ananda"], ["ortu", "Keterangan orang tua"]],
  aqiqah: [["nama", "Nama panggilan bayi"], ["namaFull", "Nama lengkap bayi"], ["ortu", "Keterangan orang tua"]],
  umum: [["nama", "Judul singkat acara"], ["namaFull", "Tuan rumah"], ["ortu", "Keterangan tambahan"]],
};
const LISTS = {
  events: { title: "Acara", fields: [["nama", "Nama acara", "text"], ["waktu", "Tanggal & jam mulai", "datetime-local"], ["selesai", "Sampai", "text"], ["tempat", "Nama tempat", "text"], ["alamat", "Alamat", "text"], ["maps", "Link Google Maps", "url"]], blank: { nama: "Acara baru", waktu: "", selesai: "selesai", tempat: "", alamat: "", maps: "" }, add: "+ Tambah acara" },
  stories: { title: "Love story", fields: [["tahun", "Tahun", "text"], ["judul", "Judul", "text"], ["isi", "Cerita", "textarea"]], blank: { tahun: "", judul: "", isi: "" }, add: "+ Tambah cerita" },
  gifts: { title: "Amplop", fields: [["bank", "Bank / e-wallet", "text"], ["no", "Nomor", "text"], ["an", "Atas nama", "text"]], blank: { bank: "", no: "", an: "" }, add: "+ Tambah rekening / e-wallet" },
};
const AI_EX = { nikah: ["Tuliskan doa pembuka", "Ganti warna jadi hijau sage", "Pindahkan galeri ke atas", "Buatkan pantun undangan", "Ganti desain ke Plum"], ultah: ["Ganti desain ke Pastel Bento", "Warna jadi biru", "Sembunyikan amplop", "Tuliskan kata pembuka"], khitan: ["Tuliskan doa pembuka", "Ganti desain ke Kawung Nusantara", "Warna jadi emas"], aqiqah: ["Tuliskan doa pembuka", "Ganti desain ke Hijau Arabesk", "Warna jadi pink"], umum: ["Tuliskan kata pembuka", "Ganti desain ke Monokrom", "Matikan musik"] };

function List({ k, items, setC }) {
  const Ls = LISTS[k];
  return (<>
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((it, i) => (
        <div className="item" key={i}>
          <button type="button" className="btn sm ghost del" aria-label="Hapus" onClick={() => setC((cc) => { cc[k] = items.filter((_, j) => j !== i); })}>✕</button>
          <div className={Ls.fields.length > 3 ? "r2" : "r3"} style={{ paddingRight: 36 }}>
            {Ls.fields.map(([f, l, t]) => t === "textarea"
              ? <label className="f" key={f} style={{ gridColumn: "1/-1" }}>{l}<textarea id={`${k}-${i}-${f}`} defaultValue={it[f]} onChange={(e) => setC((cc) => { cc[k] = cc[k].map((x, j) => (j === i ? { ...x, [f]: e.target.value } : x)); })} /></label>
              : <label className="f" key={f}>{l}<input id={`${k}-${i}-${f}`} type={t} defaultValue={it[f]} onChange={(e) => setC((cc) => { cc[k] = cc[k].map((x, j) => (j === i ? { ...x, [f]: e.target.value } : x)); })} /></label>)}
          </div>
        </div>
      ))}
    </div>
    <button type="button" className="btn sm" onClick={() => setC((cc) => { cc[k] = [...items, { ...Ls.blank }]; })}>{Ls.add}</button>
  </>);
}

export default function Editor({ params }) {
  const I = useInvitation(params.id);
  const { row, patch, premium, sb, user } = I;
  const [view, setView] = useState("edit");
  const [upg, setUpg] = useState(null);
  const [aiLog, setAiLog] = useState([]);
  const [aiIn, setAiIn] = useState("");
  const [aiSnap, setAiSnap] = useState(null);
  const [aiLeft, setAiLeft] = useState(null);
  const [busyUp, setBusyUp] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [ytErr, setYtErr] = useState("");
  const logRef = useRef(null);
  const v = useMemo(() => (row ? toV(row, { premium }) : null), [row, premium]);

  if (I.error) return <div className="center">{I.error} <Link href="/dashboard">Kembali</Link></div>;
  if (I.loading || !v) return <div className="center">Memuat editor…</div>;

  const L = LIMIT[premium ? "premium" : "basic"];
  const c = row.content || {};
  const setC = (fn) => patch((r) => { r.content = { ...toV(r), ...r.content }; delete r.content.premium; delete r.content.rsvp; delete r.content.guests; ["id", "slug", "jenis", "theme", "status", "paket"].forEach((k) => delete r.content[k]); fn(r.content, r); return r; });
  const setData = (k, val) => setC((cc) => { cc.data = { ...cc.data, [k]: val }; });
  const label = nmText(v);

  /* ---------- upload ---------- */
  const upload = async (file, kind, isAudio) => {
    setBusyUp(kind);
    try {
      const blob = isAudio ? file : await shrinkToBlob(file, kind === "cover" ? 1400 : kind === "galeri" ? 1100 : 700);
      if (!blob) throw new Error("File tidak bisa dibaca");
      const ext = isAudio ? (file.name.split(".").pop() || "mp3").toLowerCase() : "jpg";
      const path = `${user.id}/${row.id}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await sb.storage.from("media").upload(path, blob, { contentType: isAudio ? file.type || "audio/mpeg" : "image/jpeg", upsert: false });
      if (error) throw error;
      return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
    } catch (e) { toast("Gagal mengunggah: " + (e.message || e)); return null; }
    finally { setBusyUp(""); }
  };
  const onPhoto = async (e, slot) => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    const url = await upload(f, slot); if (url) setC((cc) => { cc.photos = { ...cc.photos, [slot]: url }; });
  };
  const onGallery = async (e) => {
    let fs = [...e.target.files]; e.target.value = "";
    const room = L.foto - v.photos.galeri.length;
    if (fs.length > room) { fs = fs.slice(0, Math.max(0, room)); if (!premium) setUpg(`Paket Basic maksimal ${L.foto} foto galeri.`); }
    for (const f of fs) { const url = await upload(f, "galeri"); if (url) setC((cc) => { cc.photos = { ...cc.photos, galeri: [...(cc.photos.galeri || []), url] }; }); }
    if (fs.length) toast(fs.length + " foto ditambahkan");
  };
  const onMusic = async (e) => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast("Ukuran lagu maksimal 10 MB"); return; }
    stopMusic(); const url = await upload(f, "lagu", true);
    if (url) { setC((cc) => { cc.music = "upload"; cc.musicUrl = url; cc.musicName = f.name; }); toast("Lagu terunggah"); }
  };

  /* ---------- publish ---------- */
  const publish = async () => {
    if (row.status === "terbit") { toast("Undangan ini sudah terbit"); return; }
    if (TH[row.theme].pro && !premium) { setUpg(`Desain ${TH[row.theme].nama} khusus Premium. Upgrade untuk menerbitkan, atau pilih desain gratis.`); return; }
    await I.flush();
    const { error } = await sb.from("invitations").update({ status: "terbit" }).eq("id", row.id);
    if (error) { /Premium/.test(error.message) ? setUpg(error.message) : toast(error.message); return; }
    I.setRow({ ...row, status: "terbit" });
    toast("Undangan terbit. Link siap dibagikan ke tamu.");
  };

  /* ---------- Minta AI ---------- */
  const runAI = async (text) => {
    const raw = (text ?? aiIn).trim(); if (!raw) return;
    setAiIn("");
    const res = aiApply(raw, row.jenis, { ...toV(row), ...c }, row.theme, premium);
    if (!res) { setAiLog((l) => [...l, { u: 1, t: raw }, { t: "Maaf, aku baru paham perintah seperti: ganti desain, ganti warna, tuliskan doa pembuka, buatkan pantun, sembunyikan atau tampilkan bagian, pindahkan bagian ke atas/bawah, matikan musik." }]); return; }
    const { data: left, error } = await sb.rpc("use_ai", { inv_id: row.id });
    if (error) { toast(error.message); return; }
    if (left < 0) { setAiLog((l) => [...l, { u: 1, t: raw }, { t: premium ? "Kuota 50 perintah hari ini sudah habis. Coba lagi besok ya." : "Kuota Minta AI paket Basic (5 per hari) sudah habis." }]); if (!premium) setUpg("Kuota Minta AI paket Basic sudah habis. Premium mendapat 50 perintah per hari."); return; }
    setAiLeft(left);
    if (TH[res.theme].pro && !premium && row.status === "terbit" && res.theme !== row.theme) { res.theme = row.theme; res.msg += "\n(Desain Premium tidak bisa dipasang ke undangan yang sudah terbit sebelum upgrade.)"; }
    setAiSnap({ content: structuredClone(row.content), theme: row.theme });
    patch((r) => { const cc = res.content; ["id", "slug", "jenis", "theme", "status", "paket", "premium", "rsvp", "guests"].forEach((k) => delete cc[k]); r.content = cc; r.theme = res.theme; return r; });
    setFormKey((k) => k + 1);
    setAiLog((l) => [...l, { u: 1, t: raw }, { t: res.msg + "\n\nTidak cocok? Tekan Batalkan." }]);
    setTimeout(() => logRef.current && (logRef.current.scrollTop = 1e6), 50);
  };
  const undoAI = () => { if (!aiSnap) return; patch((r) => { r.content = aiSnap.content; r.theme = aiSnap.theme; return r; }); setAiSnap(null); setFormKey((k) => k + 1); setAiLog((l) => [...l, { t: "Perubahan terakhir dibatalkan." }]); };

  /* ---------- jenis acara ---------- */
  const changeJenis = (j) => {
    const old = row.jenis, smp = sampleContent(j);
    patch((r) => {
      r.jenis = j; const cc = r.content = { ...toV({ ...r, jenis: old }), ...r.content };
      ["id", "slug", "jenis", "theme", "status", "paket", "premium", "rsvp", "guests"].forEach((k) => delete cc[k]);
      cc.data = { ...cc.data }; PF[j].forEach(([k]) => { if (!cc.data[k]) cc.data[k] = smp.data[k]; });
      if (cc.data.quote === AIQ[old][0][0]) { cc.data.quote = smp.data.quote; cc.data.quoteSrc = smp.data.quoteSrc; }
      if (cc.data.penutup === PENUTUP[old]) cc.data.penutup = smp.data.penutup;
      return r;
    });
    setFormKey((k) => k + 1);
    toast(`Jenis acara diubah ke ${JENIS[j].label}`);
  };

  const rec = THEMES.filter((t) => t.untuk.includes(row.jenis)), rest = THEMES.filter((t) => !t.untuk.includes(row.jenis));
  const ups = isDua(v) ? [["pria", "Foto pria"], ["wanita", "Foto wanita"]] : [["anak", row.jenis === "umum" ? "Foto tuan rumah" : "Foto"]];
  const order = v.order, hide = v.hide;
  const D = (k) => ({ id: `d-${k}`, defaultValue: v.data[k] ?? "", onChange: (e) => setData(k, e.target.value) });
  const pubUrl = `${siteUrl()}/${row.slug}`;

  return (
    <div className="gut"><div className="in page">
      <div className="edtop">
        <div className="t">
          <Link className="hint" href="/dashboard" style={{ textDecoration: "none" }}>← Undangan saya</Link>
          <h2>{label}</h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="pill p-acc">{JENIS[row.jenis].label}</span>
            {row.status === "terbit" ? <span className="pill p-ok">Terbit</span> : row.status === "arsip" ? <span className="pill p-none">Arsip</span> : <span className="pill p-warn">Draft</span>}
            {premium ? <span className="pill p-pro">Premium</span> : <span className="pill p-none">Basic</span>}
          </div>
        </div>
        <div className="acts">
          <span className="hint">{busyUp ? "Mengunggah…" : I.saveState}</span>
          <Link className="btn sm" href={`/lihat/${row.id}`}>Lihat penuh</Link>
          {!premium && <button type="button" className="btn sm" onClick={() => setUpg("")}>Upgrade</button>}
          <button type="button" className="btn sm pri" onClick={publish}>{row.status === "terbit" ? "Sudah terbit ✓" : "Terbitkan"}</button>
        </div>
      </div>
      {row.status === "terbit" && (
        <div className="banner" style={{ marginTop: 0, marginBottom: 16 }}>
          <span>Link undangan: <b style={{ overflowWrap: "anywhere" }}>{pubUrl}</b></span>
          <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><a className="btn sm" href={pubUrl} target="_blank" rel="noopener">Buka</a><Link className="btn sm pri" href={`/tamu/${row.id}`}>Kirim ke tamu →</Link></span>
        </div>
      )}
      <div className="edtabs" role="tablist">
        <button role="tab" aria-selected={view === "edit"} onClick={() => setView("edit")}>Isi Data</button>
        <button role="tab" aria-selected={view === "prev"} onClick={() => setView("prev")}>Pratinjau</button>
      </div>
      <div className="ed" data-v={view}>
        <form className="form" key={formKey} autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <details open><summary>Minta AI <span className="badge">BARU</span><small>{aiLeft !== null ? `Sisa ${aiLeft} hari ini` : `${L.ai} perintah per hari`}</small></summary><div className="fbody ai">
            <div className="ailog" ref={logRef}>
              {aiLog.length ? aiLog.map((m, i) => <div key={i} className={`bub ${m.u ? "u" : "a"}`} style={{ whiteSpace: "pre-line", justifySelf: m.u ? "end" : undefined }}>{m.t}</div>)
                : <div className="bub a">Halo! Ketik apa yang ingin diubah. Contoh: "ganti desain ke sinema", "warna jadi biru", "tuliskan doa pembuka", "pindahkan galeri ke atas".</div>}
            </div>
            <div className="aichips">{AI_EX[row.jenis].map((t) => <button type="button" key={t} onClick={() => runAI(t)}>{t}</button>)}</div>
            <div className="airow"><input id="aiIn" value={aiIn} onChange={(e) => setAiIn(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); runAI(); } }} placeholder="Contoh: ganti warna jadi hijau sage" /><button type="button" className="btn pri" onClick={() => runAI()}>Kirim</button></div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><button type="button" className="btn sm" disabled={!aiSnap} onClick={undoAI}>↶ Batalkan perubahan AI</button></div>
          </div></details>

          <details open><summary>Desain <small>{TH[row.theme].nama}</small></summary><div className="fbody"><div className="picker">
            {[...rec, ...rest].map((t) => (
              <button type="button" key={t.id} aria-pressed={row.theme === t.id} onClick={() => { if (t.pro && !premium && row.status === "terbit") { setUpg(`Undangan ini sudah terbit. Desain ${t.nama} bisa dipakai setelah upgrade ke Premium.`); return; } patch((r) => { r.theme = t.id; return r; }); setResetKey((k) => k + 1); if (t.pro && !premium) toast("Desain Premium: bebas dicoba, upgrade untuk menerbitkan"); }}>
                <Mini v={v} theme={t.id} cls="sq" />
                <span className="n">{t.nama}{t.pro && <span className="badge pro">PRO</span>}</span>
              </button>
            ))}
          </div></div></details>

          <details open><summary>{isDua(v) ? "Mempelai & foto" : `${JENIS[row.jenis].secK} & foto`}</summary><div className="fbody">
            <label className="f">Jenis acara<select id="jenisSel" value={row.jenis} onChange={(e) => changeJenis(e.target.value)}>{Object.entries(JENIS).map(([j, J]) => <option key={j} value={j}>{J.label}</option>)}</select></label>
            <div className="r2">{PF[row.jenis].map(([k, l]) => <label className="f" key={k}>{l}<input {...D(k)} inputMode={k === "usia" ? "numeric" : undefined} /></label>)}</div>
            <div className="r2">{ups.map(([k, l]) => (
              <div className="upl" key={k}><div className="th" style={v.photos[k] ? { backgroundImage: `url('${v.photos[k]}')` } : {}} /><label className="btn sm" htmlFor={`up-${k}`}>{busyUp === k ? "Mengunggah…" : l}</label><input type="file" id={`up-${k}`} accept="image/*" onChange={(e) => onPhoto(e, k)} />{v.photos[k] && <button type="button" className="btn sm ghost" onClick={() => setC((cc) => { cc.photos = { ...cc.photos, [k]: "" }; })}>Hapus</button>}</div>
            ))}</div>
            <div className="upl"><div className="th" style={v.photos.cover ? { backgroundImage: `url('${v.photos.cover}')` } : {}} /><label className="btn sm" htmlFor="up-cover">{busyUp === "cover" ? "Mengunggah…" : "Foto sampul"}</label><input type="file" id="up-cover" accept="image/*" onChange={(e) => onPhoto(e, "cover")} />{v.photos.cover && <button type="button" className="btn sm ghost" onClick={() => setC((cc) => { cc.photos = { ...cc.photos, cover: "" }; })}>Hapus sampul</button>}</div>
            <p className="hint" style={{ margin: 0 }}>Belum ada foto? Desain memakai latar contoh sampai kamu mengunggah foto sendiri.</p>
          </div></details>

          <details><summary>Studio: susunan &amp; warna</summary><div className="fbody">
            <div style={{ display: "grid", gap: 6 }}>
              <div className="srow fixed"><label><input type="checkbox" checked disabled readOnly /> Sampul &amp; pembuka</label><span className="hint">tetap di atas</span></div>
              {order.map((k, i) => (
                <div className="srow" key={k}>
                  <label><input type="checkbox" id={`sh-${k}`} checked={!hide.includes(k)} onChange={(e) => setC((cc) => { cc.hide = e.target.checked ? hide.filter((x) => x !== k) : [...hide, k]; })} /> {SECL[k]}</label>
                  <span className="mv">
                    <button type="button" aria-label={`Naikkan ${SECL[k]}`} disabled={i === 0} onClick={() => setC((cc) => { const o = [...order]; [o[i - 1], o[i]] = [o[i], o[i - 1]]; cc.order = o; })}>↑</button>
                    <button type="button" aria-label={`Turunkan ${SECL[k]}`} disabled={i === order.length - 1} onClick={() => setC((cc) => { const o = [...order]; [o[i + 1], o[i]] = [o[i], o[i + 1]]; cc.order = o; })}>↓</button>
                  </span>
                </div>
              ))}
              <div className="srow fixed"><label><input type="checkbox" checked disabled readOnly /> Penutup</label><span className="hint">tetap di bawah</span></div>
            </div>
            <label className="f">Warna aksen</label>
            <div className="sw">
              <button type="button" aria-pressed={!v.accent} title="Bawaan desain" style={{ background: "conic-gradient(#8a5a44 0 25%,#6f8a5e 0 50%,#2f6fb5 0 75%,#c0506a 0)" }} onClick={() => setC((cc) => { cc.accent = ""; })} />
              {ACCENTS.map((col) => <button type="button" key={col} aria-pressed={v.accent === col} aria-label={`Warna ${col}`} style={{ background: col }} onClick={() => setC((cc) => { cc.accent = col; })} />)}
              <input type="color" id="accPick" value={v.accent || "#8a5a44"} aria-label="Pilih warna sendiri" onChange={(e) => setC((cc) => { cc.accent = e.target.value; })} />
            </div>
          </div></details>

          <details><summary>Acara <small>{v.events.length} acara</small></summary><div className="fbody"><List k="events" items={v.events} setC={setC} /></div></details>

          <details><summary>Kata pembuka &amp; penutup</summary><div className="fbody">
            <label className="f">Salam pembuka<input {...D("salam")} /></label>
            <label className="f">Kutipan / doa<textarea {...D("quote")} /></label>
            <label className="f">Sumber kutipan (opsional)<input {...D("quoteSrc")} /></label>
            <label className="f">Kalimat penutup<textarea {...D("penutup")} /></label>
          </div></details>

          {(isDua(v) || v.stories.length > 0) && <details><summary>Love story <small>{v.stories.length} cerita</small></summary><div className="fbody"><List k="stories" items={v.stories} setC={setC} /></div></details>}

          <details><summary>Galeri foto <small>{v.photos.galeri.length}{L.foto === Infinity ? " foto" : ` / ${L.foto} foto`}</small></summary><div className="fbody">
            <div className="upl"><label className="btn sm" htmlFor="up-gal">{busyUp === "galeri" ? "Mengunggah…" : "+ Tambah foto"}</label><input type="file" id="up-gal" accept="image/*" multiple onChange={onGallery} /><span className="hint">{L.foto === Infinity ? "Foto otomatis diperkecil agar cepat dibuka" : `Basic: maksimal ${L.foto} foto. Premium tanpa batas.`}</span></div>
            <div className="gthumbs">{v.photos.galeri.map((g, i) => <div key={g} style={{ backgroundImage: `url('${g}')` }}><button type="button" aria-label="Hapus foto" onClick={() => setC((cc) => { cc.photos = { ...cc.photos, galeri: v.photos.galeri.filter((_, j) => j !== i) }; })}>✕</button></div>)}</div>
          </div></details>

          <details><summary>Amplop digital</summary><div className="fbody"><List k="gifts" items={v.gifts} setC={setC} />
            <label className="f">Alamat kirim kado (opsional)<textarea {...D("alamatKado")} /></label>
          </div></details>

          <details><summary>Musik <small>{{ contoh: "Instrumen contoh", upload: v.musicName || "Lagu sendiri", youtube: "YouTube", none: "Tanpa musik" }[v.music]}</small></summary><div className="fbody">
            <div className="toggles">
              {[["youtube", "Link YouTube"], ["upload", "Unggah MP3"], ["contoh", "Instrumen contoh"], ["none", "Tanpa musik"]].map(([m, l]) => (
                <label className="tog" key={m}><input type="radio" name="mus" id={`mus-${m}`} checked={v.music === m} disabled={(m === "upload" && !v.musicUrl) || (m === "youtube" && !v.ytId)} onChange={() => { stopMusic(); setC((cc) => { cc.music = m; }); }} /> {l}</label>
              ))}
            </div>
            <label className="f">Link lagu dari YouTube
              <input id="ytUrl" type="url" inputMode="url" placeholder="https://youtu.be/... atau https://www.youtube.com/watch?v=..." defaultValue={v.ytUrl}
                onChange={(e) => { const y = parseYouTube(e.target.value); setYtErr(e.target.value && !y ? "Link YouTube tidak dikenali. Salin dari tombol Bagikan di YouTube." : ""); stopMusic(); setC((cc) => { cc.ytUrl = e.target.value; if (y) { cc.ytId = y.id; cc.ytStart = y.start; cc.music = "youtube"; } else if (!e.target.value) { cc.ytId = ""; if (cc.music === "youtube") cc.music = "contoh"; } }); }} /></label>
            {ytErr ? <span className="err">{ytErr}</span> : v.ytId ? <span className="hint">♪ Video terpasang{v.ytStart ? `, mulai dari detik ke-${v.ytStart}` : ""}. Tekan "Tutup ke sampul" lalu "Buka" di pratinjau untuk mendengarkan.</span> : <span className="hint">Tempel link dari tombol Bagikan di YouTube. Agar lagu mulai di bagian tertentu, pakai link dengan waktu (contoh: ...?t=45).</span>}
            <div className="upl"><label className="btn sm" htmlFor="up-mus">{busyUp === "lagu" ? "Mengunggah…" : "Atau unggah lagu (MP3)"}</label><input type="file" id="up-mus" accept="audio/*" onChange={onMusic} /><span className="hint">{v.musicName ? "♪ " + v.musicName : "Maksimal 10 MB"}</span></div>
          </div></details>
        </form>

        <aside className="side">
          <div className="phone"><InviteFrame v={v} theme={row.theme} guest="Bapak Budi Santoso" ikey="ed" resetKey={resetKey} /></div>
          <div className="prevbar">
            <button type="button" className="btn sm" onClick={() => { stopMusic(); setResetKey((k) => k + 1); }}>↺ Tutup ke sampul</button>
            <Link className="btn sm pri" href={`/tamu/${row.id}`}>Kirim ke tamu →</Link>
          </div>
        </aside>
      </div>
      <UpgradeModal open={upg !== null} onClose={() => setUpg(null)} reason={upg} invitation={{ id: row.id, slug: row.slug, label }} />
    </div></div>
  );
}
