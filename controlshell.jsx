import React, { useState } from "react";
import { Activity, BarChart3, Bell, ClipboardList, DatabaseZap, FileDown, LayoutDashboard, LogOut, MoonStar, Search, ShieldCheck, Sprout, Sun } from "lucide-react";
import gateway from "../services/gateway";
import { useIdentity } from "../state/IdentityProvider";

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "import", label: "Import", icon: DatabaseZap },
  { id: "scenarios", label: "Scenarios", icon: ClipboardList },
  { id: "exports", label: "Exports", icon: FileDown },
  { id: "admin", label: "Access", icon: ShieldCheck },
  { id: "monitoring", label: "System", icon: Activity }
];

export default function ControlShell({ desk, setDesk, alerts, refreshAlerts, theme, setTheme, children }) {
  const { account, leave } = useIdentity();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  const isAdmin = account.role === "super_admin";
  const canPlan = isAdmin || account.role === "analyst";
  const visibleNav = nav.filter((item) => {
    if (["admin", "monitoring"].includes(item.id)) return isAdmin;
    if (item.id === "import") return canPlan;
    return true;
  });
  const unread = alerts.filter((item) => !item.seen).length;

  const markSeen = async (id) => {
    await gateway.post(`/alerts/${id}/seen`);
    refreshAlerts();
  };

  const executeSearch = async () => {
    if (!search.trim()) return setResults(null);
    const { data } = await gateway.get("/search", { params: { q: search.trim() } });
    setResults(data);
  };

  const runSearch = (event) => {
    event.preventDefault();
    executeSearch();
  };

  return (
    <div className="app-shell min-h-screen text-graphite">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-green-100 bg-white px-5 py-6 shadow-sm lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf text-white"><Sprout size={25} /></div>
          <div><p className="text-xs font-black uppercase tracking-[0.16em] text-fern">Enterprise AI</p><h1 className="text-lg font-black">Demand Command</h1></div>
        </div>
        <nav className="mt-10 space-y-2">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setDesk(item.id)} className={`side-link ${desk === item.id ? "side-link-active" : ""}`}><Icon size={19}/>{item.label}</button>;
          })}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-green-100 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm text-slate-500">Signed in as {account.role.replace("_", " ")}</p><h2 className="text-2xl font-black">{account.full_name}</h2></div>
            <div className="flex items-center gap-2">
              <form onSubmit={runSearch} className="relative hidden xl:block">
                <button type="button" onClick={executeSearch} aria-label="Search" className="absolute left-3 top-3.5 text-slate-400 transition hover:text-leaf"><Search size={16} /></button>
                <input className="field w-64 pl-9" placeholder="Search datasets or users" value={search} onChange={(event) => setSearch(event.target.value)} />
                {results && <div className="search-results"><p className="section-label">Search results</p>{results.workbooks.map((row) => <p key={`w-${row.id}`} className="search-row">Dataset: {row.title}</p>)}{results.users.map((row) => <p key={`u-${row.id}`} className="search-row">User: {row.full_name}</p>)}{!results.workbooks.length && !results.users.length && <p className="search-row">No matches found.</p>}</div>}
              </form>
              <div className="flex gap-1 lg:hidden">{visibleNav.map((item) => { const Icon = item.icon; return <button key={item.id} className="round-tool" onClick={() => setDesk(item.id)} title={item.label}><Icon size={18}/></button>; })}</div>
              <div className="relative">
                <button className="round-tool" onClick={() => setOpen(!open)} title="Alerts"><Bell size={18}/>{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-leaf px-1.5 text-xs font-black text-white">{unread}</span>}</button>
                {open && <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-green-100 bg-white p-3 shadow-corporate"><h3 className="mb-2 font-black">Alerts</h3>{alerts.length === 0 ? <p className="soft-empty">No alerts yet.</p> : alerts.map((item) => <button key={item.id} onClick={() => markSeen(item.id)} className="mb-2 w-full rounded-xl border border-green-100 p-3 text-left text-sm hover:bg-limewash"><b>{item.headline}</b><p className="mt-1 text-slate-500">{item.detail}</p></button>)}</div>}
              </div>
              <button className="round-tool" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">{theme === "dark" ? <Sun size={18}/> : <MoonStar size={18}/>}</button>
              <button className="round-tool" onClick={leave} title="Logout"><LogOut size={18}/></button>
            </div>
          </div>
        </header>
        <section className="px-4 py-6 lg:px-8">{children}</section>
      </main>
    </div>
  );
}
