import React, { useState } from 'react';
import { SimControlBar } from '../../diagrams/SvgPrimitives';

interface HierarchyLayer {
  level: number;
  name: string;
  mechanism: string;
  example: string;
  explanation: string;
}

const LAYERS: HierarchyLayer[] = [
  {
    level: 6,
    name: 'User Level',
    mechanism: 'Executable Applications & GUI',
    example: 'Spreadsheet / Browser / Simulation UI',
    explanation: 'End-user applications hide underlying software and hardware complexity behind interactive workflows.',
  },
  {
    level: 5,
    name: 'High-Level Language Level',
    mechanism: 'Compilers (C, Java, Python)',
    example: 'sum = a + b;',
    explanation: 'Human-readable statements compiled down to Assembly or bytecode instructions.',
  },
  {
    level: 4,
    name: 'Assembly Language Level',
    mechanism: 'Assembler (Mnemonics → Binary)',
    example: 'ADD R1, R2, R3',
    explanation: 'Symbolic 1-to-1 mnemonics translated by an assembler into binary Machine Level opcodes.',
  },
  {
    level: 3,
    name: 'System Software Level (OS)',
    mechanism: 'OS Kernel, System Calls & Scheduling',
    example: 'Process scheduling, Virtual Memory, I/O drivers',
    explanation: 'Manages hardware resource sharing, interrupts, file systems, and multiprogramming protection.',
  },
  {
    level: 2,
    name: 'Machine / ISA Level',
    mechanism: 'Binary Instruction Set Architecture',
    example: '1110 0000 1000 0010 0001 0000 0000 0011',
    explanation: 'Native binary opcodes understood directly by the CPU instruction decoder.',
  },
  {
    level: 1,
    name: 'Control Level (Microarchitecture)',
    mechanism: 'Hardwired Logic or Microprogram Control Store',
    example: 'R2_out, Y_in → R3_out, SelectY, Add, Z_in',
    explanation: 'Interprets Level 2 instructions step-by-step and drives control signals across buses and registers.',
  },
  {
    level: 0,
    name: 'Digital Logic Level',
    mechanism: 'Physical Gates, Adders & Flip-Flops',
    example: 'AND, OR, NOT, XOR, Full Adders, D Flip-Flops',
    explanation: 'Bottom physical silicon layer implementing Boolean logic and binary storage elements.',
  },
];

export const HierarchyLevelsLab: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const current = LAYERS.find((l) => l.level === selectedLevel) ?? LAYERS[0];

  return (
    <div className="space-y-4">
      <SimControlBar
        onStep={() => setSelectedLevel((lvl) => (lvl === 0 ? 6 : lvl - 1))}
        onReset={() => setSelectedLevel(6)}
        stepText={`Active Layer: Level ${selectedLevel} (${current.name})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mb-3">
            CLICK ANY LAYER TO TRACE TOP-DOWN VIRTUAL MACHINE TRANSLATION
          </div>
          <div className="space-y-2">
            {LAYERS.map((layer) => {
              const active = layer.level === selectedLevel;
              return (
                <button
                  key={layer.level}
                  type="button"
                  onClick={() => setSelectedLevel(layer.level)}
                  className={`w-full flex items-center justify-between gap-4 rounded-xl border px-4 py-2.5 text-left transition-all cursor-pointer ${
                    active
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40 dark:border-[#22D3EE]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-7 w-16 items-center justify-center rounded-md font-mono text-xs font-bold ${
                        active
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      LVL {layer.level}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-[#14213D] dark:text-white">{layer.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{layer.mechanism}</div>
                    </div>
                  </div>
                  <span className="hidden sm:inline font-mono text-xs text-[#2563EB] dark:text-[#22D3EE] truncate max-w-[200px]">
                    {layer.example}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              LEVEL {current.level} ABSTRACTION
            </div>
            <h3 className="text-xl font-bold text-[#14213D] dark:text-white">{current.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{current.explanation}</p>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">REPRESENTATION EXAMPLE</div>
              <div className="mt-1 font-mono text-sm font-semibold text-[#14213D] dark:text-[#22D3EE] break-all">
                {current.example}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50/70 dark:bg-slate-800/70 p-3 text-xs text-slate-700 dark:text-slate-300">
            <strong>Principle of Equivalence:</strong> Hardware (Levels 0–1) and Software (Levels 3–6) are logically equivalent—any task done in software can be built into digital logic, and vice versa.
          </div>
        </div>
      </div>
    </div>
  );
};
