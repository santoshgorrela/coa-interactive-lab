import React, { useState } from 'react';
import { Cpu, Moon, Sun, Menu, X } from 'lucide-react';
import { AppPage, useLab } from '../../context/LabContext';

export const Navbar: React.FC = () => {
  const { page, theme, toggleTheme, navigate } = useLab();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: AppPage; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'unit', label: 'Units' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'progress', label: 'Progress' },
    { id: 'manual', label: 'Manual' },
    { id: 'about', label: 'About' },
  ];

  const handleNav = (target: AppPage) => {
    navigate(target);
    setMobileOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14213D] dark:bg-[#2563EB] text-[#22D3EE] dark:text-white transition-transform group-hover:scale-105">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-[#14213D] dark:text-white">
              COA INTERACTIVE LAB
            </span>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400">
              21CSS201T · Architecture Lab
            </span>
          </span>
        </button>

        {/* Zone 2: Single-line Primary Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`whitespace-nowrap shrink-0 text-sm font-medium transition-colors cursor-pointer py-1 border-b-2 ${
                  active
                    ? 'border-[#2563EB] text-[#2563EB] dark:border-[#22D3EE] dark:text-[#22D3EE]'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#14213D] dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-[#14213D]" />}
          </button>

          <button
            type="button"
            onClick={() => handleNav('workspace')}
            className="hidden sm:inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Launch Simulator
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-medium ${
                  active
                    ? 'bg-blue-50 dark:bg-slate-800 text-[#2563EB] dark:text-[#22D3EE]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
