import React, { useEffect, useState } from 'react';
import { FlynnMode, getFlynnArchitecture } from '../../../simulators/logic/parallelArmEngine';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

const MODES: FlynnMode[] = ['SISD', 'SIMD', 'MISD', 'MIMD'];

export const FlynnsLab: React.FC = () => {
  const [mode, setMode] = useState<FlynnMode>('SIMD');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const arch = getFlynnArchitecture(mode);
  const step = arch.steps[stepIdx % arch.steps.length];

  useEffect(() => {
    setStepIdx(0);
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStepIdx((s) => (s + 1) % arch.steps.length), 1000);
    return () => window.clearInterval(id);
  }, [playing, arch.steps.length]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold cursor-pointer ${
              mode === m ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setStepIdx((s) => (s + 1) % arch.steps.length)}
        onReset={() => {
          setPlaying(false);
          setStepIdx(0);
        }}
        stepText={`${mode} · Cycle ${step.cycle}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <svg viewBox="0 0 660 250" className="w-full h-auto select-none">
            {/* Control Unit(s) */}
            {Array.from({ length: arch.controlUnits }, (_, i) => {
              const y = arch.controlUnits === 1 ? 95 : 22 + i * 56;
              return (
                <g key={`cu-${i}`}>
                  <ArchBlock
                    x={30}
                    y={y}
                    width={145}
                    height={46}
                    title={`CU ${i + 1}`}
                    value={step.instructionStream[i] ?? step.instructionStream[0]}
                    active
                  />
                  {arch.controlUnits === 1 && arch.processingElements === 4 ? (
                    [0, 1, 2, 3].map((p) => (
                      <SignalWire key={p} d={`M 175 118 L 285 ${45 + p * 56}`} active high />
                    ))
                  ) : (
                    <SignalWire d={`M 175 ${y + 23} L 285 ${y + 23}`} active high />
                  )}
                </g>
              );
            })}

            {/* Processing Elements */}
            {Array.from({ length: arch.processingElements }, (_, p) => {
              const y = arch.processingElements === 1 ? 95 : 22 + p * 56;
              const dataLabel = step.dataStreams[p] ?? step.dataStreams[0];
              const outLabel = step.outputs[p] ?? step.outputs[0];
              return (
                <g key={`pe-${p}`}>
                  <ArchBlock
                    x={285}
                    y={y}
                    width={155}
                    height={46}
                    title={`PE ${p + 1} (ALU)`}
                    value={outLabel}
                    active
                    accent="cyan"
                  />
                  <SignalWire d={`M 440 ${y + 23} L 510 ${y + 23}`} active high bidirectional={mode !== 'SISD'} />
                  <rect x={510} y={y + 4} width={132} height={38} rx={8} className="fill-slate-100 dark:fill-slate-800" stroke="#94A3B8" />
                  <text x={576} y={y + 27} textAnchor="middle" className="fill-[#14213D] dark:fill-slate-100 text-[10px] font-mono font-bold">
                    {dataLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            FLYNN&apos;S TAXONOMY (1966)
          </div>
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">{arch.fullName}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{arch.summary}</p>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs font-mono">
            <div className="text-slate-500">Examples:</div>
            <div className="mt-1 font-semibold text-[#14213D] dark:text-white">{arch.examples}</div>
          </div>
          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300">{step.note}</div>
        </div>
      </div>
    </div>
  );
};
