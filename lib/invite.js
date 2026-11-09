/* Mesin undangan: data jenis acara, desain, contoh isi, dan renderer HTML.
   Dipakai di editor (pratinjau), halaman tamu, katalog, dan dashboard. */

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const rp = (n) => "Rp" + Number(n).toLocaleString("id-ID");
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const JENIS = {
  nikah: { label: "Pernikahan", dua: 1, kick: "The Wedding of", heroK: "Kami akan menikah", secK: "Mempelai", secT: "Dua keluarga, satu ikatan", nav: "Mempelai", mast: "Edisi Pernikahan", bento: "We're getting married", ci: "Sebuah kisah tentang", desc: "Akad, pemberkatan, resepsi" },
  ultah: { label: "Ulang Tahun", kick: "Birthday Party", heroK: "Ayo rayakan bersama", secK: "Yang berulang tahun", secT: "Bintang hari ini", nav: "Profil", mast: "Edisi Ulang Tahun", bento: "It's party time!", ci: "Merayakan", desc: "Anak, remaja, dewasa" },
  khitan: { label: "Khitanan", kick: "Walimatul Khitan", heroK: "Tasyakuran khitanan", secK: "Ananda", secT: "Insya Allah dikhitan", nav: "Ananda", mast: "Edisi Khitanan", bento: "Syukuran khitan", ci: "Tasyakuran untuk", desc: "Prosesi & tasyakuran" },
  aqiqah: { label: "Aqiqah", kick: "Tasyakuran Aqiqah", heroK: "Telah lahir buah hati kami", secK: "Buah hati", secT: "Selamat datang di dunia", nav: "Ananda", mast: "Edisi Aqiqah", bento: "Welcome, baby!", ci: "Menyambut", desc: "Aqiqah & cukur rambut" },
  umum: { label: "Acara Umum", kick: "Undangan", heroK: "Dengan senang hati kami mengundang", secK: "Tuan rumah", secT: "Kami menantikan Anda", nav: "Tuan rumah", mast: "Undangan", bento: "You're invited!", ci: "Bersama", desc: "Syukuran, reuni, peresmian" },
};

export const THEMES = [
  { id: "mocha", nama: "Mocha Editorial", tag: "Modern", layout: "editorial", baru: 1, untuk: ["nikah", "umum"], desc: "Gaya majalah, warna mocha hangat", bk: ["#c9a58e", "#6b4a3a", "#ffe6cc", "#f2b48a"] },
  { id: "sinema", nama: "Sinema", tag: "Modern", layout: "cinema", baru: 1, pro: 1, dark: 1, untuk: ["nikah", "ultah", "umum"], desc: "Layar penuh, nuansa film", bk: ["#3b2a20", "#07070a", "#ffc982", "#ff7f50"] },
  { id: "bento", nama: "Pastel Bento", tag: "Modern", layout: "bento", baru: 1, pro: 1, untuk: ["nikah", "ultah"], desc: "Kotak-kotak pastel yang lembut", bk: ["#f7d8e6", "#c6b6f3", "#fff2b8", "#bfe8d2"] },
  { id: "ceria", nama: "Balon Ceria", tag: "Ceria", layout: "bento", baru: 1, untuk: ["ultah", "aqiqah"], desc: "Warna cerah untuk pesta anak", bk: ["#ffd1dc", "#bfe9ff", "#fff0a0", "#c9f3b8"] },
  { id: "mono", nama: "Monokrom", tag: "Minimalis", layout: "poster", baru: 1, pro: 1, untuk: ["nikah", "ultah", "umum"], desc: "Hitam-putih, huruf besar tegas", bk: ["#b5b5b5", "#2b2b2b", "#ffffff", "#dddddd"] },
  { id: "plum", nama: "Plum Segel Lilin", tag: "Elegan", layout: "arch", baru: 1, pro: 1, dark: 1, untuk: ["nikah"], desc: "Bingkai lengkung & segel lilin", bk: ["#6a2550", "#1c0816", "#f0c87a", "#ff9fd2"] },
  { id: "islami", nama: "Hijau Arabesk", tag: "Islami", layout: "arch", baru: 1, dark: 1, untuk: ["khitan", "aqiqah", "nikah"], desc: "Pola bintang, hijau zamrud & emas", bk: ["#1c5a4c", "#082a24", "#e8c77a", "#9fe0c8"] },
  { id: "sage", nama: "Sage Botani", tag: "Floral", layout: "scallop", baru: 1, untuk: ["nikah", "aqiqah"], desc: "Garis daun, tepi bergelombang", bk: ["#c3cfb4", "#71866a", "#fff8ea", "#f1cbc6"] },
  { id: "nusa", nama: "Kawung Nusantara", tag: "Adat", layout: "classic", baru: 1, pro: 1, dark: 1, untuk: ["nikah", "khitan", "umum"], desc: "Motif kawung, cokelat soga", bk: ["#6b4128", "#25150c", "#f0b860", "#ff8a4a"] },
  { id: "jawa", nama: "Jawa Klasik", tag: "Adat", layout: "classic", dark: 1, untuk: ["nikah", "khitan"], desc: "Marun & emas, nuansa adat", bk: ["#7a3328", "#2b1412", "#e8b866", "#ff9a5a"] },
  { id: "navy", nama: "Navy Emas", tag: "Elegan", layout: "classic", dark: 1, untuk: ["nikah", "umum"], desc: "Biru malam dengan aksen emas", bk: ["#2b4570", "#0b1526", "#e6c27a", "#9fc2ff"] },
];
export const TH = Object.fromEntries(THEMES.map((t) => [t.id, t]));
export const REKOM = { nikah: "mocha", ultah: "ceria", khitan: "islami", aqiqah: "sage", umum: "navy" };
export const ORDER = ["quote", "mempelai", "countdown", "acara", "story", "galeri", "hadiah", "rsvp"];
export const SECL = { quote: "Kata pembuka", mempelai: "Profil / mempelai", countdown: "Hitung mundur", acara: "Waktu & tempat", story: "Love story", galeri: "Galeri foto", hadiah: "Amplop digital", rsvp: "RSVP & ucapan" };
export const ACCENTS = ["#8a5a44", "#6f8a5e", "#1f9e93", "#2f6fb5", "#6c4bd1", "#c0506a", "#f0506a", "#c9a14a", "#1a1a1a"];
export const LIMIT = { basic: { tamu: 30, foto: 5, ai: 5 }, premium: { tamu: Infinity, foto: Infinity, ai: 50 } };
export const PRICE = { premium: 129000 };
export const RESELLER = [
  { id: "mitra", nama: "Mitra", m: 149000, slot: 10, fit: ["10 undangan aktif", "Semua desain Premium", "Tanpa label Undangku", "Dashboard semua klien"] },
  { id: "studio", nama: "Studio", m: 399000, slot: 30, hot: 1, fit: ["30 undangan aktif", "Semua fitur Mitra", "Alamat undangan custom", "Logo usaha di undangan"] },
  { id: "agensi", nama: "Agensi", m: 899000, slot: 100, fit: ["100 undangan aktif", "Semua fitur Studio", "Domain merek sendiri", "Beberapa admin tim"] },
];

