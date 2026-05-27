import React, { useEffect, useState } from "react";
import { Bell, Database, FileStack, Users } from "lucide-react";
import gateway from "../services/gateway";
import FigureTile from "../widgets/FigureTile";

export default function AdminDesk() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const load = async () => {
    const [summary, people] = await Promise.all([gateway.get("/admin/overview"), gateway.get("/admin/users", { params: { q: query } })]);
    setOverview(summary.data);
    setUsers(people.data);
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    await gateway.patch(`/admin/users/${id}/role`, null, { params: { role } });
    load();
  };

  if (!overview) return <p className="soft-empty animate-pulse">Loading admin overview...</p>;

  return (
    <div className="space-y-6">
      <div><p className="section-label">Admin desk</p><h2 className="section-title">Platform control overview</h2></div>
      <div className="grid gap-4 md:grid-cols-4">
        <FigureTile icon={Users} label="Accounts" value={overview.accounts} />
        <FigureTile icon={Database} label="Workbooks" value={overview.workbooks} />
        <FigureTile icon={FileStack} label="Scenarios" value={overview.scenarios} />
        <FigureTile icon={Bell} label="Alerts" value={overview.alerts} />
      </div>
      <section className="surface">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-black">Role and access management</h3><div className="flex gap-2"><input className="field" placeholder="Find user" value={query} onChange={(event) => setQuery(event.target.value)}/><button className="secondary-action" onClick={load}>Search</button></div></div>
        <div className="table-grid">{users.map((user) => <div className="data-row" key={user.id}><div><b>{user.full_name}</b><p className="text-xs text-slate-500">{user.email}</p></div><span className="capitalize">{user.active ? "Active" : "Disabled"}</span><select className="field" value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}><option value="super_admin">Super Admin</option><option value="analyst">Analyst</option><option value="viewer">Viewer</option></select></div>)}</div>
      </section>
      <section className="surface">
        <h3 className="mb-4 text-lg font-black">Recent events</h3>
        <div className="space-y-3">{overview.recent_events.map((item, index) => <div className="event-row" key={index}><b>{item.event_name}</b><span>{item.reference}</span><span>{new Date(item.created_at).toLocaleString()}</span></div>)}</div>
      </section>
    </div>
  );
}
