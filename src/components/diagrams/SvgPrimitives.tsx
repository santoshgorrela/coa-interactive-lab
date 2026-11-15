import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Eraser, Zap } from 'lucide-react';

interface SignalWireProps {
  d: string;
  active?: boolean;
  high?: boolean;
  bidirectional?: boolean;
  label?: string;
  labelX?: number;
  labelY?: number;
}

export const SignalWire: React.FC<SignalWireProps> = ({
  d,
  active = false,
  high = false,
  bidirectional = false,
  label,
  labelX,
  labelY,
}) => {
  const strokeColor = high ? '#22D3EE' : active ? '#2563EB' : '#94A3B8';
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={active || high ? 3 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active || high ? 'animate-signal-flow' : ''}
        opacity={active || high ? 1 : 0.45}
      />
      {bidirectional && (
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeDasharray="2 6"
          opacity={0.35}
        />
      )}
      {label && labelX !== undefined && labelY !== undefined && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          className="fill-slate-600 dark:fill-slate-300 text-[10px] font-mono font-semibold"
        >
          {label}
        </text>
      )}
    </g>
  );
};

interface ArchBlockProps {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  value?: string;
  active?: boolean;
  selected?: boolean;
  accent?: 'blue' | 'cyan' | 'navy' | 'emerald' | 'amber';
  onClick?: () => void;
}

export const ArchBlock: React.FC<ArchBlockProps> = ({
  x,
  y,
  width,
  height,
  title,
  subtitle,
  value,
  active = false,
  selected = false,
  accent = 'blue',
  onClick,
}) => {
  const strokePalette = {
    blue: active || selected ? '#2563EB' : '#CBD5E1',
    cyan: active || selected ? '#06B6D4' : '#CBD5E1',
    navy: active || selected ? '#14213D' : '#CBD5E1',
    emerald: active || selected ? '#10B981' : '#CBD5E1',
    amber: active || selected ? '#D97706' : '#CBD5E1',
  }[accent];

  return (
    <g
      onClick={onClick}
      className={onClick ? 'cursor-pointer transition-opacity hover:opacity-95' : ''}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        className={
          selected || active
            ? 'fill-blue-50 dark:fill-slate-800'
            : 'fill-white dark:fill-slate-900'
        }
        stroke={strokePalette}
        strokeWidth={selected ? 2.8 : active ? 2.2 : 1.4}
      />
      <text
        x={x + width / 2}
        y={y + (value && subtitle ? 18 : value ? 22 : height / 2 - (subtitle ? 5 : -4))}
        textAnchor="middle"
        className="fill-[#14213D] dark:fill-slate-100 text-[12px] font-bold font-display"
      >
        {title}
      </text>
      {subtitle && (
        <text
          x={x + width / 2}
          y={y + (value ? 34 : height / 2 + 12)}
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[10px] font-sans"
        >
          {subtitle}
        </text>
      )}
      {value && (
        <text
          x={x + width / 2}
          y={y + height - 9}
          textAnchor="middle"
          className="fill-[#2563EB] dark:fill-[#22D3EE] text-[12px] font-mono font-bold"
        >
          {value}
        </text>
      )}
    </g>
  );
};

interface SimControlBarProps {
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onStep?: () => void;
  onReset?: () => void;
  onClear?: () => void;
  speedMs?: number;
  onSpeedChange?: (ms: number) => void;
  examples?: { label: string; value: string }[];
  selectedExample?: string;
  onSelectExample?: (val: string) => void;
  stepText?: string;
}

export const SimControlBar: React.FC<SimControlBarProps> = ({
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  onClear,
  speedMs,
  onSpeedChange,
  examples,
  selectedExample,
  onSelectExample,
  stepText,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        {onPlayPause && (
          <button
            type="button"
            onClick={onPlayPause}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
        {onStep && (
          <button
            type="button"
            onClick={onStep}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <SkipForward className="h-3.5 w-3.5" />
            Step
          </button>
        )}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
        {stepText && (
          <span className="ml-1 font-mono text-xs font-semibold text-[#2563EB] dark:text-[#22D3EE] tabular-nums">
            {stepText}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {speedMs !== undefined && onSpeedChange && (
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <Zap className="h-3.5 w-3.5 text-[#2563EB] dark:text-[#22D3EE]" />
            <span>Speed</span>
            <select
              value={speedMs}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              aria-label="Simulation speed"
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-800 dark:text-slate-100"
            >
              <option value={1400}>0.5x</option>
              <option value={900}>1.0x</option>
              <option value={450}>2.0x</option>
            </select>
          </label>
        )}

        {examples && onSelectExample && (
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <span>Example</span>
            <select
              value={selectedExample}
              onChange={(e) => onSelectExample(e.target.value)}
              aria-label="Load preset example"
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-100"
            >
              {examples.map((ex) => (
                <option key={ex.value} value={ex.value}>
                  {ex.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
};
