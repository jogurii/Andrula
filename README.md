# Andrula

A modular, browser-based financial and ledger reconciliation engine for accountants, designed to reconcile QuickBooks exports, WIP subledgers, vendor statements, and custom accounting schedules.

---

## Features

- **Three Reconciliation Modes**:
  - **Single Workbook**: Upload one Excel file containing both QuickBooks and WIP sheets.
  - **Two Separate Files**: Upload QuickBooks and WIP Ledger exports independently.
  - **Supplier Statement vs QuickBooks**: Reconcile external vendor statements (PDF or Excel) directly against your QuickBooks Accounts Payable (AP) ledger.
- **Automatic Detection with Manual Control**:
  - Automatically identifies common sheet names (`QuickBooks`, `QB`, `WIP`, `Ledger`) and columns (`No.`, `Ref No`, `Amount`, `Date`, `Memo/Description`).
  - Optional settings panel to manually choose sheets or customize variance tolerance.
- **Detailed Discrepancy Breakdown & Audit Triage**:
  - Categorizes records by status: *Amount Mismatch*, *Missing in QuickBooks*, *Missing in WIP Ledger*, or *Line Count Difference*.
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
  - Formats numbers in AED (default for UAE), USD, EUR, GBP, IDR, SGD, or AUD.
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
| <kbd>1</kbd> | **Single Workbook Mode** | Switches to 1 Excel File (QB + WIP sheets) mode |
| <kbd>2</kbd> | **Dual File Mode** | Switches to 2 Separate Files (QB & WIP) mode |
| <kbd>3</kbd> | **Supplier Statement Mode** | Switches to Supplier Statement vs QuickBooks mode |

> [!TIP]
> **Accountant Rapid-Triage Workflow**: Click any discrepant row to inspect details. Press <kbd>M</kbd> to mark as reviewed, then press <kbd>→</kbd> to cycle to the next issue instantly without moving your hands to your mouse.
>
> *Note: Single-letter shortcuts are automatically ignored when you are actively typing inside an input field or text area.*

---

## Quick Start

You do not need to install Node.js, databases, or build tools.

1. Download or clone this repository.
2. Double-click `index.html` to open it in any modern browser (Chrome, Edge, Safari, Firefox).
3. Drag and drop your spreadsheet(s) into the upload area.

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

Andrula works with standard Excel files (`.xlsx` or `.xls`). The parser looks for the following columns within the first 20 rows of each sheet:

| Field | Recognized Header Names |
| :--- | :--- |
| **Reference Number** | `No.`, `No`, `Ref No`, `Reference`, `Num`, `Ref`, `Doc No`, `Transaction` |
| **Amount** | `Amount`, `Amt`, `Nominal`, `Net Amount`, `Total` |
| **Date** *(optional)* | `Date`, `Tanggal`, `Trans Date` |
| **Description** *(optional)* | `Memo`, `Description`, `Desc`, `Name`, `Vendor`, `Particulars` |

If your file uses custom headers or sheet names, open the **"Sheet & Column Settings"** panel on the page to select them manually.

---

## License

MIT License. Feel free to use, modify, and adapt this tool for your accounting workflows.