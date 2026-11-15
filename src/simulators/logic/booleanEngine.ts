export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export interface GateMeta {
  type: GateType;
  name: string;
  formula: string;
  icCode: string;
  unary?: boolean;
  description: string;
}

export const GATE_METADATA: Record<GateType, GateMeta> = {
  AND: {
    type: 'AND',
    name: 'AND Gate',
    formula: 'Y = A · B',
    icCode: '7408',
    description: 'Outputs 1 only when all inputs (A and B) are 1.',
  },
  OR: {
    type: 'OR',
    name: 'OR Gate',
    formula: 'Y = A + B',
    icCode: '7432',
    description: 'Outputs 1 when at least one input (A or B) is 1.',
  },
  NOT: {
    type: 'NOT',
    name: 'NOT Gate (Inverter)',
    formula: "Y = A'",
    icCode: '7404',
    unary: true,
    description: 'Inverts the single input A: 0 becomes 1 and 1 becomes 0.',
  },
  NAND: {
    type: 'NAND',
    name: 'NAND Gate',
    formula: "Y = (A · B)'",
    icCode: '7400',
    description: 'Universal gate: outputs 0 only when both A and B are 1.',
  },
  NOR: {
    type: 'NOR',
    name: 'NOR Gate',
    formula: "Y = (A + B)'",
    icCode: '7402',
    description: 'Universal gate: outputs 1 only when both A and B are 0.',
  },
  XOR: {
    type: 'XOR',
    name: 'Exclusive-OR (EX-OR)',
    formula: 'Y = A ⊕ B',
    icCode: '7486',
    description: 'Outputs 1 when inputs A and B differ (odd parity detector).',
  },
  XNOR: {
    type: 'XNOR',
    name: 'Exclusive-NOR (EX-NOR)',
    formula: 'Y = (A ⊕ B)\'',
    icCode: '74266',
    description: 'Equivalence gate: outputs 1 when inputs A and B are identical.',
  },
};

export function evaluateGate(gate: GateType, a: 0 | 1, b: 0 | 1 = 0): 0 | 1 {
  switch (gate) {
    case 'AND':
      return a === 1 && b === 1 ? 1 : 0;
    case 'OR':
      return a === 1 || b === 1 ? 1 : 0;
    case 'NOT':
      return a === 1 ? 0 : 1;
    case 'NAND':
      return a === 1 && b === 1 ? 0 : 1;
    case 'NOR':
      return a === 1 || b === 1 ? 0 : 1;
    case 'XOR':
      return a !== b ? 1 : 0;
    case 'XNOR':
      return a === b ? 1 : 0;
  }
}

export interface GateTruthRow {
  a: 0 | 1;
  b?: 0 | 1;
  out: 0 | 1;
}

export function getGateTruthTable(gate: GateType): GateTruthRow[] {
  if (gate === 'NOT') {
    return [
      { a: 0, out: evaluateGate('NOT', 0) },
      { a: 1, out: evaluateGate('NOT', 1) },
    ];
  }
  const rows: GateTruthRow[] = [];
  for (const a of [0, 1] as const) {
    for (const b of [0, 1] as const) {
      rows.push({ a, b, out: evaluateGate(gate, a, b) });
    }
  }
  return rows;
}

export interface DeMorganResult {
  law: 1 | 2;
  a: 0 | 1;
  b: 0 | 1;
  notA: 0 | 1;
  notB: 0 | 1;
  lhsInner: 0 | 1;
  lhsOut: 0 | 1;
  rhsOut: 0 | 1;
  equivalent: boolean;
  lhsLabel: string;
  rhsLabel: string;
}

/**
 * Law 1: (A + B)' = A' · B' (NOR == Bubbled AND)
 * Law 2: (A · B)' = A' + B' (NAND == Bubbled OR)
 */