export const LEAF = (() => {
  let p = '<path d="M8 52C52 44 100 38 152 10"/>';
  [[34, 48], [60, 43], [86, 37], [112, 28], [136, 18]].forEach(([x, y], i) => {
    const s = 1 - i * 0.1;
    p += `<path d="M${x} ${y}c${-3 * s} ${-9 * s} ${2 * s} ${-16 * s} ${10 * s} ${-18 * s} ${2 * s} ${8 * s} ${-3 * s} ${15 * s} ${-10 * s} ${18 * s}z"/><path d="M${x} ${y}c${7 * s} ${4 * s} ${15 * s} ${2 * s} ${19 * s} ${-5 * s} ${-7 * s} ${-3 * s} ${-15 * s} ${-1 * s} ${-19 * s} ${5 * s}z"/>`;
  });
  return `<svg viewBox="0 0 160 60" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}<circle cx="153" cy="9" r="2.2" fill="currentColor"/></svg>`;
})();
const ICON = {
  mempelai: '<path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"/>',
  acara: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  galeri: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-10 8.5"/>',
  hadiah: '<rect x="4" y="9" width="16" height="4" rx="1"/><path d="M5.5 13v7h13v-7M12 9v11M12 9C10 5 6.5 5.5 7.5 8c.5 1.2 4.5 1 4.5 1s4 .2 4.5-1c1-2.5-2.5-3-4.5 1"/>',
  rsvp: '<path d="M4.5 5.5h15v10h-9l-4.5 3.5v-3.5h-1.5z"/>',
};
const NOTE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>';

/* ---------- contoh isi per jenis acara ---------- */
const SALAM = "Assalamu'alaikum Warahmatullahi Wabarakatuh";
export const AIQ = {
  nikah: [["Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.", "QS. Ar-Rum: 21"],
    ["Dua cerita yang berbeda akhirnya menemukan halaman yang sama. Kami ingin menuliskan bab berikutnya di hadapan orang-orang tersayang.", ""],
    ["Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Kehadiran dan doa restu Anda adalah kebahagiaan bagi kami.", ""]],
  ultah: [["Satu tahun lagi penuh tawa, belajar, dan petualangan. Ayo datang dan rayakan bersama!", ""], ["Kue sudah siap, balon sudah ditiup. Tinggal kamu yang belum datang!", ""]],
  khitan: [["Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan tasyakuran khitanan putra kami. Semoga ananda tumbuh menjadi anak yang saleh dan berbakti.", ""], ["Alhamdulillah, ananda telah siap menjalankan sunnah. Mohon doa agar ananda menjadi pribadi yang taat, cerdas, dan berakhlak mulia.", ""]],
  aqiqah: [["Alhamdulillah, dengan penuh rasa syukur kami menyambut kelahiran buah hati kami. Mohon doa agar ananda tumbuh sehat, saleh, dan menjadi penyejuk hati.", ""], ["Satu doa kecil telah dijawab dengan tangis pertama yang paling indah. Kami ingin berbagi syukur bersama keluarga dan sahabat.", ""]],
  umum: [["Dengan rasa syukur, kami ingin berbagi kebahagiaan bersama keluarga, sahabat, dan tetangga.", ""], ["Kebahagiaan terasa lengkap jika dirayakan bersama. Kami menantikan kehadiran Anda.", ""]],
};
export const PENUTUP = {
  nikah: "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  ultah: "Sampai jumpa di pesta! Kehadiranmu adalah hadiah terbaik.",
  khitan: "Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih.",
  aqiqah: "Atas kehadiran dan doanya untuk ananda, kami sekeluarga mengucapkan terima kasih.",
  umum: "Atas perhatian dan kehadirannya, kami ucapkan terima kasih.",
};
export const PANTUN = ["Pergi ke pasar membeli kain,\nkain dibeli warnanya biru.\nKami tak ingin undangan yang lain,\ncukup hadirmu di hari baru.", "Bunga melati di dalam taman,\nharum semerbak di pagi hari.\nDatanglah wahai kawan dan teman,\nramaikan bahagia kami di sini."];

