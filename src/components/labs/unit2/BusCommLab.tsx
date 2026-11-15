import React, { useState } from 'react';
import { SignalWire } from '../../diagrams/SvgPrimitives';

type BusType = 'address' | 'data' | 'control';

const BUS_DETAILS: Record<BusType, { title: string; dir: string; width: string; role: string; activeLines: string }> = {
  address: {
    title: 'Address Bus (A0 – A19 / A31)',
    dir: 'Unidirectional (CPU → Memory & I/O)',
    width: 'Determines maximum addressable memory (2^n bytes)',
    role: 'Carries the binary memory location or I/O port number selected by MAR.',
    activeLines: 'Addr = 0x04A20',
  },
  data: {
    title: 'Data Bus (D0 – D7 / D31)',
    dir: 'Bidirectional (CPU ↔ Memory ↔ I/O)',
    width: 'Defines processor word transfer width per cycle (8/16/32/64-bit)',
    role: 'Carries instruction opcodes during Fetch and operand words during Read/Write.',
    activeLines: 'Data = 0x4F2A',
  },
  control: {
    title: 'Control Bus (RD, WR, CS, CLK, IRQ)',
    dir: 'Bidirectional Handshake Signals',
    width: 'Individual dedicated timing & status wires',
    role: 'Synchronizes bus masters via Read, Write, Chip Select (CS), Memory Function Completed (MFC), and Interrupts.',
    activeLines: 'RD=1, WR=0, CS=1',
  },
};

export const BusCommLab: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<BusType>('address');
  const [topology, setTopology] = useState<'single' | 'multi'>('single');

  const info = BUS_DETAILS[selectedBus];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5">
        <div className="flex flex-wrap gap-2">
          {(['address', 'data', 'control'] as BusType[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBus(b)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize cursor-pointer ${
                selectedBus === b
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {b} Bus
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTopology('single')}
            className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              topology === 'single' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Single-Bus
          </button>
          <button
            type="button"
            onClick={() => setTopology('multi')}
            className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              topology === 'multi' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Two / Multi-Bus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <svg viewBox="0 0 740 280" className="w-full h-auto select-none">
            {/* Nodes across top */}
            <rect x={40} y={24} width={150} height={64} rx={10} className="fill-blue-50 dark:fill-slate-800" stroke="#2563EB" strokeWidth={2} />
            <text x={115} y={54} textAnchor="middle" className="fill-[#14213D] dark:fill-white text-[13px] font-bold">CPU (Master)</text>
            <text x={115} y={72} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">{info.activeLines}</text>

            <rect x={295} y={24} width={150} height={64} rx={10} className="fill-white dark:fill-slate-900" stroke="#94A3B8" strokeWidth={1.6} />
            <text x={370} y={54} textAnchor="middle" className="fill-[#14213D] dark:fill-white text-[13px] font-bold">Main Memory</text>
            <text x={370} y={72} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">RAM / ROM</text>

            <rect x={550} y={24} width={150} height={64} rx={10} className="fill-white dark:fill-slate-900" stroke="#94A3B8" strokeWidth={1.6} />
            <text x={625} y={54} textAnchor="middle" className="fill-[#14213D] dark:fill-white text-[13px] font-bold">I/O Subsystems</text>
            <text x={625} y={72} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">Bridge / Peripherals</text>

            {/* Three Horizontal Bus Bars */}
            <g onClick={() => setSelectedBus('address')} className="cursor-pointer">
              <SignalWire d="M 60 135 L 680 135" active={selectedBus === 'address'} high={selectedBus === 'address'} />
              <text x={370} y={125} textAnchor="middle" className="fill-[#14213D] dark:fill-slate-200 text-[11px] font-mono font-bold">
                ADDRESS BUS → Unidirectional (CPU → Memory / I/O)
              </text>
            </g>
            <g onClick={() => setSelectedBus('data')} className="cursor-pointer">
              <SignalWire d="M 60 185 L 680 185" active={selectedBus === 'data'} high={selectedBus === 'data'} bidirectional />
              <text x={370} y={175} textAnchor="middle" className="fill-[#14213D] dark:fill-slate-200 text-[11px] font-mono font-bold">
                DATA BUS ↔ Bidirectional (Word Transfers)
              </text>
            </g>
            <g onClick={() => setSelectedBus('control')} className="cursor-pointer">
              <SignalWire d="M 60 235 L 680 235" active={selectedBus === 'control'} high={selectedBus === 'control'} bidirectional />
              <text x={370} y={225} textAnchor="middle" className="fill-[#14213D] dark:fill-slate-200 text-[11px] font-mono font-bold">
                CONTROL BUS ↔ RD / WR / CS / Interrupt Handshake
              </text>
            </g>

            {/* Vertical taps */}
            <SignalWire d="M 115 88 L 115 235" active />
            <SignalWire d="M 370 88 L 370 235" active={topology === 'single' || selectedBus !== 'control'} />
            <SignalWire d="M 625 88 L 625 235" active={topology === 'multi'} />

            {topology === 'multi' && (
              <rect x={485} y={102} width={96} height={24} rx={5} className="fill-cyan-50 dark:fill-cyan-950" stroke="#06B6D4" />
            )}
            {topology === 'multi' && (
              <text x={533} y={118} textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[10px] font-mono font-bold">
                I/O Bridge
              </text>
            )}
          </svg>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            {info.dir}
          </div>
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">{info.title}</h3>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5">
            {info.width}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{info.role}</p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {topology === 'single'
              ? 'Single-Bus Advantage: Low cost & flexible. Drawback: Only two units can communicate at once.'
              : 'Multi-Bus Advantage: Decouples high-speed CPU–Memory bus from slower I/O peripherals via an expansion bridge.'}
          </div>
        </div>
      </div>
    </div>
  );
};
