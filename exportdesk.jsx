import React from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import gateway from "../services/gateway";
import WorkbookSelect from "../widgets/WorkbookSelect";

export default function ExportDesk({ workbooks, activeWorkbook, setActiveWorkbook, refresh }) {
  const download = async (kind) => {
    if (!activeWorkbook) return;
    const { data } = await gateway.get(`/exports/${activeWorkbook}/${kind}`, { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `priya-demand-enhancement.${kind === "xlsx" ? "xlsx" : "pdf"}`;
    link.click();
    URL.revokeObjectURL(url);
    refresh?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="section-label">Reports and insights</p><h2 className="section-title">Executive download center</h2></div>
        <WorkbookSelect workbooks={workbooks} value={activeWorkbook} onChange={setActiveWorkbook} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <button className="export-card" onClick={() => download("xlsx")}><FileSpreadsheet size={36}/><span>Analytics Summary and Forecast Comparison</span><Download size={20}/></button>
        <button className="export-card" onClick={() => download("pdf")}><FileText size={36}/><span>AI Insight Executive Brief</span><Download size={20}/></button>
      </div>
    </div>
  );
}
