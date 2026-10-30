import React from 'react';
import { Coffee, Wallet, ShoppingBag, GraduationCap, Building2, CloudSun, ArrowRight, Sparkles } from 'lucide-react';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';
import { SampleDatasetMeta } from '../types/dataset';

interface SampleDatasetsSectionProps {
  onSelectSampleDataset: (id: string) => void;
}

export const SampleDatasetsSection: React.FC<SampleDatasetsSectionProps> = ({
  onSelectSampleDataset,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Coffee Shop':
        return <Coffee className="w-5 h-5 text-forest" />;
      case 'Personal Finance':
        return <Wallet className="w-5 h-5 text-forest" />;
      case 'Online Store':
        return <ShoppingBag className="w-5 h-5 text-forest" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-forest" />;
      case 'Public Services':
        return <Building2 className="w-5 h-5 text-forest" />;
      case 'Weather':
        return <CloudSun className="w-5 h-5 text-forest" />;
      default:
        return <Sparkles className="w-5 h-5 text-forest" />;
    }
  };

  return (
    <section id="sample-datasets" className="py-20 md:py-28 bg-warmWhite border-b border-sage/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest px-3 py-1 rounded-full bg-mint border border-sage/60">
            One-Click Working Examples
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark mt-3 tracking-tight">
            See What OmniLens Can Discover
          </h2>
          <p className="text-base sm:text-lg text-charcoal/80 mt-3 leading-relaxed">
            Choose any sample dataset below to immediately open a complete, working analysis with real calculated statistics, plain-English findings, interactive charts, and natural-language Q&A.
          </p>
        </div>

        {/* 6 Dataset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_DATASETS.map((sample: SampleDatasetMeta) => (
            <div
              key={sample.id}
              className="group bg-warmWhite rounded-3xl border border-sage/60 hover:border-forest/80 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lift transform hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Category tag & Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-mint/80 border border-sage/60 flex items-center justify-center shadow-soft group-hover:bg-mint transition-colors">
                    {getCategoryIcon(sample.category)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cream text-forest-dark border border-sage/40">
                    {sample.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-forest-dark group-hover:text-forest transition-colors">
                  {sample.title}
                </h3>
                
                <p className="text-xs text-mutedGrey font-medium mt-1">
                  {sample.rowCountText}
                </p>

                <p className="text-sm text-charcoal/80 mt-3 leading-relaxed">
                  {sample.description}
                </p>

                {/* Highlight Insight Bubble */}
                <div className="mt-4 p-3 rounded-2xl bg-mint/40 border border-sage/40 text-xs">
                  <span className="font-bold text-forest-dark block mb-0.5">Sample Finding:</span>
                  <span className="text-charcoal/90">{sample.highlightInsight}</span>
                </div>
              </div>

              {/* Bottom Action and Tags */}
              <div className="mt-6 pt-4 border-t border-cream-dark">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sample.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-cream text-mutedGrey"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectSampleDataset(sample.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-cream hover:bg-forest text-forest-dark hover:text-warmWhite font-semibold text-xs transition-all duration-200 group-hover:shadow-soft"
                >
                  <span>Explore this Dataset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