export const isDua = (v) => !!JENIS[v.jenis]?.dua;
export const nmText = (v) => (isDua(v) ? `${v.data.pria || ""} & ${v.data.wanita || ""}` : v.data.nama || "");
export const subOf = (v) => (v.jenis === "ultah" && v.data.usia ? `Ulang tahun ke-${v.data.usia}` : v.jenis === "umum" ? v.data.namaFull || "" : "");
const initials = (v) => (isDua(v) ? (v.data.pria || "").charAt(0) + (v.data.wanita || "").charAt(0) : (v.data.nama || "").charAt(0));

/* Isi awal (content) untuk undangan baru per jenis */
export function sampleContent(jenis) {
  const c = {
    data: { salam: SALAM, quote: AIQ[jenis][0][0], quoteSrc: AIQ[jenis][0][1], penutup: PENUTUP[jenis], alamatKado: "" },
    events: [], stories: [], gifts: [{ bank: "BCA", no: "1234567890", an: "" }],
    photos: { cover: "", pria: "", wanita: "", anak: "", galeri: [] },
    music: "contoh", musicUrl: "", musicName: "", order: [...ORDER], hide: [], accent: "",
  };
  const D = c.data;
  if (jenis === "nikah") {
    Object.assign(D, { pria: "Raka", wanita: "Ayu", priaFull: "Raka Pratama, S.T.", wanitaFull: "Ayu Lestari, S.Pd.", ortuPria: "Putra pertama Bpk. Hadi Santoso & Ibu Sri Wahyuni", ortuWanita: "Putri kedua Bpk. Joko Susilo & Ibu Rina Marlina", alamatKado: "Jl. Melati No. 12, Sleman, Yogyakarta 55281 (a.n. Ayu Lestari)" });
    c.events = [{ nama: "Akad Nikah", waktu: "2026-12-20T08:00", selesai: "10.00 WIB", tempat: "Masjid Al-Ikhlas", alamat: "Jl. Kaliurang Km 7, Sleman", maps: "https://maps.google.com/?q=Masjid+Al-Ikhlas+Sleman" },
      { nama: "Resepsi", waktu: "2026-12-20T11:00", selesai: "selesai", tempat: "Gedung Graha Sari", alamat: "Jl. Melati No. 12, Yogyakarta", maps: "https://maps.google.com/?q=Yogyakarta" }];
    c.stories = [{ tahun: "2019", judul: "Pertama bertemu", isi: "Kami bertemu di kepanitiaan kampus. Satu rapat yang terlalu panjang jadi awal segalanya." }, { tahun: "2023", judul: "Menjalin komitmen", isi: "Setelah empat tahun berteman, kami memutuskan untuk melangkah lebih serius." }, { tahun: "2026", judul: "Lamaran", isi: "Dengan restu kedua keluarga, kami resmi bertunangan pada bulan Juni." }];
    c.gifts = [{ bank: "BCA", no: "1234567890", an: "Raka Pratama" }, { bank: "DANA", no: "081234567890", an: "Ayu Lestari" }];
  }
  if (jenis === "ultah") {
    Object.assign(D, { salam: "Halo, teman-teman!", nama: "Kirana", namaFull: "Kirana Putri Maharani", usia: "5", ortu: "Putri dari Bpk. Andi Saputra & Ibu Sinta Dewi" });
    c.events = [{ nama: "Pesta Ulang Tahun", waktu: "2026-12-13T15:00", selesai: "18.00 WIB", tempat: "Kafe Taman Bermain Ceria", alamat: "Jl. Kemang Raya No. 8, Jakarta Selatan", maps: "https://maps.google.com/?q=Kemang+Jakarta" }];
    c.hide = ["story"]; c.gifts = [];
  }
  if (jenis === "khitan") {
    Object.assign(D, { nama: "Fathan", namaFull: "Muhammad Fathan Alfarizi", ortu: "Putra kedua Bpk. Rudi Hartono & Ibu Laila Kurnia" });
    c.events = [{ nama: "Prosesi Khitan", waktu: "2026-12-27T08:00", selesai: "10.00 WIB", tempat: "Kediaman keluarga", alamat: "Jl. Cempaka No. 21, Bandung", maps: "https://maps.google.com/?q=Bandung" }, { nama: "Tasyakuran", waktu: "2026-12-27T11:00", selesai: "selesai", tempat: "Kediaman keluarga", alamat: "Jl. Cempaka No. 21, Bandung", maps: "" }];
    c.hide = ["story"]; c.gifts[0].an = "Rudi Hartono";
  }
  if (jenis === "aqiqah") {
    Object.assign(D, { nama: "Alesha", namaFull: "Alesha Nur Azzahra", ortu: "Putri pertama Bpk. Fajar Ramadhan & Ibu Nadia Putri" });
    c.events = [{ nama: "Tasyakuran Aqiqah", waktu: "2027-01-10T10:00", selesai: "13.00 WIB", tempat: "Kediaman keluarga", alamat: "Jl. Anggrek No. 5, Surabaya", maps: "https://maps.google.com/?q=Surabaya" }];
    c.hide = ["story"]; c.gifts[0].an = "Fajar Ramadhan";
  }
  if (jenis === "umum") {
    Object.assign(D, { salam: "Dengan hormat,", nama: "Rumah Baru", namaFull: "Keluarga Bpk. Hendra Wijaya", ortu: "Syukuran menempati rumah baru" });
    c.events = [{ nama: "Syukuran & Makan Siang", waktu: "2026-12-06T11:00", selesai: "14.00 WIB", tempat: "Rumah keluarga Wijaya", alamat: "Perum Griya Asri Blok C-7, Bekasi", maps: "https://maps.google.com/?q=Bekasi" }];
    c.hide = ["story", "hadiah"]; c.gifts = [];
  }
  const nm = jenis === "nikah" ? `${D.pria} & ${D.wanita}` : D.nama;
  c.waTpl = `Kepada Yth.\nBapak/Ibu/Saudara/i\n*{nama}*\n\nKami mengundang Anda untuk hadir di acara ${JENIS[jenis].label.toLowerCase()} ${nm}.\n\nInfo lengkap acara:\n{link}\n\nTerima kasih.`;
  return c;
}

