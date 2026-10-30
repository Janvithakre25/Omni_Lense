import React, { useState } from 'react';
import { Sparkles, TrendingUp, HelpCircle, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';

export const HeroPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insight' | 'qa' | 'chart'>('insight');

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Decorative leaf / glow accent */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-mint/80 rounded-full blur-2xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-sage/40 rounded-full blur-3xl -z-10" />

      {/* Main Glass Card Preview */}
      <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 shadow-lift relative overflow-hidden">
        {/* Sample dataset banner */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cream-dark">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-forest animate-pulse" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">Sample Dataset Preview</p>
              <h4 className="text-sm font-bold text-forest-dark">Warm Brew Cafe — Sales Data</h4>
            </div>
          </div>
          <span className="text-xs bg-cream text-charcoal px-2.5 py-1 rounded-full font-medium border border-sage/40">
            84 records analyzed
          </span>
        </div>

        {/* Mini Tab Selectors */}
        <div className="flex gap-2 p-1 bg-cream/70 rounded-xl mb-5">
          <button
            onClick={() => setActiveTab('insight')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'insight'
                ? 'bg-warmWhite text-forest-dark shadow-soft'
                : 'text-mutedGrey hover:text-charcoal'
            }`}
          >
            Key Finding
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'qa'
                ? 'bg-warmWhite text-forest-dark shadow-soft'
                : 'text-mutedGrey hover:text-charcoal'
            }`}
          >
            Ask OmniLens
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chart'
                ? 'bg-warmWhite text-forest-dark shadow-soft'
                : 'text-mutedGrey hover:text-charcoal'
            }`}
          >
            Quick Trend
          </button>
        </div>

        {/* Tab 1: Discovery & Recommendation Card */}
        {activeTab === 'insight' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Discovery Card */}
            <div className="bg-mint/60 border border-sage/60 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-forest text-warmWhite flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-mint" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-fresh">Observed Discovery</span>
                    <span className="text-[10px] text-mutedGrey bg-warmWhite/80 px-2 py-0.5 rounded-full">Calculated</span>
                  </div>
                  <h4 className="text-base font-bold text-forest-dark mt-0.5">
                    Your sales were higher on weekends than on weekdays.
                  </h4>
                  <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">
                    We compared sales across different days and found that weekends brought in <strong>42% more sales</strong> on average during the period shown.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-warmWhite border border-sage/40 rounded-2xl p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-cream text-coffee flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-charcoal uppercase tracking-wider">Suggested Next Step</h5>
                  <p className="text-xs text-charcoal/80 mt-0.5 leading-relaxed">
                    Look at which products sell best on weekends. This could help you plan barista shifts, fresh milk orders, and morning pastry stock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Natural-Language Q&A Preview */}
        {activeTab === 'qa' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-xs font-bold text-charcoal shrink-0">
                You
              </div>
              <div className="bg-cream/70 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs text-charcoal max-w-[85%]">
                Which drink generated the most revenue this month?
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-forest flex items-center justify-center text-warmWhite shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-mint" />
              </div>
              <div className="bg-mint/80 border border-sage/60 rounded-2xl rounded-tl-sm p-3.5 text-xs text-charcoal max-w-[88%] shadow-soft">
                <p className="font-semibold text-forest-dark mb-1">
                  Oat Milk Latte generated the highest revenue ($112.50 across 18 orders).
                </p>
                <p className="text-[11px] text-mutedGrey">
                  Evidence: Accounting for 27.4% of total beverage earnings. Caramel Macchiato was second at $86.25.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Quick Trend Chart Preview */}
        {activeTab === 'chart' && (
          <div className="animate-fadeIn p-2">
            <div className="flex items-center justify-between mb-3 text-xs text-mutedGrey">
              <span className="font-medium">Average Order Value by Day</span>
              <span className="text-forest font-semibold">Peak: Saturday ($17.50)</span>
            </div>
            {/* Visual Bar representation */}
            <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1 border-b border-cream-dark">
              {[
                { day: 'Mon', val: 55, num: '$9.2' },
                { day: 'Tue', val: 50, num: '$8.5' },
                { day: 'Wed', val: 62, num: '$10.4' },
                { day: 'Thu', val: 58, num: '$9.8' },
                { day: 'Fri', val: 78, num: '$13.2' },
                { day: 'Sat', val: 100, num: '$17.5' },
                { day: 'Sun', val: 94, num: '$16.1' },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      item.day === 'Sat' || item.day === 'Sun'
                        ? 'bg-forest group-hover:bg-forest-fresh'
                        : 'bg-sage/70 group-hover:bg-sage'
                    }`}
                    style={{ height: `${item.val}%` }}
                  />
                  <span className="text-[10px] text-mutedGrey font-medium">{item.day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-mutedGrey mt-2 text-center">
              Clear visual evidence comparing weekend vs weekday volume.
            </p>
          </div>
        )}

        {/* Clarifying Reassurance Disclaimer */}
        <div className="mt-4 pt-3 border-t border-cream-dark flex items-center justify-between text-[11px] text-mutedGrey">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
            100% Calculated from data
          </span>
          <span className="italic">Sample preview shown</span>
        </div>
      </div>
    </div>
  );
};
