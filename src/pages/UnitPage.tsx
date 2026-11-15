import React, { useEffect, useState } from 'react';
import { Maximize2, CheckCircle2, HelpCircle } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { getUnitById, SIMULATIONS, UNITS, UnitId } from '../data/syllabus';
import { SimulatorRenderer } from '../components/labs/SimulatorRenderer';

export const UnitPage: React.FC = () => {
  const { activeUnitId, navigate, progress, markTopicExplored, markSimExplored, toggleUnitCompleted } = useLab();
  const unit = getUnitById(activeUnitId);
  const unitSims = SIMULATIONS.filter((s) => s.unitId === unit.id);

  const [selectedSimId, setSelectedSimId] = useState(unitSims[0]?.id ?? 'u1-von-neumann');

  useEffect(() => {
    const first = SIMULATIONS.find((s) => s.unitId === activeUnitId);
    if (first) {
      setSelectedSimId(first.id);
      markSimExplored(first.id);
    }
  }, [activeUnitId, markSimExplored]);

  const activeSim = unitSims.find((s) => s.id === selectedSimId) ?? unitSims[0];
  const isCompleted = progress.completedUnits.includes(unit.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Unit Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => navigate('unit', { unitId: u.id as UnitId })}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold cursor-pointer transition-colors ${
                u.id === unit.id
                  ? 'bg-[#14213D] dark:bg-[#2563EB] text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {u.code}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleUnitCompleted(unit.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              isCompleted
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isCompleted ? 'Unit Completed' : 'Mark Unit Complete'}
          </button>

          <button
            type="button"
            onClick={() => navigate('quiz', { unitId: unit.id })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Unit {unit.id} Practice Quiz
          </button>
        </div>
      </div>

      {/* Unit Intro */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
        <div className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">
          {unit.code} · {unitSims.length} INTERACTIVE SIMULATORS · SYLLABUS ALIGNED
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#14213D] dark:text-white">
          {unit.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {unit.introduction}
        </p>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200">
          <strong>Practical Lab Goal:</strong> {unit.practicalExample}
        </div>
      </div>

      {/* Interactive Topic Explorer */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-[#14213D] dark:text-white">
          Syllabus Topic Explorer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {unit.topics.map((topic) => {
            const studied = progress.exploredTopics.includes(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => {
                  markTopicExplored(topic.id);
                  if (topic.linkedSimId) {
                    setSelectedSimId(topic.linkedSimId);
                    markSimExplored(topic.linkedSimId);
                  }
                }}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  topic.isSupplementary
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#2563EB]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={topic.isSupplementary ? 'text-amber-700 dark:text-amber-300 font-bold' : 'text-[#2563EB] dark:text-[#22D3EE]'}>
                    {topic.isSupplementary ? 'Supplementary Enrichment' : 'Core Syllabus'}
                  </span>
                  {studied && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Studied</span>}
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-[#14213D] dark:text-white">{topic.title}</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{topic.summary}</p>
                <div className="mt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {topic.keyTerms.join(' · ')}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Unit Interactive Simulator */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-[#14213D] dark:text-white">
              {activeSim?.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{activeSim?.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('workspace', { simId: activeSim?.id })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Open in Full Workspace
          </button>
        </div>

        {/* Simulator Selector Tabs within Unit */}
        <div className="flex flex-wrap gap-2">
          {unitSims.map((sim) => (
            <button
              key={sim.id}
              type="button"
              onClick={() => {
                setSelectedSimId(sim.id);
                markSimExplored(sim.id);
              }}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                selectedSimId === sim.id
                  ? 'bg-[#2563EB] text-white'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {sim.shortTitle}
            </button>
          ))}
        </div>

        <SimulatorRenderer simId={selectedSimId} />
      </section>
    </div>
  );
};