/* Gabungkan baris database menjadi objek undangan untuk renderer */
export function toV(row, extra = {}) {
  const c = row.content || {};
  const base = sampleContent(row.jenis || "nikah");
  return {
    id: row.id, slug: row.slug, jenis: row.jenis || "nikah", theme: TH[row.theme] ? row.theme : "mocha", status: row.status, paket: row.paket,
    data: { ...base.data, ...(c.data || {}) }, events: c.events || base.events, stories: c.stories || [], gifts: c.gifts || [],
    photos: { ...base.photos, ...(c.photos || {}) }, music: c.music || "contoh", musicUrl: c.musicUrl || "", musicName: c.musicName || "",
    order: c.order && c.order.length ? c.order : [...ORDER], hide: c.hide || [], accent: c.accent || "", waTpl: c.waTpl || base.waTpl,
    premium: !!extra.premium, rsvp: extra.rsvp || [], guests: extra.guests || [],
  };
}
export function sampleV(jenis) { return toV({ id: "contoh-" + jenis, jenis, theme: REKOM[jenis], content: sampleContent(jenis) }, { premium: true }); }

export function fmt(v) {
  const d = new Date(v);
  if (!v || isNaN(d)) return { tgl: "Tanggal belum diisi", jam: "", d: "--", m: "--", y: "----", yy: "--", bln: "" };
  const p = (n) => String(n).padStart(2, "0");
  return { tgl: `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`, jam: `${p(d.getHours())}.${p(d.getMinutes())} WIB`, d: p(d.getDate()), m: p(d.getMonth() + 1), y: String(d.getFullYear()), yy: String(d.getFullYear()).slice(2), bln: BULAN[d.getMonth()].slice(0, 3) };
}
export const slugify = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

/* ---------- latar contoh (bokeh) sampai pengguna mengunggah foto ---------- */
function rng(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const BK = {};
export function bokeh(tid, seed = 1, w = 420, h = 640) {
  const k = tid + "|" + seed + "|" + w + "x" + h;
  if (BK[k]) return BK[k];
  if (typeof document === "undefined") return "";
  const T = TH[tid] || THEMES[0], [a, b, c1, c2] = T.bk, cv = document.createElement("canvas");
  cv.width = w; cv.height = h; const x = cv.getContext("2d");
  const r = rng(seed * 7919 + T.id.charCodeAt(0) * 31 + T.id.length);
  const g = x.createLinearGradient(r() * w * 0.3, 0, w * 0.7, h); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.globalCompositeOperation = T.dark ? "lighter" : "source-over";
  for (let i = 0; i < 44; i++) {
    const cx = r() * w, cy = r() * h, rad = 10 + r() * r() * w * 0.24, col = r() < 0.55 ? c1 : c2, al = (T.dark ? 0.08 : 0.2) + r() * 0.22;
    const rg = x.createRadialGradient(cx, cy, 0, cx, cy, rad); rg.addColorStop(0, rgba(col, al)); rg.addColorStop(0.75, rgba(col, al * 0.55)); rg.addColorStop(1, rgba(col, 0));
    x.fillStyle = rg; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill();
  }
  x.globalCompositeOperation = "source-over";
  const id = x.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  x.putImageData(id, 0, 0);
  return (BK[k] = cv.toDataURL("image/jpeg", 0.84));
}
const bg = (u) => (u ? `background-image:url('${String(u).replace(/'/g, "%27")}')` : "");

/* ---------- musik ---------- */
const M = { actx: null, timer: null, step: 0, t: 0, audio: null, playing: false };
function note(m, t, d, v) {
  const o = M.actx.createOscillator(), g = M.actx.createGain(); o.type = "triangle"; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(M.actx.destination); o.start(t); o.stop(t + d + 0.05);
}
function startTune() {
  try { M.actx = M.actx || new (window.AudioContext || window.webkitAudioContext)(); M.actx.resume(); } catch (e) { return; }
  const prog = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], pat = [0, 1, 2, 1, 2, 1, 0, 2], beat = 0.4; M.t = M.actx.currentTime + 0.05;
  const sched = () => { while (M.t < M.actx.currentTime + 1) { const c = prog[Math.floor(M.step / 8) % 4]; note(c[pat[M.step % 8]] + 12, M.t, 1.8, 0.07); if (M.step % 8 === 0) note(c[0] - 12, M.t, 3.2, 0.06); if (M.step % 16 === 4) note(c[2] + 24, M.t, 1.2, 0.03); M.t += beat; M.step++; } };
  sched(); clearInterval(M.timer); M.timer = setInterval(sched, 200);
}
export function playMusic(v) {
  if (v.music === "none") return;
  if (v.music === "upload" && v.musicUrl) {
    if (!M.audio) { M.audio = new Audio(); M.audio.loop = true; }
    if (M.audio.src !== v.musicUrl) M.audio.src = v.musicUrl;
    M.audio.play().catch(() => {});
  } else startTune();
  M.playing = true; document.querySelectorAll(".mus").forEach((b) => b.classList.add("on"));
}
export function stopMusic() {
  if (M.audio) M.audio.pause(); clearInterval(M.timer); M.playing = false;
  if (typeof document !== "undefined") document.querySelectorAll(".mus").forEach((b) => b.classList.remove("on"));
}

