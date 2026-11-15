import React, { useEffect, useState } from 'react';
import {
  carryLookAheadAdder,
  fullAdder,
  halfAdder,
  rippleCarryAdder,
} from '../../../simulators/logic/aluAdderEngine';
import { SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

type AdderTab = 'half' | 'full' | 'rca' | 'cla';

export const AddersLab: React.FC = () => {
  const [tab, setTab] = useState<AdderTab>('rca');
  const [aBit, setABit] = useState<0 | 1>(1);
  const [bBit, setBBit] = useState<0 | 1>(1);
  const [cinBit, setCinBit] = useState<0 | 1>(1);

  const [a4, setA4] = useState(9); // 1001
  const [b4, setB4] = useState(7); // 0111 (triggers full carry ripple!)
  const [cin4, setCin4] = useState<0 | 1>(0);
  const [waveStage, setWaveStage] = useState(3);
  const [playing, setPlaying] = useState(false);

  const ha = halfAdder(aBit, bBit);
  const fa = fullAdder(aBit, bBit, cinBit);
  const rca = rippleCarryAdder(a4, b4, cin4, 4);
  const cla = carryLookAheadAdder(a4, b4, cin4);

  useEffect(() => {
    if (!playing || tab !== 'rca') return;
    const id = window.setInterval(() => setWaveStage((s) => (s + 1) % 4), 800);
    return () => window.clearInterval(id);
  }, [playing, tab]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
        {[
          { id: 'half', label: 'Half Adder' },
          { id: 'full', label: 'Full Adder' },
          { id: 'rca', label: '4-Bit Ripple Carry Adder' },
          { id: 'cla', label: 'Carry Look-Ahead Adder (74182)' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as AdderTab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              tab === t.id ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Half Adder & Full Adder */}
      {(tab === 'half' || tab === 'full') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 lab-grid-bg space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setABit((v) => (v === 1 ? 0 : 1))}
                className="rounded-lg bg-[#2563EB] text-white px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                A = {aBit}
              </button>
              <button
                type="button"
                onClick={() => setBBit((v) => (v === 1 ? 0 : 1))}
                className="rounded-lg bg-[#2563EB] text-white px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                B = {bBit}
              </button>
              {tab === 'full' && (
                <button
                  type="button"
                  onClick={() => setCinBit((v) => (v === 1 ? 0 : 1))}
                  className="rounded-lg bg-[#2563EB] text-white px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
                >
                  Cin = {cinBit}
                </button>
              )}
            </div>

            <svg viewBox="0 0 460 200" className="w-full h-auto">
              <SignalWire d="M 60 65 L 175 65" active={aBit === 1} high={aBit === 1} label={`A=${aBit}`} labelX={34} labelY={69} />
              <SignalWire d="M 60 120 L 175 120" active={bBit === 1} high={bBit === 1} label={`B=${bBit}`} labelX={34} labelY={124} />
              {tab === 'full' && (
                <SignalWire d="M 60 165 L 220 165 L 220 135" active={cinBit === 1} high={cinBit === 1} label={`Cin=${cinBit}`} labelX={34} labelY={169} />
              )}

              <rect x={175} y={42} width={155} height={105} rx={12} className="fill-blue-50 dark:fill-slate-800" stroke="#2563EB" strokeWidth={2} />
              <text x={252} y={76} textAnchor="middle" className="fill-[#14213D] dark:fill-white text-[13px] font-bold">
                {tab === 'half' ? 'HALF ADDER' : 'FULL ADDER'}
              </text>
              <text x={252} y={96} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px] font-mono">
                {tab === 'half' ? 'S = A ⊕ B' : 'S = A ⊕ B ⊕ Cin'}
              </text>
              <text x={252} y={114} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px] font-mono">
                {tab === 'half' ? 'C = A · B' : 'Cout = AB + (A⊕B)Cin'}
              </text>

              <SignalWire
                d="M 330 72 L 405 72"
                active={(tab === 'half' ? ha.sum : fa.sum) === 1}
                high={(tab === 'half' ? ha.sum : fa.sum) === 1}
              />
              <SignalWire
                d="M 330 122 L 405 122"
                active={(tab === 'half' ? ha.carry : fa.cout) === 1}
                high={(tab === 'half' ? ha.carry : fa.cout) === 1}
              />

              <text x={425} y={76} className="fill-[#2563EB] dark:fill-[#22D3EE] text-[13px] font-mono font-bold">
                S={tab === 'half' ? ha.sum : fa.sum}
              </text>
              <text x={425} y={126} className="fill-[#2563EB] dark:fill-[#22D3EE] text-[13px] font-mono font-bold">
                C={tab === 'half' ? ha.carry : fa.cout}
              </text>
            </svg>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">
              {tab === 'half' ? 'Half Adder Equations' : 'Full Adder Equations'}
            </h3>
            <div className="font-mono text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-lg space-y-1">
              {tab === 'half' ? (
                <>
                  <div>Sum = A ⊕ B = {aBit} ⊕ {bBit} = <strong>{ha.sum}</strong></div>
                  <div>Carry = A · B = {aBit} · {bBit} = <strong>{ha.carry}</strong></div>
                </>
              ) : (
                <>
                  <div>Half1 (A⊕B) = {fa.half1Sum}, G = {fa.half1Carry}</div>
                  <div>Sum = (A⊕B) ⊕ Cin = <strong>{fa.sum}</strong></div>
                  <div>Cout = AB + (A⊕B)Cin = <strong>{fa.cout}</strong></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4-Bit Ripple Carry Adder & CLA */}
      {(tab === 'rca' || tab === 'cla') && (
        <div className="space-y-4">
          {tab === 'rca' && (
            <SimControlBar
              isPlaying={playing}
              onPlayPause={() => setPlaying((p) => !p)}
              onStep={() => setWaveStage((s) => (s + 1) % 4)}
              onReset={() => {
                setPlaying(false);
                setWaveStage(3);
              }}
              stepText={`Carry Wave Stage: FA${waveStage} (C${waveStage} → C${waveStage + 1})`}
            />
          )}

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-xs font-mono font-semibold flex items-center gap-2">
                <span>A (0–15): {a4} ({rca.aBinaryMsb})</span>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={a4}
                  onChange={(e) => setA4(Number(e.target.value))}
                />
              </label>
              <label className="text-xs font-mono font-semibold flex items-center gap-2">
                <span>B (0–15): {b4} ({rca.bBinaryMsb})</span>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={b4}
                  onChange={(e) => setB4(Number(e.target.value))}
                />
              </label>
              <button
                type="button"
                onClick={() => setCin4((c) => (c === 1 ? 0 : 1))}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-mono font-bold cursor-pointer"
              >
                C0 = {cin4}
              </button>
              <div className="ml-auto font-mono text-sm font-bold text-[#2563EB] dark:text-[#22D3EE]">
                Result: Cout={rca.cout} · Sum={rca.sumBinaryMsb} (Dec: {rca.decimalTotal})
              </div>
            </div>

            {tab === 'rca' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[...rca.stages].reverse().map((st) => {
                  const active = st.bitIndex <= waveStage;
                  return (
                    <div
                      key={st.bitIndex}
                      className={`rounded-xl border p-3.5 font-mono text-xs transition-all ${
                        st.bitIndex === waveStage
                          ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40'
                          : active
                            ? 'border-cyan-300 dark:border-cyan-800 bg-slate-50 dark:bg-slate-800/60'
                            : 'border-slate-200 dark:border-slate-800 opacity-50'
                      }`}
                    >
                      <div className="font-bold text-[#14213D] dark:text-white">Full Adder {st.bitIndex}</div>
                      <div className="mt-1 text-slate-600 dark:text-slate-300">
                        A{st.bitIndex}={st.a}, B{st.bitIndex}={st.b}, Cin={st.cin}
                      </div>
                      <div className="mt-2 flex justify-between font-bold text-[#2563EB] dark:text-[#22D3EE]">
                        <span>S{st.bitIndex} = {st.sum}</span>
                        <span>C{st.bitIndex + 1} = {st.cout}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
                    {[3, 2, 1, 0].map((i) => (
                      <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5">
                        <div className="font-bold text-[#14213D] dark:text-white">Bit {i}</div>
                        <div>P{i} = {cla.p[i]}</div>
                        <div>G{i} = {cla.g[i]}</div>
                        <div className="text-[#2563EB] dark:text-[#22D3EE] font-bold">
                          C{i + 1} = {cla.carries[i + 1]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-[#14213D] text-cyan-200 p-3 font-mono text-xs space-y-1">
                    {cla.equations.map((eq) => (
                      <div key={eq}>{eq}</div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 p-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#2563EB] dark:text-[#22D3EE]">
                    SPEED COMPARISON (4-BIT)
                  </div>
                  <div className="text-sm font-mono">
                    <div>Ripple Carry Delay: <strong>{cla.rcaGateDelays} gate delays</strong> (O(n))</div>
                    <div>CLA 74182 Delay: <strong>{cla.claGateDelays} gate delays</strong> (O(1) per block)</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Carry Look-Ahead computes C1–C4 simultaneously in two-level AND–OR logic from Propagate (Pi = Ai ⊕ Bi) and Generate (Gi = Ai · Bi).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
