import { ColumnInfo, DataQualityReport, Finding, PotentialOutlier } from '../types/dataset';

export function calculateQualityReport(data: Record<string, any>[], columns: ColumnInfo[]): DataQualityReport {
  const totalRows = data.length;
  const totalColumns = columns.length;

  if (totalRows === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      duplicateRows: 0,
      missingValuesTotal: 0,
      columnsWithMissing: [],
      potentialOutliers: [],
      inconsistentFormats: [],
      qualityScore: 100,
      friendlySummary: 'No records available to evaluate.',
    };
  }

  // Calculate missing values
  let missingValuesTotal = 0;
  const columnsWithMissing: { column: string; count: number; percentage: number }[] = [];

  columns.forEach((col) => {
    if (col.missingCount > 0) {
      missingValuesTotal += col.missingCount;
      const percentage = Math.round((col.missingCount / totalRows) * 1000) / 10;
      columnsWithMissing.push({
        column: col.name,
        count: col.missingCount,
        percentage,
      });
    }
  });

  // Check duplicate rows
  const rowSignatures = new Set<string>();
  let duplicateRows = 0;

  data.forEach((row) => {
    // Generate simple signature
    const sig = Object.values(row).map(v => (v === null || v === undefined ? '' : String(v).trim())).join('||');
    if (rowSignatures.has(sig)) {
      duplicateRows++;
    } else {
      rowSignatures.add(sig);
    }
  });

  // Calculate potential outliers using IQR for numerical columns
  const potentialOutliers: PotentialOutlier[] = [];

  columns.filter(c => c.type === 'number').forEach((col) => {
    const values: number[] = [];
    data.forEach((row) => {
      const v = row[col.name];
      if (typeof v === 'number' && !isNaN(v)) values.push(v);
      else if (typeof v === 'string') {
        const parsed = Number(v.replace(/^[$€£¥]/, '').replace(/,/g, ''));
        if (!isNaN(parsed)) values.push(parsed);
      }
    });

    if (values.length >= 8) {
      values.sort((a, b) => a - b);
      const q1Index = Math.floor(values.length * 0.25);
      const q3Index = Math.floor(values.length * 0.75);
      const q1 = values[q1Index];
      const q3 = values[q3Index];
      const iqr = q3 - q1;

      if (iqr > 0) {
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        const outliers = values.filter(v => v < lowerBound || v > upperBound);
        if (outliers.length > 0) {
          potentialOutliers.push({
            column: col.name,
            rowCount: outliers.length,
            sampleOutliers: Array.from(new Set(outliers)).slice(0, 4),
            description: `${outliers.length} row${outliers.length > 1 ? 's have' : ' has'} values outside the expected range of ${Math.round(lowerBound)} to ${Math.round(upperBound)}.`,
          });
        }
      }
    }
  });

  // Inconsistent format detection
  const inconsistentFormats: string[] = [];
  columns.forEach((col) => {
    if (col.type === 'date') {
      const dates = data.map(r => r[col.name]).filter(Boolean);
      const hasDashes = dates.some(d => String(d).includes('-'));
      const hasSlashes = dates.some(d => String(d).includes('/'));
      if (hasDashes && hasSlashes) {
        inconsistentFormats.push(`"${col.name}" mixes both slashes (/) and dashes (-) in date entries.`);
      }
    }
  });

  // Calculate overall data health score (0 - 100)
  const missingDeduction = Math.min(30, (missingValuesTotal / (totalRows * Math.max(1, totalColumns))) * 100 * 2);
  const duplicateDeduction = Math.min(25, (duplicateRows / totalRows) * 50);
  const outlierDeduction = Math.min(15, potentialOutliers.length * 4);
  const formatDeduction = inconsistentFormats.length * 5;

  const rawScore = 100 - (missingDeduction + duplicateDeduction + outlierDeduction + formatDeduction);
  const qualityScore = Math.max(10, Math.min(100, Math.round(rawScore)));

  // Generate plain-English friendly summary
  const summaryParts: string[] = [];
  if (missingValuesTotal === 0 && duplicateRows === 0 && potentialOutliers.length === 0) {
    summaryParts.push('Your data looks exceptionally clean and well-structured, with no missing values or duplicated records.');
  } else {
    if (missingValuesTotal > 0) {
      summaryParts.push(`Some information is missing (${missingValuesTotal} empty cell${missingValuesTotal > 1 ? 's' : ''} across ${columnsWithMissing.length} column${columnsWithMissing.length > 1 ? 's' : ''}).`);
    } else {
      summaryParts.push('Every row has complete details with zero empty cells.');
    }
    if (duplicateRows > 0) {
      summaryParts.push(`${duplicateRows} record${duplicateRows > 1 ? 's appear' : ' appears'} more than once.`);
    }
    if (potentialOutliers.length > 0) {
      summaryParts.push(`Some values look unusually high or low in ${potentialOutliers.map(o => `"${o.column}"`).join(', ')} compared with the rest.`);
    }
  }

  return {
    totalRows,
    totalColumns,
    duplicateRows,
    missingValuesTotal,
    columnsWithMissing,
    potentialOutliers,
    inconsistentFormats,
    qualityScore,
    friendlySummary: summaryParts.join(' '),
  };
}