/* ---------- sampul per tata letak ---------- */
export function coverHTML(v, tid, guest, gone) {
  const T = TH[tid] || THEMES[0], J = JENIS[v.jenis], d = v.data, dua = isDua(v), p = esc(d.pria), w = esc(d.wanita), n = esc(d.nama), ev = v.events[0] || {}, f = fmt(ev.waktu), g = esc(guest || "Tamu Undangan"), sb = esc(subOf(v));
  const N = dua ? `${p} &amp; ${w}` : n, SB = sb ? `<div class="sub">${sb}</div>` : "";
  const cls = `cov cv-${{ classic: "classic", editorial: "ed", poster: "po", cinema: "ci", arch: "ar", scallop: "sc", bento: "be" }[T.layout]}${gone ? " gone" : ""}`;
  const to = `<div class="to">Kepada Yth. Bapak/Ibu/Saudara/i</div><div class="gs">${g}</div>`;
  const open = (l) => `<button type="button" class="obtn" data-a="open">${l || "Buka Undangan"}</button>`;
  const ph = bg(v.photos.cover || bokeh(T.id, 1));
  switch (T.layout) {
    case "editorial": return `<div class="${cls}"><div class="mast"><span>${J.mast}</span><span>No. ${f.d}/${f.m}</span></div><div class="ph" style="${ph}"></div><div class="nm">${dua ? `${p}<i>dan</i>${w}` : n}</div>${SB}<div class="row"><div><small>${f.d}.${f.m}.${f.y} · Untuk</small><div class="gs" style="margin-top:4px">${g}</div></div>${open("Buka →")}</div></div>`;
    case "poster": return `<div class="${cls}"><div class="top"><span>Save the date</span><span>${f.d}.${f.m}.${f.yy}</span></div><div class="nm">${dua ? `<span>${p}</span><i>&amp;</i><span>${w}</span>` : n.split(" ").map((x) => `<span>${x}</span>`).join("") + (sb ? `<i>${sb}</i>` : "")}</div><div class="ph" style="${ph}"></div><div class="bt"><div><div class="to">Untuk</div><div style="font-weight:800;font-size:1.05rem;font-family:'Plus Jakarta Sans',sans-serif">${g}</div></div>${open("Buka")}</div></div>`;
    case "cinema": return `<div class="${cls}" style="${ph}"><div class="lb t"></div><div class="lb b"></div><div class="mid"><span class="k">${J.ci}</span><div class="nm">${N}</div>${SB}<span class="k" style="margin-top:8px">Tayang ${f.d} · ${f.m} · ${f.y}</span></div><div class="bot">${to}${open("▶&nbsp; Putar undangan")}</div></div>`;
    case "arch": return `<div class="${cls}"><span class="k">${J.kick}</span><div class="arch" style="${ph}"></div><div class="nm">${dua ? `${p} <i>&amp;</i> ${w}` : n}</div>${SB}<div class="dt">${f.tgl}</div>${to}<button type="button" class="seal" data-a="open" aria-label="Buka undangan"><span>${esc(initials(v))}</span></button><span class="hint2">Sentuh segel untuk membuka</span></div>`;
    case "scallop": return `<div class="${cls}"><div class="spr">${LEAF}</div><span class="k">${J.heroK}</span><div class="oval" style="${ph}"></div><div class="nm">${N}</div>${SB}<div class="dt">${f.tgl}</div>${to}${open()}</div>`;
    case "bento": return `<div class="${cls}"><div class="g"><div class="t ph" style="${ph}"></div><div class="t n"><span class="k">${J.bento}</span><div class="nm">${N}</div>${SB}</div><div class="t d"><b>${f.d}</b><span class="k" style="letter-spacing:.12em">${f.bln} ${f.y}</span></div><div class="t gt"><span class="k" style="letter-spacing:.12em">Untuk</span><b>${g}</b></div><button type="button" class="t bt" data-a="open"><span>Buka undangan</span><span>↗</span></button></div></div>`;
    default: return `<div class="${cls}" style="${ph}"><span class="k">${J.kick}</span><div class="nm">${N}</div>${SB}${to}<div style="height:18px"></div>${open()}</div>`;
  }
}
export const miniHTML = (v, tid, guest) => `<div class="frame t-${tid} L-${TH[tid].layout}" style="${v.accent ? `--i-acc:${v.accent}` : ""}">${coverHTML(v, tid, guest || "Bapak Budi Santoso").replace(/<button/g, "<span").replace(/<\/button>/g, "</span>")}</div>`;

