import React from 'react';
import { ParsedDataset } from '../../types/dataset';
import { Lightbulb, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Table, Sparkles, Layers } from 'lucide-react';

interface OverviewTabProps {
  dataset: ParsedDataset;
  onNavigateTab: (tab: 'overview' | 'explore' | 'findings' | 'ask' | 'quality' | 'reports') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ dataset, onNavigateTab }) => {
  const numCols = dataset.columns.filter(c => c.type === 'number');
  const catCols = dataset.columns.filter(c => c.type === 'string' && c.uniqueCount > 1);

  // Dynamic summary values based strictly on present columns
  const primaryNum = numCols.find(c => c.sum && c.sum > 0) || numCols[0];
  const primaryCat = catCols[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro banner */}
      <div className="bg-cream/60 border border-sage/60 rounded-3xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-forest-dark border border-sage/60 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            <span>Executive Summary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-dark">
            Here's a simple overview of the information you shared.
          </h2>
          <p className="text-sm sm:text-base text-charcoal/80 mt-2 leading-relaxed">
            We analyzed your <strong className="text-forest-dark">{dataset.data.length.toLocaleString()} rows of information</strong> across{' '}
            <strong className="text-forest-dark">{dataset.columns.length} columns</strong>. Data quality is rated at{' '}
            <strong className="text-forest-dark">{dataset.quality.qualityScore}/100</strong>. We discovered {dataset.findings.length} important patterns ready for your review.
          </p>
        </div>
      </div>

      {/* Dynamic Metric Cards (Only based on actual columns in dataset!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Record volume */}
        <div className="bg-warmWhite border border-sage/60 rounded-2xl p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">Total Records</p>
          <p className="text-3xl font-extrabold text-forest-dark mt-2">
            {dataset.data.length.toLocaleString()}
          </p>
          <p className="text-xs text-charcoal/70 mt-1">
            Rows of information analyzed
          </p>
        </div>

        {/* Metric 2: Field structure */}
        <div className="bg-warmWhite border border-sage/60 rounded-2xl p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">Information Fields</p>
          <p className="text-3xl font-extrabold text-forest-dark mt-2">
            {dataset.columns.length}
          </p>
          <p className="text-xs text-charcoal/70 mt-1">
            {numCols.length} numerical, {catCols.length} descriptive
          </p>
        </div>

        {/* Metric 3: Primary Numeric Metric if present */}
        {primaryNum ? (
          <div className="bg-warmWhite border border-sage/60 rounded-2xl p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">
              Total {primaryNum.name}
            </p>
            <p className="text-3xl font-extrabold text-forest-dark mt-2">
              {primaryNum.sum !== undefined ? Math.round(primaryNum.sum).toLocaleString() : Math.round(primaryNum.mean || 0).toLocaleString()}
            </p>
            <p className="text-xs text-charcoal/70 mt-1">
              Average: {primaryNum.mean} (Range: {primaryNum.min} to {primaryNum.max})
            </p>
          </div>
        ) : (
          <div className="bg-warmWhite border border-sage/60 rounded-2xl p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">Data Types</p>
            <p className="text-3xl font-extrabold text-forest-dark mt-2">Categorical</p>
            <p className="text-xs text-charcoal/70 mt-1">Text and classification fields</p>
          </div>
        )}

        {/* Metric 4: Health Score */}
        <div className="bg-warmWhite border border-sage/60 rounded-2xl p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">Data Cleanliness</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-extrabold text-forest-dark">
              {dataset.quality.qualityScore}
            </p>
            <span className="text-xs text-mutedGrey">/ 100</span>
          </div>
          <p className="text-xs text-forest font-medium mt-1">
            {dataset.quality.missingValuesTotal === 0 ? 'Zero missing values' : `${dataset.quality.missingValuesTotal} empty cells found`}
          </p>
        </div>

      </div>

      {/* Top Findings Quick Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-forest-dark flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-forest" />
              Important Discoveries
            </h3>
            <p className="text-xs text-mutedGrey mt-0.5">
              Calculated patterns with evidence and practical next steps
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('findings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-dark hover:underline"
          >
            <span>View all ({dataset.findings.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataset.findings.slice(0, 2).map((finding) => (
            <div
              key={finding.id}
              className="bg-warmWhite border border-sage/60 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-mint text-forest-dark">
                  {finding.type}
                </span>
                <span className="text-xs text-mutedGrey">Verified Evidence</span>
              </div>
              <h4 className="text-base font-bold text-forest-dark">{finding.title}</h4>
              <p className="text-xs text-charcoal/80 mt-1.5 leading-relaxed">
                {finding.whatItMeans}
              </p>
              <div className="mt-3 p-3 rounded-xl bg-cream/50 border border-sage/40 text-xs">
                <strong className="text-forest-dark block mb-0.5">Calculated Evidence:</strong>
                <span className="text-charcoal/80">{finding.evidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Exploration Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onNavigateTab('explore')}
          className="text-left p-5 rounded-2xl bg-warmWhite border border-sage/60 hover:border-forest hover:bg-mint/20 transition-all shadow-soft group"
        >
          <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center text-forest mb-3 group-hover:bg-forest group-hover:text-warmWhite transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-forest-dark">Explore Charts & Trends</h4>
          <p className="text-xs text-charcoal/70 mt-1">
            Build bar comparisons, time series lines, and inspect all records.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('ask')}
          className="text-left p-5 rounded-2xl bg-warmWhite border border-sage/60 hover:border-forest hover:bg-mint/20 transition-all shadow-soft group"
        >
          <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center text-forest mb-3 group-hover:bg-forest group-hover:text-warmWhite transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-forest-dark">Ask Your Data Questions</h4>
          <p className="text-xs text-charcoal/70 mt-1">
            Type questions in everyday English and receive calculated answers.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="text-left p-5 rounded-2xl bg-warmWhite border border-sage/60 hover:border-forest hover:bg-mint/20 transition-all shadow-soft group"
        >
          <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center text-forest mb-3 group-hover:bg-forest group-hover:text-warmWhite transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-forest-dark">Export PDF & Excel</h4>
          <p className="text-xs text-charcoal/70 mt-1">
            Download executive summaries and clean spreadsheets with one click.
          </p>
        </button>
      </div>

      {/* Dataset Sample Table Preview */}
      <div className="border border-sage/60 rounded-3xl overflow-hidden shadow-soft bg-warmWhite">
        <div className="bg-cream/60 px-6 py-4 border-b border-sage/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-forest" />
            <h4 className="text-xs font-bold text-forest-dark uppercase tracking-wider">
              Data Sample (First 5 Rows)
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-semibold text-forest hover:underline"
          >
            Explore all {dataset.data.length} rows →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-cream/30 text-charcoal font-semibold border-b border-sage/30">
              <tr>
                {dataset.columns.slice(0, 8).map((c) => (
                  <th key={c.name} className="px-5 py-3 whitespace-nowrap">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {dataset.data.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-cream/20">
                  {dataset.columns.slice(0, 8).map((c) => (
                    <td key={c.name} className="px-5 py-3 whitespace-nowrap text-charcoal/80">
                      {row[c.name] !== null && row[c.name] !== undefined ? String(row[c.name]) : (
                        <span className="text-mutedGrey italic">empty</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
