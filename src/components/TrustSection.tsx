import React from 'react';
import { Eye, CheckCircle2, Compass } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-12 bg-warmWhite border-b border-sage/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Pillar 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-mint/30 border border-sage/40 hover:bg-mint/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-forest text-warmWhite flex items-center justify-center shrink-0 shadow-soft">
              <Eye className="w-6 h-6 text-mint" />
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-dark">
                Understand your data without coding
              </h3>
              <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
                No formulas, SQL, or programming required. Everything is expressed in simple, conversational English everyone understands.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-mint/30 border border-sage/40 hover:bg-mint/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-forest text-warmWhite flex items-center justify-center shrink-0 shadow-soft">
              <CheckCircle2 className="w-6 h-6 text-mint" />
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-dark">
                See the evidence behind your findings
              </h3>
              <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
                Every discovery comes with verified calculations, row counts, and proportions directly from your uploaded records.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-mint/30 border border-sage/40 hover:bg-mint/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-forest text-warmWhite flex items-center justify-center shrink-0 shadow-soft">
              <Compass className="w-6 h-6 text-mint" />
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-dark">
                Turn discoveries into practical next steps
              </h3>
              <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">
                Insights shouldn't sit idle. Receive clear, actionable suggestions tailored to your findings so you can make confident choices.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
