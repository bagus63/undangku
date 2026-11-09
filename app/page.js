"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JENIS, THEMES, REKOM, TH, sampleV } from "@/lib/invite";
import { useUser } from "@/lib/useUser";
import { toast } from "@/lib/ui";
import { PersonalCards } from "@/lib/pricing";
import InviteFrame from "@/components/InviteFrame";
import Mini from "@/components/Mini";
import ThemeCard from "@/components/ThemeCard";
import PreviewModal from "@/components/PreviewModal";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const S = useMemo(() => Object.fromEntries(Object.keys(JENIS).map((j) => [j, sampleV(j)])), []);
  const [pv, setPv] = useState(null);
  const start = user ? "/dashboard?baru=1" : "/masuk?daftar=1";
  const use = (id) => { const to = `/dashboard?baru=1&tema=${id}`; router.push(user ? to : `/masuk?daftar=1&lanjut=${encodeURIComponent(to)}`); };
  const upgrade = () => { if (!user) return router.push("/masuk?daftar=1"); toast("Buka undangan yang ingin di-upgrade, lalu tekan Upgrade di editor."); router.push("/dashboard"); };
  return (<>
    <div className="gut"><div className="in hero">
      <div>
        <span className="eyebrow">Undangan digital untuk setiap momen</span>
        <h1>Satu link untuk setiap <em>hari bahagia</em>.</h1>
        <p className="lead">Pilih desain, isi nama, foto, dan lagu, lalu kirim ke setiap tamu lewat WhatsApp dengan nama mereka di sampul. Konfirmasi kehadiran masuk ke satu dashboard.</p>
        <div className="jchips">{["Pernikahan", "Ulang tahun", "Khitanan", "Aqiqah", "Syukuran & acara umum"].map((x) => <span key={x}>{x}</span>)}</div>
        <div className="cta"><Link className="btn pri" href={start}>Buat undangan gratis</Link><Link className="btn" href="/tema">Lihat semua desain</Link></div>
        <div className="proof"><div><b>{THEMES.length}</b>desain siap pakai</div><div><b>5</b>jenis acara</div><div><b>Rp0</b>untuk mulai</div></div>
      </div>
      <div className="hero-ph"><div className="phone"><InviteFrame v={S.nikah} theme="mocha" guest="Bapak Budi Santoso" ikey="hero" /></div></div>
    </div></div>

    <div className="band gut"><div className="in sec">
      <span className="eyebrow">Untuk setiap acara</span>
      <h2 className="h2">Bukan cuma pernikahan</h2>
      <p className="lead">Setiap jenis acara punya isian dan kata-kata yang pas. Ulang tahun lengkap dengan usia, khitanan dan aqiqah dengan doa, syukuran dengan nama tuan rumah.</p>
      <div className="jgrid">{Object.entries(JENIS).map(([j, J]) => (
        <Link className="jcard" href="/tema" key={j}><Mini v={S[j]} theme={REKOM[j]} /><div className="t"><b>{J.label}</b><small>{J.desc}</small></div></Link>
      ))}</div>
    </div></div>

    <div className="gut"><div className="in sec">
      <span className="eyebrow">Desain terbaru</span>
      <h2 className="h2">Gaya undangan 2026</h2>
      <p className="lead">Dari tata letak majalah sampai sinematik layar penuh. Sampul di bawah adalah tampilan asli yang dilihat tamu.</p>
      <div className="cat" style={{ marginTop: 24 }}>{THEMES.filter((t) => t.baru).slice(0, 4).map((t) => <ThemeCard key={t.id} t={t} v={S[t.untuk[0]]} onPreview={() => setPv(t.id)} onUse={() => use(t.id)} />)}</div>
    </div></div>

    <div className="band gut"><div className="in sec">
      <div className="split">
        <div>
          <span className="eyebrow">Studio</span>
          <h2 className="h2">Susun undangan sesukamu</h2>
          <p className="lead">Atur urutan bagian, sembunyikan yang tidak perlu, dan ganti warna aksen. Pratinjau berubah saat itu juga.</p>
          <ul className="ticks"><li>Geser urutan: galeri dulu atau acara dulu</li><li>Nyalakan atau matikan love story, amplop, RSVP</li><li>Pilih warna aksen sendiri di atas desain mana pun</li></ul>
        </div>
        <div className="mock" aria-hidden="true">
          <div className="bar"><i /><i /><i /></div>
          <div className="srow-m">Kata pembuka <span>↑↓</span></div><div className="srow-m on">Galeri foto <span>↑↓</span></div>
          <div className="srow-m">Waktu &amp; tempat <span>↑↓</span></div><div className="srow-m">RSVP &amp; ucapan <span>↑↓</span></div>
          <div className="sw" style={{ marginTop: 6 }}>{["#8a5a44", "#6f8a5e", "#2f6fb5", "#c0506a", "#c9a14a"].map((c, i) => <span key={c} style={{ width: 30, height: 30, borderRadius: "50%", background: c, boxShadow: i === 1 ? "0 0 0 2px var(--fg)" : "0 0 0 1px var(--line)", border: "2px solid var(--surface)" }} />)}</div>
        </div>
      </div>
      <div className="split">
        <div className="mock" aria-hidden="true">
          <div className="bar"><i /><i /><i /></div>
          <div className="bub u">Ganti warnanya jadi hijau sage</div><div className="bub a">Selesai. Warna aksen sekarang hijau sage.</div>
          <div className="bub u">Tuliskan doa pembuka untuk aqiqah</div><div className="bub a">Sudah aku isi di bagian kata pembuka. Mau versi yang lebih singkat?</div>
        </div>
        <div>
          <span className="eyebrow">Minta AI</span>
          <h2 className="h2">Cukup ketik yang kamu mau</h2>
          <p className="lead">Ganti warna, tukar desain, tuliskan doa pembuka atau pantun undangan, atur bagian. Semua bisa dibatalkan dengan satu ketukan.</p>
          <ul className="ticks"><li>Paham bahasa sehari-hari</li><li>Perubahan langsung terlihat di pratinjau</li><li>Basic 5 perintah per hari, Premium 50</li></ul>
        </div>
      </div>
    </div></div>

    <div className="gut"><div className="in sec">
      <span className="eyebrow">Fitur</span>
      <h2 className="h2">Semua yang tamu butuhkan, di satu link</h2>
      <div className="feat">
        {[["Personal", "Nama tamu di sampul", 'Setiap tamu dapat link sendiri: "Kepada Yth. Bapak Budi".'], ["WhatsApp", "Kirim sekali klik", "Pesan undangan otomatis terisi nama & link tiap tamu."], ["RSVP", "Konfirmasi kehadiran", "Tamu isi hadir/tidak & jumlah orang, rekap langsung masuk."], ["Ucapan", "Buku tamu digital", "Doa dan ucapan tamu tampil di undangan dan dashboard."], ["Amplop", "Hadiah digital", "Nomor rekening & e-wallet dengan tombol salin."], ["Musik", "Lagu latar", "Lagu berputar saat tamu membuka undangan."], ["Dashboard", "Banyak undangan, satu akun", "Kelola pernikahan, ulang tahun anak, dan syukuran dari satu tempat."], ["Data", "Ekspor RSVP", "Salin rekap kehadiran ke Excel atau Google Sheets."]].map(([a, b, c]) => <div key={b}><small>{a}</small><h3>{b}</h3><p>{c}</p></div>)}
      </div>
    </div></div>

    <div className="band gut"><div className="in sec">
      <span className="eyebrow">Cara kerja</span>
      <h2 className="h2">Tiga langkah, selesai</h2>
      <div className="steps">
        <div><h3>Pilih &amp; isi</h3><p>Pilih jenis acara dan desain, lalu isi data. Pratinjau langsung terlihat.</p></div>
        <div><h3>Kirim lewat WhatsApp</h3><p>Tempel daftar nama tamu, setiap tamu dapat link dengan namanya sendiri.</p></div>
        <div><h3>Pantau kehadiran</h3><p>Lihat siapa yang hadir, jumlah orang, dan semua ucapan dari dashboard.</p></div>
      </div>
    </div></div>

    <div className="gut"><div className="in sec">
      <span className="eyebrow">Harga</span>
      <h2 className="h2">Mulai gratis, bayar sekali kalau perlu</h2>
      <div className="prices two"><PersonalCards onUpgrade={upgrade} loggedIn={!!user} /></div>
      <div className="banner" style={{ maxWidth: 820 }}><span><b>Punya usaha WO atau jasa undangan?</b> Kelola banyak klien dengan paket Reseller.</span><Link className="btn sm" href="/harga?p=reseller">Lihat paket Reseller →</Link></div>
    </div></div>

    <div className="band gut"><div className="in sec">
      <span className="eyebrow">Pertanyaan</span>
      <h2 className="h2">Yang sering ditanyakan</h2>
      <div className="faq">
        <details><summary>Apakah tamu perlu install aplikasi?</summary><p>Tidak. Undangan dibuka lewat browser di HP mana pun, cukup klik link dari WhatsApp.</p></details>
        <details><summary>Bisa ganti desain setelah undangan dikirim?</summary><p>Bisa. Link tetap sama, tamu otomatis melihat tampilan terbaru.</p></details>
        <details><summary>Apa bedanya Basic dan Premium?</summary><p>Basic gratis untuk 30 tamu dan 5 foto galeri dengan label Undangku. Premium membuka semua desain, tamu dan foto tanpa batas, tanpa label, dan 50 perintah Minta AI per hari.</p></details>
        <details><summary>Bagaimana cara bayar Premium?</summary><p>Transfer ke rekening yang tertera di halaman upgrade, lalu tekan "Saya sudah transfer". Paket aktif setelah dikonfirmasi admin.</p></details>
        <details><summary>Apakah uang amplop digital lewat Undangku?</summary><p>Tidak. Tamu transfer langsung ke rekening atau e-wallet pemilik acara. Undangku hanya menampilkan nomornya.</p></details>
        <details><summary>Saya WO, bisa pakai untuk klien?</summary><p>Bisa, lewat paket Reseller. Satu akun untuk banyak undangan klien.</p></details>
      </div>
    </div></div>

    <div className="gut"><div className="in sec">
      <div className="closing"><h2>Hari bahagiamu layak diumumkan dengan cantik.</h2><Link className="btn pri" href={start}>Buat undangan gratis</Link></div>
    </div></div>
    <footer className="foot gut"><div className="in">© 2026 Undangku · Undangan digital untuk pernikahan, ulang tahun, khitanan, aqiqah, dan syukuran</div></footer>
    <PreviewModal v={pv ? S[TH[pv].untuk[0]] : null} theme={pv} onClose={() => setPv(null)} onUse={() => use(pv)} />
  </>);
}
