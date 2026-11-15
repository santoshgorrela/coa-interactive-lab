import React, { useState } from 'react';
import { CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { SIMULATIONS, UNITS } from '../data/syllabus';

export const ProgressPage: React.FC = () => {
  const { progress, toggleUnitCompleted, navigate, resetProgress } = useLab();
  const [confirmReset, setConfirmReset] = useState(false);

  const totalTopics = UNITS.reduce((acc, u) => acc + u.topics.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            LOCAL STORAGE TRACKING · 21CSS201T
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#14213D] dark:text-white">
            Learning Progress &amp; History
          </h1>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Reset Progress
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-red-600 dark:text-red-400">Clear saved progress?</span>
            <button
              type="button"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500">Units Completed</div>
          <div className="mt-1 text-2xl font-bold text-[#14213D] dark:text-white">
            {progress.completedUnits.length} / 5
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500">Simulations Explored</div>
          <div className="mt-1 text-2xl font-bold text-[#2563EB] dark:text-[#22D3EE]">
            {progress.exploredSims.length} / {SIMULATIONS.length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500">Topics Studied</div>
          <div className="mt-1 text-2xl font-bold text-[#14213D] dark:text-white">
            {progress.exploredTopics.length} / {totalTopics}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500">Quizzes Taken</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {Object.keys(progress.quizScores).length} / 5
          </div>
        </div>
      </div>

      {/* Unit-wise Completion & Quiz Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <h2 className="font-display text-lg font-bold text-[#14213D] dark:text-white">Unit Breakdown</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {UNITS.map((u) => {
            const done = progress.completedUnits.includes(u.id);
            const score = progress.quizScores[u.id];
            return (
              <div key={u.id} className="py-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-[#2563EB] dark:text-[#22D3EE]">{u.code}</div>
                  <div className="text-sm font-bold text-[#14213D] dark:text-white">{u.title}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                    {score ? `Best Quiz: ${score.correct}/${score.total}` : 'No quiz attempt yet'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleUnitCompleted(u.id)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                      done
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {done ? 'Completed' : 'Incomplete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('unit', { unitId: u.id })}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE] cursor-pointer"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation History */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <h2 className="font-display text-lg font-bold text-[#14213D] dark:text-white">Simulation Activity Log</h2>
        {progress.history.length === 0 ? (
          <p className="text-xs text-slate-500">No simulation history recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {progress.history.map((h) => (
              <button
                key={h.simId}
                type="button"
                onClick={() => navigate('workspace', { simId: h.simId })}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 text-left hover:border-[#2563EB] cursor-pointer"
              >
                <div className="text-xs font-bold text-[#14213D] dark:text-white">{h.title}</div>
                <div className="mt-1 font-mono text-[11px] text-slate-500">
                  Unit {h.unitId} · {h.timestamp}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
