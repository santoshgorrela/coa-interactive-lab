import React, { useState } from 'react';
import { AluOperation, runAlu } from '../../../simulators/logic/aluAdderEngine';
import { SignalWire } from '../../diagrams/SvgPrimitives';

const OPS: AluOperation[] = ['ADD', 'SUB', 'AND', 'OR', 'XOR', 'NOT'];

export const AluLab: React.FC = () => {
  const [width, setWidth] = useState<4 | 8>(4);
  const [aVal, setAVal] = useState(5);
  const [bVal, setBVal] = useState(3);
  const [op, setOp] = useState<AluOperation>('ADD');
  const [cin, setCin] = useState<0 | 1>(0);

  const maxVal = width === 4 ? 15 : 255;
  const clampedA = Math.min(maxVal, Math.max(0, aVal));
  const clampedB = Math.min(maxVal, Math.max(0, bVal));

  const res = runAlu(clampedA, clampedB, op, width, cin);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="flex flex-wrap gap-1.5">
          {OPS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOp(o)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold cursor-pointer ${
                op === o ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setWidth(4)}
            className={`px-2.5 py-1 rounded font-mono font-semibold cursor-pointer ${
              width === 4 ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            4-Bit ALU
          </button>
          <button
            type="button"
            onClick={() => setWidth(8)}
            className={`px-2.5 py-1 rounded font-mono font-semibold cursor-pointer ${
              width === 8 ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            8-Bit ALU
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live ALU Datapath SVG */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 lab-grid-bg">
          <svg viewBox="0 0 520 278" className="w-full h-auto select-none">
            {/* Input A & B wires */}
            <SignalWire d="M 45 55 L 155 55" active high label={`A = ${res.aBinary} (${res.aUnsigned})`} labelX={96} labelY={43} />
            <SignalWire d="M 45 195 L 155 195" active={op !== 'NOT'} high={op !== 'NOT'} label={`B = ${res.bBinary} (${res.bUnsigned})`} labelX={96} labelY={183} />

            {/* ALU Trapezoid Symbol */}
            <polygon
              points="160,26 320,76 320,174 160,224 160,145 195,125 160,105"
              className="fill-blue-50 dark:fill-slate-800"
              stroke="#2563EB"
              strokeWidth={2.5}
            />
            <text x={246} y={118} textAnchor="middle" className="fill-[#14213D] dark:fill-white text-[15px] font-bold font-display">
              {width}-BIT ALU
            </text>
            <text x={246} y={138} textAnchor="middle" className="fill-[#2563EB] dark:fill-[#22D3EE] text-[12px] font-mono font-bold">
              OP: {op} (M={res.selectBits.modeM})
            </text>

            {/* Control Select bottom */}
            <SignalWire d="M 240 248 L 240 199" active high label={`S=${res.selectBits.s2}${res.selectBits.s1}${res.selectBits.s0} Cin=${res.cin}`} labelX={240} labelY={266} />

            {/* Output C wire */}
            <SignalWire d="M 320 125 L 470 125" active high />
            <rect x={375} y={96} width={130} height={58} rx={10} className="fill-slate-900 dark:fill-slate-800" stroke="#22D3EE" strokeWidth={2} />
            <text x={440} y={120} textAnchor="middle" className="fill-[#22D3EE] text-[14px] font-mono font-bold">
              {res.resultBinary}
            </text>
            <text x={440} y={140} textAnchor="middle" className="fill-slate-300 text-[11px] font-mono">
              U:{res.resultUnsigned} | S:{res.resultSigned}
            </text>
          </svg>

          <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono text-slate-700 dark:text-slate-200">
            {res.explanation}
          </div>
        </div>

        {/* Inputs & Status Flags */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#14213D] dark:text-white">Operand Controls</h3>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Operand A</span>
                <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">
                  {res.aBinary} (Dec {res.aUnsigned} / Signed {res.aSigned})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={maxVal}
                value={clampedA}
                onChange={(e) => setAVal(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Operand B</span>
                <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">
                  {res.bBinary} (Dec {res.bUnsigned} / Signed {res.bSigned})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={maxVal}
                value={clampedB}
                onChange={(e) => setBVal(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {op === 'ADD' && (
              <button
                type="button"
                onClick={() => setCin((c) => (c === 1 ? 0 : 1))}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                Carry-In (Cin) = {cin}
              </button>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              ALU Status Flags
            </div>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {[
                { key: 'C', label: 'Carry', val: res.cout },
                { key: 'Z', label: 'Zero', val: res.zero ? 1 : 0 },
                { key: 'V', label: 'Overflow', val: res.overflow ? 1 : 0 },
                { key: 'N', label: 'Negative', val: res.negative ? 1 : 0 },
              ].map((f) => (
                <div
                  key={f.key}
                  className={`rounded-lg border p-2.5 ${
                    f.val === 1
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#22D3EE]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="text-base font-bold">{f.key}={f.val}</div>
                  <div className="text-[10px]">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
