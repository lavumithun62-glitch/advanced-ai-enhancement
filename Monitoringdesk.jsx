import React, { useEffect, useState } from "react";
import { Activity, Clock3, ServerCog } from "lucide-react";
import gateway from "../services/gateway";
import FigureTile from "../widgets/FigureTile";

export default function MonitoringDesk() {
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [query, setQuery] = useState("");

  const load = async () => {
    const [performance, events] = await Promise.all([gateway.get("/system/metrics"), gateway.get("/system/activity", { params: { q: query } })]);
    setMetrics(performance.data);
    setActivity(events.data);
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, []);

  if (!metrics) return <p className="soft-empty animate-pulse">Reading system telemetry...</p>;

  return <div className="space-y-6">
    <div><p className="section-label">System monitoring</p><h2 className="section-title">Operational command center</h2></div>
    <div className="grid gap-4 md:grid-cols-3">
      <FigureTile icon={ServerCog} label="API requests / 24h" value={metrics.requests_24h} />
      <FigureTile icon={Clock3} label="Average response" value={`${metrics.average_ms} ms`} />
      <FigureTile icon={Activity} label="Error rate" value={`${metrics.error_rate}%`} />
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="surface"><h3 className="mb-4 text-lg font-black">API activity monitoring</h3><div className="table-grid">{metrics.slow_requests.map((row, index) => <div className="data-row" key={`${row.path}-${index}`}><b>{row.method}</b><span>{row.path}</span><span>{row.status_code}</span><strong>{row.duration_ms} ms</strong></div>)}</div></section>
      <section className="surface"><div className="mb-4 flex gap-2"><input className="field flex-1" placeholder="Filter user actions" value={query} onChange={(event) => setQuery(event.target.value)}/><button className="secondary-action" onClick={load}>Filter</button></div><div className="table-grid">{activity.slice(0, 12).map((row, index) => <div className="data-row" key={index}><b>{row.event_name}</b><span>{row.reference || "-"}</span><strong>{new Date(row.created_at).toLocaleString()}</strong></div>)}</div></section>
    </div>
  </div>;
}
