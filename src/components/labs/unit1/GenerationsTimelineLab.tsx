import React, { useState } from 'react';
import { SimControlBar } from '../../diagrams/SvgPrimitives';

interface GenerationItem {
  id: string;
  gen: string;
  era: string;
  technology: string;
  milestone: string;
  speedIndex: number;
  memoryTech: string;
  impact: string;
}

const GENERATIONS: GenerationItem[] = [
  {
    id: 'g1',
    gen: '1st Generation',
    era: '1945–1955',
    technology: 'Vacuum Tubes & Relays',
    milestone: 'ENIAC (1946) · IAS Machine',
    speedIndex: 12,
    memoryTech: 'Electrostatic / Mercury Delay Lines',
    impact: 'Massive room-sized machines programmed via patch cords and binary machine code (~5,000 additions/sec).',
  },
  {
    id: 'g2',
    gen: '2nd Generation',
    era: '1955–1965',
    technology: 'Discrete Transistors',
    milestone: 'IBM 7094 · CDC 6600',
    speedIndex: 32,
    memoryTech: 'Magnetic Core Memory',
    impact: 'Replaced fragile vacuum tubes with solid-state transistors; introduced early compilers (FORTRAN, COBOL).',
  },
  {
    id: 'g3',
    gen: '3rd Generation',
    era: '1965–1980',
    technology: 'Integrated Circuits (SSI / MSI)',
    milestone: 'IBM System/360 · PDP-8 · Cray-1',
    speedIndex: 58,
    memoryTech: 'Semiconductor RAM & ROM',
    impact: 'Placed dozens to hundreds of transistors on silicon chips; introduced compatible ISA families and minicomputers.',
  },
  {
    id: 'g4',
    gen: '4th Generation',
    era: '1980–Present',
    technology: 'VLSI Microprocessors',
    milestone: 'Intel 4004 (1971) → Modern x86/ARM',
    speedIndex: 86,
    memoryTech: 'Multi-level Cache + DRAM',
    impact: 'Millions to billions of transistors on a single die; enabled personal computers, workstations, and smartphones.',
  },
  {
    id: 'non-vn',
    gen: 'Non-Von Neumann Era',
    era: 'Parallel & Multicore',
    technology: 'CMP / Massively Parallel Clusters',
    milestone: 'Dual-Core → 1,000+ Nodes → Blue Gene (1M)',
    speedIndex: 100,
    memoryTech: 'Distributed & Shared NUMA Caches',
    impact: 'Breaks the sequential Von Neumann bottleneck via multicore processors, vector GPUs, and supercomputer fabrics.',
  },
];

export const GenerationsTimelineLab: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = GENERATIONS[selectedIdx];

  return (
    <div className="space-y-4">
      <SimControlBar
        onStep={() => setSelectedIdx((i) => (i + 1) % GENERATIONS.length)}
        onReset={() => setSelectedIdx(0)}
        stepText={`Era ${selectedIdx + 1}/${GENERATIONS.length}: ${current.gen}`}
      />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        {/* Interactive Timeline Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-6">
          {GENERATIONS.map((item, idx) => {
            const active = idx === selectedIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 dark:border-[#22D3EE]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] font-mono text-[#2563EB] dark:text-[#22D3EE] font-semibold">
                  {item.era}
                </div>
                <div className="mt-0.5 text-sm font-bold text-[#14213D] dark:text-white">{item.gen}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.technology}</div>
              </button>
            );
          })}
        </div>

        {/* SVG Comparative Density & Detail Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4">
            <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mb-3">
              RELATIVE INTEGRATION & THROUGHPUT SCALING
            </div>
            <svg viewBox="0 0 540 210" className="w-full h-auto">
              {GENERATIONS.map((g, i) => {
                const y = 18 + i * 38;
                const barWidth = (g.speedIndex / 100) * 310;
                const active = i === selectedIdx;
                return (
                  <g key={g.id} onClick={() => setSelectedIdx(i)} className="cursor-pointer">
                    <text
                      x={6}
                      y={y + 17}
                      className={`text-[11px] font-mono font-semibold ${
                        active ? 'fill-[#2563EB] dark:fill-[#22D3EE]' : 'fill-slate-600 dark:fill-slate-400'
                      }`}
                    >
                      {g.gen.replace(' Generation', ' Gen').replace(' Era', '')}
                    </text>
                    <rect
                      x={135}
                      y={y + 3}
                      width={320}
                      height={22}
                      rx={5}
                      className="fill-slate-200/70 dark:fill-slate-800"
                    />
                    <rect
                      x={135}
                      y={y + 3}
                      width={barWidth}
                      height={22}
                      rx={5}
                      fill={active ? '#2563EB' : '#64748B'}
                      opacity={active ? 1 : 0.45}
                    />
                    <text
                      x={465}
                      y={y + 18}
                      className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-bold"
                    >
                      {g.era}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              {current.era} · {current.technology}
            </div>
            <h3 className="text-lg font-bold text-[#14213D] dark:text-white">{current.milestone}</h3>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
              Memory: {current.memoryTech}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{current.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
