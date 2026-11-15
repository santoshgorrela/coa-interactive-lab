import React, { useEffect, useState } from 'react';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

type CpuBlock = 'PC' | 'MAR' | 'MDR' | 'IR' | 'CU' | 'ALU' | 'REGS';

const BLOCK_DESC: Record<CpuBlock, { title: string; desc: string }> = {
  PC: { title: 'Program Counter (PC)', desc: 'Holds the memory address of the next instruction to be fetched sequentially (incremented after fetch).' },
  MAR: { title: 'Memory Address Register (MAR)', desc: 'Connected directly to the Address Bus; holds the target address for every memory Read or Write.' },
  MDR: { title: 'Memory Data Register (MDR)', desc: 'Two-way buffer holding data/instructions arriving from or going to Main Memory over the Data Bus.' },
  IR: { title: 'Instruction Register (IR)', desc: 'Stores the active instruction opcode and operand specifiers while the Control Unit decodes it.' },
  CU: { title: 'Control Unit (CU)', desc: 'Nerve center that decodes IR and sends timing pulses (T1–T4) to coordinate ALU, registers, and memory.' },
  ALU: { title: 'Arithmetic Logic Unit (ALU)', desc: 'Executes integer arithmetic and bitwise logic using operands from Operational Registers or MDR.' },
  REGS: { title: 'General-Purpose Registers (R0–Rn-1)', desc: 'Fast working registers inside the CPU storing variables and intermediate arithmetic results.' },
};

const CLOCK_STEPS = [
  {
    t: 'T1',
    op: 'Fetch Address',
    active: ['PC', 'MAR'] as CpuBlock[],
    rtl: 'MAR ← [PC]',
    pc: '0x0400',
    mar: '0x0400',
    mdr: '—',
    ir: '—',
    r1: '0x0A',
    r2: '0x14',
    note: 'PC sends address 0x0400 to MAR to fetch the ADD R1, R2 instruction.',
  },
  {
    t: 'T2',
    op: 'Memory Read → IR',
    active: ['MAR', 'MDR', 'IR', 'PC'] as CpuBlock[],
    rtl: 'MDR ← M[MAR], IR ← [MDR], PC ← PC + 4',
    pc: '0x0404',
    mar: '0x0400',
    mdr: 'ADD R1, R2',
    ir: 'ADD R1, R2',
    r1: '0x0A',
    r2: '0x14',
    note: 'Instruction word arrives into MDR, transfers into IR, and PC advances to 0x0404.',
  },
  {
    t: 'T3',
    op: 'Decode & ALU Execute',
    active: ['IR', 'CU', 'REGS', 'ALU'] as CpuBlock[],
    rtl: 'ALU ← [R1] + [R2]',
    pc: '0x0404',
    mar: '0x0400',
    mdr: 'ADD R1, R2',
    ir: 'ADD R1, R2',
    r1: '0x0A (10)',
    r2: '0x14 (20)',
    note: 'CU decodes ADD R1, R2 and routes R1 (10) and R2 (20) into the ALU.',
  },
  {
    t: 'T4',
    op: 'Write-Back to R2',
    active: ['ALU', 'REGS', 'CU'] as CpuBlock[],
    rtl: 'R2 ← 0x1E (30)',
    pc: '0x0404',
    mar: '0x0400',
    mdr: 'ADD R1, R2',
    ir: 'ADD R1, R2',
    r1: '0x0A (10)',
    r2: '0x1E (30)',
    note: 'ALU result 0x1E (30) is latched back into destination register R2.',
  },
];

