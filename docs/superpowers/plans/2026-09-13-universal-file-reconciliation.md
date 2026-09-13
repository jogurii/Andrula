# Universal File Reconciliation Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Andrula into a truly universal reconciliation engine: streamline upload tabs to 2 intuitive workflows (`Two Separate Files` vs `Single Workbook`), accept all formats (`.xlsx`, `.xls`, `.csv`, `.pdf`) on both Side A and Side B, and dynamically bind dropzone titles to the active accounting recipe.

**Architecture:** A unified file processor inspects MIME types and extensions on both Side A and Side B, routing `.pdf` to the visual coordinate parser and `.xlsx/.xls/.csv` to SheetJS. The mode bar is simplified from 3 tabs to 2 tabs, with legacy template normalization and dynamic recipe-driven labeling.

**Tech Stack:** Vanilla JavaScript (ES6+), SheetJS (XLSX), PDF.js, pure CSS, Node.js test runner.

---

### Task 1: Mode Bar Streamlining & Universal Dropzone HTML/CSS

**Files:**
- Modify: `index.html` (CSS styles & upload card HTML)
- Test: `scratch/test_universal_mode.js`

- [ ] **Step 1: Write failing unit test for mode migration and universal format acceptance**
  - Create `scratch/test_universal_mode.js` testing:
    - Legacy mode `'supplier'` automatically normalizes to `'dual'`.
    - Mode switching between `'dual'` and `'single'`.
    - Allowed file types on both Side A and Side B include `xlsx, xls, csv, pdf`.
    - Dynamic recipe label generator for *Supplier SOA*, *Bank Rec*, and *QuickBooks vs WIP*.
- [ ] **Step 2: Run test to verify initial state / failure**
  - Run: `node scratch/test_universal_mode.js`
  - Expected: FAIL
- [ ] **Step 3: Update HTML Mode Selector to 2 Tabs**
  - Replace 3 mode buttons (`#btnModeSingle`, `#btnModeDual`, `#btnModeSupplier`) with:
    - `#btnModeDual`: **Two Separate Files** (`Excel, CSV, PDF`) [Default Active]
    - `#btnModeSingle`: **Single Workbook** (`2 Sheets in 1 Excel`)
  - Update file inputs (`#qbFileInput`, `#wipFileInput`, `#dualFile1Input`, `#dualFile2Input`) to accept `".xlsx, .xls, .csv, .pdf"`.
  - Add badge indicators showing `Accepts Excel, CSV, PDF`.
- [ ] **Step 4: Update CSS for 2-tab mode bar and universal dropzones**
  - Optimize tab layout for desktop and mobile without button wrapping.
- [ ] **Step 5: Run test to verify progress**
  - Run: `node scratch/test_universal_mode.js`
  - Expected: PASS
- [ ] **Step 6: Commit**
  - Run: `git add index.html scratch/test_universal_mode.js; git commit -m "feat: simplify mode bar to 2 tabs and enable universal formats in markup"`

---

### Task 2: Universal Ingestion Pipeline on Side A and Side B

**Files:**
- Modify: `index.html` (JS file drop and parsing handlers)

- [ ] **Step 1: Implement Universal File Router for Dropzone A and Dropzone B**
  - When a file is dropped or selected in Side A or Side B:
    - Check extension:
      - If `.pdf`: run visual coordinate PDF extractor (`parsePDFFile`).
      - If `.csv` or `.xlsx`/`.xls`: run SheetJS reader (`parseExcelOrCSVFile`).
    - Store parsed transactions into `lastQBResult` (Side A) or `lastWIPResult` (Side B).
    - If both sides are populated, run reconciliation automatically.
- [ ] **Step 2: Dynamic Recipe Labeling Hook**
  - Update `updateLabelsForMode()` and `selectRecipe()`:
    - Dynamically set Dropzone A title: `${activeRecipe.sideAName}`
    - Dynamically set Dropzone B title: `${activeRecipe.sideBName}`
    - Dynamically update column mapping labels and summary stats.
- [ ] **Step 3: Update Keyboard Shortcuts**
  - Key `1`: Switch to Two Separate Files (`dual`).
  - Key `2`: Switch to Single Workbook (`single`).
  - Remove redundant Key `3`.
- [ ] **Step 4: Template Migration**
  - In `loadTemplate()` and `importTemplate()`, map `tmpl.mode === 'supplier'` to `'dual'`.
- [ ] **Step 5: Commit**
  - Run: `git add index.html; git commit -m "feat: enable universal PDF/Excel/CSV ingestion on both sides with dynamic recipe labels"`

---

### Task 3: Regression Testing & Browser Subagent Verification

**Files:**
- Modify: `scratch/run_all_tests.js`
- Test: Live browser subagent verification

- [ ] **Step 1: Add `test_universal_mode.js` to `run_all_tests.js`**
  - Run: `node scratch/run_all_tests.js`
  - Expected: ALL 11 TEST SUITES PASSED CLEANLY
- [ ] **Step 2: Launch browser subagent**
  - Open `index.html` in browser.
  - Verify clean 2-tab mode bar (`Two Separate Files` and `Single Workbook`).
  - Verify both dropzones accept Excel, CSV, PDF.
  - Select "Supplier Statement vs AP" recipe $\rightarrow$ verify dropzone labels change to "Supplier Statement (PDF, Excel, CSV)" and "Accounts Payable Ledger".
  - Select "Bank Statement vs Cash Book" recipe $\rightarrow$ verify dropzone labels change to "Bank Statement" and "Cash Book Ledger".
  - Load demo dataset and verify reconciliation & drilldown modal continue working flawlessly.
  - Capture visual screenshots.
- [ ] **Step 3: Update `walkthrough.md` and `README.md`**
- [ ] **Step 4: Commit**
  - Run: `git add scratch/run_all_tests.js walkthrough.md README.md; git commit -m "docs: document universal file reconciliation engine and update walkthrough"`
