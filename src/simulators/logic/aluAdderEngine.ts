export interface HalfAdderResult {
  a: 0 | 1;
  b: 0 | 1;
  sum: 0 | 1;
  carry: 0 | 1;
}

export function halfAdder(a: 0 | 1, b: 0 | 1): HalfAdderResult {
  return {
    a,
    b,
    sum: a !== b ? 1 : 0,
    carry: a === 1 && b === 1 ? 1 : 0,
  };
}

export interface FullAdderResult {
  a: 0 | 1;
  b: 0 | 1;
  cin: 0 | 1;
  half1Sum: 0 | 1;
  half1Carry: 0 | 1;
  half2Carry: 0 | 1;
  sum: 0 | 1;
  cout: 0 | 1;
  p: 0 | 1;
  g: 0 | 1;
}

export function fullAdder(a: 0 | 1, b: 0 | 1, cin: 0 | 1): FullAdderResult {
  const h1 = halfAdder(a, b);
  const h2 = halfAdder(h1.sum, cin);
  const cout: 0 | 1 = h1.carry === 1 || h2.carry === 1 ? 1 : 0;
  return {
    a,
    b,
    cin,
    half1Sum: h1.sum,
    half1Carry: h1.carry,
    half2Carry: h2.carry,
    sum: h2.sum,
    cout,
    p: h1.sum,
    g: h1.carry,
  };
}

export interface RippleAdderStage extends FullAdderResult {
  bitIndex: number; // 0 = LSB, 3 = MSB
}

export interface RippleCarryResult {
  stages: RippleAdderStage[];
  sumBitsLsb: (0 | 1)[];
  aBinaryMsb: string;
  bBinaryMsb: string;
  sumBinaryMsb: string;
  cout: 0 | 1;
  decimalA: number;
  decimalB: number;
  decimalTotal: number;
  gateDelays: number;
}

export function toBitArrayLsb(value: number, width: number): (0 | 1)[] {
  const mask = (1 << width) - 1;
  const v = value & mask;
  const bits: (0 | 1)[] = [];
  for (let i = 0; i < width; i++) {
    bits.push(((v >> i) & 1) === 1 ? 1 : 0);
  }
  return bits;
}

export function bitsLsbToMsbString(bits: (0 | 1)[]): string {
  return [...bits].reverse().join('');
}

export function rippleCarryAdder(aVal: number, bVal: number, cin: 0 | 1 = 0, width = 4): RippleCarryResult {
  const aBits = toBitArrayLsb(aVal, width);
  const bBits = toBitArrayLsb(bVal, width);
  const stages: RippleAdderStage[] = [];
  const sumBitsLsb: (0 | 1)[] = [];

  let carry = cin;
  for (let i = 0; i < width; i++) {
    const res = fullAdder(aBits[i], bBits[i], carry);
    stages.push({ ...res, bitIndex: i });
    sumBitsLsb.push(res.sum);
    carry = res.cout;
  }

  const decimalA = aVal & ((1 << width) - 1);
  const decimalB = bVal & ((1 << width) - 1);
  return {
    stages,
    sumBitsLsb,
    aBinaryMsb: bitsLsbToMsbString(aBits),
    bBinaryMsb: bitsLsbToMsbString(bBits),
    sumBinaryMsb: bitsLsbToMsbString(sumBitsLsb),
    cout: carry,
    decimalA,
    decimalB,
    decimalTotal: decimalA + decimalB + cin,
    gateDelays: width * 2 + 1, // standard 2n+1 / ~2n carry ripple delays
  };
}

export interface ClaResult {
  p: (0 | 1)[];
  g: (0 | 1)[];
  carries: (0 | 1)[]; // [c0, c1, c2, c3, c4]
  sumBitsLsb: (0 | 1)[];
  sumBinaryMsb: string;
  cout: 0 | 1;
  equations: string[];
  claGateDelays: number;
  rcaGateDelays: number;
}

