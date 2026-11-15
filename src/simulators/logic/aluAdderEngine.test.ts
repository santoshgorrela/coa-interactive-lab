import test from 'node:test';
import assert from 'node:assert/strict';
import {
  carryLookAheadAdder,
  encodeIeee754Single,
  fullAdder,
  halfAdder,
  rippleCarryAdder,
  runAlu,
  runBoothMultiply,
  runRestoringDivision,
} from './aluAdderEngine.ts';

test('Half Adder and Full Adder compute exact Sum and Carry', () => {
  assert.deepEqual(halfAdder(1, 1), { a: 1, b: 1, sum: 0, carry: 1 });
  const fa = fullAdder(1, 1, 1);
  assert.equal(fa.sum, 1);
  assert.equal(fa.cout, 1);
});

test('Ripple Carry Adder and Carry Look-Ahead Adder produce identical 4-bit sums and carries', () => {
  for (let a = 0; a < 16; a += 3) {
    for (let b = 0; b < 16; b += 5) {
      for (const cin of [0, 1] as const) {
        const rca = rippleCarryAdder(a, b, cin, 4);
        const cla = carryLookAheadAdder(a, b, cin);
        assert.equal(rca.sumBinaryMsb, cla.sumBinaryMsb);
        assert.equal(rca.cout, cla.cout);
        assert.equal(rca.decimalTotal, a + b + cin);
        assert.ok(cla.claGateDelays < rca.gateDelays);
      }
    }
  }
});

test('ALU executes ADD, SUB, AND, OR, XOR, NOT and sets C, Z, V, N flags accurately', () => {
  const addOverflow = runAlu(7, 2, 'ADD', 4); // +7 + +2 = +9 -> overflows signed 4-bit (-8..7)
  assert.equal(addOverflow.resultUnsigned, 9);
  assert.equal(addOverflow.overflow, true);
  assert.equal(addOverflow.negative, true);
  assert.equal(addOverflow.zero, false);

  const subZero = runAlu(5, 5, 'SUB', 4);
  assert.equal(subZero.resultUnsigned, 0);
  assert.equal(subZero.zero, true);
  assert.equal(subZero.cout, 1);
  assert.equal(subZero.overflow, false);

  const andRes = runAlu(0b1100, 0b1010, 'AND', 4);
  assert.equal(andRes.resultBinary, '1000');

  const notRes = runAlu(0b0101, 0, 'NOT', 4);
  assert.equal(notRes.resultBinary, '1010');
});

test('Booth Multiplication and Restoring Division yield accurate results', () => {
  const booth1 = runBoothMultiply(-5, 3);
  assert.equal(booth1.product, -15);
  assert.equal(booth1.steps.length, 5);

  const booth2 = runBoothMultiply(-3, -4);
  assert.equal(booth2.product, 12);

  const div = runRestoringDivision(13, 3);
  assert.equal(div.quotient, 4);
  assert.equal(div.remainder, 1);
});

test('IEEE 754 Single Precision encodes standard, zero, and infinity values', () => {
  const neg6 = encodeIeee754Single(-6.5);
  assert.equal(neg6.signBit, 1);
  assert.equal(neg6.biasedExponent, 129);
  assert.equal(neg6.unbiasedExponent, 2);
  assert.equal(neg6.hex, '0xC0D00000');
  assert.equal(neg6.classification, 'Normalized');

  assert.equal(encodeIeee754Single(0).classification, 'Zero');
  assert.equal(encodeIeee754Single(Infinity).classification, 'Infinity');
});
