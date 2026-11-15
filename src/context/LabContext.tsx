import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SIMULATIONS, UnitId } from '../data/syllabus';

export type AppPage = 'landing' | 'dashboard' | 'unit' | 'workspace' | 'quiz' | 'progress' | 'about';

export interface SimHistoryEntry {
  simId: string;
  title: string;
  unitId: UnitId;
  timestamp: string;
}

export interface LabProgress {
  exploredTopics: string[];
  exploredSims: string[];
  completedUnits: UnitId[];
  quizScores: Partial<Record<UnitId, { correct: number; total: number; lastTaken: string }>>;
  history: SimHistoryEntry[];
}

const DEFAULT_PROGRESS: LabProgress = {
  exploredTopics: [],
  exploredSims: [],
  completedUnits: [],
  quizScores: {},
  history: [],
};

const STORAGE_KEY = 'coa_lab_progress_v1';
const THEME_KEY = 'coa_lab_theme_v1';

interface LabContextValue {
  page: AppPage;
  activeUnitId: UnitId;
  activeSimId: string;
  theme: 'light' | 'dark';
  progress: LabProgress;
  navigate: (page: AppPage, opts?: { unitId?: UnitId; simId?: string }) => void;
  toggleTheme: () => void;
  markTopicExplored: (topicId: string) => void;
  markSimExplored: (simId: string) => void;
  toggleUnitCompleted: (unitId: UnitId) => void;
  recordQuizScore: (unitId: UnitId, correct: number, total: number) => void;
  resetProgress: () => void;
}

const LabContext = createContext<LabContextValue | null>(null);

function loadStoredProgress(): LabProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LabProgress>;
    return {
      exploredTopics: Array.isArray(parsed.exploredTopics) ? parsed.exploredTopics : [],
      exploredSims: Array.isArray(parsed.exploredSims) ? parsed.exploredSims : [],
      completedUnits: Array.isArray(parsed.completedUnits) ? parsed.completedUnits : [],
      quizScores: parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<AppPage>('landing');
  const [activeUnitId, setActiveUnitId] = useState<UnitId>(1);
  const [activeSimId, setActiveSimId] = useState<string>('u1-von-neumann');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });
  const [progress, setProgress] = useState<LabProgress>(loadStoredProgress);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const markSimExplored = useCallback((simId: string) => {
    const sim = SIMULATIONS.find((s) => s.id === simId);
    if (!sim) return;
    setProgress((prev) => {
      const exploredSims = prev.exploredSims.includes(simId) ? prev.exploredSims : [...prev.exploredSims, simId];
      const entry: SimHistoryEntry = {
        simId,
        title: sim.shortTitle,
        unitId: sim.unitId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const filteredHistory = prev.history.filter((h) => h.simId !== simId);
      const history = [entry, ...filteredHistory].slice(0, 12);
      return { ...prev, exploredSims, history };
    });
  }, []);

  const navigate = useCallback(
    (nextPage: AppPage, opts?: { unitId?: UnitId; simId?: string }) => {
      setPage(nextPage);
      if (opts?.unitId) {
        setActiveUnitId(opts.unitId);
        if (!opts.simId) {
          const firstForUnit = SIMULATIONS.find((s) => s.unitId === opts.unitId);
          if (firstForUnit) setActiveSimId(firstForUnit.id);
        }
      }
      if (opts?.simId) {
        setActiveSimId(opts.simId);
        const sim = SIMULATIONS.find((s) => s.id === opts.simId);
        if (sim) setActiveUnitId(sim.unitId);
        markSimExplored(opts.simId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [markSimExplored],
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const markTopicExplored = useCallback((topicId: string) => {
    setProgress((prev) => {
      if (prev.exploredTopics.includes(topicId)) return prev;
      return { ...prev, exploredTopics: [...prev.exploredTopics, topicId] };
    });
  }, []);

  const toggleUnitCompleted = useCallback((unitId: UnitId) => {
    setProgress((prev) => {
      const exists = prev.completedUnits.includes(unitId);
      const completedUnits = exists
        ? prev.completedUnits.filter((u) => u !== unitId)
        : [...prev.completedUnits, unitId];
      return { ...prev, completedUnits };
    });
  }, []);

  const recordQuizScore = useCallback((unitId: UnitId, correct: number, total: number) => {
    setProgress((prev) => {
      const prevScore = prev.quizScores[unitId];
      const bestCorrect = prevScore ? Math.max(prevScore.correct, correct) : correct;
      const shouldAutoComplete = correct / total >= 0.6 && !prev.completedUnits.includes(unitId);
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [unitId]: {
            correct: bestCorrect,
            total,
            lastTaken: new Date().toLocaleDateString(),
          },
        },
        completedUnits: shouldAutoComplete ? [...prev.completedUnits, unitId] : prev.completedUnits,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LabContext.Provider
      value={{
        page,
        activeUnitId,
        activeSimId,
        theme,
        progress,
        navigate,
        toggleTheme,
        markTopicExplored,
        markSimExplored,
        toggleUnitCompleted,
        recordQuizScore,
        resetProgress,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export function useLab(): LabContextValue {
  const ctx = useContext(LabContext);
  if (!ctx) {
    throw new Error('useLab must be used inside LabProvider');
  }
  return ctx;
}