export function evaluateDeMorgan(law: 1 | 2, a: 0 | 1, b: 0 | 1): DeMorganResult {
  const notA: 0 | 1 = a === 1 ? 0 : 1;
  const notB: 0 | 1 = b === 1 ? 0 : 1;

  if (law === 1) {
    const lhsInner = evaluateGate('OR', a, b);
    const lhsOut = evaluateGate('NOR', a, b);
    const rhsOut = evaluateGate('AND', notA, notB);
    return {
      law,
      a,
      b,
      notA,
      notB,
      lhsInner,
      lhsOut,
      rhsOut,
      equivalent: lhsOut === rhsOut,
      lhsLabel: "(A + B)'",
      rhsLabel: "A' · B'",
    };
  }

  const lhsInner = evaluateGate('AND', a, b);
  const lhsOut = evaluateGate('NAND', a, b);
  const rhsOut = evaluateGate('OR', notA, notB);
  return {
    law,
    a,
    b,
    notA,
    notB,
    lhsInner,
    lhsOut,
    rhsOut,
    equivalent: lhsOut === rhsOut,
    lhsLabel: "(A · B)'",
    rhsLabel: "A' + B'",
  };
}

// ---------- Boolean Expression Parser & Evaluator (up to 6 variables) ----------

export type BoolAst =
  | { kind: 'const'; val: boolean }
  | { kind: 'var'; name: string }
  | { kind: 'not'; inner: BoolAst }
  | { kind: 'bin'; op: 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR'; left: BoolAst; right: BoolAst };

interface Token {
  type: 'VAR' | 'CONST' | 'OP' | 'LPAREN' | 'RPAREN' | 'PRIME';
  value: string;
}

const KEYWORD_OPS = new Set(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR', 'NOT']);

export function tokenizeBoolean(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }
    if (ch === "'" || ch === '′' || ch === '’') {
      tokens.push({ type: 'PRIME', value: "'" });
      i++;
      continue;
    }
    if (ch === '!' || ch === '~' || ch === '¬') {
      tokens.push({ type: 'OP', value: 'NOT' });
      i++;
      continue;
    }
    if (ch === '&' || ch === '*' || ch === '·' || ch === '∧' || ch === '•') {
      tokens.push({ type: 'OP', value: 'AND' });
      i++;
      continue;
    }
    if (ch === '|' || ch === '+' || ch === '∨') {
      tokens.push({ type: 'OP', value: 'OR' });
      i++;
      continue;
    }
    if (ch === '^' || ch === '⊕') {
      tokens.push({ type: 'OP', value: 'XOR' });
      i++;
      continue;
    }
    if (ch === '0' || ch === '1') {
      tokens.push({ type: 'CONST', value: ch });
      i++;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let word = '';
      let j = i;
      while (j < input.length && /[A-Za-z0-9_]/.test(input[j])) {
        word += input[j];
        j++;
      }
      const upper = word.toUpperCase();
      if (KEYWORD_OPS.has(upper)) {
        tokens.push({ type: 'OP', value: upper });
        i = j;
        continue;
      }
      if (upper === 'TRUE') {
        tokens.push({ type: 'CONST', value: '1' });
        i = j;
        continue;
      }
      if (upper === 'FALSE') {
        tokens.push({ type: 'CONST', value: '0' });
        i = j;
        continue;
      }
      // Split consecutive single-letter variables like AB into A, B when pure letters
      if (/^[A-Za-z]+$/.test(word) && word.length > 1) {
        for (const letter of word) {
          tokens.push({ type: 'VAR', value: letter.toUpperCase() });
        }
      } else {
        tokens.push({ type: 'VAR', value: word.toUpperCase() });
      }
      i = j;
      continue;
    }
    throw new Error(`Unexpected symbol "${ch}" near position ${i + 1}`);
  }
  return tokens;
}

function insertImplicitAnd(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const cur = tokens[i];
    out.push(cur);
    if (i + 1 < tokens.length) {
      const next = tokens[i + 1];
      const curCanEnd =
        cur.type === 'VAR' || cur.type === 'CONST' || cur.type === 'RPAREN' || cur.type === 'PRIME';
      const nextCanStart =
        next.type === 'VAR' ||
        next.type === 'CONST' ||
        next.type === 'LPAREN' ||
        (next.type === 'OP' && next.value === 'NOT');
      if (curCanEnd && nextCanStart) {
        out.push({ type: 'OP', value: 'AND' });
      }
    }
  }
  return out;
}

