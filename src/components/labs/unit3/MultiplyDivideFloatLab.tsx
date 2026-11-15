import React, { useState } from 'react';
import {
  encodeIeee754Single,
  runBoothMultiply,
  runRestoringDivision,
} from '../../../simulators/logic/aluAdderEngine';

export const MultiplyDivideFloatLab: React.FC = () => {
  const [mode, setMode] = useState<'booth' | 'division' | 'ieee754'>('booth');

  const [m, setM] = useState(-5);
  const [q, setQ] = useState(3);

  const [dividend, setDividend] = useState(13);
  const [divisor, setDivisor] = useState(3);

  const [floatVal, setFloatVal] = useState(-6.5);

  const booth = runBoothMultiply(m, q);
  const div = runRestoringDivision(dividend, divisor);
  const ieee = encodeIeee754Single(floatVal);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
        {[
          { id: 'booth', label: "Booth's Signed Multiplication" },
          { id: 'division', label: 'Restoring Division' },
          { id: 'ieee754', label: 'IEEE 754 Floating-Point' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id as 'booth' | 'division' | 'ieee754')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              mode === t.id ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === 'booth' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-xs font-mono font-semibold flex items-center gap-2">
              Multiplicand M (−7..7):
              <input
                type="number"
                min={-7}
                max={7}
                value={m}
                onChange={(e) => setM(Number(e.target.value) || 0)}
                className="w-16 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
              />
            </label>
            <label className="text-xs font-mono font-semibold flex items-center gap-2">
              Multiplier Q (−7..7):
              <input
                type="number"
                min={-7}
                max={7}
                value={q}
                onChange={(e) => setQ(Number(e.target.value) || 0)}
                className="w-16 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
              />
            </label>
            <div className="ml-auto font-mono text-sm font-bold text-[#2563EB] dark:text-[#22D3EE]">
              Product = {booth.product} (8-bit: {booth.productBinary8})
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1.5">Cycle</th>
                  <th className="py-1.5">A (4-bit)</th>
                  <th className="py-1.5">Q (4-bit)</th>
                  <th className="py-1.5">Q-1</th>
                  <th className="py-1.5">Booth Operation</th>
                </tr>
              </thead>
              <tbody>
                {booth.steps.map((s) => (
                  <tr key={s.cycle} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-1.5 font-bold">{s.cycle}</td>
                    <td className="py-1.5">{s.aBits}</td>
                    <td className="py-1.5">{s.qBits}</td>
                    <td className="py-1.5">{s.qMinus1}</td>
                    <td className="py-1.5">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fast Multiplication Note: Bit-Pair Recoding halves the number of summands (n/2), and Carry-Save Addition (CSA) reduces partial-product addition depth before final carry propagation.
          </p>
        </div>
      )}

      {mode === 'division' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-xs font-mono font-semibold flex items-center gap-2">
              Dividend Q (0..15):
              <input
                type="number"
                min={0}
                max={15}
                value={dividend}
                onChange={(e) => setDividend(Number(e.target.value) || 0)}
                className="w-16 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
              />
            </label>
            <label className="text-xs font-mono font-semibold flex items-center gap-2">
              Divisor M (1..15):
              <input
                type="number"
                min={1}
                max={15}
                value={divisor}
                onChange={(e) => setDivisor(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
              />
            </label>
            <div className="ml-auto font-mono text-sm font-bold text-[#2563EB] dark:text-[#22D3EE]">
              Quotient = {div.quotient} · Remainder = {div.remainder}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1.5">Cycle</th>
                  <th className="py-1.5">A (5-bit)</th>
                  <th className="py-1.5">Q (4-bit)</th>
                  <th className="py-1.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {div.steps.map((s) => (
                  <tr key={s.cycle} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-1.5 font-bold">{s.cycle}</td>
                    <td className="py-1.5">{s.aBits}</td>
                    <td className="py-1.5">{s.qBits}</td>
                    <td className="py-1.5">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === 'ieee754' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-mono font-semibold">Decimal Number:</label>
            <input
              type="number"
              step="0.25"
              value={Number.isFinite(floatVal) ? floatVal : 0}
              onChange={(e) => setFloatVal(parseFloat(e.target.value) || 0)}
              className="w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono text-sm"
            />
            {[0, 1.5, -6.5, 42.25, Infinity].map((preset) => (
              <button
                key={String(preset)}
                type="button"
                onClick={() => setFloatVal(preset)}
                className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono cursor-pointer"
              >
                {String(preset)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 font-mono text-center">
            <div className="sm:col-span-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3">
              <div className="text-[10px] text-slate-500">Sign (1 bit)</div>
              <div className="text-lg font-bold text-[#2563EB] dark:text-[#22D3EE]">{ieee.signBit}</div>
            </div>
            <div className="sm:col-span-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 p-3">
              <div className="text-[10px] text-slate-500">Exponent (8 bits, Bias 127)</div>
              <div className="text-sm font-bold text-[#14213D] dark:text-white mt-1">{ieee.exponentBits}</div>
              <div className="text-[10px] text-slate-500">E = {ieee.biasedExponent}</div>
            </div>
            <div className="sm:col-span-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <div className="text-[10px] text-slate-500">Mantissa / Fraction (23 bits)</div>
              <div className="text-xs font-bold text-[#14213D] dark:text-white mt-1.5 break-all">
                {ieee.mantissaBits}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 font-mono text-xs flex flex-wrap justify-between gap-2">
            <span>Class: <strong>{ieee.classification}</strong></span>
            <span>Formula: <strong>{ieee.formula}</strong></span>
            <span>Hex: <strong className="text-[#2563EB] dark:text-[#22D3EE]">{ieee.hex}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
