import React, { useState } from 'react';
import { UnifiedDayInfo } from '../types/calendar';
import { CELTIC_TREES } from '../services/celticEngine';
import { getUnifiedDayInfo } from '../services/calendarEngine';
import { Flame, Trees, Sparkles, Compass } from 'lucide-react';

interface CelticCalendarViewProps {
  currentDate: Date;
  onSelectDay: (day: UnifiedDayInfo) => void;
}

export const CelticCalendarView: React.FC<CelticCalendarViewProps> = ({
  currentDate,
  onSelectDay,
}) => {
  const currentYear = currentDate.getFullYear();
  const [selectedTreeIndex, setSelectedTreeIndex] = useState<number>(0);

  const selectedTree = CELTIC_TREES[selectedTreeIndex];

  // The 8 Sabbats of the Wheel of the Year
  const sabbats = [
    {
      name: 'Samhain',
      dateStr: `31 okt - 1 nov`,
      date: new Date(currentYear, 9, 31),
      type: 'Groot Vuurfeest • Keltisch Nieuwjaar',
      season: 'Donkere Helft (Winter)',
      desc: 'De sluier tussen de werelden is het dunst. Tijd van herdenking van voorouders, introspectie en loslaten.',
      color: 'from-purple-900 to-slate-900',
    },
    {
      name: 'Yule',
      dateStr: `21 - 22 dec`,
      date: new Date(currentYear, 11, 21),
      type: 'Winterzonnewende',
      season: 'Donkere Helft',
      desc: 'Wedergeboorte van de zonnegod. De langste nacht wijkt voor de herwonnen kracht van het licht.',
      color: 'from-blue-900 to-slate-900',
    },
    {
      name: 'Imbolc',
      dateStr: `1 - 2 feb`,
      date: new Date(currentYear, 1, 1),
      type: 'Groot Vuurfeest • Sint Brigid',
      season: 'Ontwaken van de Aarde',
      desc: 'Eerste tekenen van nieuw leven onder de sneeuw. Zuivering, heilige bronnen en inspiratie van Brigid.',
      color: 'from-teal-900 to-slate-900',
    },
    {
      name: 'Ostara',
      dateStr: `20 - 21 mrt`,
      date: new Date(currentYear, 2, 20),
      type: 'Lente-equinox',
      season: 'Balans',
      desc: 'Volmaakt evenwicht tussen dag en nacht. Het ontluiken van nieuw leven, vogelzang en plantkracht.',
      color: 'from-emerald-900 to-slate-900',
    },
    {
      name: 'Beltane',
      dateStr: `30 apr - 1 mei`,
      date: new Date(currentYear, 4, 1),
      type: 'Groot Vuurfeest • Meivuren',
      season: 'Lichte Helft (Zomer)',
      desc: 'Groot feest van vruchtbaarheid, liefde en bloei. De meiboom verbindt hemel en aarde.',
      color: 'from-rose-900 to-slate-900',
    },
    {
      name: 'Litha',
      dateStr: `21 - 22 jun`,
      date: new Date(currentYear, 5, 21),
      type: 'Zomerzonnewende',
      season: 'Lichte Helft',
      desc: 'Hoogste kracht van de zon. Het rijpende graan baadt in overvloed van licht.',
      color: 'from-amber-900 to-slate-900',
    },
    {
      name: 'Lughnasadh',
      dateStr: `1 - 2 aug`,
      date: new Date(currentYear, 7, 1),
      type: 'Groot Vuurfeest • Lammas',
      season: 'Eerste Oogst',
      desc: 'Eerste graanoogst ter ere van zonnegod Lugh. Bakken van het eerste brood en vieren van overvloed.',
      color: 'from-yellow-900 to-slate-900',
    },
    {
      name: 'Mabon',
      dateStr: `22 - 23 sep`,
      date: new Date(currentYear, 8, 22),
      type: 'Herfst-equinox',
      season: 'Tweede Oogst & Dankbaarheid',
      desc: 'Evenwicht tussen licht en duister. Tweede oogstfeest (fruit, noten) en voorbereiding op de rust.',
      color: 'from-orange-900 to-slate-900',
    },
  ];

  // Generate 28 days of the selected tree month
  const treeDays: UnifiedDayInfo[] = [];
  const startY = selectedTree.startMonth === 12 ? currentYear - 1 : currentYear;
  const startCal = new Date(startY, selectedTree.startMonth - 1, selectedTree.startDay);

  for (let i = 0; i < 28; i++) {
    const cur = new Date(startCal.getTime() + i * (1000 * 60 * 60 * 24));
    treeDays.push(getUnifiedDayInfo(cur));
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/60 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300">
                <Trees className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  Keltisch Jaarwiel & Boomkalender
                </h2>
                <p className="text-xs text-emerald-400 font-mono">
                  8 Seizoensfeesten • 13 Ogham Boommaanden van 28 Dagen • De Naamloze Dag
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              De Keltische kalender weerspiegelt de ademhaling van Moeder Aarde. Het jaar is verdeeld in een donkere helft (Samonios) en een lichte helft (Giamonios), gemarkeerd door de 8 spaken van het Jaarwiel en de 13 heilige boom-archetypes uit het Ogham alfabet.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-800/50 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5 min-w-[220px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Huidige Boom:</span>
              <span className="text-emerald-300 font-bold">
                {getUnifiedDayInfo(currentDate).celtic.tree.name} ({getUnifiedDayInfo(currentDate).celtic.tree.treeDutch.split(' ')[0]})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Ogham Teken:</span>
              <span className="text-2xl font-serif text-amber-300">
                {getUnifiedDayInfo(currentDate).celtic.tree.oghamLetter}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Seizoenshelft:</span>
              <span className="text-cyan-300 font-semibold capitalize">
                {getUnifiedDayInfo(currentDate).celtic.seasonHalf}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wheel of the Year - 8 Sabbats Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Het Keltische Jaarwiel (De 8 Sabbats)
            </h3>
          </div>
          <span className="text-xs text-slate-400">4 Grote Vuurfeesten & 4 Zonne-overgangen</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sabbats.map((sab) => (
            <div
              key={sab.name}
              onClick={() => onSelectDay(getUnifiedDayInfo(sab.date))}
              className={`p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-gradient-to-b ${sab.color} transition cursor-pointer flex flex-col justify-between group hover:scale-[1.02] shadow-md`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-base font-bold text-amber-200 group-hover:text-amber-300">
                    {sab.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-300 font-mono">
                    {sab.dateStr}
                  </span>
                </div>

                <div className="text-[11px] text-emerald-300 font-semibold mt-1">
                  {sab.type}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {sab.desc}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-indigo-400 group-hover:text-amber-300 flex items-center justify-between font-medium">
                <span>Bekijk details</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 13 Celtic Tree Months Selector & Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-200">
              De 13 Keltische Boommaanden (Beth-Luis-Nion)
            </h3>
            <p className="text-xs text-slate-400">
              Elke boomperiode telt 28 dagen (364 dagen) + 23 december als de Naamloze Dag der Mysteriën.
            </p>
          </div>
        </div>

        {/* Tree months pills */}
        <div className="flex flex-wrap gap-1.5 mb-5 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
          {CELTIC_TREES.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => setSelectedTreeIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedTreeIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="font-serif text-sm">{t.oghamLetter}</span>
              <span>{t.name}</span>
              <span className="text-[10px] opacity-75">({t.treeDutch.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Selected Tree Info Box */}
        <div className="bg-slate-950/60 border border-emerald-900/40 rounded-xl p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-3xl font-serif text-amber-300">
              {selectedTree.oghamLetter}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100">
                {selectedTree.name} — {selectedTree.treeDutch}
              </h4>
              <p className="text-xs text-emerald-300/90 mt-0.5">{selectedTree.description}</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Periode: {selectedTree.startDay}/{selectedTree.startMonth} — {selectedTree.endDay}/{selectedTree.endMonth}
          </div>
        </div>

        {/* 28 Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {treeDays.map((dayInfo, idx) => {
            const hasSabbat = !!dayInfo.celtic.sabbat;

            return (
              <div
                key={dayInfo.dateString}
                onClick={() => onSelectDay(dayInfo)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group hover:scale-[1.02] ${
                  hasSabbat
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-950'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-200 group-hover:text-emerald-300">
                      Dag {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">/ 28</span>
                  </div>

                  {hasSabbat && (
                    <div className="mt-1 text-[10px] font-bold text-emerald-200 bg-emerald-900/60 px-1 py-0.5 rounded truncate">
                      🔥 {dayInfo.celtic.sabbat?.name}
                    </div>
                  )}
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                  <span className="text-slate-300 font-mono block">
                    {dayInfo.date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
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