export function generateEvidenceFindings(data: Record<string, any>[], columns: ColumnInfo[]): Finding[] {
  const findings: Finding[] = [];
  const rowCount = data.length;
  if (rowCount === 0) return findings;

  const numericCols = columns.filter(c => c.type === 'number');
  const categoricalCols = columns.filter(c => c.type === 'string' && c.uniqueCount > 1 && c.uniqueCount < rowCount);
  const dateCols = columns.filter(c => c.type === 'date');

  // Finding 1: Key Concentration in Categorical Columns
  categoricalCols.forEach((col) => {
    if (col.categories && col.categories.length > 0) {
      const topCat = col.categories[0];
      if (topCat && topCat.percentage >= 30) {
        findings.push({
          id: `finding-concentration-${col.name}`,
          title: `"${topCat.name}" represents the largest share in ${col.name}`,
          whatWeFound: `A single category accounts for ${topCat.percentage}% of all records in ${col.name}.`,
          whatItMeans: `Instead of an even distribution, your records are concentrated heavily around "${topCat.name}".`,
          evidence: `"${topCat.name}" appeared in ${topCat.count} out of ${rowCount} records (${topCat.percentage}%).`,
          whyItMatters: `High concentration means changes or issues with "${topCat.name}" will have a dominant impact on your overall outcomes.`,
          suggestedNextStep: `Review whether you want to diversify across other categories or allocate extra capacity to support "${topCat.name}".`,
          limitations: 'This pattern reflects the sample recorded during this period and does not guarantee the same concentration in other periods.',
          type: 'concentration',
          relatedColumns: [col.name],
        });
      }
    }
  });

  // Finding 2: Numeric Breakdown & Dominant Totals
  if (numericCols.length > 0 && categoricalCols.length > 0) {
    const primaryNum = numericCols.find(c => c.sum && c.sum > 0) || numericCols[0];
    const primaryCat = categoricalCols[0];

    if (primaryNum && primaryCat) {
      const totalsByCategory: Record<string, number> = {};
      let grandTotal = 0;

      data.forEach((row) => {
        const cat = String(row[primaryCat.name] || 'Unknown');
        const val = Number(row[primaryNum.name]);
        if (!isNaN(val)) {
          totalsByCategory[cat] = (totalsByCategory[cat] || 0) + val;
          grandTotal += val;
        }
      });

      const sorted = Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 1 && grandTotal > 0) {
        const [topName, topAmount] = sorted[0];
        const sharePct = Math.round((topAmount / grandTotal) * 1000) / 10;

        findings.push({
          id: `finding-breakdown-${primaryCat.name}-${primaryNum.name}`,
          title: `"${topName}" generated the highest total ${primaryNum.name}`,
          whatWeFound: `When grouped by ${primaryCat.name}, "${topName}" contributed the highest cumulative amount of ${primaryNum.name}.`,
          whatItMeans: `A significant portion of your ${primaryNum.name} comes from ${topName}.`,
          evidence: `"${topName}" contributed ${Math.round(topAmount).toLocaleString()} (${sharePct}% of the overall ${Math.round(grandTotal).toLocaleString()} total).`,
          whyItMatters: `Understanding where the bulk of ${primaryNum.name} comes from helps prioritize resources and identify dependencies.`,
          suggestedNextStep: `Examine the factors that make "${topName}" so prominent and see if similar success can be applied to other areas.`,
          limitations: 'Historical totals show what happened, but do not imply that external demand or costs will stay identical.',
          type: 'distribution',
          relatedColumns: [primaryCat.name, primaryNum.name],
        });
      }
    }
  }

  // Finding 3: Day of Week or Time Trend (e.g. Weekends vs Weekdays)
  const dayCol = columns.find(c => c.name.toLowerCase().includes('day') || c.name.toLowerCase().includes('date'));
  const amountCol = numericCols.find(c => ['amount', 'sales', 'total', 'revenue', 'price', 'order_total', 'total_amount'].some(k => c.name.toLowerCase().includes(k)));

  if (dayCol && amountCol) {
    let weekendSum = 0;
    let weekendCount = 0;
    let weekdaySum = 0;
    let weekdayCount = 0;

    data.forEach((row) => {
      const dayVal = String(row[dayCol.name] || '').toLowerCase();
      const numVal = Number(row[amountCol.name]);
      if (!isNaN(numVal)) {
        if (dayVal.includes('satur') || dayVal.includes('sun') || dayVal === 'sat' || dayVal === 'sun') {
          weekendSum += numVal;
          weekendCount++;
        } else if (dayVal.includes('mon') || dayVal.includes('tue') || dayVal.includes('wed') || dayVal.includes('thu') || dayVal.includes('fri')) {
          weekdaySum += numVal;
          weekdayCount++;
        }
      }
    });

    if (weekendCount > 0 && weekdayCount > 0) {
      const avgWeekend = Math.round((weekendSum / weekendCount) * 100) / 100;
      const avgWeekday = Math.round((weekdaySum / weekdayCount) * 100) / 100;

      if (avgWeekend > avgWeekday) {
        const diffPct = Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100);
        findings.push({
          id: `finding-weekend-trend`,
          title: `Weekend activity was ${diffPct}% higher than weekdays`,
          whatWeFound: `Average ${amountCol.name} on weekends was notably higher than on typical weekdays.`,
          whatItMeans: `Customer transactions and volumes rise significantly over Saturday and Sunday.`,
          evidence: `Average ${amountCol.name} was ${avgWeekend} on weekends compared to ${avgWeekday} on weekdays.`,
          whyItMatters: `Recognizing busy days prevents staffing shortages, stockouts, or missed service opportunities.`,
          suggestedNextStep: `Align scheduling, inventories, and special promotions to capture peak weekend interest.`,
          limitations: 'Two things may change together, but that does not necessarily mean day of week is the sole reason for higher spending.',
          type: 'trend',
          relatedColumns: [dayCol.name, amountCol.name],
        });
      }
    }
  }

  // Finding 4: High Value Spread / Variation
  numericCols.forEach((col) => {
    if (col.min !== undefined && col.max !== undefined && col.mean !== undefined && col.median !== undefined) {
      const ratio = col.max / Math.max(1, col.mean);
      if (ratio > 3 && col.max > 50) {
        findings.push({
          id: `finding-spread-${col.name}`,
          title: `Wide variation detected in "${col.name}"`,
          whatWeFound: `Values in "${col.name}" range from ${col.min} to ${col.max}, with a typical average of ${col.mean}.`,
          whatItMeans: `There are a few particularly high records that pull up the overall average well above the median (${col.median}).`,
          evidence: `The maximum value (${col.max}) is ${Math.round(ratio * 10) / 10} times greater than the average (${col.mean}).`,
          whyItMatters: `When a few large numbers skew the average, relying on averages alone can lead to inaccurate budgeting or planning.`,
          suggestedNextStep: `Use the median (${col.median}) for typical expectations, and investigate what caused the largest values.`,
          limitations: 'These higher values might be completely legitimate large orders rather than mistakes.',
          type: 'distribution',
          relatedColumns: [col.name],
        });
      }
    }
  });

  // Finding 5: Data Completeness & Quality finding
  const quality = calculateQualityReport(data, columns);
  if (quality.missingValuesTotal > 0) {
    findings.push({
      id: `finding-quality-gaps`,
      title: `Information gaps in ${quality.columnsWithMissing.length} column(s)`,
      whatWeFound: `${quality.missingValuesTotal} empty values were found across your records.`,
      whatItMeans: `Some questions may have partial answers until the blank records are addressed or excluded.`,
      evidence: `${quality.columnsWithMissing.map(c => `"${c.column}" (${c.count} missing, ${c.percentage}%)`).join(', ')}.`,
      whyItMatters: `Unchecked missing data can distort averages, cause missing counts, or introduce unintended bias.`,
      suggestedNextStep: `Review the Data Quality tab to inspect which rows are incomplete and download a clean copy if needed.`,
      limitations: 'Empty fields may be intentional if optional for certain transaction types.',
      type: 'quality',
      relatedColumns: quality.columnsWithMissing.map(c => c.column),
    });
  }

  return findings;
}

export function generateSuggestedQuestions(columns: ColumnInfo[], data: Record<string, any>[]): string[] {
  const questions = [
    'What is happening in my data?',
    'What are the most important discoveries here?',
    'Are there any unusual or unexpected values?',
    'What should I look at next?',
  ];

  const catCols = columns.filter(c => c.type === 'string' && c.uniqueCount > 1 && c.uniqueCount <= 30);
  const numCols = columns.filter(c => c.type === 'number');

  if (catCols.length > 0 && numCols.length > 0) {
    questions.push(`Which ${catCols[0].name} has the highest ${numCols[0].name}?`);
    questions.push(`How does ${numCols[0].name} differ across ${catCols[0].name}?`);
  }

  if (numCols.length > 1) {
    questions.push(`Is there a relationship between ${numCols[0].name} and ${numCols[1].name}?`);
  }

  const dateCol = columns.find(c => c.type === 'date' || c.name.toLowerCase().includes('day') || c.name.toLowerCase().includes('date'));
  if (dateCol && numCols.length > 0) {
    questions.push(`How did ${numCols[0].name} change over time?`);
  }

  return questions.slice(0, 7);
}
