"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  const { user, profile } = useUser();
  const L = user
    ? [["/dashboard", "Undangan Saya"], ["/tema", "Desain"], ["/harga", "Harga"], ...(profile?.is_admin ? [["/admin", "Admin"]] : [])]
    : [["/", "Beranda"], ["/tema", "Desain"], ["/harga", "Harga"]];
  const nama = profile?.nama || user?.email || "";
  const logout = async () => { await supabaseBrowser().auth.signOut(); router.push("/"); router.refresh(); };
  return (
    <header className="nav gut">
      <div className="in">
        <Link className="brand" href={user ? "/dashboard" : "/"}><i>U</i>Undangku</Link>
        <nav className="links" aria-label="Menu utama">
          {L.map(([h, l]) => <Link key={h} href={h} aria-current={path === h || (h !== "/" && path.startsWith(h)) ? "page" : undefined}>{l}</Link>)}
        </nav>
        <div className="navr">
          {user ? (<>
            <span className="who"><span className="av">{nama.charAt(0).toUpperCase()}</span><span className="nm2">{nama}</span></span>
            <button type="button" className="btn sm ghost" onClick={logout}>Keluar</button>
          </>) : (<>
            <Link className="btn sm ghost" href="/masuk">Masuk</Link>
            <Link className="btn sm pri" href="/masuk?daftar=1">Mulai gratis</Link>
          </>)}
        </div>
      </div>
    </header>
  );
}
