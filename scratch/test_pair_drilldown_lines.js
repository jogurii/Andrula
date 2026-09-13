const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Extract pairDrilldownLines from index.html
const htmlPath = fs.existsSync(path.join(process.cwd(), 'index.html'))
  ? path.join(process.cwd(), 'index.html')
  : path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(htmlPath, 'utf8');

// We test both directly in Node context and extracted from index.html
function getPairDrilldownLinesFunction() {
  const funcMatch = indexHtml.match(/function\s+pairDrilldownLines\s*\([\s\S]*?^    \}/m);
  if (!funcMatch) {
    throw new Error('pairDrilldownLines function not found in index.html');
  }
  // Also need calculateVariance helper
  const calcMatch = indexHtml.match(/function\s+calculateVariance\s*\([\s\S]*?^    \}/m);
  const code = (calcMatch ? calcMatch[0] : '') + '\n' + funcMatch[0] + '\nreturn pairDrilldownLines;';
  return new Function(code)();
}

try {
  const pairDrilldownLines = getPairDrilldownLinesFunction();

  // Test 1: 1-to-1 exact amount matching across scrambled order
  {
    const qbRows = [
      { date: '2026-06-30', description: 'Concrete A', amount: -57454.66 },
      { date: '2026-06-30', description: 'Rebar B', amount: -42339.78 },
      { date: '2026-06-30', description: 'Tiles C', amount: -23962.03 }
    ];
    // WIP in reversed/scrambled order
    const wipRows = [
      { date: '2026-06-29', description: 'Tiles C WIP', amount: -23962.03 },
      { date: '2026-06-29', description: 'Concrete A WIP', amount: -57454.66 },
      { date: '2026-06-29', description: 'Rebar B WIP', amount: -42339.78 }
    ];

    const pairs = pairDrilldownLines(qbRows, wipRows, 'standard', 0.01, 'amount');
    assert.strictEqual(pairs.length, 3, 'Should have exactly 3 paired rows');
    assert.strictEqual(pairs[0].qb.amount, -57454.66);
    assert.strictEqual(pairs[0].wip.amount, -57454.66);
    assert.strictEqual(pairs[0].status, 'matched');

    assert.strictEqual(pairs[1].qb.amount, -42339.78);
    assert.strictEqual(pairs[1].wip.amount, -42339.78);
    assert.strictEqual(pairs[1].status, 'matched');

    assert.strictEqual(pairs[2].qb.amount, -23962.03);
    assert.strictEqual(pairs[2].wip.amount, -23962.03);
    assert.strictEqual(pairs[2].status, 'matched');
    console.log('✓ Test 1 Passed: 1-to-1 exact matching in scrambled order aligns perfectly.');
  }

  // Test 2: Unpaired lines generate empty counterpart on opposite side
  {
    const qbRows = [
      { date: '2026-06-30', description: 'Concrete', amount: -50000 },
      { date: '2026-06-30', description: 'Extra QB Line', amount: -10000 }
    ];
    const wipRows = [
      { date: '2026-06-30', description: 'Concrete', amount: -50000 },
      { date: '2026-06-30', description: 'Extra WIP Line', amount: -5000 }
    ];

    const pairs = pairDrilldownLines(qbRows, wipRows, 'standard', 0.01, 'discrepancies');
    assert.strictEqual(pairs.length, 3, 'Should produce 3 rows (2 discrepant + 1 matched)');

    // Discrepant rows must be pinned at top in 'discrepancies' mode
    const topRows = pairs.slice(0, 2);
    const hasDiscrepantQB = topRows.some(p => p.status === 'discrepant_qb' && p.qb !== null && p.wip === null);
    const hasDiscrepantWIP = topRows.some(p => p.status === 'discrepant_wip' && p.qb === null && p.wip !== null);
    assert(hasDiscrepantQB, 'Should have an unpaired QB line with null WIP counterpart');
    assert(hasDiscrepantWIP, 'Should have an unpaired WIP line with null QB counterpart');

    // Last row should be matched
    assert.strictEqual(pairs[2].status, 'matched');
    assert.strictEqual(pairs[2].qb.amount, -50000);
    assert.strictEqual(pairs[2].wip.amount, -50000);
    console.log('✓ Test 2 Passed: Unpaired lines generate placeholders and discrepancies are pinned at top.');
  }

  // Test 3: Smart tie-breaking on identical amounts with different dates
  {
    const qbRows = [
      { date: '2026-06-15', description: 'Payment 1', amount: -20000 },
      { date: '2026-06-25', description: 'Payment 2', amount: -20000 }
    ];
    const wipRows = [
      { date: '2026-06-25', description: 'WIP Payment 2', amount: -20000 },
      { date: '2026-06-15', description: 'WIP Payment 1', amount: -20000 }
    ];

    const pairs = pairDrilldownLines(qbRows, wipRows, 'standard', 0.01, 'file_order');
    assert.strictEqual(pairs.length, 2);
    // Line 1 should pair 06-15 with 06-15
    const pair15 = pairs.find(p => p.qb.date === '2026-06-15');
    assert.strictEqual(pair15.wip.date, '2026-06-15', 'Should pair identical amounts by matching date');
    console.log('✓ Test 3 Passed: Smart tie-breaking on identical amounts pairs by matching date.');
  }

  // Test 4: Sorting mode 'file_order' preserves initial sequence
  {
    const qbRows = [
      { date: '2026-06-01', description: 'First', amount: -100 },
      { date: '2026-06-02', description: 'Second', amount: -900 }
    ];
    const wipRows = [
      { date: '2026-06-02', description: 'Second', amount: -900 },
      { date: '2026-06-01', description: 'First', amount: -100 }
    ];

    const pairs = pairDrilldownLines(qbRows, wipRows, 'standard', 0.01, 'file_order');
    assert.strictEqual(pairs[0].qb.description, 'First');
    assert.strictEqual(pairs[1].qb.description, 'Second');
    console.log('✓ Test 4 Passed: File Order preserves original file sequence.');
  }

  console.log('\nALL pairDrilldownLines UNIT TESTS PASSED!');
} catch (err) {
  console.error('Test Failed:', err.message);
  process.exit(1);
}
