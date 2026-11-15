import React, { useState } from 'react';
import { runBarrelShifter, ShiftType } from '../../../simulators/logic/parallelArmEngine';

type ArmModeName = 'User' | 'FIQ' | 'IRQ' | 'Supervisor' | 'Abort' | 'Undef' | 'System';

const ARM_MODES: Record<ArmModeName, { cpsrModeBits: string; banked: string[]; desc: string }> = {
  User: { cpsrModeBits: '10000', banked: ['None (R0–R15 shared)'], desc: 'Unprivileged mode for normal application execution.' },
  FIQ: { cpsrModeBits: '10001', banked: ['R8_fiq–R12_fiq', 'R13_fiq', 'R14_fiq', 'SPSR_fiq'], desc: 'Fast Interrupt Request with 7 banked registers to avoid stack push overhead.' },
  IRQ: { cpsrModeBits: '10010', banked: ['R13_irq', 'R14_irq', 'SPSR_irq'], desc: 'Standard Interrupt Request mode with dedicated SP, LR, and SPSR.' },
  Supervisor: { cpsrModeBits: '10011', banked: ['R13_svc', 'R14_svc', 'SPSR_svc'], desc: 'Privileged OS kernel mode entered on Reset or SWI.' },
  Abort: { cpsrModeBits: '10111', banked: ['R13_abt', 'R14_abt', 'SPSR_abt'], desc: 'Handles instruction prefetch or data memory aborts.' },
  Undef: { cpsrModeBits: '11011', banked: ['R13_und', 'R14_und', 'SPSR_und'], desc: 'Entered when an undefined opcode is encountered.' },
  System: { cpsrModeBits: '11111', banked: ['Shares R0–R15 with User (Privileged)'], desc: 'Privileged mode sharing User registers for OS tasks.' },
};

export const ArmThumbLab: React.FC = () => {
  const [tab, setTab] = useState<'thumb' | 'modes' | 'shifter'>('thumb');
  const [selectedMode, setSelectedMode] = useState<ArmModeName>('FIQ');
  const [isaState, setIsaState] = useState<'ARM' | 'THUMB'>('ARM');

  const [shiftInput, setShiftInput] = useState(0x0015);
  const [shiftType, setShiftType] = useState<ShiftType>('LSL');
  const [shiftAmt, setShiftAmt] = useState(2);

  const shifter = runBarrelShifter(shiftInput, shiftType, shiftAmt);
  const modeInfo = ARM_MODES[selectedMode];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
        {[
          { id: 'thumb', label: 'ARM (32-Bit) vs Thumb (16-Bit)' },
          { id: 'modes', label: '7 Modes & 37 Registers (CPSR)' },
          { id: 'shifter', label: 'Barrel Shifter (1-Cycle Shift)' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as 'thumb' | 'modes' | 'shifter')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              tab === t.id ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'thumb' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">
              Instruction Bit-Field Comparison (BX Switching via CPSR T-Bit)
            </h3>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setIsaState('ARM')}
                className={`px-3 py-1 rounded font-bold cursor-pointer ${isaState === 'ARM' ? 'bg-[#2563EB] text-white' : ''}`}
              >
                ARM State (T=0, 32-bit)
              </button>
              <button
                type="button"
                onClick={() => setIsaState('THUMB')}
                className={`px-3 py-1 rounded font-bold cursor-pointer ${isaState === 'THUMB' ? 'bg-[#2563EB] text-white' : ''}`}
              >
                Thumb State (T=1, 16-bit)
              </button>
            </div>
          </div>

          {isaState === 'ARM' ? (
            <div className="grid grid-cols-7 gap-1.5 font-mono text-xs text-center">
              {[
                { label: 'Cond [31:28]', val: '1110 (AL)' },
                { label: '00 [27:26]', val: '00' },
                { label: 'I [25]', val: '0' },
                { label: 'Opcode [24:21]', val: '0100 (ADD)' },
                { label: 'S [20]', val: '0' },
                { label: 'Rn / Rd [19:12]', val: 'R1, R2' },
                { label: 'Operand2 [11:0]', val: 'R3 + Shift' },
              ].map((f) => (
                <div key={f.label} className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-2.5">
                  <div className="text-[10px] text-slate-500">{f.label}</div>
                  <div className="mt-1 font-bold text-[#14213D] dark:text-white">{f.val}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center max-w-xl">
              {[
                { label: 'Prefix [15:11]', val: '00011' },
                { label: 'Op [10:9]', val: '00 (ADD)' },
                { label: 'Rm / Rn [8:3]', val: 'R3, R2' },
                { label: 'Rd [2:0]', val: 'R1' },
              ].map((f) => (
                <div key={f.label} className="rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 p-2.5">
                  <div className="text-[10px] text-slate-500">{f.label}</div>
                  <div className="mt-1 font-bold text-[#14213D] dark:text-white">{f.val}</div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300">
            <strong>Code Density Tradeoff:</strong> Thumb instructions occupy 16 bits instead of 32 bits (~30–40% smaller code footprint) and run faster over narrow 16-bit memory buses, while ARM mode provides full conditional execution and 16 directly visible registers.
          </div>
        </div>
      )}

      {tab === 'modes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <div className="text-xs font-mono font-semibold text-slate-500">SELECT ARM PROCESSOR MODE</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(ARM_MODES) as ArmModeName[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMode(m)}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-mono font-bold cursor-pointer ${
                    selectedMode === m ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#22D3EE]' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="pt-2 text-xs font-mono text-slate-600 dark:text-slate-300">
              Total ARM7TDMI Register File: <strong>37 Registers</strong> (31 General-Purpose + 6 Status: CPSR + 5 SPSRs)
            </div>
          </div>
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex justify-between font-mono text-xs">
              <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">{selectedMode} Mode</span>
              <span>CPSR M[4:0] = {modeInfo.cpsrModeBits}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{modeInfo.desc}</p>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 font-mono text-xs">
              Banked Registers: <strong>{modeInfo.banked.join(', ')}</strong>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              CPSR Flags: N (Negative) · Z (Zero) · C (Carry) · V (Overflow) · Q (Saturate) · J (Jazelle) · I/F (IRQ/FIQ) · T (Thumb)
            </div>
          </div>
        </div>
      )}

      {tab === 'shifter' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-mono font-semibold">
              Input Rm (0..65535):
              <input
                type="number"
                min={0}
                max={65535}
                value={shiftInput}
                onChange={(e) => setShiftInput(Number(e.target.value) || 0)}
                className="ml-2 w-24 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
              />
            </label>
            <div className="flex gap-1.5">
              {(['LSL', 'LSR', 'ASR', 'ROR'] as ShiftType[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setShiftType(st)}
                  className={`rounded-lg px-3 py-1 text-xs font-mono font-bold cursor-pointer ${
                    shiftType === st ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <label className="text-xs font-mono font-semibold flex items-center gap-2">
              Shift #{shiftAmt}:
              <input type="range" min={0} max={15} value={shiftAmt} onChange={(e) => setShiftAmt(Number(e.target.value))} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-slate-500">Input Rm ({shifter.inputHex})</div>
              <div className="mt-1 font-bold text-sm">{shifter.inputBin16}</div>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-3">
              <div className="text-[#2563EB] dark:text-[#22D3EE]">
                Output ({shifter.outputHex} = {shifter.outputUnsigned}) · Carry Out = {shifter.carryOut}
              </div>
              <div className="mt-1 font-bold text-sm">{shifter.outputBin16}</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">{shifter.description}</p>
        </div>
      )}
    </div>
  );
};
