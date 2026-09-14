# Andrula

A modular, browser-based financial and ledger reconciliation engine for accountants, designed to reconcile QuickBooks exports, WIP subledgers, vendor statements, and custom accounting schedules.

Processes spreadsheets and PDF statements entirely inside your web browser. No files, ledger balances, or financial details are ever uploaded to a server or transmitted over the internet.

---

## Features

- **Streamlined 2-Option Universal Reconciliation Layout**:
  - **Two Separate Files (Default, 90% of Closes)**: Compare two separate files of **any** format (`.xlsx`, `.xls`, `.csv`, `.pdf`) on both Side A and Side B. Supports all combinations (Excel ↔ Excel, PDF ↔ Excel, CSV ↔ CSV, PDF ↔ CSV, PDF ↔ PDF).
  - **Single Workbook (10% of Closes)**: Compare two sheets within a single Excel workbook (`.xlsx`, `.xls`).
- **Universal Multi-Format Ingestion**:
  - Both dropzones automatically route spreadsheets to SheetJS and PDF statements to the visual coordinate extraction engine.
  - Dropzone titles, descriptions, column mappers, and table headers dynamically adapt to the active accounting recipe (e.g. *Supplier SOA vs AP*, *Bank Rec*, *QuickBooks vs WIP*).
- **Automatic Detection with Manual Control**:
  - Automatically identifies common sheet names (`QuickBooks`, `QB`, `WIP`, `Ledger`) and columns (`No.`, `Ref No`, `Amount`, `Date`, `Memo/Description`).
  - Transparent auto-detection indicators (`Auto-Detect (Col X: Header)`) for both spreadsheets and PDF statements.
  - Dedicated **Worksheet & Column Setup** card located directly beneath upload dropzones to quickly switch sheets and fine-tune column mappings or select `— None (Do not use) —` to resolve Net vs Debit/Credit column conflicts.
  - Collapsible **Reconciliation Recipe & Formula Settings** panel focused on business recipe profiles, math formulas ($A - B = 0$, $A + B = 0$, $|A| - |B| = 0$), reference normalizers, and reusable template JSON export/import.
- **Detailed Discrepancy Breakdown & Audit Triage**:
  - Categorizes records by status: *Amount Mismatch*, *Missing in Primary Ledger*, *Missing in Counterpart Ledger*, or *Line Count Difference*.
  - Persistent **"Mark as Reviewed"** audit tracking with live progress counter (e.g., `12 of 38 Reviewed (32%)`).
  - Flexible display options: Choose **10, 25, 50, 100 per page** or **All** for full continuous scroll with browser `Ctrl+F`.
  - Real-time search and status filter tabs.
- **Interactive Drill-Down & Line Matching**:
  - Click any row to view side-by-side transaction entries from both ledgers.
  - Automatically highlights exact matched entries, split transactions, and variance lines.
  - Mark items reviewed and navigate sequentially right from inside the inspection modal.
- **Built-In Keyboard Shortcuts**:
  - Full keyboard control for high-speed triage without touching the mouse.
- **Multi-Currency Support**:
  - Formats numbers in 15 major currencies: AED (default for UAE), USD, EUR, GBP, SAR, QAR, OMR, BHD, KWD, EGP, INR, SGD, AUD, CAD, and IDR, with accurate sub-unit precision (3 decimals for OMR, BHD, KWD).
- **Excel Export**:
  - Download reconciliation results directly into a structured `.xlsx` spreadsheet, including your audit review statuses.

---

## Keyboard Shortcuts Guide

Andrula includes hotkeys designed specifically for accountants performing high-volume transaction reviews. Press <kbd>?</kbd> anytime in the app to view the interactive shortcuts guide.

### Discrepancy Inspection & Triage (Inside Drill-Down Modal)

| Key | Action | Description |
| :---: | :--- | :--- |
| <kbd>M</kbd> | **Mark / Unmark Reviewed** | Toggles the audit reviewed checkbox for the current discrepancy |
| <kbd>→</kbd> or <kbd>J</kbd> | **Next Discrepancy** | Advances directly to the next discrepancy in the filtered list |
| <kbd>←</kbd> or <kbd>K</kbd> | **Previous Discrepancy** | Moves back to the previous discrepancy |
| <kbd>C</kbd> | **Copy Voucher Ref** | Copies the voucher / reference number to the clipboard |
| <kbd>Esc</kbd> | **Close Modal** | Closes the drill-down inspection dialog |

