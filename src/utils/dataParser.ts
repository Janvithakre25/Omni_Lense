import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ColumnInfo, ColumnDataType } from '../types/dataset';

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function sanitizeFileName(rawName: string): string {
  if (!rawName || typeof rawName !== 'string') return 'dataset';
  // Remove path traversal, directory separators, and control characters
  const clean = rawName
    .replace(/^.*[\\\/]/, '') // Extract basename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') // Remove illegal filename and control characters
    .replace(/^\.+/, '') // Remove leading dots
    .trim();
  return clean.slice(0, 100) || 'dataset';
}

export interface ParseResult {
  data: Record<string, any>[];
  columns: ColumnInfo[];
  fileName: string;
  rowCount: number;
  columnCount: number;
}

export function detectColumnType(values: any[]): ColumnDataType {
  const validValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (validValues.length === 0) return 'string';

  let numberCount = 0;
  let booleanCount = 0;
  let dateCount = 0;

  for (const val of validValues) {
    if (typeof val === 'number') {
      numberCount++;
      continue;
    }
    if (typeof val === 'boolean' || val === 'true' || val === 'false' || val === 'TRUE' || val === 'FALSE') {
      booleanCount++;
      continue;
    }
    if (typeof val === 'string') {
      const cleanVal = val.trim();
      // Check if numeric (including currency / commas)
      const numMatch = cleanVal.replace(/^[$€£¥]/, '').replace(/,/g, '');
      if (cleanVal !== '' && !isNaN(Number(numMatch))) {
        numberCount++;
        continue;
      }
      // Check if date
      if (cleanVal.length >= 6 && !isNaN(Date.parse(cleanVal)) && isNaN(Number(cleanVal))) {
        dateCount++;
        continue;
      }
    }
  }

  const threshold = validValues.length * 0.7;
  if (numberCount >= threshold) return 'number';
  if (booleanCount >= threshold) return 'boolean';
  if (dateCount >= threshold) return 'date';
  return 'string';
}

export function analyzeColumns(data: Record<string, any>[]): ColumnInfo[] {
  if (!data || data.length === 0) return [];

  const rawKeys = Object.keys(data[0] || {});
  // Filter out empty keys
  const keys = rawKeys.filter(k => k && k.trim() !== '');

  return keys.map((key) => {
    const rawValues = data.map(row => row[key]);
    const detectedType = detectColumnType(rawValues);

    let missingCount = 0;
    const valueFrequency: Record<string, number> = {};
    const numericValues: number[] = [];

    rawValues.forEach((val) => {
      if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
        missingCount++;
        return;
      }

      const strVal = String(val).trim();
      valueFrequency[strVal] = (valueFrequency[strVal] || 0) + 1;

      if (detectedType === 'number') {
        const num = typeof val === 'number' ? val : Number(String(val).replace(/^[$€£¥]/, '').replace(/,/g, ''));
        if (!isNaN(num)) {
          numericValues.push(num);
        }
      }
    });

    const uniqueCount = Object.keys(valueFrequency).length;
    const sampleValues = Array.from(new Set(rawValues.filter(v => v !== null && v !== undefined && v !== ''))).slice(0, 5);

    const colInfo: ColumnInfo = {
      name: key,
      type: detectedType,
      missingCount,
      uniqueCount,
      sampleValues,
    };

    if (detectedType === 'number' && numericValues.length > 0) {
      numericValues.sort((a, b) => a - b);
      const sum = numericValues.reduce((acc, curr) => acc + curr, 0);
      const min = numericValues[0];
      const max = numericValues[numericValues.length - 1];
      const mean = Math.round((sum / numericValues.length) * 100) / 100;
      const mid = Math.floor(numericValues.length / 2);
      const median = numericValues.length % 2 !== 0 ? numericValues[mid] : Math.round(((numericValues[mid - 1] + numericValues[mid]) / 2) * 100) / 100;

      colInfo.min = min;
      colInfo.max = max;
      colInfo.mean = mean;
      colInfo.median = median;
      colInfo.sum = Math.round(sum * 100) / 100;
    } else {
      // Build top categories
      const sortedCategories = Object.entries(valueFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / data.length) * 1000) / 10,
        }));
      colInfo.categories = sortedCategories;
    }

    return colInfo;
  });
}

export async function parseFile(file: File): Promise<ParseResult> {
  if (!file) {
    throw new Error('No file provided for parsing.');
  }

  // File size validation to prevent memory exhaustion and browser denial-of-service
  if (file.size === 0) {
    throw new Error('The uploaded file is empty (0 bytes). Please upload a file with data rows.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File size (${sizeInMB}MB) exceeds the maximum allowed limit of ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`);
  }

  const safeFileName = sanitizeFileName(file.name);
  const fileExt = safeFileName.split('.').pop()?.toLowerCase();

  if (fileExt === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            reject(new Error('The uploaded CSV file is empty. Please upload a file with data rows.'));
            return;
          }
          const cleanData = results.data as Record<string, any>[];
          const columns = analyzeColumns(cleanData);
          resolve({
            data: cleanData,
            columns,
            fileName: safeFileName,
            rowCount: cleanData.length,
            columnCount: columns.length,
          });
        },
        error: (err) => {
          reject(new Error(`Failed to read CSV: ${err.message}`));
        },
      });
    });
  }

  if (fileExt === 'xlsx' || fileExt === 'xls') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          const workbook = XLSX.read(buffer, { type: 'binary', cellDates: true });
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) {
            throw new Error('No worksheets found in this Excel file.');
          }
          const worksheet = workbook.Sheets[firstSheetName];
          const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: null }) as Record<string, any>[];

          if (!rawJson || rawJson.length === 0) {
            throw new Error('The Excel sheet contains no readable rows.');
          }

          const columns = analyzeColumns(rawJson);
          resolve({
            data: rawJson,
            columns,
            fileName: safeFileName,
            rowCount: rawJson.length,
            columnCount: columns.length,
          });
        } catch (err: any) {
          reject(new Error(`Failed to parse Excel file: ${err.message || err}`));
        }
      };
      reader.onerror = () => reject(new Error('File reader failed to read the Excel file.'));
      reader.readAsBinaryString(file);
    });
  }

  if (fileExt === 'json') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);
          const dataArray = Array.isArray(parsed) ? parsed : parsed.data || parsed.records || parsed.items;

          if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('JSON file must contain an array of objects or have a "data" property containing rows.');
          }

          const columns = analyzeColumns(dataArray);
          resolve({
            data: dataArray,
            columns,
            fileName: safeFileName,
            rowCount: dataArray.length,
            columnCount: columns.length,
          });
        } catch (err: any) {
          reject(new Error(`Invalid JSON format: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('File reader failed to read the JSON file.'));
      reader.readAsText(file);
    });
  }

  throw new Error(`The format ".${fileExt}" is not supported yet. Supported formats are CSV, Excel (.xlsx, .xls), and JSON.`);
}
