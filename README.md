# OmniLens — Universal Data Intelligence Platform

> **"Your data. Clear answers. Better decisions."**

OmniLens transforms raw, complex, messy, and unstructured data into meaningful, understandable, evidence-backed insights that empower anyone to make better decisions — regardless of technical background.

---

##  Visual Identity & Design Direction

Inspired by the warmth, craft, and premium feel of the Starbucks design language:

- **Deep Forest Green** (`#006241`): Primary buttons, key headings, active navigation elements.
- **Dark Forest Green** (`#004C37`): Section accents and bold headers.
- **Fresh Green** (`#00754A`): Positive highlights and focus indicators.
- **Cream** (`#F7F0E5`): Soft backdrop for landing pages and card surfaces.
- **Warm White** (`#FFFCF7`): Main application workspace and analytical cards.
- **Soft Sage** (`#D4E4D3`): Pill borders, badges, and secondary containers.
- **Light Mint** (`#E8F3EC`): Highlight discovery cards and subtle glow accents.
- **Coffee Brown** (`#6F4E37`): Warmth, secondary callouts, and visual contrast.
- **Charcoal** (`#1E2923`): Highly readable body text.
- **Muted Grey** (`#66736B`): Subtitles, helper descriptions, and axis markers.
- **Typography**: Clean, friendly, and modern using `DM Sans` / `Inter`.

---

##  Key Features

### 1. Interactive Data Upload & Processing
- Drag-and-drop file upload for **CSV**, **Excel (.xlsx, .xls)**, and **JSON**.
- In-browser parsing and type inference (numeric, categorical, date, boolean).
- Dataset preview displaying rows of information, detected columns, and immediate cleanliness score.
- 100% private: all calculations run locally in the browser session.

### 2. 6 Pre-Loaded Real-World Sample Datasets
Instant one-click working examples with real data calculations:
-  **Warm Brew Cafe**: Daily beverage & pastry sales, weekday vs. weekend revenue trends.
-  **Personal Spending**: Living expenses, grocery vs. dining distributions.
-  **Nordic Craft Co.**: E-commerce shipments, ratings, and return rates.
-  **Academy of Applied Sciences**: Student study hours, attendance, and exam outcomes.
-  **City Works 311**: Municipal service requests, priority levels, and resolution speeds.
-  **Alpine Valley Observatory**: Daily temperature ranges, rainfall millimeters, and humidity.

### 3. "What Your Data Is Telling You" — Structured Evidence Cards
Every discovery follows a rigorous 6-part human-readable framework:
1. **What we found**: Concise observation.
2. **What it means in everyday language**: Friendly explanation without jargon.
3. **Calculated evidence**: Real verified counts, percentages, and totals.
4. **Why it might matter**: Practical implications.
5. **Suggested next step**: Actionable recommendations.
6. **Important limitations**: Clear note distinguishing observed correlation from causation.

### 4. Conversational Data Q&A Engine
- Natural-language query interface ("What is happening in my data?", "Which product sells the most?", "Are there any unusual values?", "What should I look at next?").
- Answers grounded directly in computed statistics.
- Generates inline comparison and trend charts directly in message responses.
- Provides suggested follow-up chips and evidence notes.

### 5. Interactive Visual Explorer
- Switch between **Bar Charts**, **Line Charts**, **Donut Charts**, and **Scatter Plots**.
- Change X-axis groupings and Y-axis numerical metrics on the fly.
- Interactive hover tooltips with formatted numbers.
- Searchable and sortable full-dataset table with responsive pagination.

### 6. Data Quality & Cleanliness Audit
- 0–100 data hygiene score.
- Automated detection of:
  - Missing cell counts per column
  - Exact duplicate row signatures
  - Statistical outliers via Interquartile Range (IQR 1.5×)
  - Date format inconsistencies
- Preview clean rows and download de-duplicated data.

### 7. Multi-Format Executive Reports
- **Executive PDF Briefing**: Printable document with headers, metadata, findings table, and limitations note.
- **Excel Workbook**: Multi-sheet workbook (`Dataset`, `OmniLens Findings`, `Field Profiles`).
- **Normalized CSV**: Cleaned and formatted data file.

---

##  Getting Started

### Prerequisites
- Node.js (v18 or newer recommended, tested on Node v24)
- npm (v9 or newer)
- Git

### Cloning & Installation
```bash
# 1. Clone the repository
git clone https://github.com/Janvithakre25/Omni_Lense.git

# 2. Navigate into the project directory
cd Omni_Lense

# 3. Install dependencies
npm install
```

> [!TIP]
> **Terminal Usage Tip:** When you start the development server (`npm run dev`), it occupies the current terminal session to serve live updates. If you need to run tests (`npm test`), generate production builds (`npm run build`), or execute Git operations while the app is running, use a **separate / different terminal window or tab**.

