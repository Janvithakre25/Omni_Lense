import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onResetToHome: () => void;
  onOpenUpload: () => void;
  onOpenSamples: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onResetToHome,
  onOpenUpload,
  onOpenSamples,
}) => {
  return (
    <footer id="about-section" className="bg-charcoal text-warmWhite pt-16 pb-12 border-t border-charcoal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-mutedGrey/30">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-warmWhite">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a7 7 0 0 0 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" fill="#E8F3EC" stroke="#006241" />
                  <circle cx="12" cy="9" r="2.5" fill="#006241" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-warmWhite">
                OmniLens
              </span>
            </div>

            <p className="text-sm font-semibold text-mint">
              "Your data. Clear answers. Better decisions."
            </p>

            <p className="text-xs text-sage/80 leading-relaxed max-w-sm">
              Universal Data Intelligence Platform designed to transform messy, complex spreadsheets into understandable, evidence-backed insights in plain everyday English.
            </p>

            <div className="flex items-center gap-2 text-xs text-mint/90 pt-2">
              <ShieldCheck className="w-4 h-4 text-mint" />
              <span>100% In-Browser Analysis • Zero Data Leaves Your Machine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage">Navigation</h4>
            <ul className="space-y-2 text-xs text-warmWhite/80">
              <li>
                <button onClick={onResetToHome} className="hover:text-mint transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={onOpenUpload} className="hover:text-mint transition-colors">
                  Explore My Data
                </button>
              </li>
              <li>
                <button onClick={onOpenSamples} className="hover:text-mint transition-colors">
                  Sample Datasets
                </button>
              </li>
              <li>
                <a href="#features-section" className="hover:text-mint transition-colors">
                  Platform Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-mint transition-colors">
                  Use Cases
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Data Formats */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage">Data Capabilities</h4>
            <p className="text-xs text-warmWhite/80 leading-relaxed">
              Accepts CSV, Excel (.xlsx, .xls), and JSON. Features automatic column detection, IQR outlier analysis, duplicate row audits, multi-format export, and grounded conversational querying.
            </p>
            <div className="p-3 rounded-xl bg-charcoal-light border border-mutedGrey/40 text-[11px] text-warmWhite/70">
              <strong className="text-mint block mb-0.5">Integrity Standard:</strong>
              OmniLens guarantees every chart, metric, and finding is calculated directly from genuine records without invented numbers or unverified claims.
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mutedGrey">
          <p>© {new Date().getFullYear()} OmniLens Platform. Built for clear human understanding.</p>
          <p className="flex items-center gap-1">
            Inspired by warm, friendly craft aesthetic.
          </p>
        </div>
      </div>
    </footer>
  );
};
