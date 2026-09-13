# Side-by-Side Paired Ledger Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide side-by-side aligned line comparisons in the drill-down detail modal, pairing each QuickBooks line with its WIP counterpart on the same horizontal row, pinning discrepancies to the top, and offering sort toggles.

**Architecture:** A smart pairing engine (`pairDrilldownLines`) scores and binds 1-to-1 counterparts with date/memo tie-breaking, produces unified `ComparisonRow` objects, and renders synchronized dual tables with empty placeholder rows on missing sides and bi-directional hover highlighting.

**Tech Stack:** Vanilla JavaScript (ES6+), pure CSS flex/grid and tabular styling, SheetJS, PDF.js, Node.js test runner.

---

### Task 1: Smart Pairing Algorithm & Unit Tests

**Files:**
- Create: `scratch/test_pair_drilldown_lines.js`
- Modify: `index.html` (add `pairDrilldownLines` helper)

- [ ] **Step 1: Write unit test suite for line pairing and sorting**
  - Create `scratch/test_pair_drilldown_lines.js` testing:
    - 1-to-1 exact amount matching across scrambled orders.
    - Unpaired lines generating empty placeholders on the missing side (`qb === null` or `wip === null`).
    - Smart tie-breaking on identical amounts with different dates.
    - Sorting modes: `discrepancies`, `amount`, and `file_order`.
- [ ] **Step 2: Run test to verify it fails initially**
  - Run: `node scratch/test_pair_drilldown_lines.js`
  - Expected: FAIL (function not yet implemented)
- [ ] **Step 3: Implement `pairDrilldownLines` in `index.html`**
  - Implement function supporting formula variance, tolerance matching, date/memo score tie-breaking, and multi-mode sorting.
- [ ] **Step 4: Run test to verify it passes**
  - Run: `node scratch/test_pair_drilldown_lines.js`
  - Expected: PASS
- [ ] **Step 5: Commit**
  - Run: `git add index.html scratch/test_pair_drilldown_lines.js; git commit -m "feat: add pairDrilldownLines algorithm with smart tie-breaking and sorting"`

---

### Task 2: Modal Toolbar Sort Controls & Table Styling

**Files:**
- Modify: `index.html` (CSS & HTML markup)

- [ ] **Step 1: Add CSS for paired rows, empty placeholders, and synchronized hover**
  - Add `.drilldown-sort-group` and `.btn-group-segmented` styles.
  - Add `.row-placeholder` and `.empty-counterpart-cell` styles (subtle dashed border, centered muted pill `— No counterpart in [Peer] —`).
  - Add `.drilldown-table tr.is-hovered` styles for synchronized cross-ledger highlighting.
  - Enforce consistent row heights (`min-height: 44px; height: 44px; vertical-align: middle;`) so tables remain vertically locked.
- [ ] **Step 2: Add Sort Toggle HTML markup in `#drilldownModal` header**
  - Add segmented buttons: `Discrepancies First` (default active), `By Amount`, and `File Order`.
- [ ] **Step 3: Commit**
  - Run: `git add index.html; git commit -m "style: add sort controls and synchronized row styling to drilldown modal"`

---

### Task 3: Modal Rendering Integration & Synchronized Interaction

**Files:**
- Modify: `index.html` (`openDrilldownModal` & sort event listeners)

- [ ] **Step 1: Integrate `pairDrilldownLines` into `openDrilldownModal`**
  - Call `pairDrilldownLines` when building the modal rows.
  - Render row $i$ in `modalQBRowsBody` and row $i$ in `modalWIPRowsBody` simultaneously from `comparisonRows[i]`.
  - If a side is `null`, render `<tr class="row-placeholder" data-row-index="${i}"><td colspan="4" class="empty-counterpart-cell"><span class="empty-counterpart-pill">— No counterpart line in [Peer] —</span></td></tr>`.
- [ ] **Step 2: Add Synchronized Hover Listeners**
  - On mouseover of `tr[data-row-index]`, toggle `.is-hovered` on the corresponding row in both tables.
- [ ] **Step 3: Wire Up Sort Segment Buttons**
  - Clicking a segment button updates `currentModalSortMode` and re-renders the rows immediately without reloading the modal.
- [ ] **Step 4: Update Panel Header Badges**
  - Display actual line discrepancies (e.g. `2 Discrepant Lines`) when voucher has an amount mismatch.
- [ ] **Step 5: Commit**
  - Run: `git add index.html; git commit -m "feat: integrate paired row rendering and synced hover in drilldown modal"`

---

### Task 4: Regression Testing & Browser Subagent Verification

**Files:**
- Modify: `scratch/run_all_tests.js`
- Test: Live browser subagent verification

- [ ] **Step 1: Update `run_all_tests.js` to include `test_pair_drilldown_lines.js`**
  - Run: `node scratch/run_all_tests.js`
  - Expected: ALL 10 TEST SUITES PASSED CLEANLY
- [ ] **Step 2: Launch browser subagent to verify live UI**
  - Load demo dataset.
  - Open voucher `JVT-18458` (28 lines).
  - Verify side-by-side alignment of all lines.
  - Verify empty counterpart cells for unmatched lines.
  - Click sort options and confirm smooth re-sorting.
  - Take visual screenshot.
- [ ] **Step 3: Update `walkthrough.md` with screenshots and documentation**
- [ ] **Step 4: Commit**
  - Run: `git add scratch/run_all_tests.js walkthrough.md; git commit -m "test: verify side-by-side paired drilldown modal and update walkthrough"`
