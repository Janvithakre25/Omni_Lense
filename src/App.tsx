import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { TrustSection } from './components/TrustSection';
import { UploadSection } from './components/UploadSection';
import { SampleDatasetsSection } from './components/SampleDatasetsSection';
import { InteractiveFeatures } from './components/InteractiveFeatures';
import { UseCaseSection } from './components/UseCaseSection';
import { Footer } from './components/Footer';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { ParsedDataset } from './types/dataset';
import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { analyzeColumns } from './utils/dataParser';
import { calculateQualityReport, generateEvidenceFindings, generateSuggestedQuestions } from './utils/dataAnalyzer';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [activeDataset, setActiveDataset] = useState<ParsedDataset | null>(null);

  // Load a sample dataset dynamically by ID
  const handleSelectSampleDataset = (id: string) => {
    const meta = SAMPLE_DATASETS.find(s => s.id === id);
    if (!meta) return;

    const columns = analyzeColumns(meta.data);
    const quality = calculateQualityReport(meta.data, columns);
    const findings = generateEvidenceFindings(meta.data, columns);
    const suggestedQuestions = generateSuggestedQuestions(columns, meta.data);

    const parsed: ParsedDataset = {
      id: meta.id,
      name: meta.title,
      source: 'sample',
      uploadedAt: new Date().toISOString(),
      data: meta.data,
      columns,
      quality,
      findings,
      suggestedQuestions,
    };

    setActiveDataset(parsed);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDatasetLoaded = (dataset: ParsedDataset) => {
    setActiveDataset(dataset);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToUpload = () => {
    if (currentView === 'dashboard') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('explore-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('explore-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSamples = () => {
    if (currentView === 'dashboard') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('sample-datasets');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('sample-datasets');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-warmWhite text-charcoal">
      {/* Navigation */}
      <Navbar
        activeDataset={activeDataset}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenUpload={scrollToUpload}
        onOpenSamples={scrollToSamples}
        onResetToHome={handleResetToHome}
      />

      {/* Main Body */}
      {currentView === 'dashboard' && activeDataset ? (
        <DashboardLayout
          dataset={activeDataset}
          onUploadDifferent={scrollToUpload}
          onBackToHome={handleResetToHome}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <LandingHero
            onExploreDataClick={scrollToUpload}
            onTrySampleClick={scrollToSamples}
          />

          {/* Three Trust Pillars */}
          <TrustSection />

          {/* Interactive Drag & Drop File Upload */}
          <UploadSection
            onDatasetLoaded={handleDatasetLoaded}
            onSelectSampleDataset={handleSelectSampleDataset}
          />

          {/* Interactive Sample Dataset Explorer */}
          <SampleDatasetsSection
            onSelectSampleDataset={handleSelectSampleDataset}
          />

          {/* Feature Capabilities Breakdown */}
          <InteractiveFeatures />

          {/* Audience Use Cases */}
          <UseCaseSection
            onSelectSampleDataset={handleSelectSampleDataset}
            onOpenUpload={scrollToUpload}
          />
        </main>
      )}

      {/* Global Footer */}
      <Footer
        onResetToHome={handleResetToHome}
        onOpenUpload={scrollToUpload}
        onOpenSamples={scrollToSamples}
      />
    </div>
  );
};

export default App;
