import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { getQuestionsByUnit } from '../data/quizzes';
import { UNITS, UnitId } from '../data/syllabus';

export const QuizPage: React.FC = () => {
  const { activeUnitId, navigate, recordQuizScore } = useLab();
  const [unitId, setUnitId] = useState<UnitId>(activeUnitId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = getQuestionsByUnit(unitId);

  useEffect(() => {
    setUnitId(activeUnitId);
    setAnswers({});
    setSubmitted(false);
  }, [activeUnitId]);

  const handleSelectUnit = (uid: UnitId) => {
    setUnitId(uid);
    setAnswers({});
    setSubmitted(false);
  };

  const correctCount = questions.reduce(
    (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
    0,
  );

  const handleSubmit = () => {
    setSubmitted(true);
    recordQuizScore(unitId, correctCount, questions.length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">
            PRACTICE &amp; ASSESSMENT · 21CSS201T
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#14213D] dark:text-white">
            Unit-Wise Practice Quiz
          </h1>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleSelectUnit(u.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold cursor-pointer ${
                unitId === u.id
                  ? 'bg-[#2563EB] text-white'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
              }`}
            >
              Unit {u.id}
            </button>
          ))}
        </div>
      </div>

      {submitted && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE]">
              UNIT {unitId} RESULTS SUMMARY
            </div>
            <div className="mt-1 font-display text-2xl font-extrabold text-[#14213D] dark:text-white">
              Score: {correctCount} / {questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Score saved to your Progress dashboard.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Quiz
            </button>
            <button
              type="button"
              onClick={() => navigate('progress')}
              className="rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              View Progress
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const picked = answers[q.id];
          const isPicked = picked !== undefined;
          const isCorrect = picked === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
            >
              <div className="font-mono text-xs text-slate-500">
                Question {qIdx + 1} of {questions.length} · Unit {unitId}
              </div>
              <h3 className="text-base font-bold text-[#14213D] dark:text-white">{q.question}</h3>

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const selected = picked === oIdx;
                  const rightOption = oIdx === q.correctIndex;
                  let style =
                    'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#2563EB]';
                  if (isPicked) {
                    if (rightOption) {
                      style =
                        'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else if (selected) {
                      style = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                    }
                  } else if (selected) {
                    style = 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                      className={`w-full flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {isPicked && rightOption && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                      {isPicked && selected && !rightOption && <XCircle className="h-4 w-4 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isPicked && (
                <div
                  className={`rounded-lg p-3 text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <strong>{isCorrect ? 'Correct:' : 'Explanation:'}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            Submit Unit {unitId} Quiz ({Object.keys(answers).length}/{questions.length} Answered)
          </button>
        </div>
      )}
    </div>
  );
};
