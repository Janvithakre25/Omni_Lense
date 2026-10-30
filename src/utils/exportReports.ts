import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ParsedDataset } from '../types/dataset';

export function downloadCleanedCSV(dataset: ParsedDataset) {
  const csv = Papa.unparse(dataset.data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${dataset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_cleaned.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadExcelWorkbook(dataset: ParsedDataset) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Raw / Clean Data
  const wsData = XLSX.utils.json_to_sheet(dataset.data);
  XLSX.utils.book_append_sheet(wb, wsData, 'Dataset');

  // Sheet 2: Findings & Insights
  const findingsRows = dataset.findings.map(f => ({
    'Discovery': f.title,
    'What It Means': f.whatItMeans,
    'Evidence': f.evidence,
    'Suggested Next Step': f.suggestedNextStep,
    'Limitations': f.limitations,
  }));
  const wsFindings = XLSX.utils.json_to_sheet(findingsRows);
  XLSX.utils.book_append_sheet(wb, wsFindings, 'OmniLens Findings');

  // Sheet 3: Column Profiles
  const profileRows = dataset.columns.map(c => ({
    'Field Name': c.name,
    'Detected Type': c.type,
    'Missing Count': c.missingCount,
    'Unique Values': c.uniqueCount,
    'Min': c.min ?? 'N/A',
    'Max': c.max ?? 'N/A',
    'Average': c.mean ?? 'N/A',
    'Midpoint (Median)': c.median ?? 'N/A',
    'Sum Total': c.sum ?? 'N/A',
  }));
  const wsProfiles = XLSX.utils.json_to_sheet(profileRows);
  XLSX.utils.book_append_sheet(wb, wsProfiles, 'Field Profiles');

  XLSX.writeFile(wb, `${dataset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_omnilens_analysis.xlsx`);
}

export function downloadPdfReport(dataset: ParsedDataset) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Starbucks Forest Green Banner
  doc.setFillColor(0, 98, 65); // #006241
  doc.rect(0, 0, pageWidth, 32, 'F');

  // OmniLens Title
  doc.setTextColor(255, 252, 247); // warm white
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('OmniLens — Executive Data Intelligence Report', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Your data. Clear answers. Better decisions.', 14, 26);

  // Metadata Block
  doc.setTextColor(30, 41, 35); // charcoal
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Dataset Summary', 14, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dataset: ${dataset.name}`, 14, 48);
  doc.text(`Analyzed on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 54);
  doc.text(`Rows of Information: ${dataset.data.length.toLocaleString()} | Columns: ${dataset.columns.length}`, 14, 60);
  doc.text(`Data Quality Score: ${dataset.quality.qualityScore} / 100 (${dataset.quality.friendlySummary})`, 14, 66);

  // Section: Key Findings
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 76, 55); // #004C37
  doc.text('Key Discoveries & Evidence', 14, 78);

  const findingsTableData = dataset.findings.slice(0, 5).map(f => [
    f.title,
    f.whatItMeans,
    f.evidence,
    f.suggestedNextStep,
  ]);

  autoTable(doc, {
    startY: 83,
    head: [['What We Found', 'What It Means', 'Calculated Evidence', 'Suggested Next Step']],
    body: findingsTableData,
    headStyles: {
      fillColor: [0, 98, 65],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 48 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45 },
    },
    theme: 'striped',
  });

  // Section: Data Health & Quality Notes
  const finalY = (doc as any).lastAutoTable.finalY + 12;

  if (finalY < 240) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 76, 55);
    doc.text('Data Quality & Limitations Note', 14, finalY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 115, 107); // mutedGrey
    const qualityNotes = [
      `• Completeness: ${dataset.quality.missingValuesTotal} empty cell(s) detected across records.`,
      `• Duplication: ${dataset.quality.duplicateRows} exact duplicate row(s) identified.`,
      `• Analytical Boundaries: Discoveries reflect the sample provided. Patterns do not imply external causation without controlled experimentation.`,
    ];
    let offset = finalY + 6;
    qualityNotes.forEach((note) => {
      doc.text(note, 14, offset);
      offset += 5.5;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(102, 115, 107);
  doc.text('Generated with OmniLens Universal Data Intelligence Platform • Confidential & Grounded in Real Data', 14, 285);

  doc.save(`${dataset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_omnilens_report.pdf`);
}
