import React from 'react';
import { useLab } from '../context/LabContext';
import { SIMULATIONS, UNITS } from '../data/syllabus';

export const AboutPage: React.FC = () => {
  const { navigate } = useLab();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 space-y-4">
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
          Academic Project · Course Code 21CSS201T
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#14213D] dark:text-white">
          About COA Interactive Lab
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>COA INTERACTIVE LAB</strong> is an interactive academic computer engineering laboratory built for <strong>Computer Organization and Architecture (21CSS201T)</strong>. Rather than presenting static textbook paragraphs, every core concept across all five syllabus units is paired with live state-driven SVG diagrams, micro-operation steppers, truth-table engines, and hands-on hardware experiments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
            <div className="text-slate-500">Syllabus Coverage</div>
            <div className="mt-1 text-lg font-bold text-[#14213D] dark:text-white">Units 1 – 5</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
            <div className="text-slate-500">Interactive Simulators</div>
            <div className="mt-1 text-lg font-bold text-[#2563EB] dark:text-[#22D3EE]">{SIMULATIONS.length} Modules</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
            <div className="text-slate-500">Architecture Stack</div>
            <div className="mt-1 text-lg font-bold text-[#14213D] dark:text-white">Client-Side SPA</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 space-y-4">
        <h2 className="font-display text-xl font-bold text-[#14213D] dark:text-white">
          Curriculum Alignment &amp; Supplementary Distinction
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          All terminology, micro-operation sequences, arithmetic algorithms, hazard diagrams, and ARM7TDMI/ARMv5TEJ specifications strictly align with the five 21CSS201T course units. Enrichment exercises inspired by the 8086 reference lab guide are clearly labeled as <em>Supplementary Enrichment</em>.
        </p>
        <div className="space-y-2">
          {UNITS.map((u) => (
            <div
              key={u.id}
              onClick={() => navigate('unit', { unitId: u.id })}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 hover:border-[#2563EB] cursor-pointer"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#2563EB] dark:text-[#22D3EE] mr-2">
                  {u.code}
                </span>
                <span className="text-sm font-bold text-[#14213D] dark:text-white">{u.title}</span>
              </div>
              <span className="text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">Explore →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
