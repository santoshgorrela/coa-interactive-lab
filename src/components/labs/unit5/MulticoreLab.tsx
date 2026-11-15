import React, { useState } from 'react';
import { MulticoreTask, scheduleMulticoreTasks } from '../../../simulators/logic/parallelArmEngine';

const INITIAL_TASKS: MulticoreTask[] = [
  { id: 'T1', name: 'Matrix Block A', duration: 4 },
  { id: 'T2', name: 'FFT Transform', duration: 3 },
  { id: 'T3', name: 'Image Filter', duration: 4 },
  { id: 'T4', name: 'Sort Buffer', duration: 2 },
  { id: 'T5', name: 'CRC Check', duration: 3 },
];

export const MulticoreLab: React.FC = () => {
  const [coreCount, setCoreCount] = useState<1 | 2 | 4>(4);
  const [tasks, setTasks] = useState<MulticoreTask[]>(INITIAL_TASKS);
  const [newName, setNewName] = useState('Hash Chunk');
  const [newDur, setNewDur] = useState(3);

  const schedule = scheduleMulticoreTasks(coreCount, tasks);

  const addTask = () => {
    const nextId = `T${tasks.length + 1}`;
    setTasks((prev) => [...prev, { id: nextId, name: newName || nextId, duration: Math.max(1, Math.min(6, newDur)) }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
          {([1, 2, 4] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCoreCount(c)}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer ${
                coreCount === c ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {c}-Core {c === 1 ? '(Single)' : 'CMP'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            aria-label="New task name"
            className="w-28 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5"
          />
          <input
            type="number"
            min={1}
            max={6}
            value={newDur}
            onChange={(e) => setNewDur(Number(e.target.value) || 2)}
            aria-label="Task duration cycles"
            className="w-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 font-mono"
          />
          <button
            type="button"
            onClick={addTask}
            className="rounded-lg bg-[#2563EB] text-white px-3 py-1.5 font-semibold cursor-pointer"
          >
            + Add Thread
          </button>
          <button
            type="button"
            onClick={() => setTasks(INITIAL_TASKS)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-semibold cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">
            Chip Multiprocessor (CMP) Core Execution Timeline
          </h3>
          <div className="font-mono text-xs font-bold text-[#2563EB] dark:text-[#22D3EE]">
            Total: {schedule.totalCycles} cycles (vs {schedule.sequentialCycles} sequential) · Speedup: {schedule.speedup}×
          </div>
        </div>

        <div className="space-y-3">
          {schedule.cores.map((items, coreIdx) => (
            <div key={coreIdx} className="space-y-1">
              <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                Core {coreIdx}
              </div>
              <div className="flex h-10 w-full rounded-lg bg-slate-100 dark:bg-slate-800 p-1 gap-1 overflow-x-auto">
                {items.map((it) => {
                  const pct = ((it.end - it.start) / schedule.totalCycles) * 100;
                  return (
                    <div
                      key={it.taskId}
                      style={{ width: `${Math.max(12, pct)}%` }}
                      className="h-full rounded-md bg-[#2563EB] text-white px-2 flex items-center justify-between text-[11px] font-mono font-semibold shrink-0"
                    >
                      <span className="truncate">{it.taskId}: {it.name}</span>
                      <span className="ml-1 opacity-80">{it.end - it.start}c</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