/* ---------- isi undangan ---------- */
export function inviteHTML(v, key, guest, tid, opened) {
  tid = TH[tid] ? tid : v.theme;
  const T = TH[tid], J = JENIS[v.jenis], d = v.data, P = v.photos, ev0 = v.events[0] || {}, fd = fmt(ev0.waktu), dua = isDua(v), sb = esc(subOf(v));
  const H = (k, t) => `<h3><span class="spr">${LEAF}</span><small>${k}</small>${t}</h3>`;
  const pf = (slot, n, seed) => (P[slot] ? `<div class="pf" style="${bg(P[slot])}"></div>` : `<div class="pf" style="${bg(bokeh(tid, seed, 300, 400))}">${esc((n || "?").trim().charAt(0))}</div>`);
  const vis = (k) => !v.hide.includes(k);
  const S_ = {
    quote: () => `<section><p class="salam">${esc(d.salam)}</p><p class="qt" style="white-space:pre-line">“${esc(d.quote)}”${d.quoteSrc ? `<cite>${esc(d.quoteSrc)}</cite>` : ""}</p></section>`,
    mempelai: () => `<section data-sec="mempelai">${H(J.secK, J.secT)}${dua
      ? `<div class="pp"><div class="ps">${pf("pria", d.pria, 2)}<span class="k">Mempelai pria</span><div class="fn">${esc(d.priaFull)}</div><p>${esc(d.ortuPria)}</p></div><div class="amp">&amp;</div><div class="ps">${pf("wanita", d.wanita, 3)}<span class="k">Mempelai wanita</span><div class="fn">${esc(d.wanitaFull)}</div><p>${esc(d.ortuWanita)}</p></div></div>`
      : `<div class="pp one"><div class="ps">${pf("anak", d.nama, 2)}<div class="fn">${esc(d.namaFull)}</div>${sb && v.jenis === "ultah" ? `<p class="sub" style="opacity:1">${sb}</p>` : ""}<p>${esc(d.ortu)}</p></div></div>`}</section>`,
    countdown: () => `<section class="s-cd">${H("Hitung mundur", "Menuju hari bahagia")}<p style="margin:0">${fd.tgl}</p><div class="cd" data-t="${esc(ev0.waktu || "")}"><div><b>0</b><span>Hari</span></div><div><b>0</b><span>Jam</span></div><div><b>0</b><span>Menit</span></div><div><b>0</b><span>Detik</span></div></div></section>`,
    acara: () => `<section data-sec="acara">${H("Waktu & tempat", "Rangkaian acara")}${v.events.map((e) => { const x = fmt(e.waktu); return `<div class="ev"><h4>${esc(e.nama)}</h4><p>${x.tgl}</p><p>${x.jam}${e.selesai ? " – " + esc(e.selesai) : ""}</p><p style="margin-top:10px"><b>${esc(e.tempat)}</b></p><p>${esc(e.alamat)}</p>${e.maps && /^https?:\/\//.test(e.maps) ? `<a class="obtn" href="${esc(e.maps)}" target="_blank" rel="noopener">Buka Google Maps</a>` : ""}</div>`; }).join("") || "<p>Belum ada acara</p>"}</section>`,
    story: () => (v.stories.length ? `<section>${H("Love story", "Kisah kami")}<div class="tl">${v.stories.map((s) => `<div><small>${esc(s.tahun)}</small><b>${esc(s.judul)}</b><p>${esc(s.isi)}</p></div>`).join("")}</div></section>` : ""),
    galeri: () => `<section data-sec="galeri">${H("Galeri", "Momen kami")}<div class="gl">${(P.galeri.length ? P.galeri : [0, 1, 2].map((i) => bokeh(tid, i + 5, 360, 360))).map((g) => `<div style="${bg(g)}"></div>`).join("")}</div></section>`,
    hadiah: () => (v.gifts.length || d.alamatKado ? `<section data-sec="hadiah">${H("Amplop digital", "Tanda kasih")}<p style="margin:0 0 16px;opacity:.85">Doa restu Anda sudah lebih dari cukup. Namun jika ingin memberi tanda kasih, dapat melalui:</p>
      ${v.gifts.map((g, i) => `<div class="gift"><b>${esc(g.bank)}</b><div class="no">${esc(g.no)}</div><div>a.n. ${esc(g.an)}</div><button type="button" data-a="gift" data-i="${i}">Salin nomor</button></div>`).join("")}
      ${d.alamatKado ? `<div class="gift"><b>KIRIM KADO</b><div style="margin-top:6px">${esc(d.alamatKado)}</div><button type="button" data-a="addr">Salin alamat</button></div>` : ""}</section>` : ""),
    rsvp: () => `<section data-sec="rsvp">${H("RSVP", "Konfirmasi kehadiran")}
      <form class="rf"><input id="${key}-rn" required maxlength="120" placeholder="Nama" value="${esc(guest || "")}">
        <select id="${key}-rh"><option>Hadir</option><option>Tidak hadir</option><option value="Ragu">Masih ragu</option></select>
        <select id="${key}-rj"><option value="1">1 orang</option><option value="2">2 orang</option><option value="3">3 orang</option><option value="4">4 orang</option></select>
        <textarea id="${key}-ru" rows="3" maxlength="1000" placeholder="Tulis ucapan & doa"></textarea><button class="obtn" type="submit">Kirim</button></form>
      <div class="ws">${v.rsvp.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50).map((w) => `<div><b>${esc(w.nama)}</b><em>${esc(w.hadir)}</em><p>${esc(w.ucapan)}</p></div>`).join("")}</div></section>`,
  };
  const body = v.order.filter(vis).map((k) => (S_[k] ? S_[k]() : "")).join("");
  const NAV = { mempelai: J.nav, acara: "Acara", galeri: "Galeri", hadiah: "Hadiah", rsvp: "RSVP" };
  const nav = v.order.filter((k) => NAV[k] && vis(k) && (k !== "hadiah" || v.gifts.length || d.alamatKado));
  const acc = v.accent ? `--i-acc:${esc(v.accent)};` : "";
  return `<div class="frame t-${tid} L-${T.layout}${opened ? " op" : ""}" style="${acc}">
  ${coverHTML(v, tid, guest, opened)}
  <div class="prog"><i></i></div>
  <div class="scr">
    <section class="s-hero"><div class="hph" style="${bg(P.cover || bokeh(tid, 1))}"></div><span class="k">${J.heroK}</span>
      <div class="nm">${dua ? `<span>${esc(d.pria)}</span> <i>&amp;</i> <span>${esc(d.wanita)}</span>` : `<span>${esc(d.nama)}</span>`}</div>${sb ? `<div class="sub">${sb}</div>` : ""}
      <div class="dn"><b>${fd.d}</b><span>.</span><b>${fd.m}</b><span>.</span><b>${fd.yy}</b></div><p class="dl">${fd.tgl}</p></section>
    ${body}
    <section class="end"><div class="orn"><span class="k">Terima kasih</span></div><p style="margin:0">${esc(d.penutup)}</p><div class="nm">${esc(nmText(v))}</div>${v.premium ? "" : `<div class="wm">Dibuat dengan Undangku</div>`}</section>
  </div>
  <nav class="inav" aria-label="Navigasi undangan">${nav.map((s) => `<button type="button" data-a="go" data-s="${s}" aria-label="${NAV[s]}" title="${NAV[s]}"><svg viewBox="0 0 24 24">${ICON[s]}</svg></button>`).join("")}</nav>
  ${v.music !== "none" ? `<button type="button" class="mus${M.playing ? " on" : ""}" data-a="mus" aria-label="Putar atau jeda musik">${NOTE}</button>` : ""}
</div>`;
}

/* Pasang undangan ke elemen DOM dan hubungkan tombolnya.
   opts: { key, guest, theme, opened, onOpen, onRsvp(entry) => Promise, toast } */
export function mountInvite(el, v, opts = {}) {
  if (!el) return;
  const key = opts.key || "inv";
  const old = el.querySelector(".scr"); const st = old ? old.scrollTop : 0;
  el.innerHTML = inviteHTML(v, key, opts.guest, opts.theme, opts.opened);
  const fr = el.querySelector(".frame"), scr = fr.querySelector(".scr"), bar = fr.querySelector(".prog i");
  scr.scrollTop = st;
  const secs = [...scr.querySelectorAll("[data-sec]")], btns = [...fr.querySelectorAll(".inav button")];
  const onScroll = () => {
    const max = scr.scrollHeight - scr.clientHeight; bar.style.width = (max > 0 ? (scr.scrollTop / max) * 100 : 0) + "%";
    let cur = ""; secs.forEach((s) => { if (s.offsetTop - scr.clientHeight * 0.4 <= scr.scrollTop) cur = s.dataset.sec; });
    btns.forEach((b) => b.classList.toggle("on", b.dataset.s === cur));
  };
  scr.onscroll = onScroll; onScroll();
  const toast = opts.toast || (() => {});
  el.onclick = (e) => {
    const b = e.target.closest("[data-a]"); if (!b) return; const a = b.dataset.a;
    if (a === "open") { fr.querySelector(".cov").classList.add("gone"); fr.classList.add("op"); opts.onOpen && opts.onOpen(); playMusic(v); }
    if (a === "go") { const t = scr.querySelector(`[data-sec="${b.dataset.s}"]`); if (t) scr.scrollTo({ top: t.offsetTop - 8, behavior: "smooth" }); }
    if (a === "mus") { M.playing ? stopMusic() : playMusic(v); }
    if (a === "gift") { const g = v.gifts[+b.dataset.i]; copyText(g.no).then(() => toast(`Nomor ${g.bank} disalin`)); }
    if (a === "addr") { copyText(v.data.alamatKado).then(() => toast("Alamat disalin")); }
  };
  const form = fr.querySelector("form.rf");
  if (form) form.onsubmit = async (e) => {
    e.preventDefault();
    const nama = el.querySelector(`#${key}-rn`).value.trim(); if (!nama) { toast("Isi nama dulu"); return; }
    const hadir = el.querySelector(`#${key}-rh`).value;
    const entry = { nama, hadir, jumlah: hadir === "Tidak hadir" ? 0 : +el.querySelector(`#${key}-rj`).value, ucapan: el.querySelector(`#${key}-ru`).value.trim() || "(tanpa ucapan)" };
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Mengirim…";
    try { if (opts.onRsvp) await opts.onRsvp(entry); toast("Terima kasih, konfirmasi terkirim"); }
    catch (err) { toast("Gagal mengirim: " + (err.message || "coba lagi")); btn.disabled = false; btn.textContent = "Kirim"; }
  };
  tickCountdowns();
}
export function tickCountdowns() {
  if (typeof document === "undefined") return;
  document.querySelectorAll(".cd").forEach((c) => {
    const t = new Date(c.dataset.t) - Date.now(); const s = Math.max(0, Math.floor((isNaN(t) ? 0 : t) / 1000));
    const vals = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
    c.querySelectorAll("b").forEach((b, i) => (b.textContent = vals[i]));
  });
}
export function copyText(text) {
  const fb = () => { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); };
  try { return navigator.clipboard.writeText(text).catch(fb); } catch (e) { fb(); return Promise.resolve(); }
}

