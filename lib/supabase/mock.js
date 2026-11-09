"use client";
/* Database tiruan di browser (localStorage) untuk mencoba aplikasi tanpa Supabase.
   Aktif hanya jika NEXT_PUBLIC_SUPABASE_URL=mock. Jangan dipakai untuk produksi. */
const KEY = "undangku-mock-db";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
const db = () => {
  let d = load();
  if (!d) d = { user: null, profiles: [], invitations: [], guests: [], rsvps: [], payments: [], seq: 1 };
  return d;
};
const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
const uuid = () => "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));
const PRO = ["sinema", "bento", "mono", "plum", "nusa"];

class Q {
  constructor(t) { this.t = t; this.f = []; this.op = "select"; this.cols = "*"; this.one = 0; this.ord = null; this.lim = null; }
  select(c) { if (this.op === "select") this.cols = c || "*"; else this.ret = true; return this; }
  eq(k, v) { this.f.push((r) => r[k] === v); return this; }
  order(k, o) { this.ord = [k, o?.ascending !== false]; return this; }
  limit(n) { this.lim = n; return this; }
  maybeSingle() { this.one = 1; return this; }
  single() { this.one = 2; return this; }
  insert(v) { this.op = "insert"; this.val = v; return this; }
  update(v) { this.op = "update"; this.val = v; return this; }
  delete() { this.op = "delete"; return this; }
  then(res, rej) { return Promise.resolve().then(() => this.run()).then(res, rej); }
  run() {
    const d = db(), uid = d.user?.id, me = d.profiles.find((p) => p.id === uid);
    const err = (m) => ({ data: null, error: { message: m } });
    let rows = d[this.t];
    const premium = (inv) => inv.paket === "premium" || !!d.profiles.find((p) => p.id === inv.owner)?.plan;
    if (this.op === "insert") {
      const list = (Array.isArray(this.val) ? this.val : [this.val]).map((x) => ({ ...x }));
      for (const x of list) {
        if (this.t === "invitations") {
          if (d.invitations.some((i) => i.slug === x.slug)) return err("duplicate key value violates unique constraint");
          Object.assign(x, { id: uuid(), owner: uid, status: x.status || "draft", paket: "basic", ai_left: 5, ai_date: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString() });
        } else if (this.t === "guests") {
          const inv = d.invitations.find((i) => i.id === x.invitation_id);
          if (!premium(inv) && d.guests.filter((g) => g.invitation_id === inv.id).length >= 30) return err("Paket Basic maksimal 30 tamu.");
          Object.assign(x, { id: d.seq++, created_at: new Date().toISOString() });
          d.guests.push(x); continue;
        } else Object.assign(x, { id: d.seq++, created_at: new Date().toISOString(), owner: x.owner || uid, status: x.status || (this.t === "payments" ? "menunggu" : undefined) });
        d[this.t].push(x);
      }
      save(d);
      return { data: this.one ? list[0] : list, error: null };
    }
    rows = rows.filter((r) => this.f.every((fn) => fn(r)));
    if (this.t === "invitations" && !me?.is_admin) rows = rows.filter((r) => r.owner === uid || r.status === "terbit");
    if (this.op === "update") {
      for (const r of rows) {
        const n = { ...r, ...this.val };
        if (n.status === "terbit" && PRO.includes(n.theme) && !premium(n)) return err("Desain ini khusus Premium. Upgrade untuk menerbitkan.");
        if (this.val.slug && d.invitations.some((i) => i.slug === this.val.slug && i.id !== r.id)) return err("duplicate key value");
        Object.assign(r, this.val);
      }
      save(d); return { data: rows, error: null };
    }
    if (this.op === "delete") { d[this.t] = d[this.t].filter((r) => !rows.includes(r)); save(d); return { data: rows, error: null }; }
    rows = rows.map((r) => {
      const o = { ...r };
      if (this.t === "invitations" && /guests\(count\)/.test(this.cols)) o.guests = [{ count: d.guests.filter((g) => g.invitation_id === r.id).length }];
      if (this.t === "invitations" && /rsvps\(/.test(this.cols)) o.rsvps = d.rsvps.filter((g) => g.invitation_id === r.id);
      return o;
    });
    if (this.ord) { const [k, asc] = this.ord; rows.sort((a, b) => (a[k] > b[k] ? 1 : -1) * (asc ? 1 : -1)); }
    if (this.lim) rows = rows.slice(0, this.lim);
    if (this.one) return { data: rows[0] || null, error: this.one === 2 && !rows[0] ? { message: "not found" } : null };
    return { data: rows, error: null };
  }
}

const listeners = new Set();
export function mockClient() {
  return {
    auth: {
      async getUser() { return { data: { user: db().user } }; },
      onAuthStateChange(cb) { listeners.add(cb); return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } }; },
      async signOut() { const d = db(); d.user = null; save(d); listeners.forEach((l) => l("SIGNED_OUT", null)); return {}; },
      async signInWithPassword({ email }) { return this._login(email, email.split("@")[0]); },
      async signUp({ email, options }) { return this._login(email, options?.data?.full_name || email.split("@")[0]); },
      async signInWithOAuth() { const r = await this._login("demo@gmail.com", "Pengguna Demo"); window.location.href = "/dashboard"; return r; },
      async _login(email, nama) {
        const d = db(); let p = d.profiles.find((x) => x.email === email);
        if (!p) { p = { id: uuid(), email, nama, plan: null, is_admin: d.profiles.length === 0, created_at: new Date().toISOString() }; d.profiles.push(p); }
        d.user = { id: p.id, email }; save(d);
        listeners.forEach((l) => l("SIGNED_IN", { user: d.user }));
        return { data: { user: d.user, session: {} }, error: null };
      },
    },
    from: (t) => new Q(t),
    async rpc(fn, a) {
      const d = db();
      if (fn === "use_ai") { const i = d.invitations.find((x) => x.id === a.inv_id); if (i.ai_left <= 0) return { data: -1 }; i.ai_left--; save(d); return { data: i.ai_left }; }
      if (fn === "invitation_premium") return { data: false };
      if (fn === "admin_set_paket") { d.invitations.find((x) => x.id === a.inv_id).paket = a.p; save(d); return {}; }
      if (fn === "admin_set_plan") { d.profiles.find((x) => x.id === a.user_id).plan = a.p || null; save(d); return {}; }
      if (fn === "admin_payment") {
        const p = d.payments.find((x) => x.id === a.pay_id); p.status = a.st;
        if (a.st === "lunas" && p.item === "premium") { const i = d.invitations.find((x) => x.id === p.invitation_id); i.paket = "premium"; i.ai_left = 50; }
        if (a.st === "lunas" && p.item.startsWith("reseller:")) d.profiles.find((x) => x.id === p.owner).plan = p.item.split(":")[1];
        save(d); return {};
      }
      return { error: { message: "rpc tidak dikenal" } };
    },
    storage: {
      from: () => ({
        async upload(path, blob) { const url = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); }); sessionStorage.setItem("m:" + path, url); return { error: null }; },
        getPublicUrl(path) { return { data: { publicUrl: sessionStorage.getItem("m:" + path) } }; },
      }),
    },
  };
}
