# Andrula

A browser-based utility for reconciling accounting transactions between QuickBooks exports and WIP (Work In Progress) ledgers.

It processes spreadsheets entirely inside your web browser. No files, ledger balances, or financial details are ever uploaded to a server or sent over the internet.

---

## Features

- **Flexible File Upload**:
  - **Single Workbook**: Upload one Excel file containing both QuickBooks and WIP sheets.
  - **Two Separate Files**: Upload QuickBooks and WIP Ledger exports independently.
- **Automatic Detection with Manual Control**:
  - Automatically identifies common sheet names (`QuickBooks`, `QB`, `WIP`, `Ledger`) and columns (`No.`, `Ref No`, `Amount`, `Date`, `Memo/Description`).
  - Optional settings panel to manually choose sheets or customize variance tolerance.
- **Detailed Discrepancy Breakdown**:
  - Categorizes records by status: *Amount Mismatch*, *Missing in QuickBooks*, *Missing in WIP Ledger*, or *Line Count Difference*.
  - Real-time search and status filters.
- **Interactive Drill-Down**:
  - Click any row to view side-by-side transaction entries from both ledgers.
  - Automatically marks matched entries, discrepant amounts, and missing records.
- **Multi-Currency Support**:
  - Formats numbers in AED (default for UAE), USD, EUR, GBP, IDR, SGD, or AUD.
- **Excel Export**:
  - Download reconciliation results directly into a structured `.xlsx` spreadsheet.
- **100% Client-Side Privacy**:
  - Powered by SheetJS and vanilla JavaScript running directly on your machine.

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
