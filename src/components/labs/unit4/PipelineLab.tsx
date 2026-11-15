import React, { useEffect, useState } from 'react';
import { PipelineStageCell, simulatePipeline } from '../../../simulators/logic/processorPipelineEngine';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

const STAGES: ('IF' | 'ID' | 'EX' | 'MEM' | 'WB')[] = ['IF', 'ID', 'EX', 'MEM', 'WB'];

export const PipelineLab: React.FC = () => {
  const sim = simulatePipeline('ideal');
  const [cycle, setCycle] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(900);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setCycle((c) => (c >= sim.totalCycles ? 1 : c + 1));
    }, speedMs);
    return () => window.clearInterval(id);
  }, [playing, speedMs, sim.totalCycles]);

  const stageInstruction = (stage: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB'): string => {
    const cIdx = cycle - 1;
    const rowIdx = sim.grid.findIndex((row) => row[cIdx] === stage);
    if (rowIdx === -1) return 'Idle';
    return sim.instructions[rowIdx].split(':')[0];
  };

  const cellStyle = (cell: PipelineStageCell, isCurrentCycle: boolean) => {
    if (!cell) return 'bg-transparent text-slate-300 dark:text-slate-700';
    const base =
      cell === 'IF'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
        : cell === 'ID'
          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200'
          : cell === 'EX'
            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
            : cell === 'MEM'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200';
    return `${base} ${isCurrentCycle ? 'ring-2 ring-[#2563EB] dark:ring-[#22D3EE]' : 'opacity-80'}`;
  };

  return (
    <div className="space-y-4">
      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setCycle((c) => (c >= sim.totalCycles ? 1 : c + 1))}
        onReset={() => {
          setPlaying(false);
          setCycle(1);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        stepText={`Clock Cycle C${cycle} of ${sim.totalCycles}`}
      />

      {/* 5-Stage Hardware Pipeline Diagram */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
        <div className="text-xs font-mono font-semibold text-[#14213D] dark:text-slate-200 mb-3">
          5-STAGE PIPELINE HARDWARE STAGES &amp; INTERSTAGE BUFFERS (CYCLE C{cycle})
        </div>
        <svg viewBox="0 0 760 128" className="w-full h-auto select-none">
          {STAGES.map((stg, idx) => {
            const x = 16 + idx * 150;
            const occupant = stageInstruction(stg);
            const active = occupant !== 'Idle';
            return (
              <g key={stg}>
                {idx < 4 && <SignalWire d={`M ${x + 126} 62 L ${x + 150} 62`} active={active} high={active} />}
                <ArchBlock
                  x={x}
                  y={16}
                  width={126}
                  height={92}
                  title={stg}
                  subtitle={
                    stg === 'IF'
                      ? 'Instr Fetch'
                      : stg === 'ID'
                        ? 'Decode / Reg'
                        : stg === 'EX'
                          ? 'ALU Execute'
                          : stg === 'MEM'
                            ? 'Data Memory'
                            : 'Write Back'
                  }
                  value={occupant}
                  active={active}
                  accent={stg === 'EX' ? 'cyan' : stg === 'WB' ? 'emerald' : 'blue'}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cycle-by-Cycle Gantt Occupancy Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-x-auto">
        <table className="w-full text-xs font-mono text-center border-separate border-spacing-1">
          <thead>
            <tr className="text-slate-500">
              <th className="text-left py-1 px-2">Instruction</th>
              {Array.from({ length: sim.totalCycles }, (_, idx) => (
                <th
                  key={idx}
                  onClick={() => setCycle(idx + 1)}
                  className={`py-1 px-2 rounded cursor-pointer ${
                    cycle === idx + 1 ? 'bg-[#2563EB] text-white' : ''
                  }`}
                >
                  C{idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sim.instructions.map((inst, rIdx) => (
              <tr key={inst}>
                <td className="text-left py-1.5 px-2 font-bold text-[#14213D] dark:text-white whitespace-nowrap">
                  {inst}
                </td>
                {sim.grid[rIdx].map((cell, cIdx) => (
                  <td key={cIdx} className={`py-1.5 px-2 rounded font-bold ${cellStyle(cell, cycle === cIdx + 1)}`}>
                    {cell ?? '·'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
