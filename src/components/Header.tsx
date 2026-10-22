import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Database,
  BookOpen,
  Sparkles,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { MainViewType } from '../types/calendar';

interface HeaderProps {
  currentDate: Date;
  onChangeDate: (date: Date) => void;
  activeView: MainViewType;
  onChangeView: (view: MainViewType) => void;
  onOpenFirebaseSync: () => void;
  onOpenGuide: () => void;
  isFirebaseConfigured: boolean;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maart',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Augustus',
  'September',
  'Oktober',
  'November',
  'December',
];

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onChangeDate,
  activeView,
  onChangeView,
  onOpenFirebaseSync,
  onOpenGuide,
  isFirebaseConfigured,
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    if (newDate.getFullYear() >= 1926) {
      onChangeDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    if (newDate.getFullYear() <= 2056) {
      onChangeDate(newDate);
    }
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(year, currentMonth, Math.min(currentDate.getDate(), 28));
    onChangeDate(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentYear, month, Math.min(currentDate.getDate(), 28));
    onChangeDate(newDate);
  };

  const handleToday = () => {
    onChangeDate(new Date(2026, 9, 12)); // Oct 12, 2026
  };

  // Generate year options from 1926 to 2056 (130 years)
  const years = Array.from({ length: 2056 - 1926 + 1 }, (_, i) => 1926 + i);

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                Universele Kalender
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                1926 — 2056
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gregoriaans • Keltisch • Maya • Haab • Astronomisch • Essenen
            </p>
          </div>
        </div>

        {/* Date Selector & Navigation */}
        <div className="flex items-center flex-wrap justify-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 shadow-inner">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Vorige maand"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="bg-slate-900 text-slate-100 text-sm font-semibold rounded-lg px-2.5 py-1.5 border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="bg-slate-900 text-amber-300 text-sm font-bold rounded-lg px-2.5 py-1.5 border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Volgende maand"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleToday}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 transition font-medium ml-1"
            title="Naar huidige datum"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Vandaag
          </button>
        </div>

        {/* Global Action Modals */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            Kalender Gids
          </button>

          <button
            onClick={onOpenFirebaseSync}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isFirebaseConfigured
                ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/50'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Firebase DB</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Primary View Switcher Navigation */}
      <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-start overflow-x-auto gap-1.5 py-1 no-scrollbar text-xs">
        <span className="text-slate-400 text-xs font-medium mr-2 flex items-center gap-1 shrink-0">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> Weergave:
        </span>

        <button
          onClick={() => onChangeView('month')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'month'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <span>Standaard Maand (6 Weken)</span>
        </button>

        <button
          onClick={() => onChangeView('week')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'week'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <span>Week View</span>
        </button>

        <button
          onClick={() => onChangeView('year')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'year'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <span>Jaar View</span>
        </button>

        <span className="text-slate-600 px-1 shrink-0">|</span>

        <button
          onClick={() => onChangeView('essene')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'essene'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
              : 'bg-slate-800/70 hover:bg-slate-700 text-cyan-300'
          }`}
        >
          <span>📜 Essenen Kalender</span>
        </button>

        <button
          onClick={() => onChangeView('maya')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'maya'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
              : 'bg-slate-800/70 hover:bg-slate-700 text-amber-300'
          }`}
        >
          <span>☀️ Maya & Haab</span>
        </button>

        <button
          onClick={() => onChangeView('celtic')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'celtic'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
              : 'bg-slate-800/70 hover:bg-slate-700 text-emerald-300'
          }`}
        >
          <span>🌿 Keltisch Wiel & Bomen</span>
        </button>

        <button
          onClick={() => onChangeView('astronomical')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
            activeView === 'astronomical'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-slate-800/70 hover:bg-slate-700 text-purple-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Astronomisch & Maancycli</span>
        </button>
      </div>
    </header>
  );
};