### Global Navigation & Controls

| Key | Action | Description |
| :---: | :--- | :--- |
| <kbd>?</kbd> | **Toggle Hotkeys Guide** | Opens or closes the built-in keyboard shortcuts guide |
| <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> | **Focus Search** | Instantly focuses and selects the search input |
| <kbd>Ctrl</kbd> + <kbd>E</kbd> | **Export to Excel** | Downloads the filtered discrepancies spreadsheet |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | **In-Page Find** | Browser native search (set page size to **All** for continuous scroll) |
| <kbd>1</kbd> | **Two Separate Files Mode** | Switches to 2 Separate Files (`dual`) mode (accepts Excel, CSV, PDF) |
| <kbd>2</kbd> | **Single Workbook Mode** | Switches to 1 Excel File (2 sheets in 1 workbook) mode |

> [!TIP]
> **Accountant Rapid-Triage Workflow**: Click any discrepant row to inspect details. Press <kbd>M</kbd> to mark as reviewed, then press <kbd>→</kbd> to cycle to the next issue instantly without moving your hands to your mouse.
>
> *Note: Single-letter shortcuts are automatically ignored when you are actively typing inside an input field or text area.*

---

## Quick Start

You do not need to install Node.js, databases, or build tools.

1. Download or clone this repository.
2. Double-click `index.html` to open it in any modern browser (Chrome, Edge, Safari, Firefox).
3. Drag and drop your spreadsheet(s) or PDF statement into the upload area.

### Optional: Running via Local Server

If you prefer to serve it locally:

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

Then visit `http://localhost:3000`.

---

## Expected Spreadsheet Format

Andrula works with standard Excel files (`.xlsx` or `.xls`) and CSV files. The parser looks for the following columns within the first 20 rows of each sheet:

| Field | Recognized Header Names |
| :--- | :--- |
| **Reference Number** | `No.`, `No`, `Ref No`, `Reference`, `Num`, `Ref`, `Doc No`, `Transaction` |
| **Amount** | `Amount`, `Amt`, `Nominal`, `Net Amount`, `Total` |
| **Date** *(optional)* | `Date`, `Tanggal`, `Trans Date` |
| **Description** *(optional)* | `Memo`, `Description`, `Desc`, `Name`, `Vendor`, `Particulars` |

---

## Reconciliation Recipe Engine & Multi-Formula Matching

Andrula includes a **Reconciliation Recipe Engine** that adapts to any accounting schedule, subledger, or financial schedule. Open the **Reconciliation Recipe & Formula Settings** control center on the upload card to configure:

### 1. Built-in Recipe Presets
- **QuickBooks vs WIP Ledger**: Direct difference matching ($A - B = 0$) with fuzzy reference cleanup.
- **Supplier Statement vs Accounts Payable**: Contra / inverse sign matching ($A + B = 0$) where supplier credits match ledger debits.
- **Bank Statement vs Cash Book**: Contra matching with date and reference cross-matching.
- **Intercompany Accounts (Entity A vs Entity B)**: Inverse matching across sister legal entities.
- **Custom Recipe**: Fully customizable formula, normalizer, tolerance, and column overrides.

### 2. Configurable Matching Formulas
- **Direct Net Difference ($A - B = 0$)**: Standard comparison where positive and negative signs match between ledgers.
- **Contra / Inverse Sign ($A + B = 0$)**: Balances opposite-sign entries (e.g. Bank credits + Cash book debits = 0).
- **Absolute Magnitude Difference ($|A| - |B| = 0$)**: Matches total volume or magnitude regardless of positive/negative accounting convention.

### 3. Reference Number Normalizers
- **Fuzzy Standard (Recommended)**: Automatically strips common prefixes (`INV-`, `VCH-`, `BILL-`, `REF-`, `#`), strips trailing punctuation, and trims leading zeroes (`000452` matches `452`).
- **Alphanumeric Only**: Removes all special characters, spaces, slashes, and hyphens (e.g., `INV/2026/08` matches `INV202608`).
- **Exact Match**: Strict case-insensitive character comparison.

### 4. Dynamic Column Mapping & Separate Debit/Credit Overrides
When spreadsheets or PDF statements are uploaded, candidate columns are automatically extracted and populated into dropdowns for:
- **Side A (Primary Ledger)**: Reference Number, Amount (Net/Signed), Debit (Dr), Credit (Cr), Date, and Description.
- **Side B (Counterpart Ledger)**: Reference Number, Amount (Net/Signed), Debit (Dr), Credit (Cr), Date, and Description.

