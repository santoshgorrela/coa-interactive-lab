import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeBooleanExpression,
  asciiAndParity,
  bcdAddSingleDigits,
  binaryToGray,
  computeComplement,
  convertNumberBase,
  decimalToBcd,
  decimalToExcess3,
  evaluateDeMorgan,
  evaluateGate,
  grayToBinary,
} from './booleanEngine.ts';

test('evaluateGate produces correct logic truth values for all 7 gates', () => {
  assert.equal(evaluateGate('AND', 1, 1), 1);
  assert.equal(evaluateGate('AND', 1, 0), 0);
  assert.equal(evaluateGate('OR', 0, 1), 1);
  assert.equal(evaluateGate('NOT', 1), 0);
  assert.equal(evaluateGate('NAND', 1, 1), 0);
  assert.equal(evaluateGate('NOR', 0, 0), 1);
  assert.equal(evaluateGate('XOR', 1, 0), 1);
  assert.equal(evaluateGate('XOR', 1, 1), 0);
  assert.equal(evaluateGate('XNOR', 0, 0), 1);
});

test('evaluateDeMorgan proves Law 1 and Law 2 across all 4 input combinations', () => {
  for (const law of [1, 2] as const) {
    for (const a of [0, 1] as const) {
      for (const b of [0, 1] as const) {
        const res = evaluateDeMorgan(law, a, b);
        assert.equal(res.equivalent, true, `Law ${law} failed for A=${a}, B=${b}`);
        assert.equal(res.lhsOut, res.rhsOut);
      }
    }
  }
});

test('Boolean expression parser evaluates expressions, canonical SOP, and equivalence comparison', () => {
  const deMorgan1 = analyzeBooleanExpression("(A + B)' = A' * B'");
  assert.equal(deMorgan1.isComparison, true);
  assert.equal(deMorgan1.areEquivalent, true);
  assert.deepEqual(deMorgan1.minterms, [0]);

  const xorCheck = analyzeBooleanExpression('A ^ B = A\'B + AB\'');
  assert.equal(xorCheck.areEquivalent, true);
  assert.deepEqual(xorCheck.minterms, [1, 2]);
  assert.equal(xorCheck.canonicalSop, "A'·B + A·B'");

  const nonEquiv = analyzeBooleanExpression('A + B = A · B');
  assert.equal(nonEquiv.areEquivalent, false);
});

test('Radix, Gray, BCD, Excess-3, complements, and parity conversions work accurately', () => {
  const conv = convertNumberBase('2A', 16);
  assert.equal(conv.valid, true);
  assert.equal(conv.decimal, 42);
  assert.equal(conv.binary, '101010');
  assert.equal(conv.octal, '52');

  const gray = binaryToGray('1011');
  assert.equal(gray, '1110');
  assert.equal(grayToBinary(gray), '1011');

  assert.equal(decimalToBcd(29), '0010 1001');
  assert.equal(decimalToExcess3(29), '0101 1100');

  const bcdSum = bcdAddSingleDigits(7, 8);
  assert.equal(bcdSum.needsCorrection, true);
  assert.equal(bcdSum.bcdDigits, '0001 0101');

  assert.equal(computeComplement('0101', '1s'), '1010');
  assert.equal(computeComplement('0101', '2s'), '1011');

  const parity = asciiAndParity('A', 'even');
  assert.equal(parity[0].bin7, '1000001');
  assert.equal(parity[0].parityBit, 0);
});
