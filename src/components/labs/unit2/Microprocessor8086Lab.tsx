import React, { useState } from 'react';

type TabMode = 'micro' | 'formats' | 'addressing' | '8086';

const ADDRESSING_MODES = [
  { name: 'Immediate', syntax: 'MOV R1, #25', ea: 'Operand inside instruction', result: 'R1 ← 25' },
  { name: 'Direct (Absolute)', syntax: 'LOAD R1, [0x200]', ea: 'EA = 0x200', result: 'R1 ← M[0x200] (40)' },
  { name: 'Register Direct', syntax: 'ADD R1, R2', ea: 'EA = Register R2', result: 'R1 ← R1 + R2' },
  { name: 'Register Indirect', syntax: 'LOAD R1, (R3)', ea: 'EA = [R3] = 0x300', result: 'R1 ← M[0x300] (99)' },
  { name: 'Indexed', syntax: 'LOAD R1, 16(R3)', ea: 'EA = [R3] + 16 = 0x310', result: 'R1 ← M[0x310]' },
  { name: 'Relative (PC)', syntax: 'BEQ +0x12', ea: 'EA = [PC] + 0x12', result: 'Branch target address' },
  { name: 'Auto-Increment', syntax: 'LOAD R1, (R3)+', ea: 'EA = [R3], then R3 ← R3 + 4', result: 'Array traversal forward' },
  { name: 'Auto-Decrement', syntax: 'LOAD R1, -(R3)', ea: 'R3 ← R3 - 4, then EA = [R3]', result: 'Stack push/pop pattern' },
];

export const Microprocessor8086Lab: React.FC = () => {
  const [tab, setTab] = useState<TabMode>('micro');
  const [activeMicro, setActiveMicro] = useState<'ALU' | 'REG' | 'CTRL'>('ALU');
  const [addrIdx, setAddrIdx] = useState(0);
  const [formatAddr, setFormatAddr] = useState<'3' | '2' | '1' | '0'>('3');

  const curAddr = ADDRESSING_MODES[addrIdx];

  const formatCode: Record<'3' | '2' | '1' | '0', string[]> = {
    '3': ['ADD R1, A, B       ; R1 ← M[A] + M[B]', 'ADD R2, C, D       ; R2 ← M[C] + M[D]', 'MUL X, R1, R2      ; M[X] ← R1 × R2'],
    '2': ['MOV R1, A          ; R1 ← M[A]', 'ADD R1, B          ; R1 ← R1 + M[B]', 'MOV R2, C          ; R2 ← M[C]', 'ADD R2, D          ; R2 ← R2 + M[D]', 'MUL R1, R2         ; R1 ← R1 × R2', 'MOV X, R1          ; M[X] ← R1'],
    '1': ['LOAD A             ; AC ← M[A]', 'ADD B              ; AC ← AC + M[B]', 'STORE T            ; M[T] ← AC', 'LOAD C             ; AC ← M[C]', 'ADD D              ; AC ← AC + M[D]', 'MUL T              ; AC ← AC × M[T]', 'STORE X            ; M[X] ← AC'],
    '0': ['PUSH A', 'PUSH B', 'ADD                ; TOS ← A + B', 'PUSH C', 'PUSH D', 'ADD                ; TOS ← C + D', 'MUL                ; TOS ← (A+B)*(C+D)', 'POP X'],
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
        {[
          { id: 'micro', label: 'Microprocessor Sections' },
          { id: 'formats', label: 'Instruction Formats (0/1/2/3-Addr)' },
          { id: 'addressing', label: 'Addressing Modes' },
          { id: '8086', label: 'Intel 8086 BIU/EU & Lab Tasks' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as TabMode)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              tab === t.id ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'micro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">Internal Microprocessor Sections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ALU' as const, title: 'ALU Section', sub: 'Arithmetic, Logic & Status Flags' },
                { id: 'REG' as const, title: 'Register Section', sub: 'Accumulator, PC, SP, Index & GP Regs' },
                { id: 'CTRL' as const, title: 'Control & Timing', sub: 'Oscillator Clock, Decoder & RD/WR' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveMicro(sec.id)}
                  className={`rounded-xl border p-4 text-left cursor-pointer ${
                    activeMicro === sec.id
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="text-sm font-bold text-[#14213D] dark:text-white">{sec.title}</div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{sec.sub}</div>
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs font-mono text-slate-700 dark:text-slate-200">
              External Interface: 16/20/32-bit Address Lines → Memory/I/O · Bidirectional Data Bus · Clock & Reset Control Lines
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">MICROPROCESSOR VS MICROCONTROLLER</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A <strong>Microprocessor</strong> (e.g., 8086) integrates CPU logic on chip and connects externally to RAM, ROM, and I/O ports over system buses. A <strong>Microcontroller</strong> (e.g., AVR) places CPU, Flash, SRAM, timers, and GPIO onto a single embedded chip.
            </p>
          </div>
        </div>
      )}

      {tab === 'formats' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">
              Evaluating X = (A + B) × (C + D) Across Instruction Formats
            </h3>
            <div className="flex gap-1.5">
              {(['3', '2', '1', '0'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormatAddr(f)}
                  className={`rounded-md px-3 py-1 text-xs font-mono font-semibold cursor-pointer ${
                    formatAddr === f ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {f}-Address
                </button>
              ))}
            </div>
          </div>
          <pre className="rounded-xl bg-[#14213D] text-cyan-200 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
            {formatCode[formatAddr].join('\n')}
          </pre>
        </div>
      )}

      {tab === 'addressing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ADDRESSING_MODES.map((m, idx) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setAddrIdx(idx)}
                className={`rounded-lg border p-2.5 text-left text-xs font-semibold cursor-pointer ${
                  idx === addrIdx
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-[#22D3EE]'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
            <div className="text-xs font-mono text-[#2563EB] dark:text-[#22D3EE]">{curAddr.name} Mode</div>
            <div className="font-mono text-base font-bold text-[#14213D] dark:text-white">{curAddr.syntax}</div>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-300">Effective Address: {curAddr.ea}</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">Action: {curAddr.result}</div>
          </div>
        </div>
      )}

      {tab === '8086' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">
              Intel 8086: BIU (6-Byte Queue) + Execution Unit (EU)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <div className="font-bold text-[#2563EB] dark:text-[#22D3EE]">Bus Interface Unit (BIU)</div>
                <div className="mt-1">CS, DS, SS, ES (16-bit Segments)</div>
                <div>IP (Instruction Pointer) · 20-bit Addr (1 MB)</div>
                <div>6-Byte Instruction Prefetch Queue</div>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <div className="font-bold text-[#2563EB] dark:text-[#22D3EE]">Execution Unit (EU)</div>
                <div className="mt-1">AX, BX, CX, DX (16-bit / H &amp; L)</div>
                <div>SP, BP, SI, DI · 16-bit ALU</div>
                <div>9 Active Flags (CF, PF, AF, ZF, SF, TF, IF, DF, OF)</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-slate-900 p-5 space-y-2">
            <div className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-300">
              SUPPLEMENTARY 8086 REFERENCE LAB TASKS
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Practical 8086 assembly exercises from the reference guide include: summing 16-bit array elements using SI/CX loops, finding largest/smallest values, BCD packed addition (DAA), and palindrome string comparison using CMPSB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
