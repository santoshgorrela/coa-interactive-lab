import React, { useEffect, useState } from 'react';
import { simulateDependencyGraph } from '../../../simulators/logic/parallelArmEngine';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

export const SequentialParallelLab: React.FC = () => {
  const graph = simulateDependencyGraph();
  const [execMode, setExecMode] = useState<'parallel' | 'sequential'>('parallel');
  const [cycle, setCycle] = useState(1);
  const [playing, setPlaying] = useState(false);

  const maxCycles = execMode === 'parallel' ? graph.parallelCycles : graph.sequentialCycles;

  useEffect(() => {
    setCycle(1);
  }, [execMode]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setCycle((c) => (c >= maxCycles ? 1 : c + 1));
    }, 950);
    return () => window.clearInterval(id);
  }, [playing, maxCycles]);

  const isTaskActive = (seqCyc: number, parCyc: number) =>
    execMode === 'parallel' ? parCyc === cycle : seqCyc === cycle;

  const isTaskDone = (seqCyc: number, parCyc: number) =>
    execMode === 'parallel' ? parCyc <= cycle : seqCyc <= cycle;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setExecMode('sequential')}
            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
              execMode === 'sequential' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Sequential Execution (5 Cycles)
          </button>
          <button
            type="button"
            onClick={() => setExecMode('parallel')}
            className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
              execMode === 'parallel' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Parallel Execution (3 Cycles · {graph.speedup}×)
          </button>
        </div>

        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
          ILP Dependence Graph (P1–P5)
        </span>
      </div>

      <SimControlBar
        isPlaying={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onStep={() => setCycle((c) => (c >= maxCycles ? 1 : c + 1))}
        onReset={() => {
          setPlaying(false);
          setCycle(1);
        }}
        stepText={`Cycle ${cycle}/${maxCycles} (${execMode === 'parallel' ? 'Parallel ILP' : 'Sequential'})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <svg viewBox="0 0 600 280" className="w-full h-auto select-none">
            <SignalWire d="M 155 76 L 100 132" active={isTaskDone(2, 2)} high={isTaskActive(2, 2)} label="RAW C" labelX={106} labelY={102} />
            <SignalWire d="M 185 76 L 265 132" active={isTaskDone(3, 2)} high={isTaskActive(3, 2)} label="RAW C" labelX={245} labelY={102} />
            <SignalWire d="M 100 192 L 100 218" active={isTaskDone(4, 3)} high={isTaskActive(4, 3)} label="RAW M" labelX={132} labelY={208} />

            <ArchBlock x={100} y={20} width={140} height={56} title="P1: C = D * E" value="Cyc 1" active={isTaskActive(1, 1)} />
            <ArchBlock x={390} y={20} width={165} height={56} title="P5: F = G / E" subtitle="Independent!" value={execMode === 'parallel' ? 'Par Cyc 1' : 'Seq Cyc 5'} active={isTaskActive(5, 1)} accent="cyan" />
            <ArchBlock x={30} y={132} width={140} height={60} title="P2: M = G + C" value="Cyc 2" active={isTaskActive(2, 2)} />
            <ArchBlock x={210} y={132} width={145} height={60} title="P3: A = B + C" value={execMode === 'parallel' ? 'Par Cyc 2' : 'Seq Cyc 3'} active={isTaskActive(3, 2)} />
            <ArchBlock x={30} y={216} width={150} height={52} title="P4: C = L + M" value={execMode === 'parallel' ? 'Par Cyc 3' : 'Seq Cyc 4'} active={isTaskActive(4, 3)} accent="emerald" />
          </svg>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5">
          <div className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            TASK DEPENDENCE ANALYSIS
          </div>
          {graph.tasks.map((t) => {
            const active = isTaskActive(t.sequentialCycle, t.parallelCycle);
            return (
              <div
                key={t.id}
                className={`rounded-lg border p-2.5 text-xs ${
                  active
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between font-mono font-bold text-[#14213D] dark:text-white">
                  <span>{t.id}: {t.expr}</span>
                  <span className="text-[#2563EB] dark:text-[#22D3EE]">
                    {execMode === 'parallel' ? `Par C${t.parallelCycle}` : `Seq C${t.sequentialCycle}`}
                  </span>
                </div>
                <div className="mt-1 text-slate-600 dark:text-slate-300">{t.hazardNote}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
