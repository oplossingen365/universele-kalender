import React, { useState } from 'react';
import { UnifiedDayInfo, UserCustomEvent, CalendarSystemKey } from '../types/calendar';
import { MoonIcon } from './MoonIcon';
import {
  X,
  Plus,
  Trash2,
  Star,
  Scroll,
  Sun,
  Trees,
  Sparkles,
  Calendar,
  Save,
} from 'lucide-react';

interface DayDetailModalProps {
  dayInfo: UnifiedDayInfo | null;
  onClose: () => void;
  userEvents: UserCustomEvent[];
  onAddUserEvent: (event: UserCustomEvent) => void;
  onDeleteUserEvent: (id: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dayInfo,
  onClose,
  userEvents,
  onAddUserEvent,
  onDeleteUserEvent,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [linkedSystem, setLinkedSystem] = useState<CalendarSystemKey>('gregorian');

  if (!dayInfo) return null;

  const currentEvents = userEvents.filter((e) => e.dateString === dayInfo.dateString);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: UserCustomEvent = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dateString: dayInfo.dateString,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      linkedCalendar: linkedSystem,
      createdAt: Date.now(),
    };

    onAddUserEvent(newEv);
    setNewTitle('');
    setNewDesc('');
  };

  const formattedDate = dayInfo.date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 p-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="text-xl font-black text-slate-100 capitalize">
                {formattedDate}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              JDN: {dayInfo.julianDayNumber} • Maya Long Count: {dayInfo.maya.longCount.fullString}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          {/* Active Events on this Day */}
          {dayInfo.events.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Kosmische & Kalender Gebeurtenissen op deze dag ({dayInfo.events.length})</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dayInfo.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl border flex items-start gap-2.5"
                    style={{
                      backgroundColor: `${ev.color}15`,
                      borderColor: `${ev.color}40`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: ev.color }} />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{ev.title}</div>
                      {ev.subtitle && <div className="text-[11px] text-slate-400">{ev.subtitle}</div>}
                      <div className="text-[10px] text-slate-400 mt-1">{ev.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6 Calendar System Panels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Essenen Kalender Panel */}
            <div className="bg-gradient-to-b from-cyan-950/40 to-slate-950 border border-cyan-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <Scroll className="w-4 h-4" />
                    <span>Essenen Kalender (364d)</span>
                  </div>
                  {dayInfo.essene.isSabbath && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-600/40">
                      Sabbat
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Maand & Dag:</span>
                    <span className="text-cyan-200 font-bold text-sm">
                      {dayInfo.essene.monthNameDutch}, Dag {dayInfo.essene.dayOfMonth}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Vaste Scheppingsdag:</span>
                    <span className="text-slate-200">{dayInfo.essene.dayOfWeekDutch}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Seizoen & Tekufah:</span>
                    <span className="text-slate-300">{dayInfo.essene.seasonNameDutch}</span>
                    {dayInfo.essene.isTekufah && (
                      <span className="text-[10px] text-teal-300 block font-semibold">
                        ⭐ {dayInfo.essene.tekufahName}
                      </span>
                    )}
                  </div>

                  {dayInfo.essene.feastName && (
                    <div className="p-2 rounded-lg bg-cyan-900/40 border border-cyan-700/50 mt-1">
                      <span className="text-amber-300 font-bold text-[11px] block">
                        📜 {dayInfo.essene.feastName}
                      </span>
                      <span className="text-[10px] text-slate-300 block mt-0.5">
                        {dayInfo.essene.feastDescription}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-cyan-900/40 text-[10px] text-slate-400">
                Qumran Dode Zeerollen
              </div>
            </div>

            {/* 2. Maya Tzolk'in Panel */}
            <div className="bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-amber-900/50 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Sun className="w-4 h-4" />
                    <span>Maya Tzolk'in (260d)</span>
                  </div>
                  <span className="text-xl">{dayInfo.maya.tzolkin.glyphSymbol}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">K'in & Toon:</span>
                    <span className="text-amber-200 font-bold text-base">
                      {dayInfo.maya.tzolkin.number} {dayInfo.maya.tzolkin.dayName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Archetype Betekenis:</span>
                    <span className="text-slate-200">{dayInfo.maya.tzolkin.meaningDutch}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Trezena (13-daagse golf):</span>
                    <span className="text-amber-300 font-semibold">
                      Golf {dayInfo.maya.tzolkin.trecenaNumber} • {dayInfo.maya.tzolkin.trecenaName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-900/40 text-[10px] text-slate-400">
                Heilige Cyclus van het Bewustzijn
              </div>
            </div>

            {/* 3. Haab' & Long Count Panel */}
            <div className="bg-gradient-to-b from-purple-950/40 to-slate-950 border border-purple-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs uppercase tracking-wider">
                    <span>🏺 Haab' & Long Count</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 font-mono">
                    365d
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Haab' Zonne-datum:</span>
                    <span className="text-purple-200 font-bold text-sm">
                      {dayInfo.haab.isChum ? '0 (Chum)' : dayInfo.haab.day} {dayInfo.haab.monthName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{dayInfo.haab.meaningDutch}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Kalenderwiel (Calendar Round):</span>
                    <span className="text-amber-300 font-mono font-bold">
                      {dayInfo.maya.longCount.calendarRound}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Lange Telling (Long Count):</span>
                    <span className="text-slate-200 font-mono">
                      {dayInfo.maya.longCount.fullString}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Heer der Nacht:</span>
                    <span className="text-cyan-300 font-mono">
                      G{dayInfo.maya.longCount.lordOfNight} van 9
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-900/40 text-[10px] text-slate-400">
                Maya Zonnejaar & Grote Cyclus
              </div>
            </div>

            {/* 4. Keltische Kalender Panel */}
            <div className="bg-gradient-to-b from-emerald-950/40 to-slate-950 border border-emerald-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <Trees className="w-4 h-4" />
                    <span>Keltische Boomkalender</span>
                  </div>
                  <span className="text-2xl font-serif text-amber-300">
                    {dayInfo.celtic.tree.oghamLetter}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Boommaand:</span>
                    <span className="text-emerald-200 font-bold text-sm">
                      {dayInfo.celtic.tree.name} — {dayInfo.celtic.tree.treeDutch}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Dag {dayInfo.celtic.tree.dayOfMonth} van 28
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Boomwijsheid:</span>
                    <span className="text-slate-300">{dayInfo.celtic.tree.description}</span>
                  </div>

                  {dayInfo.celtic.sabbat && (
                    <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-600/50 mt-1">
                      <span className="text-amber-300 font-bold text-[11px] block">
                        🔥 {dayInfo.celtic.sabbat.name}
                      </span>
                      <span className="text-[10px] text-slate-300 block mt-0.5">
                        {dayInfo.celtic.sabbat.descriptionDutch}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block text-[10px]">Seizoenshelft:</span>
                    <span className="text-cyan-300 font-semibold capitalize">
                      {dayInfo.celtic.seasonHalf === 'donker' ? 'Samonios (Donkere Winterhelft)' : 'Giamonios (Lichte Zomerhelft)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-900/40 text-[10px] text-slate-400">
                Ogham Alfabet & Wiel van het Jaar
              </div>
            </div>

            {/* 5. Astronomische Kalender Panel */}
            <div className="bg-gradient-to-b from-yellow-950/30 to-slate-950 border border-yellow-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-yellow-900/50 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Astronomisch & Kosmos</span>
                  </div>
                  <MoonIcon
                    phase={dayInfo.astronomical.moon.phase}
                    fraction={dayInfo.astronomical.moon.fraction}
                    size={24}
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Maanfase:</span>
                    <span className="text-yellow-200 font-bold text-sm">
                      {dayInfo.astronomical.moon.phaseNameDutch}
                    </span>
                    {dayInfo.astronomical.moon.traditionalName && (
                      <span className="text-[10px] text-amber-300 block">
                        Traditie: {dayInfo.astronomical.moon.traditionalName}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Illuminatie & Leeftijd:</span>
                    <span className="text-slate-200 font-mono">
                      {Math.round(dayInfo.astronomical.moon.fraction * 100)}% Verlicht • {dayInfo.astronomical.moon.ageDays} dagen oud
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Dierenriemteken Maan:</span>
                    <span className="text-purple-300 font-medium">
                      {dayInfo.astronomical.moon.moonSign}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-yellow-900/40 text-[10px] text-slate-400">
                Hemelmechanica & Lunaties
              </div>
            </div>

            {/* 6. Standaard Kalender Panel */}
            <div className="bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-blue-900/50 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-blue-300 font-bold text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    <span>Standaard Burgerkalender</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 font-mono">
                    Gregoriaans
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Datum:</span>
                    <span className="text-blue-200 font-bold text-sm">
                      {dayInfo.day} {['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'][dayInfo.month]} {dayInfo.year}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Weekdag:</span>
                    <span className="text-slate-200 font-medium">
                      {['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'][dayInfo.dayOfWeek]}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Schrikkeljaar:</span>
                    <span className="text-slate-300">
                      {((dayInfo.year % 4 === 0 && dayInfo.year % 100 !== 0) || dayInfo.year % 400 === 0) ? 'Ja (366 dagen)' : 'Nee (365 dagen)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-900/40 text-[10px] text-slate-400">
                Moderne Kalenderstandaard
              </div>
            </div>
          </div>

          {/* User Custom Notes & Events Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Persoonlijke Afspraken & Kosmische Intenties ({currentEvents.length})</span>
              </h4>
              <span className="text-xs text-slate-400">
                Gesynchroniseerd met Firebase Firestore
              </span>
            </div>

            {/* List of current notes */}
            {currentEvents.length > 0 && (
              <div className="space-y-2">
                {currentEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-100">{ev.title}</div>
                      {ev.description && <div className="text-xs text-slate-400 mt-0.5">{ev.description}</div>}
                    </div>

                    <button
                      onClick={() => onDeleteUserEvent(ev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Verwijder notitie"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add note form */}
            <form onSubmit={handleSaveNote} className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="text-xs font-semibold text-slate-300">Nieuwe notitie toevoegen voor deze datum:</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Titel (bv. Nieuwe Maan Meditatie, Essenen Pascha)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 md:col-span-2"
                />

                <select
                  value={linkedSystem}
                  onChange={(e) => setLinkedSystem(e.target.value as CalendarSystemKey)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="gregorian">Standaard Kalender</option>
                  <option value="essene">Essenen Kalender</option>
                  <option value="maya_tzolkin">Maya Tzolk'in</option>
                  <option value="haab">Maya Haab'</option>
                  <option value="celtic">Keltisch Jaarwiel</option>
                  <option value="astronomical">Astronomisch / Maan</option>
                </select>
              </div>

              <textarea
                placeholder="Optionele beschrijving of intentie..."
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-md shadow-indigo-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  Notitie Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
