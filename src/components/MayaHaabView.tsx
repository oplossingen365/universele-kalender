import React, { useState } from 'react';
import { UnifiedDayInfo } from '../types/calendar';
import { HAAB_MONTHS, calculateMayaCalendar } from '../services/mayaEngine';
import { getUnifiedDayInfo } from '../services/calendarEngine';
import { Compass, Sparkles, Sun, Shield } from 'lucide-react';

interface MayaHaabViewProps {
  currentDate: Date;
  onSelectDay: (day: UnifiedDayInfo) => void;
}

export const MayaHaabView: React.FC<MayaHaabViewProps> = ({
  currentDate,
  onSelectDay,
}) => {
  const [selectedHaabMonthIndex, setSelectedHaabMonthIndex] = useState<number>(() => {
    const info = calculateMayaCalendar(currentDate);
    return info.haab.monthIndex;
  });

  const currentMaya = calculateMayaCalendar(currentDate);
  const selectedHaabMonth = HAAB_MONTHS[selectedHaabMonthIndex];
  const isWayeb = selectedHaabMonthIndex === 18;
  const numDays = isWayeb ? 5 : 20;

  // Find Gregorian occurrences of this Haab month in the current Gregorian year
  // In the 365-day Haab cycle without leap days, a Haab month shifts ~1 day every 4 years
  // Let's find the days in the current year that match the selected Haab month
  const currentYear = currentDate.getFullYear();
  const yearStart = new Date(currentYear, 0, 1);
  const matchingDays: UnifiedDayInfo[] = [];

  for (let d = 0; d < 366; d++) {
    const cur = new Date(yearStart.getTime() + d * (1000 * 60 * 60 * 24));
    if (cur.getFullYear() !== currentYear) break;
    const mayaInfo = calculateMayaCalendar(cur);
    if (mayaInfo.haab.monthIndex === selectedHaabMonthIndex) {
      matchingDays.push(getUnifiedDayInfo(cur));
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 border border-amber-800/60 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-600/30 border border-amber-500/40 text-amber-300">
                <Sun className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                  Maya & Haab' Zonnecyclus
                </h2>
                <p className="text-xs text-amber-400 font-mono">
                  18 Maanden van 20 Dagen (360d) + 5 Dagen Wayeb' = 365 Dagen
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Het Meso-Amerikaanse kalendersysteem combineert de heilige Tzolk'in (260 dagen) met de Haab' zonnecyclus (365 dagen). Elke 52 Haab-jaren (18.980 dagen) voltooit het Kalenderwiel (Calendar Round) een volledige omwenteling.
            </p>
          </div>

          {/* Current Maya Status Card */}
          <div className="bg-slate-950/80 border border-amber-800/50 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5 min-w-[240px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Lange Telling (Long Count):</span>
              <span className="text-amber-300 font-bold">{currentMaya.longCount.fullString}</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Tzolk'in Teken:</span>
              <span className="text-amber-200 font-bold">
                {currentMaya.tzolkin.glyphSymbol} {currentMaya.tzolkin.number} {currentMaya.tzolkin.dayName}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Haab' Datum:</span>
              <span className="text-purple-300 font-bold">
                {currentMaya.haab.day} {currentMaya.haab.monthName}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Heer der Nacht:</span>
              <span className="text-cyan-300 font-bold">G{currentMaya.longCount.lordOfNight}</span>
            </div>
          </div>
        </div>

        {/* 18 Haab Months + Wayeb Grid Selector */}
        <div className="mt-5 pt-4 border-t border-amber-900/50">
          <div className="text-xs font-bold text-amber-300/80 mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Kies een Haab' Maand (Uinal):</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/50 rounded-xl border border-slate-800">
            {HAAB_MONTHS.map((hm, idx) => {
              const isSelected = selectedHaabMonthIndex === idx;
              const isW = idx === 18;

              return (
                <button
                  key={hm.name}
                  onClick={() => setSelectedHaabMonthIndex(idx)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? isW
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                        : 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : isW
                      ? 'bg-pink-950/60 text-pink-300 border border-pink-800/40 hover:bg-pink-900/60'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">{idx + 1}.</span>
                  <span>{hm.name}</span>
                  {isW && <span className="text-[10px] font-bold text-pink-200">(5d)</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Month Header & Description */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-amber-200">
                Maand {selectedHaabMonthIndex + 1}: {selectedHaabMonth.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/50">
                {numDays} Dagen
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Betekenis: <strong className="text-amber-300">{selectedHaabMonth.dutch}</strong> — {selectedHaabMonth.meaning}
            </p>
          </div>

          <div className="text-xs text-slate-400">
            {isWayeb ? (
              <span className="text-pink-300 font-bold">
                ⚠️ De 5 overgangsdagen tussen de zonnecycli: tijd voor bezinning en heilige vuren.
              </span>
            ) : (
              <span>Dag 0 is de troonsbestijging (Chum) van de maand.</span>
            )}
          </div>
        </div>

        {/* Days grid of this Haab Month */}
        {matchingDays.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Geen dagen gevonden voor deze Haab' maand in het geselecteerde jaar. Verander het jaar in de header om de cyclus te bekijken.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {matchingDays.map((dayInfo) => {
              const haab = dayInfo.haab;
              const tzolkin = dayInfo.maya.tzolkin;
              const longCount = dayInfo.maya.longCount;

              return (
                <div
                  key={dayInfo.dateString}
                  onClick={() => onSelectDay(dayInfo)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between group hover:scale-[1.02] ${
                    haab.isWayeb
                      ? 'bg-pink-950/60 border-pink-700/60 hover:border-pink-500'
                      : haab.isChum
                      ? 'bg-amber-950/70 border-amber-600/70 hover:border-amber-400 shadow-md shadow-amber-950'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Haab day header */}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-amber-200">
                        {haab.isChum ? 'Chum (0)' : `Dag ${haab.day}`} {haab.monthName}
                      </span>
                      <span className="text-lg">{tzolkin.glyphSymbol}</span>
                    </div>

                    {/* Tzolk'in coordinate */}
                    <div className="mt-2 bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                      <div className="text-[10px] text-amber-400 font-bold uppercase">
                        Tzolk'in Coördinaat
                      </div>
                      <div className="text-sm font-bold text-slate-100">
                        {tzolkin.number} {tzolkin.dayName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {tzolkin.meaningDutch}
                      </div>
                    </div>
                  </div>

                  {/* Gregorian Date Match */}
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <span className="text-slate-400 block">Standaard datum:</span>
                    <span className="text-slate-200 font-semibold font-mono">
                      {dayInfo.date.toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                      LC: {longCount.fullString}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
