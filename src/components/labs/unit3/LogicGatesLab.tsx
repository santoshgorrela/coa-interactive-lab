import React, { useEffect, useState } from 'react';
import {
  evaluateGate,
  GATE_METADATA,
  GateType,
  getGateTruthTable,
} from '../../../simulators/logic/booleanEngine';
import { SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

const GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

function renderGateSymbol(gate: GateType) {
  const isNot = gate === 'NOT';
  const hasBubble = gate === 'NAND' || gate === 'NOR' || gate === 'XNOR' || gate === 'NOT';
  const isOrFamily = gate === 'OR' || gate === 'NOR' || gate === 'XOR' || gate === 'XNOR';
  const hasXorCurve = gate === 'XOR' || gate === 'XNOR';

  if (isNot) {
    return (
      <g>
        <polygon
          points="200,72 200,148 286,110"
          className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
          strokeWidth={3}
        />
        <circle cx={294} cy={110} r={7} className="fill-white dark:fill-slate-900 stroke-[#14213D] dark:stroke-slate-200" strokeWidth={2.6} />
      </g>
    );
  }

  if (!isOrFamily) {
    // AND / NAND
    return (
      <g>
        <path
          d="M 195 65 L 245 65 A 45 45 0 0 1 245 155 L 195 155 Z"
          className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
          strokeWidth={3}
        />
        {hasBubble && (
          <circle cx={298} cy={110} r={7} className="fill-white dark:fill-slate-900 stroke-[#14213D] dark:stroke-slate-200" strokeWidth={2.6} />
        )}
      </g>
    );
  }

  // OR / NOR / XOR / XNOR
  return (
    <g>
      {hasXorCurve && (
        <path
          d="M 183 65 Q 203 110 183 155"
          fill="none"
          className="stroke-[#14213D] dark:stroke-slate-200"
          strokeWidth={3}
        />
      )}
      <path
        d="M 195 65 Q 215 110 195 155 L 240 155 Q 280 150 296 110 Q 280 70 240 65 Z"
        className="fill-blue-50 dark:fill-slate-800 stroke-[#14213D] dark:stroke-slate-200"
        strokeWidth={3}
      />
      {hasBubble && (
        <circle cx={304} cy={110} r={7} className="fill-white dark:fill-slate-900 stroke-[#14213D] dark:stroke-slate-200" strokeWidth={2.6} />
      )}
    </g>
  );
}

export const LogicGatesLab: React.FC = () => {
  const [gate, setGate] = useState<GateType>('AND');
  const [a, setA] = useState<0 | 1>(1);
  const [b, setB] = useState<0 | 1>(0);
  const [playing, setPlaying] = useState(false);

  const meta = GATE_METADATA[gate];
  const out = evaluateGate(gate, a, b);
  const rows = getGateTruthTable(gate);

  useEffect(() => {
    if (!playing) return;
    const cases: [0 | 1, 0 | 1][] = gate === 'NOT' ? [[0, 0], [1, 0]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
    let idx = cases.findIndex(([ca, cb]) => ca === a && (gate === 'NOT' || cb === b));
    const timer = window.setInterval(() => {
      idx = (idx + 1) % cases.length;
      setA(cases[idx][0]);
      setB(cases[idx][1]);
    }, 900);
    return () => window.clearInterval(timer);
  }, [playing, gate, a, b]);

  const outStart = gate === 'NOT' ? 301 : gate === 'NAND' ? 305 : gate === 'NOR' || gate === 'XNOR' ? 311 : 294;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
        <div className="flex flex-wrap gap-1.5">
          {GATES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGate(g)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold cursor-pointer transition-colors ${
                gate === g
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          IC {meta.icCode} · {meta.formula}
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
        stepText={`Output Y = ${out} (${out === 1 ? 'HIGH' : 'LOW'})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Gate SVG Stage */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 lab-grid-bg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#14213D] dark:text-white">{meta.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">{meta.description}</p>
            </div>
            <div className="font-mono text-sm font-bold text-[#2563EB] dark:text-[#22D3EE]">{meta.formula}</div>
          </div>

          <svg viewBox="0 0 460 220" className="w-full h-auto select-none">
            {/* Input wires */}
            {meta.unary ? (
              <SignalWire d="M 96 110 L 200 110" active={a === 1} high={a === 1} />
            ) : (
              <>
                <SignalWire d={`M 96 86 L ${gate === 'XOR' || gate === 'XNOR' ? 191 : 198} 86`} active={a === 1} high={a === 1} />
                <SignalWire d={`M 96 134 L ${gate === 'XOR' || gate === 'XNOR' ? 191 : 198} 134`} active={b === 1} high={b === 1} />
              </>
            )}

            {/* Output wire */}
            <SignalWire d={`M ${outStart} 110 L 386 110`} active={out === 1} high={out === 1} />

            {/* Gate symbol */}
            {renderGateSymbol(gate)}

            {/* Input Toggle Switches */}
            <g onClick={() => setA((v) => (v === 1 ? 0 : 1))} className="cursor-pointer">
              <rect
                x={26}
                y={meta.unary ? 92 : 68}
                width={70}
                height={36}
                rx={8}
                fill={a === 1 ? '#2563EB' : '#E2E8F0'}
              />
              <text
                x={61}
                y={meta.unary ? 115 : 91}
                textAnchor="middle"
                className={`text-[13px] font-mono font-bold ${a === 1 ? 'fill-white' : 'fill-slate-800'}`}
              >
                A = {a}
              </text>
            </g>

            {!meta.unary && (
              <g onClick={() => setB((v) => (v === 1 ? 0 : 1))} className="cursor-pointer">
                <rect x={26} y={116} width={70} height={36} rx={8} fill={b === 1 ? '#2563EB' : '#E2E8F0'} />
                <text
                  x={61}
                  y={139}
                  textAnchor="middle"
                  className={`text-[13px] font-mono font-bold ${b === 1 ? 'fill-white' : 'fill-slate-800'}`}
                >
                  B = {b}
                </text>
              </g>
            )}

            {/* Output Lamp */}
            <circle
              cx={410}
              cy={110}
              r={24}
              fill={out === 1 ? '#22D3EE' : '#1E293B'}
              stroke={out === 1 ? '#2563EB' : '#64748B'}
              strokeWidth={3}
            />
            <text
              x={410}
              y={115}
              textAnchor="middle"
              className={`text-[14px] font-mono font-bold ${out === 1 ? 'fill-[#14213D]' : 'fill-slate-300'}`}
            >
              Y={out}
            </text>
          </svg>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setA((v) => (v === 1 ? 0 : 1))}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
            >
              Toggle Input A ({a})
            </button>
            {!meta.unary && (
              <button
                type="button"
                onClick={() => setB((v) => (v === 1 ? 0 : 1))}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                Toggle Input B ({b})
              </button>
            )}
          </div>
        </div>

        {/* Truth Table Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE] mb-3">
            Live Truth Table ({gate})
          </div>
          <table className="w-full text-sm font-mono text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="py-2">A</th>
                {!meta.unary && <th className="py-2">B</th>}
                <th className="py-2">Output Y</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const match = r.a === a && (meta.unary || r.b === b);
                return (
                  <tr
                    key={i}
                    onClick={() => {
                      setA(r.a);
                      if (r.b !== undefined) setB(r.b);
                    }}
                    className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer ${
                      match ? 'bg-blue-50 dark:bg-blue-950/50 font-bold text-[#2563EB] dark:text-[#22D3EE]' : ''
                    }`}
                  >
                    <td className="py-2">{r.a}</td>
                    {!meta.unary && <td className="py-2">{r.b}</td>}
                    <td className="py-2">{r.out}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
