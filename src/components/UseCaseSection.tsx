import React from 'react';
import { DollarSign, Briefcase, Landmark, BookOpen, Layers, ArrowRight } from 'lucide-react';

interface UseCaseSectionProps {
  onSelectSampleDataset: (id: string) => void;
  onOpenUpload: () => void;
}

export const UseCaseSection: React.FC<UseCaseSectionProps> = ({
  onSelectSampleDataset,
  onOpenUpload,
}) => {
  const useCases = [
    {
      id: 'finance',
      title: 'Personal Finance',
      icon: <DollarSign className="w-5 h-5 text-forest" />,
      description: 'Understand living costs, identify largest recurring expenses, track spending categories, and spot unexpected spikes without budget anxiety.',
      actionText: 'Try Personal Spending Data',
      datasetId: 'personal-spending',
    },
    {
      id: 'business',
      title: 'Business & Retail',
      icon: <Briefcase className="w-5 h-5 text-forest" />,
      description: 'Track sales trends, pinpoint top-earning menu or store items, compare weekday vs weekend margins, and plan inventory with confidence.',
      actionText: 'Try Coffee Shop Sales Data',
      datasetId: 'coffee-shop-sales',
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce & Orders',
      icon: <Layers className="w-5 h-5 text-forest" />,
      description: 'Monitor order fulfillment times, evaluate return rates across product lines, analyze discount impacts, and maintain high customer satisfaction.',
      actionText: 'Try E-Commerce Orders Data',
      datasetId: 'online-store-orders',
    },
    {
      id: 'public',
      title: 'Government & Public Services',
      icon: <Landmark className="w-5 h-5 text-forest" />,
      description: 'Evaluate municipal ticket resolution speeds, map district workload patterns, and identify service bottlenecks with grounded accountability.',
      actionText: 'Try City 311 Requests Data',
      datasetId: 'public-service-requests',
    },
    {
      id: 'education',
      title: 'Students & Researchers',
      icon: <BookOpen className="w-5 h-5 text-forest" />,
      description: 'Investigate dataset structures, test study-hour correlations with exam mastery, review data distributions, and document analytical boundaries.',
      actionText: 'Try Student Cohort Data',
      datasetId: 'student-performance',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-warmWhite border-b border-sage/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest px-3 py-1 rounded-full bg-mint border border-sage/60">
            Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark mt-3 tracking-tight">
            Built for Real-World Scenarios
          </h2>
          <p className="text-base sm:text-lg text-charcoal/80 mt-3 leading-relaxed">
            Whether managing a local store, auditing municipal tickets, tracking household finances, or researching academic cohorts — OmniLens adapts to your context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((uc) => (
            <div
              key={uc.id}
              className="bg-cream/30 border border-sage/60 rounded-3xl p-6 flex flex-col justify-between hover:bg-cream/60 transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-mint flex items-center justify-center mb-4 shadow-soft">
                  {uc.icon}
                </div>
                <h3 className="text-lg font-bold text-forest-dark">{uc.title}</h3>
                <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sage/30">
                <button
                  onClick={() => onSelectSampleDataset(uc.datasetId)}
                  className="w-full inline-flex items-center justify-between text-xs font-semibold text-forest hover:text-forest-dark py-1"
                >
                  <span>{uc.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* General Users Card */}
          <div className="bg-forest text-warmWhite rounded-3xl p-6 flex flex-col justify-between shadow-soft-lg">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-forest-fresh flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-warmWhite" />
              </div>
              <h3 className="text-lg font-bold text-warmWhite">Have Your Own Dataset?</h3>
              <p className="text-sm text-warmWhite/80 mt-2 leading-relaxed">
                Upload any CSV, Excel, or JSON spreadsheet. OmniLens will automatically profile columns, calculate clean metrics, and generate plain-English suggestions.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-forest-fresh">
              <button
                onClick={onOpenUpload}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-mint text-forest-dark font-semibold text-xs hover:bg-warmWhite transition-colors"
              >
                <span>Upload Custom Spreadsheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
