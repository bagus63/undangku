import { supabaseServer } from "@/lib/supabase/server";
import { JENIS, nmText, toV, fmt } from "@/lib/invite";
import PublicInvite from "./PublicInvite";

async function load(slug) {
  if (!/^[a-z0-9-]{3,60}$/.test(slug)) return null;
  const sb = supabaseServer();
  const { data: row } = await sb.from("invitations").select("id,slug,jenis,theme,status,paket,content").eq("slug", slug).eq("status", "terbit").maybeSingle();
  if (!row) return null;
  const [{ data: rsvps }, { data: premium }] = await Promise.all([
    sb.from("rsvps").select("nama,hadir,ucapan,created_at").eq("invitation_id", row.id).order("created_at", { ascending: false }).limit(100),
    sb.rpc("invitation_premium", { inv_id: row.id }),
  ]);
  return { row, rsvps: rsvps || [], premium: !!premium };
}

export async function generateMetadata({ params, searchParams }) {
  const d = await load(params.slug);
  if (!d) return { title: "Undangan tidak ditemukan · Undangku" };
  const v = toV(d.row), f = fmt(v.events[0]?.waktu), to = searchParams?.to;
  const title = `${JENIS[v.jenis].label} ${nmText(v)}`;
  const description = `${to ? `Kepada Yth. ${to}. ` : ""}${f.tgl}${v.events[0]?.tempat ? " · " + v.events[0].tempat : ""}. Buka undangan untuk detail acara.`;
  return { title, description, openGraph: { title, description, type: "website", images: v.photos.cover ? [{ url: v.photos.cover }] : [] } };
}

export default async function Page({ params, searchParams }) {
  const d = await load(params.slug);
  if (!d) return (
    <div className="pubwrap" style={{ zIndex: 40, background: "var(--bg)", alignItems: "center" }}>
      <div className="center" style={{ textAlign: "center", padding: 24, height: "auto" }}>
        <div><h2 className="h2">Undangan tidak ditemukan</h2><p className="lead">Link mungkin salah ketik, atau undangan belum diterbitkan oleh pemiliknya.</p></div>
      </div>
    </div>
  );
  return <PublicInvite row={d.row} rsvps={d.rsvps} premium={d.premium} guest={(searchParams?.to || "").slice(0, 120)} />;
}