/* ---------- Minta AI (aturan sederhana; bisa diganti AI sungguhan nanti) ---------- */
const COLORS = { "merah muda": "#e88aa6", "hijau sage": "#7c9a6e", sage: "#7c9a6e", merah: "#c0392b", pink: "#e05a8a", ungu: "#7b4bc4", lilac: "#9b84d9", biru: "#2f6fb5", navy: "#1d3557", tosca: "#1f9e93", hijau: "#4f8a5b", kuning: "#e0b02a", emas: "#c9a14a", gold: "#c9a14a", oranye: "#e07a2f", jingga: "#e07a2f", coklat: "#8a5a44", cokelat: "#8a5a44", mocha: "#8a5a44", hitam: "#1a1a1a", maroon: "#7a2232", marun: "#7a2232" };
const SECW = { galeri: ["galeri", "foto"], story: ["love story", "cerita", "kisah"], countdown: ["hitung mundur", "countdown"], hadiah: ["amplop", "hadiah", "kado", "rekening"], rsvp: ["rsvp", "ucapan", "buku tamu", "konfirmasi"], acara: ["acara", "lokasi", "waktu"], mempelai: ["mempelai", "profil"], quote: ["kata pembuka", "kutipan"] };
let aiQi = 0;
/* Mengubah content (objek salinan) sesuai perintah. Kembalikan {content, theme, msg} atau null */
export function aiApply(raw, jenis, content, theme, premium) {
  const t = raw.toLowerCase(), out = []; let th2 = theme;
  const c = JSON.parse(JSON.stringify(content));
  const hideV = /(sembunyi|hilangkan|matikan|hapus bagian|nonaktif|tutup)/.test(t), showV = /(tampilkan|munculkan|aktifkan|nyalakan)/.test(t);
  const th = THEMES.find((x) => t.includes(x.nama.toLowerCase())) || THEMES.find((x) => new RegExp("\\b" + x.id + "\\b").test(t)) || THEMES.find((x) => x.nama.toLowerCase().split(" ").some((w) => w.length > 4 && !COLORS[w] && new RegExp("(desain|tema)\\s+(ke\\s+)?" + w).test(t)));
  if (th && /(desain|tema)/.test(t)) { th2 = th.id; out.push(`Desain diganti ke ${th.nama}.` + (th.pro && !premium ? " Ini desain Premium, bisa dicoba dulu." : "")); }
  if (/musik|lagu/.test(t) && (hideV || /tanpa/.test(t))) { c.music = "none"; stopMusic(); out.push("Musik dimatikan."); }
  else if (/musik|lagu/.test(t) && showV) { c.music = "contoh"; out.push("Musik instrumen dinyalakan lagi."); }
  const cw = Object.keys(COLORS).find((k) => t.includes(k));
  if (cw && /(warna|aksen|jadi|ganti|ubah)/.test(t)) { c.accent = COLORS[cw]; out.push(`Warna aksen sekarang ${cw}.`); }
  if (/warna (asli|bawaan|semula)|reset warna/.test(t)) { c.accent = ""; out.push("Warna kembali ke bawaan desain."); }
  c.order = c.order && c.order.length ? c.order : [...ORDER]; c.hide = c.hide || [];
  const sec = Object.keys(SECW).find((k) => SECW[k].some((w) => t.replace(/kata pembuka|doa pembuka/g, (m) => (hideV || showV ? m : "")).includes(w)));
  if (sec && !/musik|lagu/.test(t) && (hideV || showV)) {
    if (hideV) { if (!c.hide.includes(sec)) c.hide.push(sec); out.push(`Bagian ${SECL[sec]} disembunyikan.`); }
    else { c.hide = c.hide.filter((x) => x !== sec); out.push(`Bagian ${SECL[sec]} ditampilkan.`); }
  } else if (sec && /(pindah|taruh|naikkan|turunkan|letakkan|urut)/.test(t)) {
    c.order.splice(c.order.indexOf(sec), 1);
    if (/(bawah|akhir|terakhir|turunkan)/.test(t)) { c.order.push(sec); out.push(`${SECL[sec]} dipindah ke paling bawah.`); }
    else { c.order.unshift(sec); out.push(`${SECL[sec]} dipindah ke paling atas, tepat setelah sampul.`); }
  }
  c.data = c.data || {};
  if (/pantun/.test(t)) { c.data.quote = PANTUN[aiQi++ % PANTUN.length]; c.data.quoteSrc = ""; c.hide = c.hide.filter((x) => x !== "quote"); out.push("Pantun undangan sudah aku tulis di bagian kata pembuka:\n" + c.data.quote); }
  else if (/(doa|kata pembuka|kalimat pembuka|kutipan|ayat|pembuka)/.test(t) && !hideV && !showV) { const q = AIQ[jenis][aiQi++ % AIQ[jenis].length]; c.data.quote = q[0]; c.data.quoteSrc = q[1]; out.push("Sudah aku isi di bagian kata pembuka:\n“" + q[0] + "”" + (q[1] ? " (" + q[1] + ")" : "")); }
  if (/penutup/.test(t) && !hideV) { c.data.penutup = PENUTUP[jenis]; out.push("Kalimat penutup sudah diperbarui."); }
  if (!out.length) return null;
  return { content: c, theme: th2, msg: out.join("\n") };
}
