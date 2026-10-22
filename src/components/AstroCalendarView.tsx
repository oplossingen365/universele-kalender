import React from 'react';
import { UnifiedDayInfo } from '../types/calendar';
import { calculateMoonPhase, getAstronomicalEvents } from '../services/astronomicalEngine';
import { getUnifiedDayInfo } from '../services/calendarEngine';
import { MoonIcon } from './MoonIcon';
import { Sparkles, Moon, Sun, Orbit, Eye } from 'lucide-react';

interface AstroCalendarViewProps {
  currentDate: Date;
  onSelectDay: (day: UnifiedDayInfo) => void;
}

export const AstroCalendarView: React.FC<AstroCalendarViewProps> = ({
  currentDate,
  onSelectDay,
}) => {
  const currentYear = currentDate.getFullYear();
  const todayMoon = calculateMoonPhase(currentDate);

  // Scan through the year to find all Full Moons and New Moons
  const yearStart = new Date(currentYear, 0, 1);
  const majorMoonDays: Array<{
    date: Date;
    dayInfo: UnifiedDayInfo;
    type: 'full' | 'new';
  }> = [];

  for (let d = 0; d < 366; d++) {
    const cur = new Date(yearStart.getTime() + d * (1000 * 60 * 60 * 24));
    if (cur.getFullYear() !== currentYear) break;
    const mp = calculateMoonPhase(cur);

    // Peak full moon (fraction >= 0.99) or peak new moon (fraction <= 0.01)
    if (mp.fraction >= 0.99) {
      // Avoid duplicate consecutive days
      const last = majorMoonDays[majorMoonDays.length - 1];
      if (!last || last.type !== 'full' || (cur.getTime() - last.date.getTime()) > 10 * 86400000) {
        majorMoonDays.push({
          date: cur,
          dayInfo: getUnifiedDayInfo(cur),
          type: 'full',
        });
      }
    } else if (mp.fraction <= 0.01) {
      const last = majorMoonDays[majorMoonDays.length - 1];
      if (!last || last.type !== 'new' || (cur.getTime() - last.date.getTime()) > 10 * 86400000) {
        majorMoonDays.push({
          date: cur,
          dayInfo: getUnifiedDayInfo(cur),
          type: 'new',
        });
      }
    }
  }

  // Major meteor showers in a year
  const meteorShowers = [
    { name: 'Quadrantiden', peak: '3 januari', zhr: '120/uur', desc: 'Scherpe intense piek, heldere vuurbollen.' },
    { name: 'Lyriden', peak: '22 april', zhr: '20/uur', desc: 'Oudste bekende meteorenzwerm, komeet Thatcher.' },
    { name: 'Eta Aquariïden', peak: '6 mei', zhr: '50/uur', desc: 'Snelle meteoren afkomstig van komeet Halley.' },
    { name: 'Perseïden', peak: '12-13 augustus', zhr: '100/uur', desc: 'Beroemde Tranen van Laurentius, komeet Swift-Tuttle.' },
    { name: 'Orioniden', peak: '21 oktober', zhr: '25/uur', desc: 'Snelle stofdeeltjes van komeet Halley.' },
    { name: 'Leoniden', peak: '17 november', zhr: '15/uur', desc: 'Bekend om periodieke meteorenstormen om de ~33 jaar.' },
    { name: 'Geminiden', peak: '13-14 december', zhr: '150/uur', desc: 'Koning van de meteorenzwermen, asteroïde Phaethon.' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/60 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300">
                <Sparkles className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 bg-clip-text text-transparent">
                  Astronomische Kalender & Maancycli
                </h2>
                <p className="text-xs text-purple-400 font-mono">
                  Synodische Maanden (29.53d) • Dierenriem • Solstitia & Equinoxen • Meteorenzwermen
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              De kosmos dicteert de oeroude ritmes van het leven. Volg de maan door haar fasen en astrologische sterrenbeelden, en ontdek wanneer hemelse fenomenen zoals zonnewendes en vallende sterren pieken.
            </p>
          </div>

          {/* Current Moon Live Dial Card */}
          <div className="bg-slate-950/80 border border-purple-800/50 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-4 min-w-[260px] shadow-lg">
            <div className="text-4xl">
              <MoonIcon phase={todayMoon.phase} fraction={todayMoon.fraction} size={42} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-100">{todayMoon.phaseNameDutch}</div>
              <div className="text-xs text-amber-300 font-mono">
                {Math.round(todayMoon.fraction * 100)}% Verlicht • Dag {todayMoon.ageDays}
              </div>
              <div className="text-[11px] text-purple-300">
                Maan in {todayMoon.moonSign}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Moons & New Moons of the Year */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold text-slate-100">
              Lunaties van het Jaar {currentYear} (Nieuwe & Volle Manen)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{majorMoonDays.length} Hoofdfasen</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {majorMoonDays.map((item, idx) => {
            const isFull = item.type === 'full';
            const mInfo = item.dayInfo.astronomical.moon;

            return (
              <div
                key={idx}
                onClick={() => onSelectDay(item.dayInfo)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group hover:scale-[1.02] ${
                  isFull
                    ? 'bg-amber-950/30 border-amber-600/50 hover:border-amber-400 shadow-md shadow-amber-950/40'
                    : 'bg-indigo-950/30 border-indigo-700/50 hover:border-indigo-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      <MoonIcon phase={mInfo.phase} fraction={mInfo.fraction} size={20} />
                    </span>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-amber-300">
                      {isFull ? mInfo.traditionalName || 'Volle Maan' : 'Nieuwe Maan'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-mono mt-1">
                    {item.date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                  </div>

                  <div className="text-[10px] text-purple-300 mt-0.5">
                    {mInfo.moonSign}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-600/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-600/40'
                    }`}
                  >
                    {isFull ? '100%' : '0%'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meteor Showers Guide */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Meteorenzwermen & Vallende Sterren Kalender
            </h3>
          </div>
          <span className="text-xs text-slate-400">Jaarlijkse Kosmische Piekdata</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {meteorShowers.map((ms) => (
            <div
              key={ms.name}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-cyan-300">{ms.name}</span>
                  <span className="text-xs font-mono text-amber-300">{ms.peak}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{ms.desc}</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>ZHR (Zenuithoek frequentie):</span>
                <span className="font-bold text-cyan-400">{ms.zhr}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
