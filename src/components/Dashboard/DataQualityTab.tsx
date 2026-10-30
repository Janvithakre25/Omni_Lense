import React, { useState } from 'react';
import { ParsedDataset } from '../../types/dataset';
import { ShieldCheck, AlertTriangle, CheckCircle2, Download, Copy, Eye, HelpCircle, Sparkles } from 'lucide-react';
import { downloadCleanedCSV } from '../../utils/exportReports';

interface DataQualityTabProps {
  dataset: ParsedDataset;
}

export const DataQualityTab: React.FC<DataQualityTabProps> = ({ dataset }) => {
  const { quality } = dataset;
  const [showCleanPreview, setShowCleanPreview] = useState(false);

  // Compute cleaned preview (rows with zero missing fields)
  const completeRows = dataset.data.filter((row) =>
    dataset.columns.every(col => row[col.name] !== null && row[col.name] !== undefined && row[col.name] !== '')
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Quality Score Hero Card */}
      <div className="bg-cream/60 border border-sage/60 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-forest-dark border border-sage/60 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Data Health & Cleanliness Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-dark">
              How Healthy Is Your Data?
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              {quality.friendlySummary}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-warmWhite rounded-2xl border border-sage/60 shadow-soft">
            <span className="text-xs uppercase font-bold text-mutedGrey tracking-wider">Health Rating</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-5xl font-black text-forest-dark">{quality.qualityScore}</span>
              <span className="text-lg font-bold text-mutedGrey">/ 100</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2.5 mt-2 overflow-hidden border border-sage/40">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quality.qualityScore >= 80 ? 'bg-forest' : quality.qualityScore >= 60 ? 'bg-amber-600' : 'bg-red-500'
                }`}
                style={{ width: `${quality.qualityScore}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* 4 Health Checks Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Check 1: Missing Information */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-cream-dark">
            <h3 className="text-base font-bold text-forest-dark flex items-center gap-2">
              {quality.missingValuesTotal === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-forest" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              Missing Information
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream text-charcoal">
              {quality.missingValuesTotal === 0 ? 'No gaps' : `${quality.missingValuesTotal} empty cells`}
            </span>
          </div>

          <p className="text-xs text-charcoal/80 mt-3 leading-relaxed">
            {quality.missingValuesTotal === 0
              ? 'Every row in your dataset contains complete information with zero missing fields.'
              : 'Some rows are missing values in specific fields. When fields are empty, averages and group totals may omit those records.'}
          </p>

          {quality.columnsWithMissing.length > 0 && (
            <div className="mt-4 space-y-2">
              {quality.columnsWithMissing.map((col) => (
                <div
                  key={col.column}
                  className="p-2.5 rounded-xl bg-cream/40 border border-sage/40 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-charcoal">{col.column}</span>
                  <span className="text-amber-800 font-medium">
                    {col.count} empty ({col.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check 2: Duplicate Records */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-cream-dark">
            <h3 className="text-base font-bold text-forest-dark flex items-center gap-2">
              {quality.duplicateRows === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-forest" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              Duplicate Records
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream text-charcoal">
              {quality.duplicateRows === 0 ? 'Zero duplicates' : `${quality.duplicateRows} repeated rows`}
            </span>
          </div>

          <p className="text-xs text-charcoal/80 mt-3 leading-relaxed">
            {quality.duplicateRows === 0
              ? 'No duplicate rows found. Every record appears to be an independent observation.'
              : 'Several records appear more than once with matching fields. Repeated rows can inflate counts and artificially boost sales or transaction volumes.'}
          </p>

          <div className="mt-4 p-3 rounded-xl bg-cream/40 border border-sage/40 text-xs text-mutedGrey">
            Recommendation: We preserve your original records. You can review and download a de-duplicated dataset below.
          </div>
        </div>

        {/* Check 3: Unusual Values / Outliers */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-cream-dark">
            <h3 className="text-base font-bold text-forest-dark flex items-center gap-2">
              {quality.potentialOutliers.length === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-forest" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-coffee" />
              )}
              Unusual Values
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream text-charcoal">
              {quality.potentialOutliers.length === 0 ? 'Expected range' : `${quality.potentialOutliers.length} column(s) with spikes`}
            </span>
          </div>

          <p className="text-xs text-charcoal/80 mt-3 leading-relaxed">
            {quality.potentialOutliers.length === 0
              ? 'All numerical values stay within standard statistical bounds with no extreme spikes.'
              : 'Some values are much higher or lower than most others. These numbers may represent legitimate large orders, seasonal peaks, or manual entry errors.'}
          </p>

          {quality.potentialOutliers.length > 0 && (
            <div className="mt-4 space-y-2">
              {quality.potentialOutliers.map((o) => (
                <div key={o.column} className="p-3 rounded-xl bg-cream/40 border border-sage/40 text-xs">
                  <strong className="text-forest-dark block">{o.column}</strong>
                  <p className="text-charcoal/80 mt-0.5">{o.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check 4: Format Consistency */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-cream-dark">
            <h3 className="text-base font-bold text-forest-dark flex items-center gap-2">
              {quality.inconsistentFormats.length === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-forest" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              Date & Value Formats
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream text-charcoal">
              {quality.inconsistentFormats.length === 0 ? 'Consistent formats' : 'Formatting mix'}
            </span>
          </div>

          <p className="text-xs text-charcoal/80 mt-3 leading-relaxed">
            {quality.inconsistentFormats.length === 0
              ? 'All dates and numbers follow uniform structural conventions across every column.'
              : 'Mixed delimiters or formatting detected. OmniLens normalizes these during analysis so your calculations remain correct.'}
          </p>

          {quality.inconsistentFormats.length > 0 && (
            <div className="mt-4 space-y-2">
              {quality.inconsistentFormats.map((f, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-cream/40 border border-sage/40 text-xs text-charcoal/80">
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Proposed Corrections & Cleaned Data Action */}
      <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-dark">
          <div>
            <h3 className="text-lg font-bold text-forest-dark">Clean Data Export</h3>
            <p className="text-xs text-charcoal/80 mt-1">
              Never silently delete or change important information. We preserve your raw records while giving you the option to download a vetted copy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCleanPreview(!showCleanPreview)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-sage bg-cream/50 hover:bg-cream text-charcoal text-xs font-semibold transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showCleanPreview ? 'Hide Preview' : 'Preview Clean Rows'}</span>
            </button>
            <button
              onClick={() => downloadCleanedCSV(dataset)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-warmWhite text-xs font-semibold hover:bg-forest-dark transition-all shadow-soft"
            >
              <Download className="w-4 h-4 text-mint" />
              <span>Download Clean CSV</span>
            </button>
          </div>
        </div>

        {/* Clean Rows Preview */}
        {showCleanPreview && (
          <div className="mt-6 border border-sage/60 rounded-2xl overflow-hidden animate-fadeIn">
            <div className="bg-cream/60 px-4 py-2.5 text-xs font-bold text-forest-dark border-b border-sage/40">
              Clean Records ({completeRows.length} out of {dataset.data.length} total rows)
            </div>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-xs text-left">
                <thead className="bg-cream/30 text-charcoal font-semibold border-b border-sage/30">
                  <tr>
                    {dataset.columns.map((c) => (
                      <th key={c.name} className="px-4 py-2 whitespace-nowrap">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {completeRows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-cream/20">
                      {dataset.columns.map((c) => (
                        <td key={c.name} className="px-4 py-2 whitespace-nowrap text-charcoal/80">
                          {String(row[c.name])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
