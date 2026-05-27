import React from "react";
import { Activity, BadgeDollarSign, Gauge, PackageCheck, Radio } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import WorkbookSelect from "../widgets/WorkbookSelect";
import FigureTile from "../widgets/FigureTile";

export default function OverviewDesk({ workbooks, activeWorkbook, setActiveWorkbook, insights, busy, live, filters, setFilters, dimensions }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="section-label">Corporate overview</p><h2 className="section-title">Demand health monitor</h2></div>
        <div className="flex flex-wrap gap-2"><WorkbookSelect workbooks={workbooks} value={activeWorkbook} onChange={setActiveWorkbook} /><span className="live-pill"><Radio size={13}/>Live 15s</span></div>
      </div>
      {activeWorkbook && <section className="filter-bar"><input className="field" placeholder="Filter product" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })}/><select className="field" value={filters.market} onChange={(event) => setFilters({ ...filters, market: event.target.value })}><option value="">All regions</option>{dimensions.markets.map((value) => <option key={value}>{value}</option>)}</select><select className="field" value={filters.segment} onChange={(event) => setFilters({ ...filters, segment: event.target.value })}><option value="">All categories</option>{dimensions.segments.map((value) => <option key={value}>{value}</option>)}</select></section>}
      {!activeWorkbook && <p className="soft-empty">Import a workbook to activate analytics.</p>}
      {busy && <p className="soft-empty animate-pulse">Loading business insights...</p>}
      {insights && !busy && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <FigureTile icon={BadgeDollarSign} label="Revenue" value={`$${Number(insights.revenue).toLocaleString()}`} />
            <FigureTile icon={PackageCheck} label="Units" value={Number(insights.units).toLocaleString()} />
            <FigureTile icon={Gauge} label="Quality" value={`${insights.quality_score}%`} />
            <FigureTile icon={Activity} label="Confidence" value={`${insights.confidence}%`} />
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            <Panel title="Revenue progression"><ResponsiveContainer width="100%" height={310}><AreaChart data={insights.monthly_revenue}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="label"/><YAxis/><Tooltip/><Area dataKey="revenue" stroke="#15803d" fill="#bbf7d0" strokeWidth={3}/></AreaChart></ResponsiveContainer></Panel>
            <Panel title="Top revenue items"><ResponsiveContainer width="100%" height={310}><BarChart data={insights.top_items}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="item"/><YAxis/><Tooltip/><Bar dataKey="revenue" fill="#16a34a" radius={[10,10,0,0]}/></BarChart></ResponsiveContainer></Panel>
          </div>
          {live && <section className="surface"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">Real-time sales monitor</h3><span className="text-sm text-slate-500">Updated {new Date(live.updated_at).toLocaleTimeString()}</span></div><div className="table-grid">{live.sales_monitor.map((row, index) => <div className="data-row" key={`${row.item}-${index}`}><b>{row.item}</b><span>{new Date(row.date).toLocaleDateString()}</span><span>{Number(row.units).toLocaleString()} units</span><strong>${Number(row.revenue).toLocaleString()}</strong></div>)}</div></section>}
        </>
      )}
    </div>
  );
}

function Panel({ title, children }) {
  return <section className="surface"><h3 className="mb-4 text-lg font-black">{title}</h3>{children}</section>;
}
