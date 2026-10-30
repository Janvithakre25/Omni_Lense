import React, { useState } from 'react';
import { Compass, Menu, X, Database, Sparkles, ArrowRight } from 'lucide-react';
import { ParsedDataset } from '../types/dataset';

interface NavbarProps {
  activeDataset: ParsedDataset | null;
  onOpenDashboard: () => void;
  onOpenUpload: () => void;
  onOpenSamples: () => void;
  onResetToHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeDataset,
  onOpenDashboard,
  onOpenUpload,
  onOpenSamples,
  onResetToHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-warmWhite/90 backdrop-blur-md border-b border-sage/40 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-xl p-1 text-left"
          aria-label="OmniLens Home"
        >
          <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-warmWhite shadow-soft group-hover:bg-forest-dark transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a7 7 0 0 0 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" fill="#E8F3EC" stroke="#006241" />
              <circle cx="12" cy="9" r="2.5" fill="#006241" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-forest-dark flex items-center gap-1.5">
              OmniLens
              <span className="text-xs px-2 py-0.5 rounded-full bg-mint text-forest-dark font-medium border border-sage/60">
                Universal
              </span>
            </span>
            <p className="text-xs text-mutedGrey hidden sm:block">Clear answers. Better decisions.</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal" aria-label="Main Navigation">
          <button
            onClick={onResetToHome}
            className="hover:text-forest transition-colors py-1 hover:border-b-2 hover:border-forest"
          >
            Home
          </button>
          <a
            href="#explore-section"
            className="hover:text-forest transition-colors py-1"
          >
            Explore Data
          </a>
          <a
            href="#features-section"
            className="hover:text-forest transition-colors py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-forest transition-colors py-1"
          >
            How It Works
          </a>
          <button
            onClick={onOpenSamples}
            className="hover:text-forest transition-colors py-1"
          >
            Sample Datasets
          </button>
          <a
            href="#about-section"
            className="hover:text-forest transition-colors py-1"
          >
            About
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {activeDataset ? (
            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-mint text-forest-dark border border-sage hover:bg-sage/40 transition-all font-medium text-sm shadow-soft"
            >
              <Database className="w-4 h-4 text-forest" />
              <span>Current Data: <strong className="font-semibold">{activeDataset.name.slice(0, 14)}...</strong></span>
              <ArrowRight className="w-4 h-4 text-forest" />
            </button>
          ) : (
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-warmWhite font-medium text-sm hover:bg-forest-dark transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-mint" />
              <span>Start Exploring</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-charcoal hover:bg-cream transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warmWhite border-b border-sage/60 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => { onResetToHome(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-lg text-charcoal hover:bg-cream font-medium text-sm"
          >
            Home
          </button>
          <button
            onClick={() => { onOpenUpload(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-lg text-charcoal hover:bg-cream font-medium text-sm"
          >
            Explore Data
          </button>
          <a
            href="#features-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-charcoal hover:bg-cream font-medium text-sm"
          >
            Features
          </a>
          <button
            onClick={() => { onOpenSamples(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-lg text-charcoal hover:bg-cream font-medium text-sm"
          >
            Sample Datasets
          </button>
          <a
            href="#about-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-charcoal hover:bg-cream font-medium text-sm"
          >
            About
          </a>

          <div className="pt-3 border-t border-sage/30">
            {activeDataset ? (
              <button
                onClick={() => { onOpenDashboard(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-forest text-warmWhite font-medium text-sm"
              >
                <Database className="w-4 h-4" />
                <span>Go to Active Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => { onOpenUpload(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-forest text-warmWhite font-medium text-sm"
              >
                <Sparkles className="w-4 h-4 text-mint" />
                <span>Start Exploring</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
