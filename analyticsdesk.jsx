import React from "react";
import { AlertTriangle, Layers3, Sparkles, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FigureTile from "../widgets/FigureTile";
import WorkbookSelect from "../widgets/WorkbookSelect";

export default function AnalyticsDesk({ workbooks, activeWorkbook, setActiveWorkbook, insights, dimensions, filters, setFilters }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="section-label">Advanced analytics</p><h2 className="section-title">Signals and risk intelligence</h2></div>
        <WorkbookSelect workbooks={workbooks} value={activeWorkbook} onChange={setActiveWorkbook} />
      </div>
      {activeWorkbook && <section className="filter-bar"><select className="field" value={filters.market} onChange={(event) => setFilters({ ...filters, market: event.target.value })}><option value="">Every region</option>{dimensions.markets.map((row) => <option key={row}>{row}</option>)}</select><select className="field" value={filters.segment} onChange={(event) => setFilters({ ...filters, segment: event.target.value })}><option value="">Every category</option>{dimensions.segments.map((row) => <option key={row}>{row}</option>)}</select></section>}
      {!insights && <p className="soft-empty">Choose a workbook for enterprise analytics.</p>}
      {insights && <>
        <div className="grid gap-4 md:grid-cols-3">
          <FigureTile icon={Layers3} label="Regions analyzed" value={insights.market_mix.length} />
          <FigureTile icon={AlertTriangle} label="Anomalies detected" value={insights.anomalies.length} />
          <FigureTile icon={TrendingUp} label="Risk items" value={insights.inventory_risks.filter((row) => row.risk !== "healthy").length} />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Region-wise revenue"><ResponsiveContainer width="100%" height={285}><BarChart data={insights.market_mix}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="market"/><YAxis/><Tooltip/><Bar dataKey="revenue" fill="#10b981" radius={[9, 9, 0, 0]}/></BarChart></ResponsiveContainer></Panel>
          <Panel title="Category sales insights"><ResponsiveContainer width="100%" height={285}><BarChart data={insights.segment_mix}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="segment"/><YAxis/><Tooltip/><Bar dataKey="revenue" fill="#0f766e" radius={[9, 9, 0, 0]}/></BarChart></ResponsiveContainer></Panel>
          <Panel title="Predicted revenue"><ResponsiveContainer width="100%" height={285}><BarChart data={insights.revenue_prediction}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="label"/><YAxis/><Tooltip/><Bar dataKey="revenue" fill="#15803d" radius={[9, 9, 0, 0]}/></BarChart></ResponsiveContainer></Panel>
          <Panel title="Inventory risk analysis"><div className="table-grid">{insights.inventory_risks.map((row) => <div className="data-row" key={row.item}><b>{row.item}</b><span>{row.forecast_units} forecast</span><span>{row.estimated_cover} cover</span><strong className={`risk-${row.risk}`}>{row.risk}</strong></div>)}</div></Panel>
        </div>
        <section className="surface"><h3 className="mb-4 flex items-center gap-2 text-lg font-black"><Sparkles size={19} className="text-leaf"/>AI-generated business insights</h3><div className="grid gap-3 md:grid-cols-2">{insights.generated_insights.map((line) => <p className="insight-card" key={line}>{line}</p>)}</div></section>
      </>}
    </div>
  );
}

function Panel({ title, children }) {
  return <section className="surface"><h3 className="mb-4 text-lg font-black">{title}</h3>{children}</section>;
}
