"use client";
import Link from "next/link";
import { rp, PRICE, THEMES } from "./invite";

export function PersonalCards({ onUpgrade, loggedIn }) {
  return (<>
    <div className="price"><h3>Basic</h3><div className="amt">Gratis</div>
      <ul><li>6 desain gratis</li><li>Sampai 30 tamu</li><li>5 foto galeri</li><li>RSVP &amp; ucapan</li><li>5 perintah Minta AI per hari</li><li>Label "Dibuat dengan Undangku"</li></ul>
      <Link className="btn" href={loggedIn ? "/dashboard?baru=1" : "/masuk?daftar=1"}>Mulai gratis</Link></div>
    <div className="price hot"><span className="tag">Paling dipilih</span><h3>Premium</h3><div className="amt">{rp(PRICE.premium)} <small>/ undangan, sekali bayar</small></div>
      <ul><li>Semua {THEMES.length} desain</li><li>Tamu &amp; foto galeri tanpa batas</li><li>Tanpa label Undangku</li><li>50 perintah Minta AI per hari</li><li>Ekspor RSVP ke Excel</li><li>Aktif 12 bulan</li></ul>
      <button type="button" className="btn pri" onClick={onUpgrade}>Upgrade ke Premium</button></div>
  </>);
}
