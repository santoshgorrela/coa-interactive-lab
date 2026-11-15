import React, { useEffect, useState } from 'react';
import {
  getInstructionCycleTrace,
  InstructionCycleProgramId,
} from '../../../simulators/logic/processorPipelineEngine';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

export const InstructionCycleLab: React.FC = () => {
  const [programId, setProgramId] = useState<InstructionCycleProgramId>('add_indirect');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(900);

  const trace = getInstructionCycleTrace(programId);
  const cur = trace.steps[stepIdx] ?? trace.steps[0];

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [programId]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStepIdx((s) => (s + 1) % trace.steps.length);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [playing, speedMs, trace.steps.length]);

  const isCompActive = (c: string) => cur.activeComponents.includes(c);

  return (
    <div className="space-y-4">
      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setStepIdx((s) => (s + 1) % trace.steps.length)}
        onReset={() => {
          setPlaying(false);
          setStepIdx(0);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        selectedExample={programId}
        onSelectExample={(val) => setProgramId(val as InstructionCycleProgramId)}
        examples={[
          { label: 'ADD (R3), R1 (7 Steps)', value: 'add_indirect' },
          { label: 'LOAD R1, [0x300] (5 Steps)', value: 'load_loc' },
          { label: 'BR +0x18 Branch (5 Steps)', value: 'branch_offset' },
        ]}
        stepText={`${cur.label} (${cur.phase}): ${cur.rtl}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Single-Bus Datapath SVG */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-[#14213D] dark:text-white">{trace.instruction}</span>
            <span className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              Step {cur.step}/{trace.steps.length} · {cur.phase}
            </span>
          </div>

          <svg viewBox="0 0 740 360" className="w-full h-auto select-none">
            {/* Internal Single Processor Bus (Central Spine) */}
            <SignalWire d="M 370 20 L 370 340" active={cur.activeBus} high={cur.activeBus} />
            <text x={370} y={14} textAnchor="middle" className="fill-[#2563EB] dark:fill-[#22D3EE] text-[10px] font-mono font-bold">
              INTERNAL PROCESSOR SINGLE BUS
            </text>

            {/* Left column registers */}
            <ArchBlock x={30} y={24} width={155} height={64} title="PC" subtitle="Program Counter" value={cur.registers.PC} active={isCompActive('PC')} />
            <ArchBlock x={30} y={102} width={155} height={64} title="MAR" subtitle="Addr Register" value={cur.registers.MAR} active={isCompActive('MAR')} />
            <ArchBlock x={30} y={180} width={155} height={64} title="MDR" subtitle="Data Register" value={cur.registers.MDR} active={isCompActive('MDR')} />
            <ArchBlock x={30} y={258} width={155} height={64} title="IR" subtitle="Instruction Reg" value={cur.registers.IR} active={isCompActive('IR')} />

            {/* Right column ALU & Temp & General Registers */}
            <ArchBlock x={545} y={24} width={165} height={64} title="R1 / R3 Registers" subtitle={`R1=${cur.registers.R1}`} value={`R3=${cur.registers.R3}`} active={isCompActive('R1') || isCompActive('R3')} />
            <ArchBlock x={545} y={102} width={165} height={64} title="Register Y" subtitle="ALU Input A Latch" value={cur.registers.Y} active={isCompActive('Y')} />
            <ArchBlock x={420} y={182} width={96} height={52} title="MUX" subtitle="4 / Y" active={isCompActive('MUX')} accent="amber" />
            <ArchBlock x={545} y={180} width={165} height={64} title="ALU" subtitle="Add / Sub / Logic" value={cur.phase} active={isCompActive('ALU')} accent="cyan" />
            <ArchBlock x={545} y={258} width={165} height={64} title="Register Z" subtitle="ALU Output Latch" value={cur.registers.Z} active={isCompActive('Z')} />

            {/* Connections to Central Bus */}
            <SignalWire d="M 185 56 L 370 56" active={isCompActive('PC')} high={isCompActive('PC')} />
            <SignalWire d="M 185 134 L 370 134" active={isCompActive('MAR')} high={isCompActive('MAR')} />
            <SignalWire d="M 185 212 L 370 212" active={isCompActive('MDR')} high={isCompActive('MDR')} bidirectional />
            <SignalWire d="M 185 290 L 370 290" active={isCompActive('IR')} high={isCompActive('IR')} />

            <SignalWire d="M 370 56 L 545 56" active={isCompActive('R1') || isCompActive('R3')} high={isCompActive('R1') || isCompActive('R3')} bidirectional />
            <SignalWire d="M 370 134 L 545 134" active={isCompActive('Y')} high={isCompActive('Y')} />
            <SignalWire d="M 370 208 L 420 208" active={isCompActive('MUX')} high={isCompActive('MUX')} />
            <SignalWire d="M 516 208 L 545 208" active={isCompActive('ALU')} high={isCompActive('ALU')} />
            <SignalWire d="M 628 166 L 628 180" active={isCompActive('Y') && isCompActive('ALU')} />
            <SignalWire d="M 628 244 L 628 258" active={isCompActive('ALU') || isCompActive('Z')} high={isCompActive('Z')} />
            <SignalWire d="M 545 290 L 370 290" active={isCompActive('Z')} high={isCompActive('Z')} />
          </svg>
        </div>

        {/* Control Signals & Explanation Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              MICRO-OPERATION {cur.label} · {cur.phase.toUpperCase()}
            </div>
            <div className="font-mono text-sm font-bold text-[#14213D] dark:text-white">{cur.rtl}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{cur.explanation}</p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-mono text-slate-500 mb-2">ACTIVE CONTROL SIGNALS</div>
              <div className="flex flex-wrap gap-1.5">
                {cur.controlSignals.map((sig) => (
                  <span
                    key={sig}
                    className="rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 font-mono text-[11px] font-bold text-[#2563EB] dark:text-[#22D3EE]"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="text-[11px] font-mono text-slate-500 mb-2">SEQUENCE TIMELINE</div>
            <div className="space-y-1">
              {trace.steps.map((st, idx) => (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setStepIdx(idx)}
                  className={`w-full text-left rounded-lg px-2.5 py-1.5 font-mono text-xs cursor-pointer ${
                    idx === stepIdx
                      ? 'bg-[#2563EB] text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {st.label}: {st.rtl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