export function carryLookAheadAdder(aVal: number, bVal: number, cin: 0 | 1 = 0): ClaResult {
  const a = toBitArrayLsb(aVal, 4);
  const b = toBitArrayLsb(bVal, 4);

  const p: (0 | 1)[] = [];
  const g: (0 | 1)[] = [];
  for (let i = 0; i < 4; i++) {
    p.push(a[i] !== b[i] ? 1 : 0);
    g.push(a[i] === 1 && b[i] === 1 ? 1 : 0);
  }

  const c0 = cin;
  const c1: 0 | 1 = g[0] === 1 || (p[0] === 1 && c0 === 1) ? 1 : 0;
  const c2: 0 | 1 = g[1] === 1 || (p[1] === 1 && g[0] === 1) || (p[1] === 1 && p[0] === 1 && c0 === 1) ? 1 : 0;
  const c3: 0 | 1 =
    g[2] === 1 ||
    (p[2] === 1 && g[1] === 1) ||
    (p[2] === 1 && p[1] === 1 && g[0] === 1) ||
    (p[2] === 1 && p[1] === 1 && p[0] === 1 && c0 === 1)
      ? 1
      : 0;
  const c4: 0 | 1 =
    g[3] === 1 ||
    (p[3] === 1 && g[2] === 1) ||
    (p[3] === 1 && p[2] === 1 && g[1] === 1) ||
    (p[3] === 1 && p[2] === 1 && p[1] === 1 && g[0] === 1) ||
    (p[3] === 1 && p[2] === 1 && p[1] === 1 && p[0] === 1 && c0 === 1)
      ? 1
      : 0;

  const carries = [c0, c1, c2, c3, c4];
  const sumBitsLsb: (0 | 1)[] = [
    p[0] !== c0 ? 1 : 0,
    p[1] !== c1 ? 1 : 0,
    p[2] !== c2 ? 1 : 0,
    p[3] !== c3 ? 1 : 0,
  ];

  return {
    p,
    g,
    carries,
    sumBitsLsb,
    sumBinaryMsb: bitsLsbToMsbString(sumBitsLsb),
    cout: c4,
    equations: [
      `C1 = G0 + P0·C0 = ${g[0]} + ${p[0]}·${c0} = ${c1}`,
      `C2 = G1 + P1·G0 + P1·P0·C0 = ${c2}`,
      `C3 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0 = ${c3}`,
      `C4 = G3 + P3·G2 + P3·P2·G1 + P3·P2·P1·G0 + P3·P2·P1·P0·C0 = ${c4}`,
    ],
    claGateDelays: 4, // constant 3–4 gate delays regardless of 4-bit block
    rcaGateDelays: 9,
  };
}

// ---------- ALU Simulation Engine ----------

export type AluOperation = 'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'NOT';

export interface AluResult {
  op: AluOperation;
  width: 4 | 8;
  aUnsigned: number;
  bUnsigned: number;
  aSigned: number;
  bSigned: number;
  aBinary: string;
  bBinary: string;
  resultUnsigned: number;
  resultSigned: number;
  resultBinary: string;
  cin: 0 | 1;
  cout: 0 | 1;
  zero: boolean;
  overflow: boolean;
  negative: boolean;
  selectBits: { s2: 0 | 1; s1: 0 | 1; s0: 0 | 1; modeM: 0 | 1 };
  explanation: string;
}

export function toSigned(val: number, width: number): number {
  const mask = (1 << width) - 1;
  const u = val & mask;
  const signBit = 1 << (width - 1);
  return (u & signBit) !== 0 ? u - (1 << width) : u;
}

