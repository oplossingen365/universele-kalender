import React from 'react';
import { CalendarSystemKey } from '../types/calendar';
import { Filter, CheckCheck, X } from 'lucide-react';

interface FilterBarProps {
  activeFilters: Record<CalendarSystemKey, boolean>;
  onToggleFilter: (key: CalendarSystemKey) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  eventCounts?: Record<CalendarSystemKey, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onToggleFilter,
  onSelectAll,
  onClearAll,
  eventCounts,
}) => {
  const filterDefinitions: Array<{
    key: CalendarSystemKey;
    label: string;
    icon: string;
    colorActive: string;
    colorBadge: string;
  }> = [
    {
      key: 'gregorian',
      label: 'Standaard Kalender',
      icon: '🏛️',
      colorActive: 'bg-blue-600/30 border-blue-500 text-blue-200',
      colorBadge: 'bg-blue-500/20 text-blue-300',
    },
    {
      key: 'essene',
      label: 'Essenen (364d & Feesten)',
      icon: '📜',
      colorActive: 'bg-cyan-600/30 border-cyan-500 text-cyan-200',
      colorBadge: 'bg-cyan-500/20 text-cyan-300',
    },
    {
      key: 'maya_tzolkin',
      label: 'Maya Tzolk\'in',
      icon: '☀️',
      colorActive: 'bg-amber-600/30 border-amber-500 text-amber-200',
      colorBadge: 'bg-amber-500/20 text-amber-300',
    },
    {
      key: 'haab',
      label: 'Maya Haab\' Zonnecyclus',
      icon: '🏺',
      colorActive: 'bg-purple-600/30 border-purple-500 text-purple-200',
      colorBadge: 'bg-purple-500/20 text-purple-300',
    },
    {
      key: 'celtic',
      label: 'Keltisch (Sabbats & Bomen)',
      icon: '🌿',
      colorActive: 'bg-emerald-600/30 border-emerald-500 text-emerald-200',
      colorBadge: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      key: 'astronomical',
      label: 'Astronomisch & Maanfasen',
      icon: '✨',
      colorActive: 'bg-yellow-600/30 border-yellow-500 text-yellow-200',
      colorBadge: 'bg-yellow-500/20 text-yellow-300',
    },
  ];

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filter events per kalendersysteem:</span>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {filterDefinitions.map((f) => {
            const isActive = activeFilters[f.key];
            const count = eventCounts ? eventCounts[f.key] : undefined;

            return (
              <button
                key={f.key}
                onClick={() => onToggleFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none ${
                  isActive
                    ? `${f.colorActive} shadow-sm shadow-black/40`
                    : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-sm">{f.icon}</span>
                <span>{f.label}</span>
                {count !== undefined && count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${f.colorBadge}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick bulk actions */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Alle kalender-filters inschakelen"
          >
            <CheckCheck className="w-3 h-3 text-emerald-400" />
            Alles aan
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Alle kalender-filters uitschakelen"
          >
            <X className="w-3 h-3 text-rose-400" />
            Wissen
          </button>
        </div>
      </div>
    </div>
  );
};
