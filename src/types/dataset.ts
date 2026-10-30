export type ColumnDataType = 'number' | 'string' | 'date' | 'boolean';

export interface ColumnInfo {
  name: string;
  type: ColumnDataType;
  missingCount: number;
  uniqueCount: number;
  sampleValues: (string | number | boolean | null)[];
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  sum?: number;
  categories?: { name: string; count: number; percentage: number }[];
}

export type FindingType = 'trend' | 'distribution' | 'concentration' | 'quality' | 'anomaly' | 'comparison';

export interface Finding {
  id: string;
  title: string;
  whatWeFound: string;
  whatItMeans: string;
  evidence: string;
  whyItMatters: string;
  suggestedNextStep: string;
  limitations: string;
  type: FindingType;
  relatedColumns: string[];
}

export interface PotentialOutlier {
  column: string;
  rowCount: number;
  sampleOutliers: number[];
  description: string;
}

export interface DataQualityReport {
  totalRows: number;
  totalColumns: number;
  duplicateRows: number;
  missingValuesTotal: number;
  columnsWithMissing: { column: string; count: number; percentage: number }[];
  potentialOutliers: PotentialOutlier[];
  inconsistentFormats: string[];
  qualityScore: number;
  friendlySummary: string;
}

export interface ParsedDataset {
  id: string;
  name: string;
  source: 'uploaded' | 'sample';
  uploadedAt: string;
  data: Record<string, any>[];
  columns: ColumnInfo[];
  quality: DataQualityReport;
  findings: Finding[];
  suggestedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chartConfig?: {
    type: 'bar' | 'line' | 'pie' | 'scatter';
    xAxis: string;
    yAxis: string;
    data: any[];
    title: string;
  };
  evidence?: string;
  suggestedFollowUps?: string[];
}

export interface SampleDatasetMeta {
  id: string;
  title: string;
  category: 'Personal Finance' | 'Coffee Shop' | 'Online Store' | 'Education' | 'Public Services' | 'Weather';
  description: string;
  rowCountText: string;
  highlightInsight: string;
  tags: string[];
  data: Record<string, any>[];
}