export function runAlu(
  aInput: number,
  bInput: number,
  op: AluOperation,
  width: 4 | 8 = 4,
  cin: 0 | 1 = 0,
): AluResult {
  const mask = (1 << width) - 1;
  const signBitMask = 1 << (width - 1);
  const a = aInput & mask;
  const b = bInput & mask;
  const signedA = toSigned(a, width);
  const signedB = toSigned(b, width);

  let res = 0;
  let cout: 0 | 1 = 0;
  let overflow = false;
  let effectiveCin = cin;
  let selectBits: AluResult['selectBits'] = { s2: 0, s1: 0, s0: 0, modeM: 0 };
  let explanation = '';

  switch (op) {
    case 'ADD': {
      const sum = a + b + cin;
      res = sum & mask;
      cout = sum > mask ? 1 : 0;
      const aSign = (a & signBitMask) !== 0;
      const bSign = (b & signBitMask) !== 0;
      const rSign = (res & signBitMask) !== 0;
      overflow = aSign === bSign && rSign !== aSign;
      selectBits = { s2: 0, s1: 1, s0: 1, modeM: 0 };
      explanation = `Arithmetic ADD: ${a} + ${b}${cin ? ' + 1 (Cin)' : ''} = ${res} (Cout=${cout}, V=${overflow ? 1 : 0}).`;
      break;
    }
    case 'SUB': {
      // A - B via 2's complement: A + (~B) + 1 (Mode M = 1, Cin = 1)
      effectiveCin = 1;
      const bComp = (~b) & mask;
      const diffSum = a + bComp + 1;
      res = diffSum & mask;
      cout = diffSum > mask ? 1 : 0; // Carry out of 2's complement adder
      const aSign = (a & signBitMask) !== 0;
      const bSign = (b & signBitMask) !== 0;
      const rSign = (res & signBitMask) !== 0;
      overflow = aSign !== bSign && rSign !== aSign;
      selectBits = { s2: 0, s1: 1, s0: 1, modeM: 1 };
      explanation = `2's Complement SUB (M=1): A + B' + 1 = ${a.toString(2).padStart(width, '0')} + ${bComp.toString(2).padStart(width, '0')} + 1 = ${res.toString(2).padStart(width, '0')}.`;
      break;
    }
    case 'AND': {
      res = a & b;
      selectBits = { s2: 0, s1: 0, s0: 0, modeM: 0 };
      explanation = `Bitwise AND across all ${width} slices: A · B.`;
      break;
    }
    case 'OR': {
      res = a | b;
      selectBits = { s2: 0, s1: 0, s0: 1, modeM: 0 };
      explanation = `Bitwise OR across all ${width} slices: A + B.`;
      break;
    }
    case 'XOR': {
      res = a ^ b;
      selectBits = { s2: 0, s1: 1, s0: 0, modeM: 0 };
      explanation = `Bitwise XOR across all ${width} slices: A ⊕ B.`;
      break;
    }
    case 'NOT': {
      res = (~a) & mask;
      selectBits = { s2: 1, s1: 0, s0: 0, modeM: 0 };
      explanation = `1's Complement NOT on operand A: A'.`;
      break;
    }
  }

  const resultSigned = toSigned(res, width);
  const negative = (res & signBitMask) !== 0;

  return {
    op,
    width,
    aUnsigned: a,
    bUnsigned: b,
    aSigned: signedA,
    bSigned: signedB,
    aBinary: a.toString(2).padStart(width, '0'),
    bBinary: b.toString(2).padStart(width, '0'),
    resultUnsigned: res,
    resultSigned,
    resultBinary: res.toString(2).padStart(width, '0'),
    cin: effectiveCin,
    cout,
    zero: res === 0,
    overflow,
    negative,
    selectBits,
    explanation,
  };
}

// ---------- Booth's Multiplication (4-bit Signed) ----------

export interface BoothStep {
  cycle: number;
  action: string;
  aBits: string;
  qBits: string;
  qMinus1: 0 | 1;
}

export function runBoothMultiply(multiplicand: number, multiplier: number): {
  m: number;
  q: number;
  steps: BoothStep[];
  product: number;
  productBinary8: string;
} {
  // Clamp signed 4-bit range -8..7 (avoiding -8 edge case display issues cleanly via 5-bit internal or 4-bit standard)
  const m = Math.max(-7, Math.min(7, Math.trunc(multiplicand)));
  const q = Math.max(-7, Math.min(7, Math.trunc(multiplier)));

  let A = 0;
  let Q = q & 0xf;
  let qMinus1: 0 | 1 = 0;
  const M4 = m & 0xf;

  const fmt4 = (n: number) => (n & 0xf).toString(2).padStart(4, '0');
  const steps: BoothStep[] = [
    { cycle: 0, action: 'Initialize A=0000, Q=Multiplier, Q-1=0', aBits: fmt4(A), qBits: fmt4(Q), qMinus1 },
  ];

  for (let cycle = 1; cycle <= 4; cycle++) {
    const q0 = Q & 1;
    let opDesc = '';
    if (q0 === 1 && qMinus1 === 0) {
      A = toSigned((A - M4) & 0xf, 4);
      opDesc = 'Q0Q-1 = 10 -> A = A - M, then ASR';
    } else if (q0 === 0 && qMinus1 === 1) {
      A = toSigned((A + M4) & 0xf, 4);
      opDesc = 'Q0Q-1 = 01 -> A = A + M, then ASR';
    } else {
      opDesc = `Q0Q-1 = ${q0}${qMinus1} -> No Add/Sub, ASR only`;
    }

    // Arithmetic Shift Right (A, Q, Q-1) across 9 bits
    const combined9: number = ((A & 0xf) << 5) | (Q << 1) | qMinus1;
    const signBit = (A & 0x8) !== 0 ? 1 : 0;
    const shifted: number = (combined9 >> 1) | (signBit << 8);
    A = toSigned((shifted >> 5) & 0xf, 4);
    Q = (shifted >> 1) & 0xf;
    qMinus1 = (shifted & 1) === 1 ? 1 : 0;

    steps.push({
      cycle,
      action: opDesc,
      aBits: fmt4(A),
      qBits: fmt4(Q),
      qMinus1,
    });
  }

  const product8 = ((A & 0xf) << 4) | (Q & 0xf);
  return {
    m,
    q,
    steps,
    product: toSigned(product8, 8),
    productBinary8: product8.toString(2).padStart(8, '0'),
  };
}

