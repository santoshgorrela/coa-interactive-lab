import React from 'react';
import { ArrowRight, PlayCircle, Layers, Cpu, Binary, GitBranch, Network } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { SIMULATIONS, UNITS, UnitId } from '../data/syllabus';
import { SignalWire } from '../components/diagrams/SvgPrimitives';

const UNIT_ICONS: Record<UnitId, React.ReactNode> = {
  1: <Layers className="h-5 w-5" />,
  2: <Cpu className="h-5 w-5" />,
  3: <Binary className="h-5 w-5" />,
  4: <GitBranch className="h-5 w-5" />,
  5: <Network className="h-5 w-5" />,
};

export const LandingPage: React.FC = () => {
  const { navigate } = useLab();

  return (
    <div className="space-y-14 pb-14">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] lab-grid-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-[#22D3EE]">
              Course Code 21CSS201T · Computer Engineering Laboratory
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#14213D] dark:text-white leading-[1.08]">
              COA INTERACTIVE LAB
            </h1>
            <p className="text-lg font-medium text-[#2563EB] dark:text-[#22D3EE]">
              Understand. Experiment. Visualize. Simulate.
            </p>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              An interactive Computer Organization and Architecture laboratory spanning Von Neumann machines, bus systems, digital logic &amp; ALU design, 5-stage instruction pipelines, and ARM parallel processors.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('workspace', { simId: 'u4-pipeline' })}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-[#14213D] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <PlayCircle className="h-4 w-4 text-[#2563EB] dark:text-[#22D3EE]" />
                Explore Simulations
              </button>
              <button
                type="button"
                onClick={() => navigate('manual')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-[#14213D] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                User Manual
              </button>
            </div>

            <div className="pt-2 font-mono text-xs text-[#64748B] dark:text-slate-400">
              5 Academic Units · {SIMULATIONS.length} Interactive Labs · Live SVG Datapaths &amp; Truth Tables
            </div>
          </div>

          {/* Animated Technical Hero Schematic */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#14213D] p-5 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 mb-3">
                <span>LIVE DATAPATH ARCHITECTURE PREVIEW</span>
                <span>ALU · PIPELINE · ARM</span>
              </div>
              <svg viewBox="0 0 540 280" className="w-full h-auto select-none">
                <SignalWire d="M 105 70 L 210 70" active high />
                <SignalWire d="M 105 140 L 210 140" active high />
                <SignalWire d="M 330 105 L 420 105" active high />
                <SignalWire d="M 270 175 L 270 225 L 430 225" active />
                <SignalWire d="M 105 225 L 210 225" active high />

                <rect x={25} y={42} width={85} height={54} rx={8} fill="#1E293B" stroke="#22D3EE" strokeWidth={1.8} />
                <text x={67} y={66} textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">FETCH (IF)</text>
                <text x={67} y={83} textAnchor="middle" fill="#22D3EE" className="text-[10px] font-mono">PC: 0x104</text>

                <rect x={25} y={112} width={85} height={54} rx={8} fill="#1E293B" stroke="#2563EB" strokeWidth={1.8} />
                <text x={67} y={136} textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">DECODE</text>
                <text x={67} y={153} textAnchor="middle" fill="#93C5FD" className="text-[10px] font-mono">ADD R1,R2</text>

                <rect x={210} y={50} width={120} height={125} rx={10} fill="#0F172A" stroke="#22D3EE" strokeWidth={2.2} />
                <text x={270} y={96} textAnchor="middle" fill="#FFFFFF" className="text-[13px] font-bold">ALU CORE</text>
                <text x={270} y={116} textAnchor="middle" fill="#22D3EE" className="text-[11px] font-mono">CLA · Booth</text>
                <text x={270} y={136} textAnchor="middle" fill="#94A3B8" className="text-[10px] font-mono">C=0 Z=0 V=0</text>

                <rect x={420} y={76} width={96} height={58} rx={8} fill="#1E293B" stroke="#10B981" strokeWidth={1.8} />
                <text x={468} y={102} textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">WRITE BACK</text>
                <text x={468} y={119} textAnchor="middle" fill="#34D399" className="text-[10px] font-mono">R1 ← 0x0E</text>

                <rect x={25} y={198} width={85} height={54} rx={8} fill="#1E293B" stroke="#64748B" strokeWidth={1.5} />
                <text x={67} y={222} textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">CONTROL</text>
                <text x={67} y={238} textAnchor="middle" fill="#CBD5E1" className="text-[10px] font-mono">µPC / FSM</text>

                <rect x={420} y={198} width={96} height={54} rx={8} fill="#1E293B" stroke="#2563EB" strokeWidth={1.8} />
                <text x={468} y={222} textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">ARM / CMP</text>
                <text x={468} y={238} textAnchor="middle" fill="#22D3EE" className="text-[10px] font-mono">4-Core SIMD</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Unit Laboratory Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
              Syllabus Laboratories
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#14213D] dark:text-white">
              Five Core Engineering Modules
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="text-sm font-semibold text-[#2563EB] dark:text-[#22D3EE] hover:underline cursor-pointer"
          >
            Open Full Dashboard →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {UNITS.map((u) => {
            const simCount = SIMULATIONS.filter((s) => s.unitId === u.id).length;
            return (
              <div
                key={u.id}
                onClick={() => navigate('unit', { unitId: u.id })}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-[#2563EB] dark:hover:border-[#22D3EE] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#2563EB] dark:text-[#22D3EE]">
                    <span>{u.code} · {simCount} Labs</span>
                    <span className="text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-[#22D3EE]">
                      {UNIT_ICONS[u.id]}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-[#14213D] dark:text-white">
                    {u.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {u.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">
                  <span>Enter Laboratory</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
