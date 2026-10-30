import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { HeroPreview } from './HeroPreview';

interface LandingHeroProps {
  onExploreDataClick: () => void;
  onTrySampleClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreDataClick,
  onTrySampleClick,
}) => {
  return (
    <section className="relative bg-cream/50 pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-sage/40">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-mint/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint text-forest-dark border border-sage/60 text-xs font-semibold shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <span>Universal Data Intelligence Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-dark tracking-tight leading-[1.12]">
              Make Sense of Your Data. <br className="hidden sm:inline" />
              <span className="text-forest">Make Better Decisions.</span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-lg sm:text-xl text-charcoal/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Have a spreadsheet, a pile of records, or information you don't know how to understand? OmniLens helps you discover what's important, understand what it means, and decide what to do next. <span className="text-charcoal font-medium">No technical skills needed.</span>
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreDataClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-forest text-warmWhite font-semibold text-base hover:bg-forest-dark transition-all duration-200 shadow-soft-lg hover:shadow-lift transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore My Data</span>
                <ArrowRight className="w-5 h-5 text-mint" />
              </button>

              <button
                onClick={onTrySampleClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-warmWhite text-forest-dark font-semibold text-base border border-sage hover:bg-cream transition-all duration-200 shadow-soft"
              >
                <span>Try a Sample Dataset</span>
              </button>
            </div>

            {/* Reassurance Message */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-mutedGrey">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-forest" />
                Easy to use
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-forest" />
                Clear explanations
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-forest" />
                Insights you can explore
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Preview */}
          <div className="lg:col-span-5">
            <HeroPreview />
          </div>

        </div>
      </div>
    </section>
  );
};
