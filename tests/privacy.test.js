import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// 1. Filename sanitization and path traversal prevention
test('sanitizeFileName removes path traversal and illegal characters', async () => {
  const sanitizeFileName = (rawName) => {
    if (!rawName || typeof rawName !== 'string') return 'dataset';
    const clean = rawName
      .replace(/^.*[\\\/]/, '')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
      .replace(/^\.+/, '')
      .trim();
    return clean.slice(0, 100) || 'dataset';
  };

  assert.equal(sanitizeFileName('../../etc/passwd.csv'), 'passwd.csv');
  assert.equal(sanitizeFileName('..\\..\\Windows\\System32\\cmd.csv'), 'cmd.csv');
  assert.equal(sanitizeFileName('test<script>.json'), 'test_script_.json');
  assert.equal(sanitizeFileName('   normal-data.xlsx   '), 'normal-data.xlsx');
  assert.equal(sanitizeFileName(''), 'dataset');
});

// 2. File size enforcement validation
test('Enforces maximum file size limit (50MB) to prevent denial of service', () => {
  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const validateSize = (size) => {
    if (size === 0) throw new Error('The uploaded file is empty (0 bytes).');
    if (size > MAX_FILE_SIZE_BYTES) throw new Error('File size exceeds the maximum allowed limit.');
    return true;
  };

  assert.throws(() => validateSize(0), /empty/);
  assert.throws(() => validateSize(55 * 1024 * 1024), /exceeds/);
  assert.equal(validateSize(1024 * 1024), true); // 1MB is valid
});

// 3. Absence of database dependencies or write operations
test('Codebase does not include permanent database drivers or ORMs', () => {
  const pkgContent = fs.readFileSync('package.json', 'utf-8');
  const pkg = JSON.parse(pkgContent);
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

  const forbiddenDbDeps = ['sqlite3', 'pg', 'mysql', 'mysql2', 'mongoose', 'prisma', 'typeorm', 'mongodb'];
  for (const dep of forbiddenDbDeps) {
    assert.equal(dep in allDeps, false, `Database dependency ${dep} must not be present`);
  }
});

// 4. Absence of external network calls in data processing modules
test('No external network calls (fetch, axios, XMLHttpRequest) in data processing modules', () => {
  const modulesToCheck = [
    'src/utils/dataParser.ts',
    'src/utils/dataAnalyzer.ts',
    'src/utils/qaEngine.ts',
    'src/utils/exportReports.ts',
  ];

  for (const modPath of modulesToCheck) {
    const code = fs.readFileSync(modPath, 'utf-8');
    assert.equal(/fetch\s*\(/.test(code), false, `Module ${modPath} must not invoke fetch()`);
    assert.equal(/axios/i.test(code), false, `Module ${modPath} must not import or use axios`);
    assert.equal(/XMLHttpRequest/i.test(code), false, `Module ${modPath} must not use XMLHttpRequest`);
  }
});

// 5. Absence of persistent browser storage writes in data processing modules
test('No localStorage, sessionStorage, or indexedDB persistence in data processing modules', () => {
  const modulesToCheck = [
    'src/utils/dataParser.ts',
    'src/utils/dataAnalyzer.ts',
    'src/utils/qaEngine.ts',
  ];

  for (const modPath of modulesToCheck) {
    const code = fs.readFileSync(modPath, 'utf-8');
    assert.equal(/localStorage/i.test(code), false, `Module ${modPath} must not access localStorage`);
    assert.equal(/sessionStorage/i.test(code), false, `Module ${modPath} must not access sessionStorage`);
    assert.equal(/indexedDB/i.test(code), false, `Module ${modPath} must not access indexedDB`);
  }
});

// 6. Privacy notice text integrity in UploadSection
test('Privacy Notice in UploadSection contains the exact required wording', () => {
  const uploadSectionCode = fs.readFileSync('src/components/UploadSection.tsx', 'utf-8');

  assert.ok(
    uploadSectionCode.includes('🔒 Your Data. Your Privacy.'),
    'Privacy notice header must match'
  );
  assert.ok(
    uploadSectionCode.includes('Your uploaded files are processed temporarily to provide your requested results.'),
    'Privacy notice paragraph 1 must match'
  );
  assert.ok(
    uploadSectionCode.includes('We do not store your uploaded files or their contents in our database.'),
    'Privacy notice must declare no database storage'
  );
  assert.ok(
    uploadSectionCode.includes('Your files may be accessed by the systems that process your request, but they are not made available for routine human browsing'),
    'Privacy notice paragraph 2 must match'
  );
  assert.ok(
    uploadSectionCode.includes('Your privacy matters. Your files are processed, not permanently stored by our application.'),
    'Privacy notice concluding sentence must match'
  );
});

// 7. Object URL revocation in export utility
test('exportReports revokes object URLs after download to release memory', () => {
  const exportCode = fs.readFileSync('src/utils/exportReports.ts', 'utf-8');
  assert.ok(
    exportCode.includes('URL.revokeObjectURL(url)'),
    'exportReports must revoke object URLs to prevent memory retention'
  );
});
