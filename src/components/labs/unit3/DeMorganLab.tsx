import React, { useEffect, useState } from 'react';
import { evaluateDeMorgan } from '../../../simulators/logic/booleanEngine';
import { SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

export const DeMorganLab: React.FC = () => {
  const [law, setLaw] = useState<1 | 2>(1);
  const [a, setA] = useState<0 | 1>(0);
  const [b, setB] = useState<0 | 1>(1);
  const [playing, setPlaying] = useState(false);

  const res = evaluateDeMorgan(law, a, b);

  useEffect(() => {
    if (!playing) return;
    const cases: [0 | 1, 0 | 1][] = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    let idx = cases.findIndex(([ca, cb]) => ca === a && cb === b);
    const timer = window.setInterval(() => {
      idx = (idx + 1) % 4;
      setA(cases[idx][0]);
      setB(cases[idx][1]);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, a, b]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLaw(1)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold cursor-pointer ${
              law === 1 ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            Law 1: (A + B)&apos; = A&apos; · B&apos; (NOR ≡ Bubbled AND)
          </button>
          <button
            type="button"
            onClick={() => setLaw(2)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold cursor-pointer ${
              law === 2 ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            Law 2: (A · B)&apos; = A&apos; + B&apos; (NAND ≡ Bubbled OR)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setA((v) => (v === 1 ? 0 : 1))}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
          >
            A = {a}
          </button>
          <button
            type="button"
            onClick={() => setB((v) => (v === 1 ? 0 : 1))}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
          >
            B = {b}
          </button>
        </div>
      </div>

      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onReset={() => {
          setPlaying(false);
          setA(0);
          setB(0);
        }}
        stepText={`Outputs Match: ${res.lhsLabel} = ${res.lhsOut} == ${res.rhsLabel} = ${res.rhsOut}`}
      />

      {/* Side-by-Side Synchronized Circuits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LHS Circuit */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#14213D] dark:text-white">
              LHS: {res.lhsLabel} ({law === 1 ? 'NOR Gate' : 'NAND Gate'})
            </span>
            <span className="font-mono text-xs font-bold text-[#2563EB] dark:text-[#22D3EE]">OUT = {res.lhsOut}</span>
          </div>
          <svg viewBox="0 0 380 180" className="w-full h-auto select-none">
            <SignalWire d="M 66 64 L 146 64" active={a === 1} high={a === 1} />
            <SignalWire d="M 66 116 L 146 116" active={b === 1} high={b === 1} />
            <SignalWire d="M 248 90 L 316 90" active={res.lhsOut === 1} high={res.lhsOut === 1} />

            <text x={28} y={69} className="fill-slate-700 dark:fill-slate-200 text-[12px] font-mono font-bold">A={a}</text>
            <text x={28} y={121} className="fill-slate-700 dark:fill-slate-200 text-[12px] font-mono font-bold">B={b}</text>

            {law === 1 ? (
              <path
                d="M 145 48 Q 165 90 145 132 L 190 132 Q 225 126 238 90 Q 225 54 190 48 Z"
                className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
                strokeWidth={2.8}
              />
            ) : (
              <path
                d="M 145 48 L 195 48 A 42 42 0 0 1 195 132 L 145 132 Z"
                className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
                strokeWidth={2.8}
              />
            )}
            <circle cx={243} cy={90} r={6} className="fill-white dark:fill-slate-900 stroke-[#14213D] dark:stroke-slate-200" strokeWidth={2.5} />

            <circle cx={336} cy={90} r={20} fill={res.lhsOut === 1 ? '#22D3EE' : '#1E293B'} stroke="#2563EB" strokeWidth={2.5} />
            <text x={336} y={95} textAnchor="middle" className={`text-[13px] font-mono font-bold ${res.lhsOut === 1 ? 'fill-[#14213D]' : 'fill-white'}`}>
              {res.lhsOut}
            </text>
          </svg>
        </div>

        {/* RHS Circuit */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#14213D] dark:text-white">
              RHS: {res.rhsLabel} ({law === 1 ? 'Bubbled AND' : 'Bubbled OR'})
            </span>
            <span className="font-mono text-xs font-bold text-[#2563EB] dark:text-[#22D3EE]">OUT = {res.rhsOut}</span>
          </div>
          <svg viewBox="0 0 380 180" className="w-full h-auto select-none">
            <SignalWire d="M 66 64 L 114 64" active={a === 1} high={a === 1} />
            <SignalWire d="M 66 116 L 114 116" active={b === 1} high={b === 1} />
            <SignalWire d="M 128 64 L 176 64" active={res.notA === 1} high={res.notA === 1} label={`A'=${res.notA}`} labelX={148} labelY={54} />
            <SignalWire d="M 128 116 L 176 116" active={res.notB === 1} high={res.notB === 1} label={`B'=${res.notB}`} labelX={148} labelY={134} />
            <SignalWire d="M 262 90 L 316 90" active={res.rhsOut === 1} high={res.rhsOut === 1} />

            <text x={28} y={69} className="fill-slate-700 dark:fill-slate-200 text-[12px] font-mono font-bold">A={a}</text>
            <text x={28} y={121} className="fill-slate-700 dark:fill-slate-200 text-[12px] font-mono font-bold">B={b}</text>

            {/* Input inversion bubbles */}
            <circle cx={121} cy={64} r={6} className="fill-white dark:fill-slate-900 stroke-[#14213D] dark:stroke-slate-200" strokeWidth={2.5} />
            <circle cx={121} cy={116} r={6} className="fill-white dark:fill-slate-900 stroke-[#14213D] dark:stroke-slate-200" strokeWidth={2.5} />

            {law === 1 ? (
              <path
                d="M 176 48 L 220 48 A 42 42 0 0 1 220 132 L 176 132 Z"
                className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
                strokeWidth={2.8}
              />
            ) : (
              <path
                d="M 176 48 Q 196 90 176 132 L 220 132 Q 252 126 264 90 Q 252 54 220 48 Z"
                className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
                strokeWidth={2.8}
              />
            )}

            <circle cx={336} cy={90} r={20} fill={res.rhsOut === 1 ? '#22D3EE' : '#1E293B'} stroke="#2563EB" strokeWidth={2.5} />
            <text x={336} y={95} textAnchor="middle" className={`text-[13px] font-mono font-bold ${res.rhsOut === 1 ? 'fill-[#14213D]' : 'fill-white'}`}>
              {res.rhsOut}
            </text>
          </svg>
        </div>
      </div>

      {/* Truth Table Proof */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-x-auto">
        <table className="w-full text-xs font-mono text-center">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th className="py-1.5">A</th>
              <th className="py-1.5">B</th>
              <th className="py-1.5">A&apos;</th>
              <th className="py-1.5">B&apos;</th>
              <th className="py-1.5 text-[#2563EB] dark:text-[#22D3EE]">{res.lhsLabel}</th>
              <th className="py-1.5 text-[#2563EB] dark:text-[#22D3EE]">{res.rhsLabel}</th>
              <th className="py-1.5">Verified</th>
            </tr>
          </thead>
          <tbody>
            {([0, 1] as const).flatMap((ra) =>
              ([0, 1] as const).map((rb) => {
                const row = evaluateDeMorgan(law, ra, rb);
                const active = ra === a && rb === b;
                return (
                  <tr
                    key={`${ra}-${rb}`}
                    onClick={() => {
                      setA(ra);
                      setB(rb);
                    }}
                    className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer ${
                      active ? 'bg-blue-50 dark:bg-blue-950/50 font-bold' : ''
                    }`}
                  >
                    <td className="py-1.5">{ra}</td>
                    <td className="py-1.5">{rb}</td>
                    <td className="py-1.5">{row.notA}</td>
                    <td className="py-1.5">{row.notB}</td>
                    <td className="py-1.5">{row.lhsOut}</td>
                    <td className="py-1.5">{row.rhsOut}</td>
                    <td className="py-1.5 text-emerald-600 dark:text-emerald-400">✓ Match</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
