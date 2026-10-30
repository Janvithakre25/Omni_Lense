import React from 'react';
import { MessageSquareText, Lightbulb, ShieldAlert, FileSpreadsheet, BarChart3, Sparkles } from 'lucide-react';

export const InteractiveFeatures: React.FC = () => {
  const features = [
    {
      icon: <Lightbulb className="w-6 h-6 text-forest" />,
      title: "Evidence-Backed Discoveries",
      subtitle: "What Your Data Is Telling You",
      description: "OmniLens surfaces critical patterns, volume concentrations, and variations as structured cards. Each card explains what was found, what it means in plain English, and practical steps you can take next.",
      badge: "Automated Insights"
    },
    {
      icon: <MessageSquareText className="w-6 h-6 text-forest" />,
      title: "Conversational Data Q&A",
      subtitle: "Ask in Everyday Language",
      description: "Ask natural questions like \"Which product sells the most?\" or \"Are there any unusual values?\". OmniLens runs actual statistical queries on your records and responds with explanations and inline charts.",
      badge: "No Code"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-forest" />,
      title: "Interactive Visual Exploration",
      subtitle: "Dynamic Charts with Zero Setup",
      description: "Switch seamlessly between bar comparisons, time-series lines, distribution scatter plots, and category breakdowns. Hover to see exact values, filter columns, and explore underlying records effortlessly.",
      badge: "Responsive Charts"
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-forest" />,
      title: "Intelligent Data Quality Check",
      subtitle: "Catch Gaps Before You Decide",
      description: "Automatically detects empty rows, duplicate entries, inconsistent date formatting, and statistical outliers using interquartile testing. Receive a clear 0-100 cleanliness score with friendly advice.",
      badge: "Health Audit"
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-forest" />,
      title: "One-Click Executive Reports",
      subtitle: "Export PDF, Excel & CSV",
      description: "Download beautifully styled PDF summaries with executive overviews and evidence tables, export multi-tab Excel workbooks, or generate cleaned CSVs to share with teammates and stakeholders.",
      badge: "Multi-Format Export"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-forest" />,
      title: "100% In-Browser Privacy",
      subtitle: "Your Records Never Leave Your Machine",
      description: "All parsing, math calculations, and visual renderings occur locally in your browser session. Your proprietary spreadsheets and confidential numbers remain completely secure and private.",
      badge: "Private by Design"
    }
  ];

  return (
    <section id="features-section" className="py-20 md:py-28 bg-cream/40 border-b border-sage/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest px-3 py-1 rounded-full bg-mint border border-sage/60">
            Intelligent Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark mt-3 tracking-tight">
            Designed for Clarity. Powered by Real Math.
          </h2>
          <p className="text-base sm:text-lg text-charcoal/80 mt-3 leading-relaxed">
            Every feature is built around our core promise: <em>Your data. Clear answers. Better decisions.</em>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-warmWhite border border-sage/60 rounded-3xl p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center shadow-soft">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-bold text-forest-dark uppercase tracking-wider bg-cream px-2.5 py-1 rounded-full border border-sage/40">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-forest-dark">{feat.title}</h3>
                <p className="text-xs font-semibold text-coffee mt-0.5">{feat.subtitle}</p>
                <p className="text-sm text-charcoal/80 mt-3 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