Accountants can map single net amount columns or separate Debit/Credit columns ($Amount = Debit - Credit$) without modifying source files.

**PDF Spatial Column Remapping**: When a PDF statement is uploaded, Andrula's visual coordinate detector extracts candidate columns and displays a `📄 PDF detected N columns` badge on the mapping card, enabling you to reassign column roles directly from the interface if needed.

### 5. Multi-Line ERP Split Reports ("Fill-Down Blank References")
Detailed ERP reports (e.g. QuickBooks Detailed, SAP, Sage 50/300, Netsuite, MYOB) often print the voucher reference number only on the first split row, leaving subsequent line items with amounts but empty reference cells.
- Enable **Fill-down blank references** in the Recipe Settings panel.
- Andrula automatically inherits the parent voucher reference and transaction date across all split rows until an empty separator row, subtotal, or new voucher is reached.

### 6. Universal Supplier Statement Ingestion (PDF, Excel, or CSV)
More than half of vendors provide statements of account in spreadsheet formats rather than PDF.
- The statement dropzone accepts `.pdf`, `.xlsx`, `.xls`, and `.csv`.
- If an Excel or CSV file is uploaded, Andrula automatically extracts the statement transactions via the spreadsheet parser.
- For PDF statements, text items are grouped and sorted by **visual Y/X coordinates**, reconstructing true tabular rows even when PDF generators write columns out of visual order.

### 7. Accounting Period Cutoff & Date Range Filter
Supplier statements frequently include invoices from prior months or future dating:
- Use the **Cutoff Date Filter** (`From` & `To` date inputs) in the results toolbar to isolate records within your target accounting period.
- Discrepancies and status filter counts immediately update to reflect only transactions within the active cutoff window, preventing false discrepancies from timing differences.

### 8. Template Management (Save / Export / Import JSON)
Save time during recurring monthly closes by preserving your configuration profiles:
- **Save Template**: Store current settings (recipe, formula, tolerance, normalizer, fill-down toggle, sheet names, and column mappings) directly in browser storage.
- **Export JSON**: Export active configurations as clean `.json` files to share across your accounting and audit team.
- **Import JSON**: Load `.json` configuration templates instantly.

### 9. Drill-Down Detail Modal with Side-by-Side Paired Ledger Alignment
Inspect any transaction voucher in depth:
- **1-to-1 Counterpart Pairing**: Each line in the primary ledger is matched and aligned side-by-side with its counterpart on the exact same horizontal row baseline.
- **Smart Tie-Breaking**: When multiple lines share identical amounts, transactions are intelligently paired by matching dates and memo descriptions before falling back to index sequence.
- **Dashed Placeholder Rows**: Unpaired or discrepant transactions render an empty placeholder slot on the missing side (`— No counterpart line in [Peer] —`), ensuring the tables never drift vertically.
- **Discrepancy Marking**: Lines causing variances are highlighted in soft rose with `⚠ Discrepant` badges, while exact pairs are tagged `✓ Matched`.
- **3-Way View Order Switcher**: Toggle instantly between **`Discrepancies First`** (pins problem lines causing the variance right at the top), **`By Amount`** (ordered largest to smallest value), and **`File Order`** (original spreadsheet order).
- **Synchronized Hover**: Hovering over any line highlights both counterpart rows simultaneously across ledgers.

---

## Project Structure & Development

```text
Andrula/
├── index.html              # Core single-page application (HTML, CSS, JS)
├── README.md               # Documentation and operator guide
├── .gitignore              # Git ignore rules for node_modules, temp files, and test exports
├── docs/                   # Architectural plans and specifications
│   └── superpowers/
│       ├── plans/          # Implementation plans
│       └── specs/          # Design specifications
└── scratch/                # Unit test suites and verification scripts
    ├── test_universal_mode.js
    └── test_pair_drilldown_lines.js
```

### Running Automated Tests

You can run the included test suites using Node.js:

```bash
# Test universal 2-option mode & file format ingestion
node scratch/test_universal_mode.js

# Test side-by-side paired drill-down algorithm
node scratch/test_pair_drilldown_lines.js
```

---

## License

MIT License. Feel free to use, modify, and adapt this tool for your accounting workflows.