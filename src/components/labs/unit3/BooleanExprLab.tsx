import React, { useMemo, useState } from 'react';
import { analyzeBooleanExpression } from '../../../simulators/logic/booleanEngine';

const PRESET_EXPRESSIONS = [
  { label: "De Morgan 1: (A+B)' = A'·B'", expr: "(A + B)' = A' * B'" },
  { label: "De Morgan 2: (A·B)' = A'+B'", expr: "(A * B)' = A' + B'" },
  { label: "XOR Canonical: A ^ B = A'B + AB'", expr: "A ^ B = A'B + AB'" },
  { label: 'Full Adder Carry: AB + C(A^B)', expr: 'A*B + C*(A ^ B)' },
  { label: 'Absorption: A + AB = A', expr: 'A + A*B = A' },
];

export const BooleanExprLab: React.FC = () => {
  const [expr, setExpr] = useState("(A + B)' = A' * B'");

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, data: analyzeBooleanExpression(expr) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [expr]);

  const insertToken = (tok: string) => setExpr((prev) => `${prev}${tok}`);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">
              Boolean Expression &amp; Equivalence Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports up to 6 variables (64 rows), implicit AND (AB), postfix prime (&apos;), AND/OR/XOR/NAND/NOR/XNOR, and &quot;=&quot; comparison.
            </p>
          </div>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) setExpr(e.target.value);
            }}
            aria-label="Load Boolean expression example"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium"
          >
            <option value="">Load Preset Example…</option>
            {PRESET_EXPRESSIONS.map((p) => (
              <option key={p.label} value={p.expr}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="e.g. (A + B)' = A' * B'"
            aria-label="Boolean expression input"
            className="flex-1 min-w-[240px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 font-mono text-sm font-semibold text-[#14213D] dark:text-white"
          />
          <button
            type="button"
            onClick={() => setExpr('')}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Operator Toolbar */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'AND (*)', val: ' * ' },
            { label: 'OR (+)', val: ' + ' },
            { label: "NOT (')", val: "'" },
            { label: 'XOR (^)', val: ' ^ ' },
            { label: 'NAND', val: ' NAND ' },
            { label: 'NOR', val: ' NOR ' },
            { label: 'XNOR', val: ' XNOR ' },
            { label: 'Compare (=)', val: ' = ' },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => insertToken(btn.val)}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono font-semibold hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {!parsed.ok ? (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4 text-sm font-mono text-red-700 dark:text-red-300">
          Syntax Note: {parsed.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Summary & Canonical SOP */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              {parsed.data.isComparison && (
                <div
                  className={`rounded-lg px-3.5 py-2.5 text-sm font-bold ${
                    parsed.data.areEquivalent
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {parsed.data.areEquivalent
                    ? '✓ EQUIVALENT: Both sides match for all truth-table rows'
                    : '✕ NOT EQUIVALENT: Outputs differ on at least one row'}
                </div>
              )}

              <div>
                <div className="text-[11px] font-mono text-slate-500">CANONICAL SUM OF PRODUCTS (SOP)</div>
                <div className="mt-1 rounded-lg bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-xs font-bold text-[#2563EB] dark:text-[#22D3EE] break-all">
                  F = {parsed.data.canonicalSop}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-500">SIMPLIFICATION &amp; CLASSIFICATION</div>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {parsed.data.simplificationHint}
                </p>
              </div>
            </div>
          </div>

          {/* Generated Truth Table */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-x-auto max-h-[380px]">
            <table className="w-full text-xs font-mono text-center border-collapse">
              <thead className="sticky top-0 bg-white dark:bg-slate-900">
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1.5 px-2">m</th>
                  {parsed.data.variables.map((v) => (
                    <th key={v} className="py-1.5 px-2">
                      {v}
                    </th>
                  ))}
                  <th className="py-1.5 px-2 text-[#2563EB] dark:text-[#22D3EE]">
                    {parsed.data.isComparison ? 'LHS' : 'Out'}
                  </th>
                  {parsed.data.isComparison && (
                    <>
                      <th className="py-1.5 px-2 text-[#2563EB] dark:text-[#22D3EE]">RHS</th>
                      <th className="py-1.5 px-2">Match</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {parsed.data.rows.map((r) => (
                  <tr
                    key={r.index}
                    className={`border-b border-slate-100 dark:border-slate-800 ${
                      r.lhsOut === 1 ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-1.5 px-2 text-slate-400">m{r.index}</td>
                    {parsed.data.variables.map((v) => (
                      <td key={v} className="py-1.5 px-2">
                        {r.inputs[v]}
                      </td>
                    ))}
                    <td className="py-1.5 px-2 font-bold">{r.lhsOut}</td>
                    {parsed.data.isComparison && (
                      <>
                        <td className="py-1.5 px-2 font-bold">{r.rhsOut}</td>
                        <td className="py-1.5 px-2 font-bold">
                          {r.matches ? (
                            <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">✕</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
