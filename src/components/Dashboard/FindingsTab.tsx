import React, { useState } from 'react';
import { ParsedDataset, Finding } from '../../types/dataset';
import { Lightbulb, CheckCircle2, TrendingUp, AlertCircle, Compass, ShieldAlert, Filter, Sparkles } from 'lucide-react';

interface FindingsTabProps {
  dataset: ParsedDataset;
}

export const FindingsTab: React.FC<FindingsTabProps> = ({ dataset }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredFindings = dataset.findings.filter((f) => {
    if (selectedFilter === 'all') return true;
    return f.type === selectedFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-cream/50 border border-sage/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint text-forest-dark border border-sage/60 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <span>Evidence-Backed Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-dark">
              What Your Data Is Telling You
            </h2>
            <p className="text-sm text-charcoal/80 mt-1 max-w-2xl leading-relaxed">
              Every card below is derived from verified calculations across your records. We distinguish what was observed from potential explanations, ensuring you have reliable ground to act on.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All (${dataset.findings.length})` },
              { id: 'concentration', label: 'Concentration' },
              { id: 'distribution', label: 'Distribution' },
              { id: 'trend', label: 'Trends' },
              { id: 'quality', label: 'Quality' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedFilter(pill.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedFilter === pill.id
                    ? 'bg-forest text-warmWhite shadow-soft'
                    : 'bg-warmWhite text-charcoal border border-sage/60 hover:bg-cream'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-6">
        {filteredFindings.length === 0 ? (
          <div className="p-12 text-center bg-warmWhite rounded-3xl border border-sage/40 text-mutedGrey">
            No findings match the selected category filter.
          </div>
        ) : (
          filteredFindings.map((finding: Finding, index: number) => (
            <div
              key={finding.id}
              className="bg-warmWhite border border-sage/60 rounded-3xl p-6 sm:p-8 shadow-soft hover:shadow-soft-lg transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-dark">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-mint text-forest-dark flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-forest-dark">
                    {finding.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-mint text-forest-dark border border-sage/60">
                    {finding.type}
                  </span>
                  <span className="text-xs text-mutedGrey">
                    Columns: {finding.relatedColumns.join(', ')}
                  </span>
                </div>
              </div>

              {/* 6 Structured Sections as required by Section 6.E */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* 1. What We Found */}
                <div className="p-4 rounded-2xl bg-cream/40 border border-sage/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-dark flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                    1. What we found
                  </h4>
                  <p className="text-sm text-charcoal/90 leading-relaxed font-medium">
                    {finding.whatWeFound}
                  </p>
                </div>

                {/* 2. What It Means in Everyday Language */}
                <div className="p-4 rounded-2xl bg-cream/40 border border-sage/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-dark flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-coffee" />
                    2. What it means in everyday language
                  </h4>
                  <p className="text-sm text-charcoal/90 leading-relaxed">
                    {finding.whatItMeans}
                  </p>
                </div>

                {/* 3. Evidence Supporting the Finding */}
                <div className="p-4 rounded-2xl bg-mint/40 border border-sage/50 md:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-dark flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-forest" />
                    3. Calculated Evidence
                  </h4>
                  <p className="text-sm text-charcoal font-semibold leading-relaxed">
                    {finding.evidence}
                  </p>
                </div>

                {/* 4. Why It Might Matter */}
                <div className="p-4 rounded-2xl bg-warmWhite border border-sage/40 shadow-soft">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5 mb-1.5">
                    <Compass className="w-3.5 h-3.5 text-forest-fresh" />
                    4. Why it might matter
                  </h4>
                  <p className="text-xs text-charcoal/80 leading-relaxed">
                    {finding.whyItMatters}
                  </p>
                </div>

                {/* 5. A Useful Next Step */}
                <div className="p-4 rounded-2xl bg-warmWhite border border-sage/40 shadow-soft">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-dark flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-forest" />
                    5. Suggested next step
                  </h4>
                  <p className="text-xs text-charcoal/90 leading-relaxed font-medium">
                    {finding.suggestedNextStep}
                  </p>
                </div>

              </div>

              {/* 6. Important Limitations Disclaimer */}
              <div className="mt-4 pt-3 border-t border-cream-dark flex items-start gap-2 text-[11px] text-mutedGrey italic">
                <AlertCircle className="w-3.5 h-3.5 text-mutedGrey shrink-0 mt-0.5" />
                <span>
                  <strong>Important Limitation:</strong> {finding.limitations}
                </span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
