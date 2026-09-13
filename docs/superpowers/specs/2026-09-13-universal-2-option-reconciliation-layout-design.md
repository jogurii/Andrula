# Design Spec: Universal 2-Choice Reconciliation Layout

## 1. Overview & Objectives
Currently, Andrula presents users with three separate mode selector tabs:
1. `Single Workbook (2 Sheets)`
2. `Two Separate Files (QB & WIP)`
3. `Supplier SOA (PDF vs QB)`

This creates significant user friction:
- **Redundancy**: Modes 2 and 3 are fundamentally the same workflow (comparing File A against File B). Forcing the user to choose between them based on whether a file is a PDF or from a supplier creates unnecessary hesitation.
- **Recipe Mismatch**: The recipe engine supports Bank Reconciliations, Intercompany Accounts, and Accounts Payable, but Mode 2 permanently hardcodes "QB & WIP" on the tab and dropzones.
- **Format Restrictions**: In Mode 2, CSV files are rejected or poorly communicated, even though 30%+ of bank statements and payment processor exports are `.csv`.

### The Solution: Universal 2-Choice Architecture
Simplify the upload interface into two intuitive, professional options:
1. **`Two Separate Files (Excel, CSV, PDF)`** *(Default - covers 90% of reconciliations)*:
   - **Side A (Primary Statement / Ledger)**: Accepts `.xlsx`, `.xls`, `.csv`, `.pdf`.
   - **Side B (Counterpart Ledger / ERP)**: Accepts `.xlsx`, `.xls`, `.csv`.
   - Dropzone headers, badges, and column mappings dynamically adapt to the active Recipe (e.g. *Supplier SOA vs AP*, *Bank vs Cash Book*, *QuickBooks vs WIP*).
2. **`Single Workbook (2 Sheets in 1 Excel)`** *(Covers the 10% case where both ledgers exist in one multi-sheet file)*:
   - Accepts `.xlsx`, `.xls` and prompts the user to select Sheet A and Sheet B.

---

## 2. Component & UI Changes

### 2.1 Mode Selector Bar
Replace the 3 buttons (`#btnModeSingle`, `#btnModeDual`, `#btnModeSupplier`) with 2 sleek, responsive tabs:
```html
<div class="mode-selector-wrap">
  <button type="button" class="mode-tab-btn active" id="btnModeDual" data-mode="dual">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    Two Separate Files
    <span class="mode-badge-pill">Excel, CSV, PDF</span>
  </button>
  <button type="button" class="mode-tab-btn" id="btnModeSingle" data-mode="single">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
    Single Workbook
    <span class="mode-badge-pill">2 Sheets in 1 Excel</span>
  </button>
</div>
```

### 2.2 Dynamic Recipe-Aware Dropzone Labels
When a recipe is selected (or on initial load), the dropzone card titles and descriptions update automatically:
- **Left Dropzone (Side A)**:
  - Title: `${activeRecipe.sideAName} (Statement / File A)`
  - Formats: `Accepts .xlsx, .xls, .csv, .pdf`
- **Right Dropzone (Side B)**:
  - Title: `${activeRecipe.sideBName} (Ledger / File B)`
  - Formats: `Accepts .xlsx, .xls, .csv`

### 2.3 Universal File Processing Pipeline
- **Side A**:
  - If dropped file is `.pdf`: handled via visual coordinate PDF parser (`parseSupplierPDF`).
  - If dropped file is `.csv` or `.xlsx`/`.xls`: handled via SheetJS reader with smart header detection and custom column mapping.
- **Side B**:
  - Accepts `.csv` and `.xlsx`/`.xls` via SheetJS reader.

---

## 3. Backward Compatibility & Template Migration
- **Saved Templates**: If a saved template or imported JSON has `mode: 'supplier'`, it is automatically normalized to `mode: 'dual'`.
- **Keyboard Shortcuts**:
  - `1`: Two Separate Files (`dual`)
  - `2`: Single Workbook (`single`)
- **URL Parameters**:
  - `?mode=dual` or `?mode=supplier` routes to Universal Dual Mode.
  - `?mode=single` routes to Single Workbook Mode.

---

## 4. Verification Plan
1. **Automated Unit Tests (`scratch/test_universal_mode.js`)**:
   - Verify mode switching between `dual` and `single`.
   - Verify legacy `'supplier'` mode maps seamlessly to `'dual'`.
   - Verify dynamic recipe labeling updates Side A and Side B text across recipes (*Bank Rec*, *Supplier Rec*, *WIP Rec*).
   - Verify CSV and PDF format validation.
2. **Browser Subagent Verification**:
   - Open page in browser.
   - Verify only 2 mode tabs appear, with "Two Separate Files" active by default.
   - Switch recipes (e.g. to "Supplier Statement vs Accounts Payable") and confirm dropzone labels update dynamically.
   - Verify demo mode loads correctly.
   - Capture screenshots and record video.
