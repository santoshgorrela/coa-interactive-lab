import React, { useState } from 'react';
import { ArchBlock, SignalWire } from '../../diagrams/SvgPrimitives';

export const RegisterTransferBusLab: React.FC = () => {
  const [busMode, setBusMode] = useState<'single' | 'three'>('single');
  const [srcReg, setSrcReg] = useState<'R1' | 'R2'>('R1');
  const [dstReg, setDstReg] = useState<'R2' | 'R3'>('R3');
  const [muxConst, setMuxConst] = useState<'Y' | '4'>('Y');

  const [r1, setR1] = useState(18);
  const [r2, setR2] = useState(7);
  const [r3, setR3] = useState(0);
  const [transferLog, setTransferLog] = useState('Click "Execute Transfer" to gate Ri_out → Bus → Rj_in.');

  const executeTransfer = () => {
    const val = srcReg === 'R1' ? r1 : r2;
    if (dstReg === 'R2') setR2(val);
    else setR3(val);
    setTransferLog(`Asserted ${srcReg}_out = 1, ${dstReg}_in = 1 → Copied ${val} across internal bus.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setBusMode('single')}
            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
              busMode === 'single' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Single-Bus Gating (Ri_out / Ri_in)
          </button>
          <button
            type="button"
            onClick={() => setBusMode('three')}
            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
              busMode === 'three' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Three-Bus Organization (A, B, C)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span>Src:</span>
          <select value={srcReg} onChange={(e) => setSrcReg(e.target.value as 'R1' | 'R2')} className="rounded border px-2 py-1 bg-slate-50 dark:bg-slate-800">
            <option value="R1">R1 ({r1})</option>
            <option value="R2">R2 ({r2})</option>
          </select>
          <span>→ Dst:</span>
          <select value={dstReg} onChange={(e) => setDstReg(e.target.value as 'R2' | 'R3')} className="rounded border px-2 py-1 bg-slate-50 dark:bg-slate-800">
            <option value="R2">R2 ({r2})</option>
            <option value="R3">R3 ({r3})</option>
          </select>
          <button
            type="button"
            onClick={executeTransfer}
            className="rounded-lg bg-[#2563EB] text-white px-3 py-1.5 font-sans font-semibold cursor-pointer"
          >
            Execute Transfer
          </button>
        </div>
      </div>

      {busMode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
            <svg viewBox="0 0 680 240" className="w-full h-auto">
              <SignalWire d="M 40 120 L 640 120" active high label="COMMON INTERNAL PROCESSOR BUS" labelX={340} labelY={108} />
              <ArchBlock x={55} y={24} width={120} height={64} title="R1" value={`Val: ${r1}`} active={srcReg === 'R1'} onClick={() => setR1((v) => v + 1)} />
              <ArchBlock x={225} y={24} width={120} height={64} title="R2" value={`Val: ${r2}`} active={srcReg === 'R2' || dstReg === 'R2'} />
              <ArchBlock x={395} y={24} width={120} height={64} title="R3" value={`Val: ${r3}`} active={dstReg === 'R3'} />
              <ArchBlock
                x={245}
                y={152}
                width={185}
                height={66}
                title={`ALU MUX (${muxConst})`}
                subtitle="Select 4 or Y"
                value={muxConst === '4' ? 'PC + 4 Mode' : 'Operand [Y] Mode'}
                active
                accent="cyan"
                onClick={() => setMuxConst((m) => (m === 'Y' ? '4' : 'Y'))}
              />
              <SignalWire d="M 115 88 L 115 120" active={srcReg === 'R1'} high={srcReg === 'R1'} label="R1_out" labelX={145} labelY={104} />
              <SignalWire d="M 285 88 L 285 120" active={srcReg === 'R2' || dstReg === 'R2'} />
              <SignalWire d="M 455 88 L 455 120" active={dstReg === 'R3'} high={dstReg === 'R3'} label="R3_in" labelX={485} labelY={104} />
              <SignalWire d="M 338 120 L 338 152" active high />
            </svg>
          </div>
          <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">TRI-STATE GATING</div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              {transferLog}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Only one register may assert <code>Ri_out</code> at a time on a single bus using tri-state switches, while D flip-flops latch data when <code>Rj_in</code> is asserted. Click the ALU MUX block to toggle Constant 4 vs Register Y.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-base font-bold text-[#14213D] dark:text-white">
              Three-Bus Processor Datapath (Bus A, Bus B, Bus C)
            </h3>
            <span className="font-mono text-xs text-[#2563EB] dark:text-[#22D3EE]">
              ADD R4, R5, R6 executes in 1 ALU step (4 total steps incl. Fetch)
            </span>
          </div>
          <svg viewBox="0 0 700 210" className="w-full h-auto">
            <SignalWire d="M 190 46 L 440 46" active high label="Bus A (Src 1)" labelX={315} labelY={36} />
            <SignalWire d="M 190 96 L 440 96" active high label="Bus B (Src 2)" labelX={315} labelY={86} />
            <SignalWire d="M 580 155 L 115 155 L 115 130" active high label="Bus C (Destination Write-Back)" labelX={350} labelY={174} />
            <ArchBlock x={30} y={28} width={160} height={102} title="3-Port Register File" subtitle="2 Read (A,B) + 1 Write (C)" value="R4, R5, R6" active />
            <ArchBlock x={255} y={108} width={135} height={40} title="Incrementer" subtitle="PC ← PC + 4" active />
            <ArchBlock x={440} y={32} width={160} height={96} title="ALU" subtitle="Inputs A & B Simultaneously" value="Out → Bus C" active accent="cyan" />
          </svg>
        </div>
      )}
    </div>
  );
};
