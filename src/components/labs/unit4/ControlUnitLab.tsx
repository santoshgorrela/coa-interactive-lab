import React, { useState } from 'react';
import { ArchBlock, SignalWire } from '../../diagrams/SvgPrimitives';

const HARDWIRED_STEPS = [
  { step: 'T1', instr: 'ANY', activeEqs: ['PCout = T1', 'MARin = T1', 'Read = T1', 'Zin = T1 + T6·ADD + T4·BR'] },
  { step: 'T2', instr: 'ANY', activeEqs: ['Zout = T2 + T7·ADD', 'PCin = T2 + T5·BR', 'WMFC = T2 + T5·ADD'] },
  { step: 'T4', instr: 'ADD', activeEqs: ['R3out = T4·ADD', 'MARin = T4·ADD', 'Read = T4·ADD'] },
  { step: 'T6', instr: 'ADD', activeEqs: ['MDRout = T6·ADD', 'SelectY = T6·ADD', 'Zin = T1 + T6·ADD'] },
  { step: 'T7', instr: 'ADD', activeEqs: ['Zout = T7·ADD', 'R1in = T7·ADD', 'End = T7·ADD + T5·BR'] },
];

const MICRO_STORE = [
  { addr: '0x00', label: 'Fetch-1', cw: 'PC_out, MAR_in, Read, Select4, Add, Z_in', next: '0x01' },
  { addr: '0x01', label: 'Fetch-2', cw: 'Z_out, PC_in, Y_in, WMFC', next: '0x02' },
  { addr: '0x02', label: 'Decode', cw: 'MDR_out, IR_in, Branch→IR[Opcode]', next: '0x10 (ADD)' },
  { addr: '0x10', label: 'ADD-1', cw: 'R3_out, MAR_in, Read', next: '0x11' },
  { addr: '0x11', label: 'ADD-2', cw: 'R1_out, Y_in, WMFC', next: '0x12' },
  { addr: '0x12', label: 'ADD-3', cw: 'MDR_out, SelectY, Add, Z_in', next: '0x13' },
  { addr: '0x13', label: 'ADD-4', cw: 'Z_out, R1_in, End', next: '0x00' },
];

export const ControlUnitLab: React.FC = () => {
  const [cuType, setCuType] = useState<'hardwired' | 'microprogrammed'>('hardwired');
  const [hwIdx, setHwIdx] = useState(0);
  const [uPc, setUPc] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setCuType('hardwired')}
            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
              cuType === 'hardwired' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Hardwired Control Unit
          </button>
          <button
            type="button"
            onClick={() => setCuType('microprogrammed')}
            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
              cuType === 'microprogrammed' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Microprogrammed Control Unit
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            cuType === 'hardwired'
              ? setHwIdx((i) => (i + 1) % HARDWIRED_STEPS.length)
              : setUPc((p) => (p + 1) % MICRO_STORE.length)
          }
          className="rounded-lg bg-[#2563EB] text-white px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
        >
          Step Clock / µPC
        </button>
      </div>

      {cuType === 'hardwired' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
            <svg viewBox="0 0 600 230" className="w-full h-auto">
              <ArchBlock x={25} y={32} width={120} height={60} title="Step Counter" value={HARDWIRED_STEPS[hwIdx].step} active />
              <ArchBlock x={190} y={32} width={130} height={60} title="Step Decoder" value={`T1..T7 (${HARDWIRED_STEPS[hwIdx].step})`} active />
              <ArchBlock x={25} y={132} width={120} height={60} title="IR Opcode" value={HARDWIRED_STEPS[hwIdx].instr} active />
              <ArchBlock x={190} y={132} width={130} height={60} title="Instr Decoder" value="INS1..INSm" active />
              <ArchBlock x={390} y={65} width={175} height={104} title="Combinational Encoder" subtitle="AND/OR Gate Matrix" value="Control Signals Out" active accent="cyan" />
              <SignalWire d="M 145 62 L 190 62" active high />
              <SignalWire d="M 145 162 L 190 162" active high />
              <SignalWire d="M 320 62 L 390 102" active high />
              <SignalWire d="M 320 162 L 390 132" active high />
            </svg>
          </div>
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              ACTIVE BOOLEAN ENCODER EQUATIONS ({HARDWIRED_STEPS[hwIdx].step})
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {HARDWIRED_STEPS[hwIdx].activeEqs.map((eq) => (
                <div key={eq} className="rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 font-bold text-[#14213D] dark:text-white">
                  {eq}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardwired control is fastest (used in RISC processors) because control lines come directly from combinational logic gates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-x-auto">
            <div className="text-xs font-mono font-semibold text-slate-500 mb-2">
              CONTROL STORE (µPC = {MICRO_STORE[uPc].addr})
            </div>
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1.5">µAddr</th>
                  <th className="py-1.5">Step</th>
                  <th className="py-1.5">Control Word (CW) Bits</th>
                  <th className="py-1.5">Next</th>
                </tr>
              </thead>
              <tbody>
                {MICRO_STORE.map((row, idx) => (
                  <tr
                    key={row.addr}
                    onClick={() => setUPc(idx)}
                    className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer ${
                      idx === uPc ? 'bg-blue-50 dark:bg-blue-950/50 font-bold text-[#2563EB] dark:text-[#22D3EE]' : ''
                    }`}
                  >
                    <td className="py-1.5">{row.addr}</td>
                    <td className="py-1.5">{row.label}</td>
                    <td className="py-1.5">{row.cw}</td>
                    <td className="py-1.5">{row.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              MICROPROGRAMMED ARCHITECTURE
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Each machine instruction maps via a Starting Address Generator into a microroutine inside the Control Store ROM. Grouping mutually exclusive signals into encoded fields (F1–F8) shrinks Control Word bit width.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
