# Design Spec: Side-by-Side Paired Ledger Alignment in Drill-Down Detail Modal

## 1. Overview
In the reconciliation drill-down detail modal (`#drilldownModal`), transactions from Side A (QuickBooks) and Side B (WIP Ledger) are currently rendered as two independent tables in their raw file ingestion order. When an accountant reviews a voucher with many lines, matching transactions sit on disparate row indices (e.g., line 1 on the left matches line 8 on the right), creating heavy cognitive friction and visual disorientation.

This design introduces **Side-by-Side Paired Ledger Alignment**:
- Each matched transaction in QuickBooks is aligned directly across from its counterpart in the WIP Ledger on the exact same horizontal row baseline.
- Unmatched or discrepant lines are placed on dedicated rows with an empty counterpart placeholder (`— No counterpart line —`), ensuring the two tables never drift out of sync.
- Discrepancies are pinned to the top by default so accountants see what is causing the variance immediately, supported by a 3-way sort toggle (`Discrepancies First`, `By Amount`, `File Order`).
- Paired rows feature synchronized hover states for effortless cross-ledger tracking.

---

## 2. Architecture & Data Flow

### 2.1 Smart Pairing Algorithm (`pairDrilldownLines`)
Input: `qbRows` (Array), `wipRows` (Array), `formulaType` (String), `tolerance` (Number).

1. **Candidate Pool Creation**:
   - Clone `qbRows` and `wipRows`, tagging each item with its original index (`origIndex`) and initial status `'unmatched'`.
2. **Scored Match Scoring**:
   - For each unmatched `qb` line, find all candidate `wip` lines where `|variance(qb.amount, wip.amount)| <= tolerance`.
   - If multiple candidates exist, rank them by a tie-break score:
     - Date match: +10 points (exact date match)
     - Description similarity: +5 points (Levenshtein or token overlap)
     - Index proximity: +1 point
   - Bind the highest-scoring candidate to form a `matched` pair:
     `{ type: 'matched', qb, wip, sortAmount: Math.abs(qb.amount), date: qb.date || wip.date }`
3. **Split-Transaction Handling**:
   - If total net sum of the voucher is balanced (`|netVariance| <= tolerance`), remaining unmatched lines are tagged as `'split_match'`.
4. **Unpaired Line Binding**:
   - Remaining unmatched QuickBooks lines become:
     `{ type: 'discrepant_qb', qb: qbLine, wip: null, sortAmount: Math.abs(qbLine.amount), date: qbLine.date }`
   - Remaining unmatched WIP lines become:
     `{ type: 'discrepant_wip', qb: null, wip: wipLine, sortAmount: Math.abs(wipLine.amount), date: wipLine.date }`
5. **Output**: An array of `ComparisonRow` objects.

### 2.2 Sorting Modes (`modalSortMode`)
The user can switch sorting modes via a segmented toggle in the modal toolbar:
- **`discrepancies` (Default)**:
  1. Discrepant / Unmatched rows first (`discrepant_qb`, `discrepant_wip`)
  2. Split-matched rows (`split_match`)
  3. Matched pairs (`matched`), ordered by `sortAmount` descending.
- **`amount`**:
  - All rows ordered by `sortAmount` descending (largest to smallest value).
- **`file_order`**:
  - Preserves original raw file order: rows are ordered by `min(qb?.origIndex ?? Infinity, wip?.origIndex ?? Infinity)`.

---

## 3. UI Component Structure

### 3.1 Modal Toolbar Sort Controls
Add a compact segmented button control in the modal header next to the navigation controls:
```html
<div class="drilldown-sort-group">
  <span class="drilldown-sort-label">Sort:</span>
  <div class="btn-group-segmented">
    <button class="btn-segment active" data-sort="discrepancies">Discrepancies First</button>
    <button class="btn-segment" data-sort="amount">By Amount</button>
    <button class="btn-segment" data-sort="file_order">File Order</button>
  </div>
</div>
```

### 3.2 Synchronized Dual Table Layout
- Both `.drilldown-panel` elements render a `<table>` with identical numbers of rows $N$.
- Row $i$ in `modalQBRowsBody` and row $i$ in `modalWIPRowsBody` correspond to the exact same `ComparisonRow[i]`.
- Row heights are matched via CSS (`min-height: 42px; line-height: 1.4; vertical-align: middle;`).
- When a side is `null` (e.g. `wip === null`):
  ```html
  <tr class="row-placeholder" data-row-index="${i}">
    <td colspan="4" class="empty-counterpart-cell">
      <span class="empty-counterpart-pill">— No counterpart line in WIP Ledger —</span>
    </td>
  </tr>
  ```
- When a side is present:
  ```html
  <tr class="${rowClass}" data-row-index="${i}">
    <td class="td-date">${escapeHtml(r.date || '-')}</td>
    <td class="td-desc">${escapeHtml(r.description || 'No description provided')}</td>
    <td class="td-amount">${formatMoney(r.amount)}</td>
    <td class="td-status">${pillHtml}</td>
  </tr>
  ```

### 3.3 Synchronized Hover Interaction
- On mouse enter of `tr[data-row-index="i"]` in either table:
  - Add `.is-hovered` class to both `qbTbody.querySelector('tr[data-row-index="i"]')` and `wipTbody.querySelector('tr[data-row-index="i"]')`.
- On mouse leave:
  - Remove `.is-hovered` from both rows.
- Style `.is-hovered`: subtle background highlight (`var(--blossom-50)` or `rgba(224, 90, 119, 0.08)` for discrepant, `rgba(107, 142, 114, 0.08)` for matched).

---

## 4. Edge Cases & Error Handling
1. **Single-Ledger Vouchers (`qbLines === 0` or `wipLines === 0`)**:
   - The modal retains the 64/36 asymmetric missing card layout. Sorting toggle is disabled/hidden since only one side exists.
2. **Identical Amounts**:
   - Tie-breaking uses Date exact match and Description overlap before fallback to index, preventing mismatched memos (e.g. concrete slab vs steel rebar).
3. **Unequal Line Counts**:
   - Always produces $\max(\text{matched}) + \text{unmatched QB} + \text{unmatched WIP}$ rows, guaranteeing 100% horizontal alignment.
4. **Rounding Variances (e.g., AED 0.02 overall variance across matched lines)**:
   - Evaluates line variances against `currentTolerance`. If overall voucher is an `Amount Mismatch`, panel header badges accurately reflect the variance rather than falsely claiming `All Lines Matched`.

---

## 5. Verification Plan
1. **Automated Unit Tests**:
   - Test `pairDrilldownLines` with:
     - 1-to-1 exact amount matches in scrambled order.
     - Identical amounts with differing dates (verifying smart tie-break).
     - Split amounts (1 line vs 2 lines).
     - Unmatched lines on Side A and Side B.
     - All 3 sorting modes (`discrepancies`, `amount`, `file_order`).
2. **Browser Subagent Testing**:
   - Open voucher with 28 lines (e.g. `JVT-18458`).
   - Verify matched lines sit on the exact same vertical row.
   - Verify hover on row $i$ highlights both sides.
   - Click sort buttons and verify instant re-ordering without glitches.
   - Verify single-sided missing vouchers remain pristine.
