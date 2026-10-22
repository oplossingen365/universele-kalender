import React, { useState } from 'react';
import { UnifiedDayInfo } from '../types/calendar';
import { getEsseneYearAnchor, calculateEsseneCalendar } from '../services/esseneEngine';
import { getUnifiedDayInfo } from '../services/calendarEngine';
import { Scroll, Sparkles, Sun, Shield, Info } from 'lucide-react';

interface EsseneCalendarViewProps {
  currentDate: Date;
  onSelectDay: (day: UnifiedDayInfo) => void;
}

const ESSENE_DAYS_OF_WEEK = [
  'Woensdag (1e d. schepping lichten)',
  'Donderdag',
  'Vrijdag (voorbereiding)',
  'Sabbat (rustdag)',
  'Zondag',
  'Maandag',
  'Dinsdag',
];

export const EsseneCalendarView: React.FC<EsseneCalendarViewProps> = ({
  currentDate,
  onSelectDay,
}) => {
  const currentYear = currentDate.getFullYear();
  const anchor = getEsseneYearAnchor(currentYear);

  const [activeSeason, setActiveSeason] = useState<number>(1); // 1: Lente, 2: Zomer, 3: Herfst, 4: Winter
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1 to 12

  const seasons = [
    { number: 1, name: 'Lente (Tekufah Nisan)', months: [1, 2, 3], icon: '🌱', color: 'from-emerald-950 to-cyan-950' },
    { number: 2, name: 'Zomer (Tekufah Tammuz)', months: [4, 5, 6], icon: '☀️', color: 'from-amber-950 to-orange-950' },
    { number: 3, name: 'Herfst (Tekufah Tishrei)', months: [7, 8, 9], icon: '🍁', color: 'from-orange-950 to-red-950' },
    { number: 4, name: 'Winter (Tekufah Tevet)', months: [10, 11, 12], icon: '❄️', color: 'from-blue-950 to-indigo-950' },
  ];

  // Month lengths: 30, 30, 31 for each quarter
  const getDaysInMonth = (m: number) => (m % 3 === 0 ? 31 : 30);

  // Month names
  const monthNames = [
    '1e Maand (Nisan)',
    '2e Maand (Iyyar)',
    '3e Maand (Sivan)',
    '4e Maand (Tammuz)',
    '5e Maand (Av)',
    '6e Maand (Elul)',
    '7e Maand (Tishrei)',
    '8e Maand (Cheshvan)',
    '9e Maand (Kislev)',
    '10e Maand (Tevet)',
    '11e Maand (Shevat)',
    '12e Maand (Adar)',
  ];

  // Map Essene month and day back to Gregorian date
  const getGregorianForEssene = (m: number, d: number): Date => {
    // Days elapsed from anchor (Month 1 Day 1)
    let elapsedDays = 0;
    for (let curM = 1; curM < m; curM++) {
      elapsedDays += getDaysInMonth(curM);
    }
    elapsedDays += (d - 1);

    const result = new Date(anchor.getTime() + elapsedDays * (1000 * 60 * 60 * 24));
    return result;
  };

  const daysInSelectedMonth = getDaysInMonth(selectedMonth);

  // Generate days for the selected month
  const monthDays = Array.from({ length: daysInSelectedMonth }, (_, i) => {
    const dayNumber = i + 1;
    const gregDate = getGregorianForEssene(selectedMonth, dayNumber);
    const dayInfo = getUnifiedDayInfo(gregDate);
    return {
      dayNumber,
      gregDate,
      dayInfo,
    };
  });

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-300">
                <Scroll className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-200 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  Historische Kalender van de Essenen
                </h2>
                <p className="text-xs text-cyan-400 font-mono">
                  364 Dagen • 52 Volle Weken • Dode Zeerollen (Qumran / Jubileën / Henoch)
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Het unieke zonnejaar van de Essenen telt precies 364 dagen. Elk jaar begint altijd op een{' '}
              <strong className="text-cyan-300">woensdag</strong> (de 4e scheppingsdag, waarop zon, maan en sterren werden geplaatst). Elke feestdag valt elk jaar op exact dezelfde dag van de week!
            </p>
          </div>

          <div className="bg-slate-950/80 border border-cyan-800/40 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <div className="flex items-center justify-between gap-4 font-mono">
              <span className="text-slate-400">Ankerdatum {currentYear}:</span>
              <span className="text-cyan-300 font-bold">
                {anchor.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 font-mono">
              <span className="text-slate-400">Jaarstructuur:</span>
              <span className="text-amber-300 font-bold">4 × 91 dagen = 364 dagen</span>
            </div>
          </div>
        </div>

        {/* 4 Seasons Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
          {seasons.map((s) => (
            <button
              key={s.number}
              onClick={() => {
                setActiveSeason(s.number);
                setSelectedMonth(s.months[0]);
              }}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                activeSeason === s.number
                  ? 'bg-cyan-900/60 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-950'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-lg block">{s.icon}</span>
                <span className="text-xs font-bold block mt-1">{s.name}</span>
                <span className="text-[10px] text-slate-400">91 dagen (13 weken)</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">Q{s.number}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Month Selector inside Selected Season */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <span>Kies maand binnen {seasons.find((s) => s.number === activeSeason)?.name}:</span>
        </div>

        <div className="flex items-center gap-2">
          {seasons
            .find((s) => s.number === activeSeason)
            ?.months.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedMonth === m
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {monthNames[m - 1]} ({getDaysInMonth(m)} dgn)
              </button>
            ))}
        </div>
      </div>

      {/* Essene Month Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-cyan-200">
              {monthNames[selectedMonth - 1]} — Essenen Kalender
            </h3>
            <p className="text-xs text-slate-400">
              Vaste dagen van de week volgens de scheppingsorde (Sabbat valt altijd op dag 4, 11, 18, 25).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300">
              Goud = Sabbat
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-700/60 text-cyan-300">
              Cyaan = Essenen Feest / Tekufah
            </span>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
          {monthDays.map(({ dayNumber, gregDate, dayInfo }) => {
            const essene = dayInfo.essene;
            const isSabbath = essene.isSabbath;
            const hasFeast = !!essene.feastName;
            const isTekufah = essene.isTekufah;

            return (
              <div
                key={dayNumber}
                onClick={() => onSelectDay(dayInfo)}
                className={`rounded-xl border p-2.5 transition-all cursor-pointer flex flex-col justify-between group hover:scale-[1.02] ${
                  hasFeast
                    ? 'bg-cyan-950/80 border-cyan-500 shadow-md shadow-cyan-950'
                    : isTekufah
                    ? 'bg-teal-950/80 border-teal-500'
                    : isSabbath
                    ? 'bg-amber-950/30 border-amber-600/60 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Essene Day number & Weekday */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-100 group-hover:text-cyan-300">
                        Dag {dayNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {essene.dayOfWeekDutch.split(' ')[0]}
                      </span>
                    </div>

                    {isSabbath && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-600/40">
                        Sabbat
                      </span>
                    )}
                  </div>

                  {/* Feasts banner */}
                  {hasFeast && (
                    <div className="mt-2 text-[10px] font-bold text-cyan-200 bg-cyan-900/60 border border-cyan-700/50 p-1 rounded">
                      📜 {essene.feastName}
                    </div>
                  )}

                  {isTekufah && (
                    <div className="mt-2 text-[10px] font-bold text-teal-200 bg-teal-900/60 border border-teal-700/50 p-1 rounded">
                      🧭 Tekufah Dag 91
                    </div>
                  )}
                </div>

                {/* Gregorian Match */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span className="text-slate-400 block">Standaard datum:</span>
                  <span className="text-slate-200 font-semibold font-mono">
                    {gregDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