export const CpuRegisterLab: React.FC = () => {
  const [selected, setSelected] = useState<CpuBlock>('PC');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(900);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStepIdx((s) => (s + 1) % CLOCK_STEPS.length), speedMs);
    return () => window.clearInterval(id);
  }, [playing, speedMs]);

  const cur = CLOCK_STEPS[stepIdx];

  return (
    <div className="space-y-4">
      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setStepIdx((s) => (s + 1) % CLOCK_STEPS.length)}
        onReset={() => {
          setPlaying(false);
          setStepIdx(0);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        stepText={`${cur.t}: ${cur.op} (${cur.rtl})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <svg viewBox="0 0 740 340" className="w-full h-auto select-none">
            {/* CPU Boundary */}
            <rect x={18} y={18} width={520} height={304} rx={14} className="fill-slate-50/70 dark:fill-slate-950/60" stroke="#94A3B8" strokeDasharray="5 4" />
            <text x={278} y={38} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono font-bold">
              INTERNAL CPU ARCHITECTURE (ADD R1, R2)
            </text>

            <ArchBlock x={42} y={58} width={135} height={68} title="PC" subtitle="Program Counter" value={cur.pc} active={cur.active.includes('PC')} selected={selected === 'PC'} onClick={() => setSelected('PC')} />
            <ArchBlock x={42} y={146} width={135} height={68} title="IR" subtitle="Instruction Reg" value={cur.ir} active={cur.active.includes('IR')} selected={selected === 'IR'} onClick={() => setSelected('IR')} />
            <ArchBlock x={42} y={234} width={135} height={68} title="Control Unit" subtitle="Timing & Decode" active={cur.active.includes('CU')} selected={selected === 'CU'} onClick={() => setSelected('CU')} />

            <ArchBlock x={212} y={58} width={135} height={68} title="MAR" subtitle="Address Register" value={cur.mar} active={cur.active.includes('MAR')} selected={selected === 'MAR'} onClick={() => setSelected('MAR')} />
            <ArchBlock x={212} y={146} width={135} height={68} title="MDR" subtitle="Data Register" value={cur.mdr} active={cur.active.includes('MDR')} selected={selected === 'MDR'} onClick={() => setSelected('MDR')} />

            <ArchBlock x={378} y={58} width={140} height={116} title="Registers" subtitle={`R1 = ${cur.r1}`} value={`R2 = ${cur.r2}`} active={cur.active.includes('REGS')} selected={selected === 'REGS'} onClick={() => setSelected('REGS')} />
            <ArchBlock x={378} y={196} width={140} height={106} title="ALU" subtitle="32-bit Adder/Logic" value={stepIdx >= 2 ? '10 + 20 = 30' : 'Ready'} active={cur.active.includes('ALU')} selected={selected === 'ALU'} accent="cyan" onClick={() => setSelected('ALU')} />

            {/* External Memory Block */}
            <ArchBlock x={578} y={76} width={142} height={164} title="Main Memory" subtitle="0x0400: ADD R1,R2" value="Bus Connected" active={stepIdx === 0 || stepIdx === 1} accent="navy" />

            <SignalWire d="M 177 92 L 212 92" active={stepIdx === 0} high={stepIdx === 0} />
            <SignalWire d="M 347 92 L 578 92" active={stepIdx === 0 || stepIdx === 1} high={stepIdx === 0} label="Address Bus" labelX={460} labelY={46} />
            <SignalWire d="M 347 180 L 578 180" active={stepIdx === 1} high={stepIdx === 1} bidirectional />
            <SignalWire d="M 212 180 L 177 180" active={stepIdx === 1} high={stepIdx === 1} />
            <SignalWire d="M 110 214 L 110 234" active={stepIdx >= 2} />
            <SignalWire d="M 448 174 L 448 196" active={stepIdx >= 2} high={stepIdx >= 2} bidirectional />
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <div className="text-[11px] font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              CLOCK CYCLE {cur.t}
            </div>
            <div className="font-mono text-sm font-bold text-[#14213D] dark:text-white">{cur.rtl}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{cur.note}</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <div className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              CLICKED REGISTER / UNIT
            </div>
            <h4 className="text-sm font-bold text-[#14213D] dark:text-white">{BLOCK_DESC[selected].title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{BLOCK_DESC[selected].desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
