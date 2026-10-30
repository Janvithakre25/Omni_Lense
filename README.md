# OmniLens — Universal Data Intelligence Platform

> **"Your data. Clear answers. Better decisions."**

OmniLens transforms raw, complex, messy, and unstructured data into meaningful, understandable, evidence-backed insights that empower anyone to make better decisions — regardless of technical background.

---

## ☕ Visual Identity & Design Direction

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

## 🌟 Key Features

### 1. Interactive Data Upload & Processing
- Drag-and-drop file upload for **CSV**, **Excel (.xlsx, .xls)**, and **JSON**.
- In-browser parsing and type inference (numeric, categorical, date, boolean).
- Dataset preview displaying rows of information, detected columns, and immediate cleanliness score.
- 100% private: all calculations run locally in the browser session.

### 2. 6 Pre-Loaded Real-World Sample Datasets
Instant one-click working examples with real data calculations:
- ☕ **Warm Brew Cafe**: Daily beverage & pastry sales, weekday vs. weekend revenue trends.
- 💰 **Personal Spending**: Living expenses, grocery vs. dining distributions.
- 🛍️ **Nordic Craft Co.**: E-commerce shipments, ratings, and return rates.
- 🎓 **Academy of Applied Sciences**: Student study hours, attendance, and exam outcomes.
- 🏛️ **City Works 311**: Municipal service requests, priority levels, and resolution speeds.
- ⛅ **Alpine Valley Observatory**: Daily temperature ranges, rainfall millimeters, and humidity.

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended, tested on Node v24)
- npm (v9 or newer)

### Installation
```bash
# Clone or navigate to the project directory
cd Omni_Lense

# Install dependencies
npm install
```

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

## 🛡️ Privacy & Security Guarantee
OmniLens performs all parsing, statistical calculations, and report rendering directly inside the client's browser. No private spreadsheets, confidential business records, or personal finances are transmitted to external servers.
