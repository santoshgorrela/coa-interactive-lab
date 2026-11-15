import React, { useState } from 'react';
import {
  asciiAndParity,
  bcdAddSingleDigits,
  binaryToGray,
  computeComplement,
  convertNumberBase,
  decimalToBcd,
  decimalToExcess3,
  grayToBinary,
} from '../../../simulators/logic/booleanEngine';

export const NumberCodesLab: React.FC = () => {
  const [rawNum, setRawNum] = useState('42.25');
  const [fromBase, setFromBase] = useState<2 | 8 | 10 | 16>(10);

  const [codeDec, setCodeDec] = useState(29);
  const [bcdA, setBcdA] = useState(7);
  const [bcdB, setBcdB] = useState(8);

  const [grayInput, setGrayInput] = useState('1011');
  const [compInput, setCompInput] = useState('0101');
  const [asciiText, setAsciiText] = useState('COA');
  const [parityMode, setParityMode] = useState<'even' | 'odd'>('even');

  const conv = convertNumberBase(rawNum, fromBase);
  const bcdSum = bcdAddSingleDigits(bcdA, bcdB);
  const grayOut = binaryToGray(grayInput);
  const binFromGray = grayToBinary(grayOut);
  const onesComp = computeComplement(compInput, '1s');
  const twosComp = computeComplement(compInput, '2s');
  const parityRows = asciiAndParity(asciiText, parityMode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Radix Converter */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">Number System Radix Converter</h3>
          <span className="text-xs font-mono text-[#2563EB] dark:text-[#22D3EE]">Base 2 / 8 / 10 / 16</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={rawNum}
            onChange={(e) => setRawNum(e.target.value)}
            aria-label="Number value to convert"
            className="col-span-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-mono text-sm text-[#14213D] dark:text-white"
          />
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value) as 2 | 8 | 10 | 16)}
            aria-label="Input number base"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value={10}>Decimal (10)</option>
            <option value={2}>Binary (2)</option>
            <option value={8}>Octal (8)</option>
            <option value={16}>Hex (16)</option>
          </select>
        </div>

        {!conv.valid ? (
          <div className="text-xs font-mono text-red-600 dark:text-red-400">{conv.error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 font-mono text-sm">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Binary (Base 2)</div>
              <div className="font-bold text-[#2563EB] dark:text-[#22D3EE] break-all">{conv.binary}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Decimal (Base 10)</div>
              <div className="font-bold text-[#14213D] dark:text-white">{conv.decimal}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Octal (Base 8)</div>
              <div className="font-bold text-[#14213D] dark:text-white">{conv.octal}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Hexadecimal (Base 16)</div>
              <div className="font-bold text-[#14213D] dark:text-white">0x{conv.hex}</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. BCD, Excess-3 & BCD Addition */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">BCD (8421), Excess-3 & BCD Addition</h3>
          <span className="text-xs font-mono text-[#2563EB] dark:text-[#22D3EE]">+0110 Rule</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Decimal Input:</label>
          <input
            type="number"
            min={0}
            max={999}
            value={codeDec}
            onChange={(e) => setCodeDec(Number(e.target.value) || 0)}
            className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm"
          />
          <div className="text-xs font-mono">
            <div>BCD: <strong className="text-[#2563EB] dark:text-[#22D3EE]">{decimalToBcd(codeDec)}</strong></div>
            <div>XS-3: <strong className="text-[#14213D] dark:text-white">{decimalToExcess3(codeDec)}</strong></div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-200">BCD Digit Add:</span>
            <input
              type="number"
              min={0}
              max={9}
              value={bcdA}
              onChange={(e) => setBcdA(Math.max(0, Math.min(9, Number(e.target.value) || 0)))}
              aria-label="BCD digit A"
              className="w-14 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
            />
            <span>+</span>
            <input
              type="number"
              min={0}
              max={9}
              value={bcdB}
              onChange={(e) => setBcdB(Math.max(0, Math.min(9, Number(e.target.value) || 0)))}
              aria-label="BCD digit B"
              className="w-14 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
            />
            <span className="font-mono text-slate-600 dark:text-slate-300">
              Raw = {bcdSum.rawBinary} ({bcdSum.rawSum})
            </span>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono">
            {bcdSum.needsCorrection ? (
              <span className="text-amber-700 dark:text-amber-300">
                Sum &gt; 9 → Add 0110 (6) correction → Valid BCD: <strong>{bcdSum.bcdDigits}</strong>
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-300">
                Sum ≤ 9 (valid BCD digit) → <strong>{bcdSum.bcdDigits}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Gray Code & 1's/2's Complement */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-base font-bold text-[#14213D] dark:text-white">Gray Code & Signed Complements</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
              Binary → Gray (Unit-Distance)
            </label>
            <input
              type="text"
              value={grayInput}
              onChange={(e) => setGrayInput(e.target.value.replace(/[^01]/g, '').slice(0, 8))}
              className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 font-mono text-sm"
            />
            <div className="text-xs font-mono">
              Gray: <strong className="text-[#2563EB] dark:text-[#22D3EE]">{grayOut || '—'}</strong> · Back:{' '}
              <strong>{binFromGray || '—'}</strong>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
              1&apos;s & 2&apos;s Complement (Bitwise)
            </label>
            <input
              type="text"
              value={compInput}
              onChange={(e) => setCompInput(e.target.value.replace(/[^01]/g, '').slice(0, 8))}
              className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 font-mono text-sm"
            />
            <div className="text-xs font-mono">
              1&apos;s: <strong>{onesComp || '—'}</strong> · 2&apos;s:{' '}
              <strong className="text-[#2563EB] dark:text-[#22D3EE]">{twosComp || '—'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ASCII & Parity */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">ASCII (7-Bit) + Parity Bit</h3>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setParityMode('even')}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                parityMode === 'even' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Even Parity
            </button>
            <button
              type="button"
              onClick={() => setParityMode('odd')}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                parityMode === 'odd' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Odd Parity
            </button>
          </div>
        </div>

        <input
          type="text"
          value={asciiText}
          maxLength={6}
          onChange={(e) => setAsciiText(e.target.value)}
          placeholder="Type ASCII chars"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono text-sm"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="py-1">Char</th>
                <th className="py-1">Dec</th>
                <th className="py-1">7-bit ASCII</th>
                <th className="py-1">P</th>
                <th className="py-1">8-bit Frame</th>
              </tr>
            </thead>
            <tbody>
              {parityRows.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-1 font-bold">{r.char}</td>
                  <td className="py-1">{r.asciiDec}</td>
                  <td className="py-1">{r.bin7}</td>
                  <td className="py-1 font-bold text-[#2563EB] dark:text-[#22D3EE]">{r.parityBit}</td>
                  <td className="py-1 font-bold">{r.byte8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
