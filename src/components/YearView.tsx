import React from 'react';
import { UnifiedDayInfo, CalendarSystemKey } from '../types/calendar';
import { getUnifiedDayInfo } from '../services/calendarEngine';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';

interface YearViewProps {
  currentYear: number;
  onSelectMonth: (monthIndex: number) => void;
  onSelectDate: (date: Date) => void;
  activeFilters: Record<CalendarSystemKey, boolean>;
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

export const YearView: React.FC<YearViewProps> = ({
  currentYear,
  onSelectMonth,
  onSelectDate,
  activeFilters,
}) => {
  // Key festival dates for the year summary
  const keyYearEvents = [
    { title: 'Imbolc (Keltisch Vuurfeest)', date: new Date(currentYear, 1, 1), type: 'celtic' },
    { title: 'Astronomische Lente-equinox & Ostara', date: new Date(currentYear, 2, 20), type: 'astro' },
    { title: 'Essenen Nieuwjaar (Rosh Chodashim)', date: new Date(currentYear, 2, 25), type: 'essene' },
    { title: 'Beltane (Keltisch Meifeest)', date: new Date(currentYear, 4, 1), type: 'celtic' },
    { title: 'Zomerzonnewende & Litha', date: new Date(currentYear, 5, 21), type: 'astro' },
    { title: 'Lughnasadh (Oogstfeest)', date: new Date(currentYear, 7, 1), type: 'celtic' },
    { title: 'Herfst-equinox & Mabon', date: new Date(currentYear, 8, 22), type: 'astro' },
    { title: 'Samhain (Keltisch Nieuwjaar)', date: new Date(currentYear, 9, 31), type: 'celtic' },
    { title: 'Winterzonnewende & Yule', date: new Date(currentYear, 11, 21), type: 'astro' },
    { title: 'Keltische Naamloze Dag (Maretak)', date: new Date(currentYear, 11, 23), type: 'celtic' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Year Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Jaaroverzicht {currentYear}
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700 font-semibold">
              12 Maanden
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Overzicht van alle kosmische, Keltische, Maya en Essenen cycli gedurende {currentYear}. Klik op een maand om de 6-weken weergave te openen.
          </p>
        </div>

        {/* Quick Highlights Badge */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 flex items-center gap-1.5">
            <span>📜 4 Essenen Tekufot</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 flex items-center gap-1.5">
            <span>🌿 8 Keltische Sabbats</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 flex items-center gap-1.5">
            <span>☀️ 365d Haab & Tzolk'in</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300 flex items-center gap-1.5">
            <span>✨ ~12.4 Maancycli</span>
          </div>
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTH_NAMES.map((monthName, monthIndex) => {
          // Days in this month
          const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
          const firstDayOfWeek = new Date(currentYear, monthIndex, 1).getDay(); // 0 = Sun
          const mondayOffset = (firstDayOfWeek - 1 + 7) % 7;

          // Generate days array
          const monthDays: number[] = [];
          for (let d = 1; d <= daysInMonth; d++) {
            monthDays.push(d);
          }

          return (
            <div
              key={monthName}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-indigo-500/50 hover:bg-slate-850 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h3 className="font-bold text-slate-100 group-hover:text-amber-300 transition text-sm">
                    {monthName}
                  </h3>
                  <button
                    onClick={() => onSelectMonth(monthIndex)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 font-medium"
                    title="Open deze maand in de 6-weken view"
                  >
                    <span>Open</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Days of week initials */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-500 mb-1">
                  <span>Ma</span>
                  <span>Di</span>
                  <span>Wo</span>
                  <span>Do</span>
                  <span>Vr</span>
                  <span>Za</span>
                  <span>Zo</span>
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Empty cells before month start */}
                  {Array.from({ length: mondayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6" />
                  ))}

                  {/* Days */}
                  {monthDays.map((dayNum) => {
                    const dateObj = new Date(currentYear, monthIndex, dayNum);
                    const isToday =
                      new Date().getFullYear() === currentYear &&
                      new Date().getMonth() === monthIndex &&
                      new Date().getDate() === dayNum;

                    // Check for key event indicators on this day
                    const info = getUnifiedDayInfo(dateObj);
                    const hasEvent = info.events.some((ev) => activeFilters[ev.calendar]);
                    const isFullMoon = info.astronomical.moon.phase === 'full_moon';
                    const isSabbat = !!info.celtic.sabbat;
                    const isEsseneFeast = !!info.essene.feastName;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => onSelectDate(dateObj)}
                        className={`h-6 rounded-md flex items-center justify-center font-medium transition cursor-pointer relative ${
                          isToday
                            ? 'bg-indigo-600 text-white font-bold'
                            : hasEvent
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                        title={`${dayNum} ${monthName}: ${info.events.map((e) => e.title).join(', ')}`}
                      >
                        <span>{dayNum}</span>

                        {/* Event indicator dot */}
                        {isSabbat && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-0.5" />
                        )}
                        {!isSabbat && isEsseneFeast && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-0.5" />
                        )}
                        {!isSabbat && !isEsseneFeast && isFullMoon && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 absolute bottom-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month Footer */}
              <div className="mt-3 pt-2 border-t border-slate-800/70 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{daysInMonth} dagen</span>
                <span className="text-amber-400/80 font-mono">
                  {getUnifiedDayInfo(new Date(currentYear, monthIndex, 1)).celtic.tree.treeDutch.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Annual Major Markers Timeline / List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Grote Kosmische & Spirituele Overgangen in {currentYear}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {keyYearEvents.map((ke, idx) => {
            const formatted = ke.date.toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
            });
            const info = getUnifiedDayInfo(ke.date);

            let badgeColor = 'bg-slate-800 text-slate-300';
            if (ke.type === 'celtic') badgeColor = 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
            if (ke.type === 'astro') badgeColor = 'bg-amber-950/80 text-amber-300 border border-amber-700/60';
            if (ke.type === 'essene') badgeColor = 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60';

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(ke.date)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200">{ke.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{formatted}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Maya: {info.maya.tzolkin.number} {info.maya.tzolkin.dayName} • Haab: {info.haab.day} {info.haab.monthName}
                  </div>
                </div>

                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${badgeColor}`}>
                  Bekijk
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
