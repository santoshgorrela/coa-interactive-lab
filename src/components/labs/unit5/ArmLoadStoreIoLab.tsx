import React, { useState } from 'react';
import { ArmLoadStoreMode, simulateArmLoadStore } from '../../../simulators/logic/parallelArmEngine';

const SAMPLE_MEMORY: Record<number, number> = {
  100: 42,
  104: 99,
  108: 128,
  112: 255,
};

export const ArmLoadStoreIoLab: React.FC = () => {
  const [lsMode, setLsMode] = useState<ArmLoadStoreMode>('pre_indexed');
  const [baseAddr, setBaseAddr] = useState(100);
  const [offset, setOffset] = useState(4);
  const [ioType, setIoType] = useState<'memory_mapped' | 'io_mapped'>('memory_mapped');

  const lsRes = simulateArmLoadStore(lsMode, baseAddr, offset, SAMPLE_MEMORY);

  return (
    <div className="space-y-5">
      {/* ARM Load / Store Addressing */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">
            ARM Load / Store Addressing Modes (LDR / STR / LDM / STM)
          </h3>
          <div className="flex gap-1.5 text-xs">
            {[
              { id: 'offset', label: 'Offset' },
              { id: 'pre_indexed', label: 'Pre-Indexed (!)' },
              { id: 'post_indexed', label: 'Post-Indexed' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setLsMode(m.id as ArmLoadStoreMode)}
                className={`rounded-lg px-3 py-1.5 font-semibold cursor-pointer ${
                  lsMode === m.id ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 grid grid-cols-2 gap-2 font-mono text-xs">
            {Object.entries(SAMPLE_MEMORY).map(([addr, val]) => {
              const isTarget = Number(addr) === lsRes.effectiveAddress;
              return (
                <div
                  key={addr}
                  className={`rounded-lg border p-2.5 ${
                    isTarget
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#22D3EE]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <div>Mem[{addr}]</div>
                  <div className="text-sm font-bold">{val}</div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-7 space-y-2.5">
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span>R1 Base = {baseAddr}</span>
              <select
                value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
                aria-label="Address offset"
                className="rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5"
              >
                <option value={0}>Offset #0</option>
                <option value={4}>Offset #4</option>
                <option value={8}>Offset #8</option>
              </select>
              <button
                type="button"
                onClick={() => setBaseAddr(100)}
                className="text-[#2563EB] dark:text-[#22D3EE] underline cursor-pointer"
              >
                Reset R1=100
              </button>
            </div>
            <div className="rounded-lg bg-[#14213D] text-cyan-200 p-3 font-mono text-xs space-y-1">
              <div className="font-bold text-white">{lsRes.syntax}</div>
              <div>Effective Address: {lsRes.effectiveAddress} → R0 Loaded = {lsRes.loadedValue}</div>
              <div>Updated Base R1&apos; = {lsRes.newBaseAddr}</div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{lsRes.explanation}</p>
          </div>
        </div>
      </div>

      {/* I/O Operations, AMBA Bus & ARM5 vs ARM7 Case Study */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">I/O Mapping &amp; AMBA Bus</h3>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setIoType('memory_mapped')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  ioType === 'memory_mapped' ? 'bg-[#2563EB] text-white' : ''
                }`}
              >
                Memory-Mapped
              </button>
              <button
                type="button"
                onClick={() => setIoType('io_mapped')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  ioType === 'io_mapped' ? 'bg-[#2563EB] text-white' : ''
                }`}
              >
                I/O-Mapped
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {ioType === 'memory_mapped'
              ? 'ARM uses Memory-Mapped I/O: peripheral control/status registers share the 32-bit address space and are accessed directly with LDR/STR instructions (no separate IN/OUT instructions).'
              : 'I/O-Mapped (Isolated) I/O separates memory and device address spaces using dedicated IN/OUT instructions and M/IO# control pin (used in x86).'}
          </p>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 font-mono text-xs">
            AMBA Hierarchy: High-speed <strong>AHB/ASB</strong> (ARM Core, RAM, DMA) ↔ <strong>APB Bridge</strong> ↔ Low-power <strong>APB</strong> (UART, Timer, GPIO).
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">
            Case Study: ARM7TDMI vs ARMv5TEJ (ARM5)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="font-bold text-[#2563EB] dark:text-[#22D3EE]">ARM7TDMI (ARMv4T)</div>
              <div className="mt-1">3-Stage Pipeline (F/D/E)</div>
              <div>Von Neumann Unified Bus</div>
              <div>Thumb + Debug + Mul + ICE</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="font-bold text-[#2563EB] dark:text-[#22D3EE]">ARM926EJ-S (ARMv5TEJ)</div>
              <div className="mt-1">5-Stage Pipeline · Harvard Bus</div>
              <div>DSP Extensions (Q flag)</div>
              <div>Jazelle Java Bytecode (J bit)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
