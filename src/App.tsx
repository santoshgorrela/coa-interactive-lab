import React from 'react';
import { LabProvider, useLab } from './context/LabContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UnitPage } from './pages/UnitPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { QuizPage } from './pages/QuizPage';
import { ProgressPage } from './pages/ProgressPage';
import { AboutPage } from './pages/AboutPage';

const AppShell: React.FC = () => {
  const { page, navigate } = useLab();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] dark:bg-[#0B1220] text-[#172033] dark:text-[#F1F5F9]">
      <Navbar />
      <main className="flex-1">
        {page === 'landing' && <LandingPage />}
        {page === 'dashboard' && <DashboardPage />}
        {page === 'unit' && <UnitPage />}
        {page === 'workspace' && <WorkspacePage />}
        {page === 'quiz' && <QuizPage />}
        {page === 'progress' && <ProgressPage />}
        {page === 'about' && <AboutPage />}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] dark:text-slate-400">
          <div className="font-mono">
            COA INTERACTIVE LAB · Course Code 21CSS201T · Understand. Experiment. Visualize. Simulate.
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('dashboard')} className="hover:text-[#2563EB] cursor-pointer">
              Dashboard
            </button>
            <button type="button" onClick={() => navigate('workspace')} className="hover:text-[#2563EB] cursor-pointer">
              Workspace
            </button>
            <button type="button" onClick={() => navigate('about')} className="hover:text-[#2563EB] cursor-pointer">
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LabProvider>
      <AppShell />
    </LabProvider>
  );
}