### Running Locally
```bash
# Start the Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Building for Production
```bash
# Compile TypeScript and build production assets
npm run build
```
Production assets are generated in the `dist/` directory.

### Running Automated Tests
```bash
npm test
```

---

## 🛡️ Privacy & Security Architecture

### 1. Privacy-First File Processing
OmniLens employs a strict privacy-first architecture where data analysis is executed in-memory directly within the user's browser runtime. 

### 2. How Uploaded Files Are Handled
- **Client-Side Ingest**: When a file (CSV, Excel `.xlsx`/`.xls`, or JSON) is selected or dragged onto the dropzone, it is read via the browser's standard `FileReader` API and parsed into memory structures via `PapaParse` and `SheetJS (xlsx)`.
- **In-Memory Analysis**: Column type inference, IQR outlier detection, cleanliness metrics, and natural-language findings are calculated in volatile JavaScript application heap memory.
- **Immediate DOM Cleanup**: Upon file selection, the file input element's value (`e.target.value = ''`) is immediately reset to prevent the browser DOM from retaining file handles or path references.
- **Volatile Session Lifecycle**: Data exists solely within the active React application state (`activeDataset`) during the user's session. Refreshing or navigating away instantly purges all parsed records.

### 3. Database Persistence Restrictions
- **Zero Database Persistence**: OmniLens does not connect to, write to, or maintain any database (SQL, NoSQL, or embedded).
- **No Binary Storage**: Uploaded files are never stored as binary objects (BLOBs), base64 database strings, or persisted entities.
- **No Indirect or Derived Logging**: No derived summaries, personal identifiable information (PII), or extracted records are persisted to any remote database, upload-history table, or analytics store.
- **No Local Storage Persistence**: The application deliberately avoids writing dataset contents to `localStorage`, `sessionStorage`, or `indexedDB`.

### 4. Temporary File Handling & Memory Cleanup
- **No Server Disk Writes**: Because processing occurs on the client side, no temporary files are written to host disk storage or temp directories.
- **Blob Object URL Revocation**: When exporting cleaned CSV reports, generated Blob URLs are explicitly revoked via `URL.revokeObjectURL(url)` immediately after triggering the browser download.
- **Garbage Collection Readiness**: File buffers and intermediate text representations are scoped to parsing functions and made immediately eligible for garbage collection upon completion.

### 5. Privacy Notice Behavior
The upload interface displays a compact, accessible, high-contrast privacy notice directly adjacent to the file upload dropzone before any file is selected:

> **🔒 Your Data. Your Privacy.**
> 
> "Your uploaded files are processed temporarily to provide your requested results. We do not store your uploaded files or their contents in our database. Temporary processing data is cleaned up after processing, subject to the limitations described in our privacy policy.
> 
> Your files may be accessed by the systems that process your request, but they are not made available for routine human browsing through application file storage.
> 
> Your privacy matters. Your files are processed, not permanently stored by our application."

### 6. Third-Party Processing Considerations
- **No External Cloud AI or Analytics Services**: All queries in the "Ask Your Data" tab and summary cards are computed by a deterministic local analytics engine (`qaEngine.ts` and `dataAnalyzer.ts`).
- **No Outbound Network Transmissions**: Neither raw records nor extracted insights are transmitted to external servers, cloud AI providers, or third-party telemetry platforms.

### 7. Security Measures & Known Limitations
- **File Size Protection**: Files exceeding **50MB** are rejected prior to parsing to safeguard browser performance and prevent memory exhaustion denial-of-service.
- **Filename Sanitization**: Uploaded filenames are sanitized against path traversal patterns (`..`, `/`, `\`), illegal characters, and script tags.
- **Empty File Protection**: 0-byte or malformed files are trapped and handled cleanly without exposing system internals or stack traces.
- **Known Limitations**: 
  - Client memory limits: Very large files (>50MB) may strain low-memory mobile browser environments.
  - Browser extensions: Third-party browser extensions with page-inspection permissions could inspect client DOM state; users handling strictly confidential data should run in private/incognito mode without unverified extensions.

---

##  Verification & Testing

### Running the Test Suite
The repository includes automated engine and privacy verification tests executed via Node.js's built-in test runner:

```bash
# Run all automated tests (engine + privacy test suites)
npm test
```

### Verified Test Cases
1. **Column Detection & Calculations**: Correctly infers numeric, string, and date types.
2. **IQR Outlier Detection**: Accurately flags statistical anomalies using standard 1.5× IQR fences.
3. **Quality Score Algorithm**: Accurately computes data completeness and duplicate penalties.
4. **Sample Datasets Integrity**: Validates all 6 pre-loaded datasets.
5. **Plain English Compliance**: Asserts absence of confusing technical jargon in user-facing summaries.
6. **Filename Sanitization**: Asserts removal of path traversal (`../../etc/passwd`, `..\..\cmd.csv`) and illegal characters.
7. **File Size Enforcement**: Validates that files >50MB and 0-byte files are rejected safely.
8. **No Database Dependencies**: Confirms zero database drivers or ORMs in `package.json`.
9. **No External Network Calls**: Confirms zero `fetch`, `axios`, or `XMLHttpRequest` calls in processing modules.
10. **No Browser Storage Persistence**: Confirms no `localStorage`, `sessionStorage`, or `indexedDB` writes.
11. **Privacy Notice Integrity**: Validates exact verbatim compliance with required privacy notice wording.
12. **Object URL Cleanup**: Asserts explicit invocation of `URL.revokeObjectURL(url)`.
