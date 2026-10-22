import React from 'react';
import { UnifiedDayInfo, CalendarSystemKey, UserCustomEvent } from '../types/calendar';
import { MoonIcon } from './MoonIcon';
import { Star, Sparkles, ChevronRight } from 'lucide-react';

interface WeekViewProps {
  days: UnifiedDayInfo[];
  activeFilters: Record<CalendarSystemKey, boolean>;
  userEvents: UserCustomEvent[];
  onSelectDay: (day: UnifiedDayInfo) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  days,
  activeFilters,
  userEvents,
  onSelectDay,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>Weekoverzicht (7 Dagen)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
            Vergelijking van alle 6 kalendersystemen
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {days.map((dayInfo) => {
          const hasUserNotes = userEvents.some((e) => e.dateString === dayInfo.dateString);
          const visibleEvents = dayInfo.events.filter((ev) => activeFilters[ev.calendar]);

          return (
            <div
              key={dayInfo.dateString}
              onClick={() => onSelectDay(dayInfo)}
              className={`rounded-2xl border p-3 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-lg group relative ${
                dayInfo.isToday
                  ? 'bg-slate-900/90 border-indigo-500/80 ring-2 ring-indigo-500/40 shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">
                      {['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'][dayInfo.dayOfWeek]}
                    </span>
                    <span
                      className={`text-lg font-black ${
                        dayInfo.isToday ? 'text-indigo-400' : 'text-slate-100 group-hover:text-amber-300'
                      }`}
                    >
                      {dayInfo.day} {['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'][dayInfo.month]}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <MoonIcon
                      phase={dayInfo.astronomical.moon.phase}
                      fraction={dayInfo.astronomical.moon.fraction}
                      size={20}
                    />
                    {hasUserNotes && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                </div>

                {/* 6 Calendars Multi-Block */}
                <div className="space-y-2 text-xs">
                  {/* Essene */}
                  {activeFilters.essene && (
                    <div className="bg-cyan-950/40 border border-cyan-800/30 rounded-lg p-2">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>📜 Essenen Kalender</span>
                        {dayInfo.essene.isSabbath && (
                          <span className="text-[9px] px-1 bg-cyan-700/50 text-cyan-200 rounded">Sabbat</span>
                        )}
                      </div>
                      <div className="text-cyan-100 font-semibold mt-0.5">
                        {dayInfo.essene.monthNameDutch}
                      </div>
                      <div className="text-[11px] text-cyan-300">
                        Dag {dayInfo.essene.dayOfMonth} • {dayInfo.essene.dayOfWeekDutch.split(' ')[0]}
                      </div>
                      {dayInfo.essene.feastName && (
                        <div className="mt-1 text-[10px] font-bold text-cyan-200 bg-cyan-800/60 px-1.5 py-0.5 rounded">
                          ⭐ {dayInfo.essene.feastName}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Maya Tzolk'in */}
                  {activeFilters.maya_tzolkin && (
                    <div className="bg-amber-950/40 border border-amber-800/30 rounded-lg p-2">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>☀️ Maya Tzolk'in</span>
                        <span>{dayInfo.maya.tzolkin.glyphSymbol}</span>
                      </div>
                      <div className="text-amber-100 font-bold mt-0.5">
                        {dayInfo.maya.tzolkin.number} {dayInfo.maya.tzolkin.dayName}
                      </div>
                      <div className="text-[10px] text-amber-300/80 truncate">
                        Golf: {dayInfo.maya.tzolkin.trecenaName}
                      </div>
                    </div>
                  )}

                  {/* Haab' */}
                  {activeFilters.haab && (
                    <div className="bg-purple-950/40 border border-purple-800/30 rounded-lg p-2">
                      <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                        🏺 Haab' Zonnecyclus
                      </div>
                      <div className="text-purple-100 font-semibold mt-0.5">
                        {dayInfo.haab.day} {dayInfo.haab.monthName}
                      </div>
                      <div className="text-[10px] text-purple-300/80 truncate">
                        LC: {dayInfo.maya.longCount.fullString}
                      </div>
                    </div>
                  )}

                  {/* Celtic */}
                  {activeFilters.celtic && (
                    <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-lg p-2">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>🌿 Keltische Boom</span>
                        <span className="font-serif font-black">{dayInfo.celtic.tree.oghamLetter}</span>
                      </div>
                      <div className="text-emerald-100 font-semibold mt-0.5">
                        {dayInfo.celtic.tree.name} ({dayInfo.celtic.tree.treeDutch.split(' ')[0]})
                      </div>
                      <div className="text-[10px] text-emerald-300/80">
                        Dag {dayInfo.celtic.tree.dayOfMonth} van 28
                      </div>
                      {dayInfo.celtic.sabbat && (
                        <div className="mt-1 text-[10px] font-bold text-emerald-200 bg-emerald-800/60 px-1.5 py-0.5 rounded">
                          🔥 {dayInfo.celtic.sabbat.name}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Astronomical */}
                  {activeFilters.astronomical && (
                    <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-2">
                      <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                        ✨ Kosmos & Maan
                      </div>
                      <div className="text-yellow-100 font-medium mt-0.5 text-[11px]">
                        {dayInfo.astronomical.moon.phaseNameDutch} ({Math.round(dayInfo.astronomical.moon.fraction * 100)}%)
                      </div>
                      <div className="text-[10px] text-yellow-300/80 truncate">
                        {dayInfo.astronomical.moon.moonSign}
                      </div>
                    </div>
                  )}
                </div>

                {/* Events list */}
                {visibleEvents.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Events ({visibleEvents.length}):
                    </span>
                    {visibleEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium truncate"
                        style={{
                          backgroundColor: `${ev.color}25`,
                          borderLeft: `2.5px solid ${ev.color}`,
                          color: ev.color,
                        }}
                        title={ev.description}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom footer button */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-indigo-400 group-hover:text-amber-300 font-medium">
                <span>Details bekijken</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