// ---------- Restoring Division (4-bit Unsigned) ----------

export interface DivisionStep {
  cycle: number;
  action: string;
  aBits: string;
  qBits: string;
}

export function runRestoringDivision(dividend: number, divisor: number): {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  steps: DivisionStep[];
} {
  const dv = Math.max(0, Math.min(15, Math.floor(dividend)));
  const dr = Math.max(1, Math.min(15, Math.floor(divisor)));

  let A = 0; // 5-bit signed accumulator
  let Q = dv & 0xf;
  const fmt5 = (n: number) => (n & 0x1f).toString(2).padStart(5, '0');
  const fmt4 = (n: number) => (n & 0xf).toString(2).padStart(4, '0');

  const steps: DivisionStep[] = [
    { cycle: 0, action: `Init A=00000, Q=${fmt4(Q)} (${dv}), M=${fmt5(dr)} (${dr})`, aBits: fmt5(A), qBits: fmt4(Q) },
  ];

  for (let cycle = 1; cycle <= 4; cycle++) {
    // Shift left (A, Q)
    const msbQ = (Q >> 3) & 1;
    A = ((A << 1) | msbQ) & 0x1f;
    Q = (Q << 1) & 0xf;

    // Subtract M
    const diff = A - dr;
    if (diff < 0) {
      // Restore A, set Q0 = 0
      Q = Q & 0xe;
      steps.push({
        cycle,
        action: `Shift Left; A - M < 0 -> Restore A, set Q0 = 0`,
        aBits: fmt5(A),
        qBits: fmt4(Q),
      });
    } else {
      A = diff;
      Q = Q | 1;
      steps.push({
        cycle,
        action: `Shift Left; A - M >= 0 -> Keep A=${A}, set Q0 = 1`,
        aBits: fmt5(A),
        qBits: fmt4(Q),
      });
    }
  }

  return {
    dividend: dv,
    divisor: dr,
    quotient: Q,
    remainder: A,
    steps,
  };
}

// ---------- IEEE 754 Single Precision Floating Point ----------

export interface Ieee754Breakdown {
  value: number;
  signBit: 0 | 1;
  exponentBits: string;
  mantissaBits: string;
  biasedExponent: number;
  unbiasedExponent: number | null;
  hex: string;
  classification: 'Zero' | 'Denormalized' | 'Normalized' | 'Infinity' | 'NaN';
  formula: string;
}

export function encodeIeee754Single(value: number): Ieee754Breakdown {
  const buf = new ArrayBuffer(4);
  const view = new DataView(buf);
  view.setFloat32(0, value, false);
  const u32 = view.getUint32(0, false);
  const bits = u32.toString(2).padStart(32, '0');
  const signBit: 0 | 1 = bits[0] === '1' ? 1 : 0;
  const exponentBits = bits.slice(1, 9);
  const mantissaBits = bits.slice(9);
  const biasedExponent = parseInt(exponentBits, 2);
  const mantissaInt = parseInt(mantissaBits, 2);

  let classification: Ieee754Breakdown['classification'] = 'Normalized';
  let unbiasedExponent: number | null = biasedExponent - 127;
  let formula = '';

  if (biasedExponent === 0 && mantissaInt === 0) {
    classification = 'Zero';
    unbiasedExponent = null;
    formula = `${signBit === 1 ? '-' : '+'}0.0 (E=0, M=0)`;
  } else if (biasedExponent === 0) {
    classification = 'Denormalized';
    unbiasedExponent = -126;
    formula = `(-1)^${signBit} × 0.${mantissaBits.slice(0, 8)}... × 2^(-126)`;
  } else if (biasedExponent === 255 && mantissaInt === 0) {
    classification = 'Infinity';
    unbiasedExponent = null;
    formula = `${signBit === 1 ? '-' : '+'}∞ (E=255, M=0)`;
  } else if (biasedExponent === 255) {
    classification = 'NaN';
    unbiasedExponent = null;
    formula = 'NaN (E=255, M≠0)';
  } else {
    formula = `(-1)^${signBit} × 1.${mantissaBits.slice(0, 8)}... × 2^(${biasedExponent} - 127 = ${unbiasedExponent})`;
  }

  return {
    value,
    signBit,
    exponentBits,
    mantissaBits,
    biasedExponent,
    unbiasedExponent,
    hex: `0x${u32.toString(16).toUpperCase().padStart(8, '0')}`,
    classification,
    formula,
  };
}
