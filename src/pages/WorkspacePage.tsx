import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { getSimById, SIMULATIONS, UNITS } from '../data/syllabus';
import { SimulatorRenderer } from '../components/labs/SimulatorRenderer';

export const WorkspacePage: React.FC = () => {
  const { activeSimId, navigate } = useLab();
  const activeSim = getSimById(activeSimId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            {activeSim.syllabusTag} · SIMULATION WORKSPACE
          </div>
          <h1 className="mt-0.5 font-display text-2xl font-extrabold text-[#14213D] dark:text-white">
            {activeSim.title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300">{activeSim.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeSim.id}
            onChange={(e) => navigate('workspace', { simId: e.target.value })}
            aria-label="Select simulation"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-[#14213D] dark:text-white max-w-[260px]"
          >
            {UNITS.map((unit) => (
              <optgroup key={unit.id} label={`Unit ${unit.id}: ${unit.shortTitle}`}>
                {SIMULATIONS.filter((s) => s.unitId === unit.id).map((sim) => (
                  <option key={sim.id} value={sim.id}>
                    {sim.shortTitle}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button
            type="button"
            onClick={() => navigate('unit', { unitId: activeSim.unitId })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Unit {activeSim.unitId} Guide
          </button>

          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14213D] dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      <SimulatorRenderer simId={activeSim.id} />
    </div>
  );
};
