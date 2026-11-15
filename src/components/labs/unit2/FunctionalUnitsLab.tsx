import React, { useEffect, useState } from 'react';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

const FLOW_STAGES = [
  {
    title: 'Stage 1: Input Unit Accepts Binary Data',
    active: 'INPUT',
    wire: 'in_mem',
    desc: 'Input devices encode external keystrokes or sensor signals into binary words and transfer them into Main Memory.',
  },
  {
    title: 'Stage 2: Memory Stores Instructions & Operands',
    active: 'MEM',
    wire: 'mem_cpu',
    desc: 'Primary Memory holds both program instructions and operands at unique addresses ready for fast CPU access.',
  },
  {
    title: 'Stage 3: Processing Unit (CU + ALU) Executes',
    active: 'PROC',
    wire: 'cpu_mem',
    desc: 'Control Unit decodes instructions and issues timing signals while ALU performs arithmetic and logic operations.',
  },
  {
    title: 'Stage 4: Output Unit Delivers Result',
    active: 'OUTPUT',
    wire: 'proc_out',
    desc: 'Processed binary results leave Memory/CPU and are converted into human-readable display or actuator output.',
  },
];

export const FunctionalUnitsLab: React.FC = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(900);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % FLOW_STAGES.length), speedMs);
    return () => window.clearInterval(t);
  }, [playing, speedMs]);

  const cur = FLOW_STAGES[step];

  return (
    <div className="space-y-4">
      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setStep((s) => (s + 1) % FLOW_STAGES.length)}
        onReset={() => {
          setPlaying(false);
          setStep(0);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        stepText={cur.title}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <svg viewBox="0 0 760 270" className="w-full h-auto select-none">
            <ArchBlock
              x={20}
              y={80}
              width={145}
              height={96}
              title="1. Input Unit"
              subtitle="Keyboard / ADC"
              value="Input = 12, 8"
              active={cur.active === 'INPUT'}
              selected={step === 0}
              onClick={() => setStep(0)}
            />
            <ArchBlock
              x={210}
              y={32}
              width={155}
              height={96}
              title="2. Memory Unit"
              subtitle="Primary & Secondary"
              value="M[0x10]=12, 8"
              active={cur.active === 'MEM'}
              selected={step === 1}
              onClick={() => setStep(1)}
            />
            <ArchBlock
              x={415}
              y={32}
              width={165}
              height={166}
              title="3. Processing"
              subtitle="ALU + Control Unit"
              value={step >= 2 ? 'Result: 12 + 8 = 20' : 'Idle'}
              active={cur.active === 'PROC'}
              selected={step === 2}
              accent="cyan"
              onClick={() => setStep(2)}
            />
            <ArchBlock
              x={605}
              y={80}
              width={135}
              height={96}
              title="4. Output Unit"
              subtitle="Monitor / Printer"
              value={step === 3 ? 'Display: 20' : 'Waiting'}
              active={cur.active === 'OUTPUT'}
              selected={step === 3}
              accent="emerald"
              onClick={() => setStep(3)}
            />

            {/* Control Signals line at bottom */}
            <rect
              x={210}
              y={218}
              width={370}
              height={32}
              rx={7}
              className="fill-slate-100 dark:fill-slate-800"
              stroke="#94A3B8"
              strokeWidth={1.2}
            />
            <text x={395} y={238} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-semibold">
              CONTROL SIGNALS (Timing, Read/Write, Interrupts)
            </text>

            <SignalWire d="M 165 128 L 210 80" active={step === 0 || step === 1} high={step === 0} />
            <SignalWire d="M 365 80 L 415 80" active={step === 1 || step === 2} high={step === 1 || step === 2} bidirectional />
            <SignalWire d="M 580 120 L 605 120" active={step === 3} high={step === 3} />
            <SignalWire d="M 498 198 L 498 218" active={step === 2} />
            <SignalWire d="M 288 218 L 288 128" active={step === 1 || step === 2} />
          </svg>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            INFORMATION FLOW STEP {step + 1}/4
          </div>
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">{cur.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cur.desc}</p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
            {['Input', 'Memory', 'Processing', 'Output'].map((lbl, idx) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setStep(idx)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  step === idx ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
