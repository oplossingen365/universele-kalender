import React, { useState } from 'react';
import { X, BookOpen, Scroll, Sun, Trees, Sparkles, Compass } from 'lucide-react';

interface CalendarGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarGuideModal: React.FC<CalendarGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'essene' | 'maya' | 'celtic' | 'astro' | 'gregorian'>('essene');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">
                Universele Kalender Gids & Kenniscentrum
              </h3>
              <p className="text-xs text-slate-400">
                Historische achtergrond, wiskunde en symboliek van de 6 kalendersystemen
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/60 px-5 pt-3 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('essene')}
            className={`px-3 py-2 rounded-t-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'essene'
                ? 'bg-slate-900 text-cyan-300 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 text-cyan-400" />
            <span>Essenen (364d)</span>
          </button>

          <button
            onClick={() => setActiveTab('maya')}
            className={`px-3 py-2 rounded-t-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'maya'
                ? 'bg-slate-900 text-amber-300 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Maya & Haab'</span>
          </button>

          <button
            onClick={() => setActiveTab('celtic')}
            className={`px-3 py-2 rounded-t-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'celtic'
                ? 'bg-slate-900 text-emerald-300 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            <span>Keltisch Jaarwiel</span>
          </button>

          <button
            onClick={() => setActiveTab('astro')}
            className={`px-3 py-2 rounded-t-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'astro'
                ? 'bg-slate-900 text-purple-300 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Astronomisch & Maan</span>
          </button>

          <button
            onClick={() => setActiveTab('gregorian')}
            className={`px-3 py-2 rounded-t-xl font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gregorian'
                ? 'bg-slate-900 text-blue-300 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Gregoriaans</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          
          {/* Essene Tab */}
          {activeTab === 'essene' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/50">
                <h4 className="text-sm font-bold text-cyan-200 mb-1">
                  De 364-Dagen Zonnekalender van Qumran (Dode Zeerollen)
                </h4>
                <p className="text-slate-300">
                  De gemeenschap te Qumran (de Essenen) wees de maankalender van Jeruzalem af en hanteerde de strikt wiskundige zonnecyclus beschreven in het Boek der Jubileeën en 1 Henoch.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-100 text-xs">Kernkenmerken van het Essenen Systeem:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-cyan-300">Exact 364 Dagen / 52 Weken:</strong> Omdat 364 deelbaar is door 7 (52 × 7 = 364), valt <em>elke feestdag elk jaar op exact dezelfde dag van de week</em>! Dit voorkwam dat feestdagen ooit botsten met de heilige Sabbat.
                  </li>
                  <li>
                    <strong className="text-cyan-300">Start op Woensdag:</strong> Volgens Genesis 1:14-19 schiep God de zon, de maan en de sterren op de 4e dag (woensdag). Daarom begint het Essenen jaar altijd op een woensdag!
                  </li>
                  <li>
                    <strong className="text-cyan-300">4 Seizoenen van 91 Dagen:</strong> Elk seizoen (Tekufah) bestaat uit 3 maanden: 30 dagen + 30 dagen + 31 dagen. De 31e dag is de gedenkdag van de seizoenswisseling (Tekufah).
                  </li>
                  <li>
                    <strong className="text-cyan-300">Unieke Tempelrol Feesten:</strong> Naast Pascha en Wekenfeest (Tarwe) vierden de Essenen ook het Feest van de Nieuwe Wijn (Tirosh, 50 dagen na Shavuot), het Feest van de Nieuwe Olie (Yitzhar, 50 dagen na Wijn), en het zesdaagse Houtofferfeest (Korban Etzim).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Maya Tab */}
          {activeTab === 'maya' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/50">
                <h4 className="text-sm font-bold text-amber-200 mb-1">
                  Het Meso-Amerikaanse Tijdssysteem (Tzolk'in, Haab' en Long Count)
                </h4>
                <p className="text-slate-300">
                  De Maya's zagen tijd als een levend web van met elkaar verweven cycli.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-100 text-xs">Drie Inelkaar Grijpende Tandwielen:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-amber-300">Tzolk'in (260 dagen):</strong> De heilige kalender, gevormd door 20 Zonnetekens (Imix t/m Ajaw) vermenigvuldigd met 13 Scheppingstonen. Elk individu heeft een geboorteteken dat kosmische archetypen weerspiegelt.
                  </li>
                  <li>
                    <strong className="text-amber-300">Haab' (365 dagen):</strong> Het burgerlijke zonnejaar van 18 maanden van 20 dagen (uinals) = 360 dagen, plus 5 overgangsdagen (Wayeb'). Dag 0 van elke maand heet "Chum" (de zetel van de maand).
                  </li>
                  <li>
                    <strong className="text-amber-300">Kalenderwiel (Calendar Round - 52 Jaar):</strong> De Tzolk'in en Haab' vallen pas na 18.980 dagen (52 Haab-jaren) weer op exact dezelfde dagcombinatie (zoals 4 Ajaw 8 Kumk'u).
                  </li>
                  <li>
                    <strong className="text-amber-300">Lange Telling (Long Count):</strong> Een lineaire telling vanaf de scheppingsdatum (11 augustus 3114 v.Chr., correlatie GMT 584283), opgebouwd uit K'in (1d), Winal (20d), Tun (360d), K'atun (7.200d) en B'ak'tun (144.000d).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Celtic Tab */}
          {activeTab === 'celtic' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                <h4 className="text-sm font-bold text-emerald-200 mb-1">
                  Het Keltische Jaarwiel & De 13 Ogham Bomen
                </h4>
                <p className="text-slate-300">
                  De Keltische kalender is gegrondvest in de seizoenswisselingen en de natuurlijke krachten van de bomen.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-100 text-xs">De Twee Helften & 8 Spaken:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-emerald-300">Donkere & Lichte Helft:</strong> Het jaar begint met Samhain (1 november) in de donkere helft (Samonios) en keert met Beltane (1 mei) naar de lichte helft (Giamonios).
                  </li>
                  <li>
                    <strong className="text-emerald-300">De 8 Sabbats:</strong> 4 grote vuurfeesten (Samhain, Imbolc, Beltane, Lughnasadh) en 4 zonnefeesten (Winterzonnewende/Yule, Lente-equinox/Ostara, Zomerzonnewende/Litha, Herfst-equinox/Mabon).
                  </li>
                  <li>
                    <strong className="text-emerald-300">13 Boommaanden van 28 Dagen:</strong> Beth (Berk), Luis (Lijsterbes), Nion (Es), Fearn (Els), Saille (Wilg), Uath (Meidoorn), Duir (Eik), Tinne (Hulst), Coll (Hazelaar), Muin (Wijnstok), Gort (Klimop), Ngetal (Riet), Ruis (Vlier).
                  </li>
                  <li>
                    <strong className="text-emerald-300">De Naamloze Dag (23 december):</strong> De 365e dag van het jaar, gewijd aan de Maretak en het geheim tussen dood en hergeboorte.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Astronomical Tab */}
          {activeTab === 'astro' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50">
                <h4 className="text-sm font-bold text-purple-200 mb-1">
                  Astronomische Maancycli & Kosmische Ritmes
                </h4>
                <p className="text-slate-300">
                  De beweging van de hemellichamen vormt de oerbron van alle tijdrekening op aarde.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-100 text-xs">Kosmische Cycli:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-purple-300">Synodische Maand (29.53059 dagen):</strong> De tijd die de maan nodig heeft om van Nieuwe Maan via Volle Maan weer naar Nieuwe Maan te keren.
                  </li>
                  <li>
                    <strong className="text-purple-300">Siderische Maand & Dierenriem (27.32 dagen):</strong> De maan beweegt elke ~2.3 dagen door een ander sterrenbeeld (Ram t/m Vissen).
                  </li>
                  <li>
                    <strong className="text-purple-300">Zonnewendes & Equinoxen:</strong> De astronomische hoekpunten waarin de seizoenen kantelen.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Gregorian Tab */}
          {activeTab === 'gregorian' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/50">
                <h4 className="text-sm font-bold text-blue-200 mb-1">
                  De Standaard Gregoriaanse Kalender
                </h4>
                <p className="text-slate-300">
                  In 1582 ingevoerd door paus Gregorius XIII om de kalender in pas te houden met het tropische zonnejaar van 365.2422 dagen.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-100 text-xs">Wiskundige Regels:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-blue-300">Schrikkeljaren:</strong> Elk jaar deelbaar door 4 heeft 366 dagen, tenzij deelbaar door 100, behalve als het deelbaar is door 400 (bv. 2000 was schrikkeljaar, 1900 niet).
                  </li>
                  <li>
                    <strong className="text-blue-300">6-Weken Maandraster:</strong> Doordat een maand van 31 dagen over 5 tot 6 verschillende weken kan vallen, garandeert het 42-cel raster (6 rijen van 7 dagen) dat elke maand volledig en consistent wordt weergegeven.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
