import React, { useState } from 'react';
import { ParsedDataset } from '../../types/dataset';
import { OverviewTab } from './OverviewTab';
import { ExploreTab } from './ExploreTab';
import { FindingsTab } from './FindingsTab';
import { AskDataTab } from './AskDataTab';
import { DataQualityTab } from './DataQualityTab';
import { ReportsTab } from './ReportsTab';
import {
  LayoutDashboard, BarChart3, Lightbulb, MessageSquareText, ShieldAlert, FileSpreadsheet,
  ArrowLeft, Download, RefreshCw, Database, Sparkles, CheckCircle2
} from 'lucide-react';
import { downloadPdfReport } from '../../utils/exportReports';

interface DashboardLayoutProps {
  dataset: ParsedDataset;
  onUploadDifferent: () => void;
  onBackToHome: () => void;
}

export type TabKey = 'overview' | 'explore' | 'findings' | 'ask' | 'quality' | 'reports';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  dataset,
  onUploadDifferent,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs = [
    { id: 'overview' as TabKey, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'explore' as TabKey, label: 'Explore', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'findings' as TabKey, label: `Findings (${dataset.findings.length})`, icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'ask' as TabKey, label: 'Ask Your Data', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'quality' as TabKey, label: 'Data Quality', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'reports' as TabKey, label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-warmWhite pb-24">
      
      {/* Top Sticky Header */}
      <div className="bg-warmWhite border-b border-sage/60 sticky top-20 z-40 backdrop-blur-md bg-warmWhite/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left Info: Dataset Name & Status */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1 text-xs text-mutedGrey hover:text-forest transition-colors font-medium mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-mint text-forest-dark border border-sage/60">
                  {dataset.source === 'uploaded' ? 'Custom Upload' : 'Sample Dataset'}
                </span>
                <span className="text-xs text-mutedGrey">
                  Cleanliness Score: <strong>{dataset.quality.qualityScore}/100</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight">
                {dataset.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/80 mt-1">
                <span><strong>{dataset.data.length.toLocaleString()}</strong> rows of information</span>
                <span>•</span>
                <span><strong>{dataset.columns.length}</strong> columns</span>
                <span>•</span>
                <span>{dataset.findings.length} evidence discoveries</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onUploadDifferent}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-sage/80 bg-warmWhite hover:bg-cream text-charcoal text-xs font-semibold transition-colors shadow-soft"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch Data</span>
              </button>
              
              <button
                onClick={() => downloadPdfReport(dataset)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest text-warmWhite text-xs font-semibold hover:bg-forest-dark transition-all shadow-soft"
              >
                <Download className="w-3.5 h-3.5 text-mint" />
                <span>Download PDF Report</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 mt-6 overflow-x-auto pb-1 border-b border-cream-dark scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-forest text-warmWhite shadow-soft'
                    : 'text-charcoal hover:bg-cream/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Tab Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <OverviewTab dataset={dataset} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'explore' && <ExploreTab dataset={dataset} />}
        {activeTab === 'findings' && <FindingsTab dataset={dataset} />}
        {activeTab === 'ask' && <AskDataTab dataset={dataset} />}
        {activeTab === 'quality' && <DataQualityTab dataset={dataset} />}
        {activeTab === 'reports' && <ReportsTab dataset={dataset} />}
      </main>

    </div>
  );
};
