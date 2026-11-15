import React, { useEffect, useState } from 'react';
import {
  PipelineScenarioId,
  PipelineStageCell,
  simulatePipeline,
} from '../../../simulators/logic/processorPipelineEngine';
import { SimControlBar } from '../../diagrams/SvgPrimitives';

const SCENARIOS: { id: PipelineScenarioId; label: string }[] = [
  { id: 'structural', label: 'Structural Hazard' },
  { id: 'data_raw_stall', label: 'RAW Data Hazard (Stall)' },
  { id: 'data_forwarding', label: 'RAW Resolved (Forwarding)' },
  { id: 'load_use_stall', label: 'Load-Use (1 Stall + Bypass)' },
  { id: 'control_branch_stall', label: 'Control / Branch Flush' },
  { id: 'control_branch_predict', label: 'Branch Prediction (0 Stall)' },
];

export const PipelineHazardLab: React.FC = () => {
  const [scenario, setScenario] = useState<PipelineScenarioId>('data_raw_stall');
  const [cycle, setCycle] = useState(1);
  const [playing, setPlaying] = useState(false);

  const sim = simulatePipeline(scenario);

  useEffect(() => {
    setCycle(1);
    setPlaying(false);
  }, [scenario]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setCycle((c) => (c >= sim.totalCycles ? 1 : c + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, [playing, sim.totalCycles]);

  const badgeStyle = (cell: PipelineStageCell, isCur: boolean) => {
    if (!cell) return 'text-slate-300 dark:text-slate-700';
    if (cell === 'STALL') return `bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 ${isCur ? 'ring-2 ring-amber-500' : ''}`;
    if (cell === 'FLUSH') return `bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 ${isCur ? 'ring-2 ring-red-500' : ''}`;
    return `bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-cyan-200 ${isCur ? 'ring-2 ring-[#2563EB]' : ''}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenario(s.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              scenario === s.id
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setCycle((c) => (c >= sim.totalCycles ? 1 : c + 1))}
        onReset={() => {
          setPlaying(false);
          setCycle(1);
        }}
        stepText={`Cycle C${cycle}/${sim.totalCycles} · Stall/Penalty Cycles: ${sim.stallCount}`}
      />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">{sim.title}</h3>
          {sim.forwardingLinks.length > 0 && (
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Active Bypass: {sim.forwardingLinks.map((f) => f.label).join(' · ')}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
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
                    <td key={cIdx} className={`py-1.5 px-2 rounded font-bold ${badgeStyle(cell, cycle === cIdx + 1)}`}>
                      {cell ?? '·'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
          {sim.hazardSummary}
        </div>
      </div>
    </div>
  );
};
