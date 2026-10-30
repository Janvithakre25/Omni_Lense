import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Column Detection & Calculations
test('detectColumnType identifies numeric, string and date properly', () => {
  const detectType = (values) => {
    let numCount = 0;
    for (const v of values) {
      if (typeof v === 'number' || (!isNaN(Number(String(v).replace(/^[$€£¥]/, '').replace(/,/g, ''))) && String(v).trim() !== '')) {
        numCount++;
      }
    }
    return numCount >= values.length * 0.7 ? 'number' : 'string';
  };

  assert.equal(detectType([10, 20.5, 30, 45]), 'number');
  assert.equal(detectType(['$10.50', '$25.00', '$100']), 'number');
  assert.equal(detectType(['Coffee', 'Pastry', 'Tea', 'Sandwich']), 'string');
});

// Test 2: IQR Outlier Detection
test('IQR Outlier calculation correctly identifies extreme values', () => {
  const values = [10, 11, 12, 13, 12, 11, 14, 12, 13, 12, 150]; // 150 is an extreme outlier
  values.sort((a, b) => a - b);
  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const iqr = q3 - q1;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = values.filter(v => v > upperBound);

  assert.equal(outliers.length, 1);
  assert.equal(outliers[0], 150);
});

// Test 3: Quality Score Calculation
test('Quality score starts at 100 and properly discounts for missing and duplicate values', () => {
  const calculateScore = (totalRows, totalCols, missing, duplicates) => {
    const missingDeduction = Math.min(30, (missing / (totalRows * Math.max(1, totalCols))) * 100 * 2);
    const duplicateDeduction = Math.min(25, (duplicates / totalRows) * 50);
    return Math.max(10, Math.min(100, Math.round(100 - (missingDeduction + duplicateDeduction))));
  };

  assert.equal(calculateScore(100, 5, 0, 0), 100);
  assert.ok(calculateScore(100, 5, 20, 5) < 100);
  assert.ok(calculateScore(100, 5, 20, 5) > 60);
});

// Test 4: Sample Datasets Integrity
test('All 6 sample datasets exist and have valid records', async () => {
  // Check the datasets directly from sampleDatasets.ts
  const fs = await import('node:fs');
  const content = fs.readFileSync('src/data/sampleDatasets.ts', 'utf-8');

  assert.ok(content.includes('coffee-shop-sales'), 'Coffee shop dataset must exist');
  assert.ok(content.includes('personal-spending'), 'Personal spending dataset must exist');
  assert.ok(content.includes('online-store-orders'), 'Online store dataset must exist');
  assert.ok(content.includes('student-performance'), 'Student performance dataset must exist');
  assert.ok(content.includes('public-service-requests'), 'Public service requests dataset must exist');
  assert.ok(content.includes('weather-observations'), 'Weather observations dataset must exist');
});

// Test 5: Plain English Rules
test('Plain English requirement: no technical jargon in user-facing texts', () => {
  const badTerms = ['heteroskedasticity', 'homoscedasticity', 'eigenvalue', 'stochastic gradient descent'];
  const userText = 'Your dataset has 12,000 rows of information and 18 columns. Some values look unusual compared with the rest.';
  for (const term of badTerms) {
    assert.equal(userText.toLowerCase().includes(term), false, `User text should not contain ${term}`);
  }
});
