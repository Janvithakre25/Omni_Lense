import React from 'react';
import { ParsedDataset } from '../../types/dataset';
import { FileText, FileSpreadsheet, Download, CheckCircle2, ShieldCheck, Sparkles, Printer } from 'lucide-react';
import { downloadCleanedCSV, downloadExcelWorkbook, downloadPdfReport } from '../../utils/exportReports';

interface ReportsTabProps {
  dataset: ParsedDataset;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ dataset }) => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-cream/50 border border-sage/60 rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-forest-dark border border-sage/60 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            <span>Executive Reporting</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-dark">
            Downloadable Intelligence Reports
          </h2>
          <p className="text-sm text-charcoal/80 mt-1 max-w-xl">
            Export structured findings, statistical evidence, and cleaned data in universal formats ready to share with executives, stakeholders, or teammates.
          </p>
        </div>

        <button
          onClick={() => downloadPdfReport(dataset)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-warmWhite font-semibold text-sm hover:bg-forest-dark transition-all shadow-soft shrink-0"
        >
          <Printer className="w-4 h-4 text-mint" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Export Format Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Format 1: Executive PDF */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center mb-4 shadow-soft">
              <FileText className="w-6 h-6 text-forest" />
            </div>
            <h3 className="text-base font-bold text-forest-dark">Executive PDF Briefing</h3>
            <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
              Complete printable report including dataset metadata, plain-English executive summary, evidence-backed findings table, and health audit.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-cream-dark">
            <button
              onClick={() => downloadPdfReport(dataset)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-cream hover:bg-forest text-forest-dark hover:text-warmWhite font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF (.pdf)</span>
            </button>
          </div>
        </div>

        {/* Format 2: Multi-tab Excel */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center mb-4 shadow-soft">
              <FileSpreadsheet className="w-6 h-6 text-forest" />
            </div>
            <h3 className="text-base font-bold text-forest-dark">Multi-Sheet Excel Workbook</h3>
            <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
              Formatted workbook with 3 distinct sheets: Cleaned Data, OmniLens Findings (with evidence and next steps), and Field Profiles.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-cream-dark">
            <button
              onClick={() => downloadExcelWorkbook(dataset)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-cream hover:bg-forest text-forest-dark hover:text-warmWhite font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Format 3: Cleaned CSV */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center mb-4 shadow-soft">
              <Download className="w-6 h-6 text-forest" />
            </div>
            <h3 className="text-base font-bold text-forest-dark">Processed CSV File</h3>
            <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
              Normalized CSV ready for import into spreadsheets, databases, or analytics engines, stripped of corrupting delimiters.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-cream-dark">
            <button
              onClick={() => downloadCleanedCSV(dataset)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-cream hover:bg-forest text-forest-dark hover:text-warmWhite font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV (.csv)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Report Document Preview Box */}
      <div className="bg-warmWhite border border-sage/60 rounded-3xl p-8 shadow-soft">
        <div className="border-b-2 border-forest pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              OmniLens Executive Briefing Preview
            </span>
            <h3 className="text-xl font-bold text-forest-dark mt-0.5">{dataset.name}</h3>
          </div>
          <span className="text-xs text-mutedGrey">
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Summary Block */}
        <div className="space-y-4 text-xs leading-relaxed text-charcoal/90">
          <p>
            <strong>Scope of Evaluation:</strong> Analysis performed across <strong>{dataset.data.length.toLocaleString()} records</strong> and <strong>{dataset.columns.length} columns</strong>. Data hygiene score verified at <strong>{dataset.quality.qualityScore}/100</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-cream/40 border border-sage/40">
            <strong className="text-forest-dark block mb-1">Key Takeaway:</strong>
            {dataset.findings[0] ? (
              <span>{dataset.findings[0].whatWeFound} {dataset.findings[0].whatItMeans}</span>
            ) : (
              <span>Your dataset presents consistent distributions across the observed indicators.</span>
            )}
          </div>

          <div className="pt-2">
            <strong className="text-forest-dark text-sm block mb-2">Findings Table Preview:</strong>
            <div className="border border-sage/40 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-forest text-warmWhite">
                  <tr>
                    <th className="px-4 py-2">Discovery</th>
                    <th className="px-4 py-2">Evidence</th>
                    <th className="px-4 py-2">Suggested Next Step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {dataset.findings.slice(0, 3).map((f) => (
                    <tr key={f.id} className="hover:bg-cream/20">
                      <td className="px-4 py-2.5 font-semibold text-forest-dark">{f.title}</td>
                      <td className="px-4 py-2.5 text-charcoal/80">{f.evidence}</td>
                      <td className="px-4 py-2.5 text-charcoal/80">{f.suggestedNextStep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-[11px] text-mutedGrey border-t border-cream-dark">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              Grounded in actual records
            </span>
            <span>OmniLens Universal Data Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