export function parseBooleanExpression(raw: string): { ast: BoolAst; variables: string[] } {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('Enter a Boolean expression such as (A + B)\' or A·B + C.');
  }
  const tokens = insertImplicitAnd(tokenizeBoolean(trimmed));
  let pos = 0;
  const vars = new Set<string>();

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseOr(): BoolAst {
    let node = parseXor();
    while (peek()?.type === 'OP' && (peek()!.value === 'OR' || peek()!.value === 'NOR')) {
      const op = consume()!.value as 'OR' | 'NOR';
      const right = parseXor();
      node = { kind: 'bin', op, left: node, right };
    }
    return node;
  }

  function parseXor(): BoolAst {
    let node = parseAnd();
    while (peek()?.type === 'OP' && (peek()!.value === 'XOR' || peek()!.value === 'XNOR')) {
      const op = consume()!.value as 'XOR' | 'XNOR';
      const right = parseAnd();
      node = { kind: 'bin', op, left: node, right };
    }
    return node;
  }

  function parseAnd(): BoolAst {
    let node = parseUnary();
    while (peek()?.type === 'OP' && (peek()!.value === 'AND' || peek()!.value === 'NAND')) {
      const op = consume()!.value as 'AND' | 'NAND';
      const right = parseUnary();
      node = { kind: 'bin', op, left: node, right };
    }
    return node;
  }

  function parseUnary(): BoolAst {
    if (peek()?.type === 'OP' && peek()!.value === 'NOT') {
      consume();
      return { kind: 'not', inner: parseUnary() };
    }
    return parsePostfix();
  }

  function parsePostfix(): BoolAst {
    let node = parsePrimary();
    while (peek()?.type === 'PRIME') {
      consume();
      node = { kind: 'not', inner: node };
    }
    return node;
  }

  function parsePrimary(): BoolAst {
    const t = peek();
    if (!t) {
      throw new Error('Expression ended unexpectedly.');
    }
    if (t.type === 'LPAREN') {
      consume();
      const inner = parseOr();
      if (peek()?.type !== 'RPAREN') {
        throw new Error('Missing closing parenthesis ")".');
      }
      consume();
      return inner;
    }
    if (t.type === 'VAR') {
      consume();
      vars.add(t.value);
      return { kind: 'var', name: t.value };
    }
    if (t.type === 'CONST') {
      consume();
      return { kind: 'const', val: t.value === '1' };
    }
    throw new Error(`Unexpected token "${t.value}".`);
  }

  const ast = parseOr();
  if (pos < tokens.length) {
    throw new Error(`Unexpected trailing token "${tokens[pos].value}".`);
  }
  const variables = Array.from(vars).sort();
  if (variables.length > 6) {
    throw new Error('Supports up to 6 distinct variables (64 truth-table rows) for responsive inspection.');
  }
  return { ast, variables };
}

export function evalBoolAst(ast: BoolAst, env: Record<string, boolean>): boolean {
  switch (ast.kind) {
    case 'const':
      return ast.val;
    case 'var':
      return Boolean(env[ast.name]);
    case 'not':
      return !evalBoolAst(ast.inner, env);
    case 'bin': {
      const l = evalBoolAst(ast.left, env);
      const r = evalBoolAst(ast.right, env);
      switch (ast.op) {
        case 'AND':
          return l && r;
        case 'OR':
          return l || r;
        case 'XOR':
          return l !== r;
        case 'NAND':
          return !(l && r);
        case 'NOR':
          return !(l || r);
        case 'XNOR':
          return l === r;
      }
    }
  }
}

export interface TruthTableAnalysis {
  isComparison: boolean;
  variables: string[];
  rows: {
    index: number;
    inputs: Record<string, 0 | 1>;
    lhsOut: 0 | 1;
    rhsOut?: 0 | 1;
    matches?: boolean;
  }[];
  minterms: number[];
  canonicalSop: string;
  areEquivalent?: boolean;
  tautology: boolean;
  contradiction: boolean;
  simplificationHint: string;
}

