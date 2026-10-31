import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles, RefreshCw, Table, ShieldCheck } from 'lucide-react';
import { parseFile, ParseResult } from '../utils/dataParser';
import { calculateQualityReport, generateEvidenceFindings, generateSuggestedQuestions } from '../utils/dataAnalyzer';
import { ParsedDataset } from '../types/dataset';

interface UploadSectionProps {
  onDatasetLoaded: (dataset: ParsedDataset) => void;
  onSelectSampleDataset: (id: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onDatasetLoaded,
  onSelectSampleDataset,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<ParsedDataset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setUploadedPreview(null);

    try {
      const result: ParseResult = await parseFile(file);
      const quality = calculateQualityReport(result.data, result.columns);
      const findings = generateEvidenceFindings(result.data, result.columns);
      const suggestedQuestions = generateSuggestedQuestions(result.columns, result.data);

      const parsedDataset: ParsedDataset = {
        id: `upload-${Date.now()}`,
        name: result.fileName.replace(/\.[^/.]+$/, ''),
        source: 'uploaded',
        uploadedAt: new Date().toISOString(),
        data: result.data,
        columns: result.columns,
        quality,
        findings,
        suggestedQuestions,
      };

      setUploadedPreview(parsedDataset);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to parse this file. Please ensure it is a valid CSV, Excel, or JSON file.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Reset input value to prevent the browser from holding the File object in DOM
      e.target.value = '';
      handleProcessFile(selectedFile);
    }
  };

