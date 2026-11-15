import React, { useState } from 'react';
import { calculatePipelineMetrics } from '../../../simulators/logic/processorPipelineEngine';

export const PipelinePerfLab: React.FC = () => {
  const [stages, setStages] = useState(5);
  const [instructions, setInstructions] = useState(100);
  const [clockNs, setClockNs] = useState(2);
  const [stalls, setStalls] = useState(10);

  const m = calculatePipelineMetrics(stages, instructions, clockNs, stalls);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-base font-bold text-[#14213D] dark:text-white">Pipeline Performance Parameters</h3>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span>Pipeline Stages (k)</span>
            <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">{stages} stages</span>
          </div>
          <input type="range" min={2} max={12} value={stages} onChange={(e) => setStages(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span>Instructions (N)</span>
            <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">{instructions} instr</span>
          </div>
          <input type="range" min={5} max={500} step={5} value={instructions} onChange={(e) => setInstructions(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span>Stage Clock Period (τ)</span>
            <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">{clockNs} ns</span>
          </div>
          <input type="range" min={1} max={10} step={0.5} value={clockNs} onChange={(e) => setClockNs(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span>Hazard Stall Cycles</span>
            <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">{stalls} cycles</span>
          </div>
          <input type="range" min={0} max={100} value={stalls} onChange={(e) => setStalls(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
            <div className="text-[11px] text-slate-500">Non-Pipelined</div>
            <div className="text-lg font-bold text-[#14213D] dark:text-white">{m.nonPipelinedCycles} cyc</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
            <div className="text-[11px] text-slate-500">Pipelined</div>
            <div className="text-lg font-bold text-[#2563EB] dark:text-[#22D3EE]">{m.pipelinedCycles} cyc</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
            <div className="text-[11px] text-slate-500">Speedup (S)</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{m.speedup}×</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
            <div className="text-[11px] text-slate-500">Throughput</div>
            <div className="text-lg font-bold text-[#14213D] dark:text-white">{m.throughputMIPS} MIPS</div>
          </div>
        </div>

        {/* Visual Cycle Comparison Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Sequential Execution Time</span>
              <span>{m.nonPipelinedTimeNs} ns</span>
            </div>
            <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-slate-500" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Pipelined Execution Time (Efficiency {m.efficiencyPercent}%)</span>
              <span>{m.pipelinedTimeNs} ns</span>
            </div>
            <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#2563EB]"
                style={{ width: `${Math.min(100, (m.pipelinedCycles / m.nonPipelinedCycles) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Assumption: Equal stage latency τ = {clockNs} ns; Total Cycles = k + (N − 1) + Stalls = {stages} + {instructions - 1} + {stalls} = {m.pipelinedCycles}.
        </p>
      </div>
    </div>
  );
};
