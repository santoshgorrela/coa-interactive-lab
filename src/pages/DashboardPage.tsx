import React from 'react';
import { ArrowRight, CheckCircle2, Play, Clock } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { SIMULATIONS, UNITS } from '../data/syllabus';

export const DashboardPage: React.FC = () => {
  const { progress, navigate, toggleUnitCompleted } = useLab();
  const popularSims = SIMULATIONS.filter((s) => s.isPopular);
  const completedCount = progress.completedUnits.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header & Progress Summary Strip */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
            21CSS201T · Laboratory Control Center
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#14213D] dark:text-white">
            Main Engineering Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap gap-5 font-mono text-xs">
          <div>
            <div className="text-slate-500">Units Completed</div>
            <div className="text-lg font-bold text-[#14213D] dark:text-white">{completedCount} / 5</div>
          </div>
          <div>
            <div className="text-slate-500">Labs Explored</div>
            <div className="text-lg font-bold text-[#2563EB] dark:text-[#22D3EE]">
              {progress.exploredSims.length} / {SIMULATIONS.length}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Topics Studied</div>
            <div className="text-lg font-bold text-[#14213D] dark:text-white">
              {progress.exploredTopics.length}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Unit Laboratories */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-[#14213D] dark:text-white">
          Course Laboratories (Units 1–5)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {UNITS.map((unit) => {
            const done = progress.completedUnits.includes(unit.id);
            const unitSims = SIMULATIONS.filter((s) => s.unitId === unit.id);
            const quizScore = progress.quizScores[unit.id];
            return (
              <div
                key={unit.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">
                      {unit.code} · {unitSims.length} Simulators
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleUnitCompleted(unit.id)}
                      className={`inline-flex items-center gap-1 font-semibold cursor-pointer ${
                        done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {done ? 'Done' : 'Mark'}
                    </button>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-[#14213D] dark:text-white">
                    {unit.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {unit.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    {quizScore ? `Quiz: ${quizScore.correct}/${quizScore.total}` : 'Quiz Pending'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('quiz', { unitId: unit.id })}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('unit', { unitId: unit.id })}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                    >
                      Open Lab
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Simulations & Recently Explored */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#14213D] dark:text-white">
            Popular Interactive Simulations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {popularSims.map((sim) => (
              <button
                key={sim.id}
                type="button"
                onClick={() => navigate('workspace', { simId: sim.id })}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left hover:border-[#2563EB] dark:hover:border-[#22D3EE] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#2563EB] dark:text-[#22D3EE]">
                  <span>{sim.syllabusTag}</span>
                  <Play className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 font-display text-sm font-bold text-[#14213D] dark:text-white">
                  {sim.title}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {sim.subtitle}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="lg:col-span-4 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#14213D] dark:text-white">
            Recently Explored
          </h2>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5">
            {progress.history.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                Launch any simulation to record your lab session history here.
              </p>
            ) : (
              progress.history.slice(0, 6).map((h) => (
                <button
                  key={h.simId}
                  type="button"
                  onClick={() => navigate('workspace', { simId: h.simId })}
                  className="w-full flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#14213D] dark:text-white">{h.title}</div>
                    <div className="text-[11px] font-mono text-slate-500">Unit {h.unitId}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="h-3 w-3" />
                    {h.timestamp}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