  return (
    <section id="explore-section" className="py-16 md:py-24 bg-cream/30 border-b border-sage/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-forest px-3 py-1 rounded-full bg-mint border border-sage/60">
            Interactive Data Explorer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark mt-3 tracking-tight">
            Bring Your Information to Light
          </h2>
          <p className="text-base text-charcoal/80 mt-3 leading-relaxed">
            Drop in your CSV, Excel, or JSON spreadsheet. We'll automatically identify columns, review data health, and surface evidence-backed findings in plain English.
          </p>
        </div>

        {/* Upload Box / Card */}
        <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 sm:p-10 shadow-soft-lg">
          
          {!uploadedPreview ? (
            <div>
              {/* Dropzone */}
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center transition-all ${
                  isDragging
                    ? 'border-forest bg-mint/40 scale-[1.01]'
                    : 'border-sage/80 hover:border-forest hover:bg-cream/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={onFileSelect}
                  className="hidden"
                  aria-label="Upload data file"
                />

                <div className="w-16 h-16 rounded-full bg-mint text-forest flex items-center justify-center mx-auto mb-4 shadow-soft">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-forest" />
                  ) : (
                    <Upload className="w-8 h-8 text-forest" />
                  )}
                </div>

                {isLoading ? (
                  <div>
                    <h3 className="text-lg font-bold text-forest-dark">Analyzing your data...</h3>
                    <p className="text-sm text-mutedGrey mt-1">
                      Reading rows, detecting data types, and calculating quality health checks.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-forest-dark">
                      Drag and drop your file here, or <span className="text-forest underline underline-offset-4">browse files</span>
                    </h3>
                    <p className="text-sm text-charcoal/70 mt-2 max-w-md mx-auto">
                      Supports spreadsheets with tabular data. Your data is analyzed securely right inside your browser.
                    </p>
                  </div>
                )}
              </div>

              {/* Supported and Planned Formats */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-mutedGrey pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-charcoal">Supported now:</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cream text-forest-dark font-medium border border-sage/40">CSV (.csv)</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cream text-forest-dark font-medium border border-sage/40">Excel (.xlsx, .xls)</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cream text-forest-dark font-medium border border-sage/40">JSON (.json)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-mutedGrey">Coming soon:</span>
                  <span className="px-2 py-0.5 rounded-md bg-cream/50 text-mutedGrey">PDF Reports</span>
                  <span className="px-2 py-0.5 rounded-md bg-cream/50 text-mutedGrey">Word Docs</span>
                  <span className="px-2 py-0.5 rounded-md bg-cream/50 text-mutedGrey">Scanned Receipts</span>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-mint/30 border border-sage/60 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-forest shrink-0" />
                  <h4 className="text-sm sm:text-base font-bold text-forest-dark">
                    🔒 Your Data. Your Privacy.
                  </h4>
                </div>
                <div className="text-xs sm:text-sm text-charcoal/80 leading-relaxed space-y-2">
                  <p>
                    Your uploaded files are processed temporarily to provide your requested results. We do not store your uploaded files or their contents in our database. Temporary processing data is cleaned up after processing, subject to the limitations described in our privacy policy.
                  </p>
                  <p>
                    Your files may be accessed by the systems that process your request, but they are not made available for routine human browsing through application file storage.
                  </p>
                  <p className="font-semibold text-forest-dark">
                    Your privacy matters. Your files are processed, not permanently stored by our application.
                  </p>
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unable to process file</p>
                    <p className="mt-0.5 text-xs text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Quick sample dataset shortcut */}
              <div className="mt-8 pt-6 border-t border-sage/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <span className="text-charcoal/80">Don't have a file ready right now?</span>
                <button
                  onClick={() => onSelectSampleDataset('coffee-shop-sales')}
                  className="inline-flex items-center gap-2 text-forest font-semibold hover:text-forest-dark hover:underline"
                >
                  <Sparkles className="w-4 h-4 text-forest-fresh" />
                  <span>Try our sample "Coffee Shop Sales" dataset</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Preview Box */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sage/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-mint text-forest-dark text-xs font-bold uppercase tracking-wider">
                      Successfully Processed
                    </span>
                    <span className="text-xs text-mutedGrey">Browser-verified</span>
                  </div>
                  <h3 className="text-2xl font-bold text-forest-dark mt-1">{uploadedPreview.name}</h3>
                  <p className="text-sm text-charcoal/80 mt-0.5">
                    Ready to explore. Here is a high-level summary of what was found in your file.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setUploadedPreview(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-warmWhite text-charcoal text-xs font-medium border border-sage/80 hover:bg-cream transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Upload different file</span>
                  </button>
                  <button
                    onClick={() => onDatasetLoaded(uploadedPreview)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest text-warmWhite text-sm font-semibold hover:bg-forest-dark transition-all shadow-soft"
                  >
                    <span>Launch Full Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-mint" />
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-cream/60 border border-sage/40">
                  <p className="text-xs font-medium text-mutedGrey">Rows of information</p>
                  <p className="text-2xl font-extrabold text-forest-dark mt-1">
                    {uploadedPreview.data.length.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-mutedGrey mt-1">Complete records</p>
                </div>

                <div className="p-4 rounded-2xl bg-cream/60 border border-sage/40">
                  <p className="text-xs font-medium text-mutedGrey">Columns</p>
                  <p className="text-2xl font-extrabold text-forest-dark mt-1">
                    {uploadedPreview.columns.length}
                  </p>
                  <p className="text-[11px] text-mutedGrey mt-1">Detected fields</p>
                </div>

                <div className="p-4 rounded-2xl bg-cream/60 border border-sage/40">
                  <p className="text-xs font-medium text-mutedGrey">Data Cleanliness</p>
                  <p className="text-2xl font-extrabold text-forest-dark mt-1">
                    {uploadedPreview.quality.qualityScore} / 100
                  </p>
                  <p className="text-[11px] text-forest font-medium mt-1">
                    {uploadedPreview.quality.qualityScore > 80 ? 'Very clean' : 'Needs attention'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream/60 border border-sage/40">
                  <p className="text-xs font-medium text-mutedGrey">Discoveries</p>
                  <p className="text-2xl font-extrabold text-forest-dark mt-1">
                    {uploadedPreview.findings.length}
                  </p>
                  <p className="text-[11px] text-mutedGrey mt-1">Evidence-backed</p>
                </div>
              </div>

              {/* Columns Detected Pill List */}
              <div className="p-4 rounded-2xl bg-mint/30 border border-sage/40">
                <h4 className="text-xs font-bold text-forest-dark uppercase tracking-wider mb-2">
                  Detected Columns & Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uploadedPreview.columns.map((col) => (
                    <div
                      key={col.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-warmWhite border border-sage/60 text-xs shadow-soft"
                    >
                      <span className="font-semibold text-charcoal">{col.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-sage/40 text-forest-dark">
                        {col.type}
                      </span>
                      {col.missingCount > 0 && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded">
                          {col.missingCount} missing
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Records Preview Table (First 4 rows) */}
              <div className="border border-sage/60 rounded-2xl overflow-hidden shadow-soft">
                <div className="bg-cream/60 px-4 py-2.5 border-b border-sage/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5" />
                    First Records Preview
                  </span>
                  <span className="text-xs text-mutedGrey">Showing first 4 rows</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-cream/30 text-charcoal font-semibold border-b border-sage/30">
                      <tr>
                        {uploadedPreview.columns.slice(0, 7).map((c) => (
                          <th key={c.name} className="px-4 py-2.5 whitespace-nowrap">
                            {c.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-dark">
                      {uploadedPreview.data.slice(0, 4).map((row, idx) => (
                        <tr key={idx} className="hover:bg-cream/20">
                          {uploadedPreview.columns.slice(0, 7).map((c) => (
                            <td key={c.name} className="px-4 py-2.5 whitespace-nowrap text-charcoal/80">
                              {row[c.name] !== null && row[c.name] !== undefined ? String(row[c.name]) : (
                                <span className="italic text-mutedGrey">empty</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Launch Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onDatasetLoaded(uploadedPreview)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-forest text-warmWhite font-semibold text-base hover:bg-forest-dark transition-all shadow-soft-lg transform hover:-translate-y-0.5"
                >
                  <span>Open Full Analytics Dashboard</span>
                  <ArrowRight className="w-5 h-5 text-mint" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