function getSimplificationHint(expr: string, minterms: number[], rowCount: number, vars: string[]): string {
  if (minterms.length === 0) return 'Always 0 (Contradiction) — simplifies directly to 0.';
  if (minterms.length === rowCount) return 'Always 1 (Tautology) — simplifies directly to 1.';
  const compact = expr.replace(/\s+/g, '').toUpperCase();
  if (/A\+A'B|A\+B·A'/.test(compact)) return "Absorption / Redundancy Law: A + A'·B simplifies to A + B.";
  if (/A\(A\+B\)|A\+AB/.test(compact)) return 'Absorption Law: A + A·B = A and A·(A + B) = A.';
  if (/\(A\+B\)'/.test(compact)) return "De Morgan's First Law: (A + B)' = A' · B'.";
  if (/\(AB\)'|\(A·B\)'|\(A\*B\)'/.test(compact)) return "De Morgan's Second Law: (A · B)' = A' + B'.";
  if (vars.length === 1) {
    return minterms[0] === 1 ? `Identity: simplifies to ${vars[0]}.` : `Complement: simplifies to ${vars[0]}'.`;
  }
  return `${minterms.length} of ${rowCount} minterms evaluate to 1 (Σm(${minterms.join(', ')})).`;
}

export function analyzeBooleanExpression(input: string): TruthTableAnalysis {
  const parts = input.split('=');
  if (parts.length > 2) {
    throw new Error('Use at most one "=" to compare two expressions.');
  }
  const isComparison = parts.length === 2;
  const lhsParsed = parseBooleanExpression(parts[0]);
  const rhsParsed = isComparison ? parseBooleanExpression(parts[1]) : null;

  const varSet = new Set<string>(lhsParsed.variables);
  if (rhsParsed) {
    rhsParsed.variables.forEach((v) => varSet.add(v));
  }
  const variables = Array.from(varSet).sort();
  if (variables.length > 6) {
    throw new Error('Combined expression exceeds the 6-variable limit.');
  }

  const rowCount = 1 << variables.length;
  const rows: TruthTableAnalysis['rows'] = [];
  const minterms: number[] = [];
  let allMatch = true;

  for (let idx = 0; idx < rowCount; idx++) {
    const env: Record<string, boolean> = {};
    const inputs: Record<string, 0 | 1> = {};
    for (let v = 0; v < variables.length; v++) {
      const bit = ((idx >> (variables.length - 1 - v)) & 1) === 1;
      env[variables[v]] = bit;
      inputs[variables[v]] = bit ? 1 : 0;
    }
    const lhsVal = evalBoolAst(lhsParsed.ast, env) ? 1 : 0;
    if (lhsVal === 1) minterms.push(idx);
    if (rhsParsed) {
      const rhsVal = evalBoolAst(rhsParsed.ast, env) ? 1 : 0;
      const matches = lhsVal === rhsVal;
      if (!matches) allMatch = false;
      rows.push({ index: idx, inputs, lhsOut: lhsVal, rhsOut: rhsVal, matches });
    } else {
      rows.push({ index: idx, inputs, lhsOut: lhsVal });
    }
  }

  const sopTerms = minterms.map((m) =>
    variables
      .map((v, idx) => {
        const bit = (m >> (variables.length - 1 - idx)) & 1;
        return bit === 1 ? v : `${v}'`;
      })
      .join('·'),
  );

  const canonicalSop =
    variables.length === 0
      ? rows[0]?.lhsOut === 1
        ? '1'
        : '0'
      : minterms.length === 0
        ? '0'
        : sopTerms.join(' + ');

  return {
    isComparison,
    variables,
    rows,
    minterms,
    canonicalSop,
    areEquivalent: isComparison ? allMatch : undefined,
    tautology: minterms.length === rowCount,
    contradiction: minterms.length === 0,
    simplificationHint: getSimplificationHint(parts[0], minterms, rowCount, variables),
  };
}

// ---------- Unit 1 Number Systems, Codes & Complement Arithmetic ----------

export interface BaseConversionResult {
  decimal: number;
  binary: string;
  octal: string;
  hex: string;
  valid: boolean;
  error?: string;
}

export function convertNumberBase(raw: string, fromBase: 2 | 8 | 10 | 16): BaseConversionResult {
  const cleaned = raw.trim().toUpperCase();
  if (!cleaned) {
    return { decimal: 0, binary: '0', octal: '0', hex: '0', valid: false, error: 'Enter a number.' };
  }
  const patterns: Record<2 | 8 | 10 | 16, RegExp> = {
    2: /^[01]+(\.[01]+)?$/,
    8: /^[0-7]+(\.[0-7]+)?$/,
    10: /^[0-9]+(\.[0-9]+)?$/,
    16: /^[0-9A-F]+(\.[0-9A-F]+)?$/,
  };
  if (!patterns[fromBase].test(cleaned)) {
    return {
      decimal: 0,
      binary: '-',
      octal: '-',
      hex: '-',
      valid: false,
      error: `Invalid base-${fromBase} digits.`,
    };
  }

  const [intPart, fracPart = ''] = cleaned.split('.');
  let decVal = parseInt(intPart, fromBase);
  if (fracPart.length > 0) {
    let denom = fromBase;
    for (const ch of fracPart) {
      decVal += parseInt(ch, fromBase) / denom;
      denom *= fromBase;
    }
  }

  const formatBase = (val: number, base: number): string => {
    const integer = Math.floor(val);
    let frac = val - integer;
    const intStr = integer.toString(base).toUpperCase();
    if (frac < 1e-9) return intStr;
    let fracStr = '';
    for (let i = 0; i < 6 && frac > 1e-9; i++) {
      frac *= base;
      const digit = Math.floor(frac + 1e-9);
      fracStr += digit.toString(base).toUpperCase();
      frac -= digit;
    }
    return `${intStr}.${fracStr}`;
  };

  return {
    decimal: Number(decVal.toFixed(6)),
    binary: formatBase(decVal, 2),
    octal: formatBase(decVal, 8),
    hex: formatBase(decVal, 16),
    valid: true,
  };
}

export function binaryToGray(binary: string): string {
  const clean = binary.replace(/[^01]/g, '');
  if (!clean) return '';
  let gray = clean[0];
  for (let i = 1; i < clean.length; i++) {
    gray += clean[i - 1] !== clean[i] ? '1' : '0';
  }
  return gray;
}

export function grayToBinary(gray: string): string {
  const clean = gray.replace(/[^01]/g, '');
  if (!clean) return '';
  let bin = clean[0];
  for (let i = 1; i < clean.length; i++) {
    bin += bin[i - 1] !== clean[i] ? '1' : '0';
  }
  return bin;
}

export function decimalToBcd(n: number): string {
  const abs = Math.max(0, Math.floor(Math.abs(n)));
  return abs
    .toString()
    .split('')
    .map((d) => parseInt(d, 10).toString(2).padStart(4, '0'))
    .join(' ');
}

export function decimalToExcess3(n: number): string {
  const abs = Math.max(0, Math.floor(Math.abs(n)));
  return abs
    .toString()
    .split('')
    .map((d) => (parseInt(d, 10) + 3).toString(2).padStart(4, '0'))
    .join(' ');
}

export function bcdAddSingleDigits(a: number, b: number): {
  rawSum: number;
  rawBinary: string;
  needsCorrection: boolean;
  correctedSum: number;
  bcdDigits: string;
} {
  const da = Math.max(0, Math.min(9, Math.floor(a)));
  const db = Math.max(0, Math.min(9, Math.floor(b)));
  const rawSum = da + db;
  const needsCorrection = rawSum > 9;
  const total = da + db;
  const tens = Math.floor(total / 10);
  const ones = total % 10;
  return {
    rawSum,
    rawBinary: rawSum.toString(2).padStart(5, '0'),
    needsCorrection,
    correctedSum: needsCorrection ? rawSum + 6 : rawSum,
    bcdDigits: `${tens.toString(2).padStart(4, '0')} ${ones.toString(2).padStart(4, '0')}`,
  };
}

export function computeComplement(bits: string, mode: '1s' | '2s'): string {
  const clean = bits.replace(/[^01]/g, '');
  if (!clean) return '';
  const ones = clean
    .split('')
    .map((b) => (b === '1' ? '0' : '1'))
    .join('');
  if (mode === '1s') return ones;
  const val = (parseInt(ones, 2) + 1) & ((1 << clean.length) - 1);
  return val.toString(2).padStart(clean.length, '0');
}

export function asciiAndParity(text: string, parityType: 'even' | 'odd'): {
  char: string;
  asciiDec: number;
  bin7: string;
  parityBit: 0 | 1;
  byte8: string;
}[] {
  return text
    .slice(0, 8)
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0) & 0x7f;
      const bin7 = code.toString(2).padStart(7, '0');
      const onesCount = bin7.split('').filter((c) => c === '1').length;
      const parityBit: 0 | 1 =
        parityType === 'even' ? (onesCount % 2 === 0 ? 0 : 1) : onesCount % 2 === 0 ? 1 : 0;
      return {
        char,
        asciiDec: code,
        bin7,
        parityBit,
        byte8: `${parityBit}${bin7}`,
      };
    });
}
