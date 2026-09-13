const assert = require('assert');
const fs = require('fs');
const path = require('path');

const htmlPath = fs.existsSync(path.join(process.cwd(), 'index.html'))
  ? path.join(process.cwd(), 'index.html')
  : path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(htmlPath, 'utf8');

try {
  // Test 1: Mode selector markup should have exactly 2 clean tabs: tabDualMode and tabSingleMode
  assert(indexHtml.includes('id="tabDualMode"'), 'Must have tabDualMode');
  assert(indexHtml.includes('id="tabSingleMode"'), 'Must have tabSingleMode');
  assert(!indexHtml.includes('id="tabSupplierMode"'), 'tabSupplierMode tab should be removed in favor of universal 2-mode layout');
  console.log('✓ Test 1 Passed: Mode selector has streamlined 2-tab layout.');

  // Test 2: File inputs for both Side A and Side B must accept .xlsx, .xls, .csv, .pdf
  const dual1Match = indexHtml.match(/<input[^>]+id="fileInputQB"[^>]+>/i);
  assert(dual1Match, 'Must find fileInputQB');
  assert(dual1Match[0].includes('.pdf') && dual1Match[0].includes('.csv') && dual1Match[0].includes('.xlsx'), 'fileInputQB must accept pdf, csv, xlsx');

  const dual2Match = indexHtml.match(/<input[^>]+id="fileInputWIP"[^>]+>/i);
  assert(dual2Match, 'Must find fileInputWIP');
  assert(dual2Match[0].includes('.pdf') && dual2Match[0].includes('.csv') && dual2Match[0].includes('.xlsx'), 'fileInputWIP must accept pdf, csv, xlsx');
  console.log('✓ Test 2 Passed: Both Side A and Side B inputs accept .xlsx, .xls, .csv, and .pdf.');

  // Test 3: Normalization logic - legacy mode 'supplier' must normalize to 'dual'
  const normMatch = indexHtml.includes("mode = (mode === 'supplier') ? 'dual' : mode") ||
                    indexHtml.includes("if (mode === 'supplier') mode = 'dual'") ||
                    indexHtml.includes("currentMode = (mode === 'supplier' ? 'dual' : mode)");
  assert(normMatch, 'Must normalize legacy mode "supplier" to "dual"');
  console.log('✓ Test 3 Passed: Legacy "supplier" mode is automatically normalized to "dual".');

  // Test 4: Dynamic recipe label updater updates Side A and Side B titles
  assert(indexHtml.includes('updateLabelsForMode'), 'Must have updateLabelsForMode function');
  console.log('✓ Test 4 Passed: Dynamic recipe label updater present.');

  console.log('\nALL UNIVERSAL MODE TESTS PASSED!');
} catch (err) {
  console.error('Test Failed:', err.message);
  process.exit(1);
}
