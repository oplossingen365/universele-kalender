import React from 'react';
import { UnifiedDayInfo, CalendarSystemKey, UserCustomEvent } from '../types/calendar';
import { MoonIcon } from './MoonIcon';
import { Sparkles, Star } from 'lucide-react';

interface GregorianMonthViewProps {
  days: UnifiedDayInfo[];
  activeFilters: Record<CalendarSystemKey, boolean>;
  userEvents: UserCustomEvent[];
  onSelectDay: (day: UnifiedDayInfo) => void;
}

const WEEKDAY_NAMES = [
  { short: 'Ma', full: 'Maandag' },
  { short: 'Di', full: 'Dinsdag' },
  { short: 'Wo', full: 'Woensdag (Essenen Dag 1)' },
  { short: 'Do', full: 'Donderdag' },
  { short: 'Vr', full: 'Vrijdag' },
  { short: 'Za', full: 'Zaterdag (Sabbat)' },
  { short: 'Zo', full: 'Zondag' },
];

export const GregorianMonthView: React.FC<GregorianMonthViewProps> = ({
  days,
  activeFilters,
  userEvents,
  onSelectDay,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 6-Week Calendar Grid Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/70 text-center py-2.5">
          {WEEKDAY_NAMES.map((wd, index) => (
            <div key={wd.short} className="text-xs font-bold text-slate-300">
              <span className="hidden sm:inline">{wd.full}</span>
              <span className="sm:hidden">{wd.short}</span>
              {index === 2 && (
                <span className="hidden md:inline text-[10px] text-cyan-400 block font-normal">
                  (Essenen start)
                </span>
              )}
              {index === 5 && (
                <span className="hidden md:inline text-[10px] text-amber-400 block font-normal">
                  (Sabbat)
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 6 Weeks x 7 Days Grid (42 cells) */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80 bg-slate-950/30">
          {days.map((dayInfo) => {
            // Check if day has user custom notes
            const hasUserNotes = userEvents.some((e) => e.dateString === dayInfo.dateString);

            // Filter active events based on user's active filters
            const visibleEvents = dayInfo.events.filter((ev) => activeFilters[ev.calendar]);

            // Calendar badges according to filters
            const showMoon = activeFilters.astronomical;
            const showMaya = activeFilters.maya_tzolkin;
            const showHaab = activeFilters.haab;
            const showEssene = activeFilters.essene;
            const showCeltic = activeFilters.celtic;

            return (
              <div
                key={dayInfo.dateString}
                onClick={() => onSelectDay(dayInfo)}
                className={`min-h-[110px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col justify-between transition-all duration-150 cursor-pointer group relative ${
                  dayInfo.isCurrentMonth
                    ? 'bg-slate-900/60 hover:bg-slate-800/80'
                    : 'bg-slate-950/60 opacity-45 hover:opacity-80 hover:bg-slate-900/80'
                } ${
                  dayInfo.isToday
                    ? 'ring-2 ring-indigo-500/80 bg-indigo-950/30 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]'
                    : ''
                }`}
              >
                {/* Top Row: Date, Moon & System Indicators */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm sm:text-base font-bold rounded-lg w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center ${
                        dayInfo.isToday
                          ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/50'
                          : dayInfo.isCurrentMonth
                          ? 'text-slate-200 group-hover:text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayInfo.day}
                    </span>

                    {/* User custom note indicator */}
                    {hasUserNotes && (
                      <span title="Persoonlijke notitie aanwezig">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                      </span>
                    )}
                  </div>

                  {/* Top Right: Moon Phase */}
                  {showMoon && (
                    <div className="flex items-center gap-1" title={`${dayInfo.astronomical.moon.phaseNameDutch} (${Math.round(dayInfo.astronomical.moon.fraction * 100)}%)`}>
                      <MoonIcon
                        phase={dayInfo.astronomical.moon.phase}
                        fraction={dayInfo.astronomical.moon.fraction}
                        size={14}
                      />
                    </div>
                  )}
                </div>

                {/* Micro badges for the other calendars */}
                <div className="flex flex-wrap gap-1 my-1 text-[10px] leading-tight">
                  {/* Essene coordinate */}
                  {showEssene && (
                    <span
                      className={`px-1 py-0.5 rounded font-mono truncate max-w-full ${
                        dayInfo.essene.feastName
                          ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50'
                          : dayInfo.essene.isTekufah
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                          : 'text-cyan-400/80'
                      }`}
                      title={`Essenen: ${dayInfo.essene.monthNameDutch}, Dag ${dayInfo.essene.dayOfMonth} (${dayInfo.essene.dayOfWeekDutch})`}
                    >
                      📜 M{dayInfo.essene.month}:D{dayInfo.essene.dayOfMonth}
                    </span>
                  )}

                  {/* Maya Tzolk'in coordinate */}
                  {showMaya && (
                    <span
                      className="px-1 py-0.5 rounded bg-amber-950/40 text-amber-300/90 font-mono border border-amber-900/30 truncate max-w-full"
                      title={`Maya Tzolk'in: ${dayInfo.maya.tzolkin.number} ${dayInfo.maya.tzolkin.dayName} (${dayInfo.maya.tzolkin.meaningDutch})`}
                    >
                      {dayInfo.maya.tzolkin.glyphSymbol} {dayInfo.maya.tzolkin.number} {dayInfo.maya.tzolkin.dayName}
                    </span>
                  )}

                  {/* Haab' coordinate */}
                  {showHaab && (
                    <span
                      className={`px-1 py-0.5 rounded font-mono truncate max-w-full ${
                        dayInfo.haab.isWayeb
                          ? 'bg-pink-900/70 text-pink-200 border border-pink-700 font-bold'
                          : 'bg-purple-950/40 text-purple-300/90 border border-purple-900/30'
                      }`}
                      title={`Maya Haab: ${dayInfo.haab.day} ${dayInfo.haab.monthName}`}
                    >
                      🏺 {dayInfo.haab.day} {dayInfo.haab.monthName}
                    </span>
                  )}

                  {/* Celtic tree / Sabbat coordinate */}
                  {showCeltic && (
                    <span
                      className={`px-1 py-0.5 rounded truncate max-w-full ${
                        dayInfo.celtic.sabbat
                          ? 'bg-emerald-900/70 text-emerald-200 border border-emerald-600 font-bold'
                          : 'text-emerald-400/80'
                      }`}
                      title={`Keltisch: ${dayInfo.celtic.tree.treeDutch} (Ogham ${dayInfo.celtic.tree.oghamLetter})`}
                    >
                      🌿 {dayInfo.celtic.tree.oghamLetter} {dayInfo.celtic.tree.name}
                    </span>
                  )}
                </div>

                {/* Event Pills List */}
                <div className="space-y-1 mt-auto overflow-hidden">
                  {visibleEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium truncate flex items-center gap-1 shadow-sm"
                      style={{
                        backgroundColor: `${ev.color}20`,
                        borderLeft: `2.5px solid ${ev.color}`,
                        color: ev.color,
                      }}
                      title={`${ev.badge}: ${ev.title} - ${ev.description}`}
                    >
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}

                  {visibleEvents.length > 2 && (
                    <div className="text-[9px] text-slate-400 font-bold px-1 hover:text-amber-300">
                      +{visibleEvents.length - 2} meer...
                    </div>
                  )}
                </div>

                {/* Hover affordance indicator */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
