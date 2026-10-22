// Unified Calendar Engine: combines all 6 calendar systems into a single performant engine
import {
  UnifiedDayInfo,
  CalendarEventItem,
} from '../types/calendar';
import {
  getJulianDayNumber,
  calculateMoonPhase,
  getAstronomicalEvents,
} from './astronomicalEngine';
import { calculateMayaCalendar } from './mayaEngine';
import { calculateEsseneCalendar } from './esseneEngine';
import { calculateCelticCalendar } from './celticEngine';

/**
 * Standard Dutch & International Gregorian Holidays
 */
export function getStandardHolidays(year: number, month: number, day: number): string | null {
  // Fixed holidays
  if (month === 1 && day === 1) return 'Nieuwjaarsdag';
  if (month === 4 && day === 27) return 'Koningsdag (NL)';
  if (month === 5 && day === 5) return 'Bevrijdingsdag (NL)';
  if (month === 7 && day === 21) return 'Nationale Feestdag (BE)';
  if (month === 12 && day === 5) return 'Sinterklaasavond';
  if (month === 12 && day === 25) return 'Eerste Kerstdag';
  if (month === 12 && day === 26) return 'Tweede Kerstdag';
  if (month === 12 && day === 31) return 'Oudejaarsavond';

  // Computus for Easter Sunday (Anonymous Gregorian algorithm)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

  const easterDate = new Date(year, easterMonth - 1, easterDay);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.round((targetDate.getTime() - easterDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === -2) return 'Goede Vrijdag';
  if (diffDays === 0) return 'Eerste Paasdag';
  if (diffDays === 1) return 'Tweede Paasdag';
  if (diffDays === 39) return 'Hemelvaartsdag';
  if (diffDays === 49) return 'Eerste Pinksterdag';
  if (diffDays === 50) return 'Tweede Pinksterdag';

  return null;
}

/**
 * Calculates complete information across all 6 calendar systems for a single date
 */
export function getUnifiedDayInfo(date: Date, referenceMonth?: number): UnifiedDayInfo {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon ...
  const jdn = getJulianDayNumber(year, month + 1, day);

  const today = new Date();
  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const isCurrentMonth = referenceMonth !== undefined ? month === referenceMonth : true;

  // 1. Astronomical
  const moon = calculateMoonPhase(date);
  const astroEvents = getAstronomicalEvents(date, moon);

  // 2. Maya
  const maya = calculateMayaCalendar(date);

  // 3. Essene
  const essene = calculateEsseneCalendar(date);

  // 4. Celtic
  const celtic = calculateCelticCalendar(date);

  // 5. Build unified events list
  const events: CalendarEventItem[] = [];

  // Standard Gregorian event
  const stdHoliday = getStandardHolidays(year, month + 1, day);
  if (stdHoliday) {
    events.push({
      id: `std-${year}-${month + 1}-${day}`,
      calendar: 'gregorian',
      title: stdHoliday,
      type: 'feestdag',
      color: '#3b82f6', // blue
      badge: '🏛️ Standaard',
      description: `Officiële feestdag op de standaard Gregoriaanse kalender.`,
    });
  }

  // Celtic Sabbats & Tree transitions
  if (celtic.sabbat) {
    events.push({
      id: `celtic-sabbat-${year}-${month + 1}-${day}`,
      calendar: 'celtic',
      title: celtic.sabbat.name,
      subtitle: celtic.sabbat.type === 'groot_vuurfeest' ? 'Groot Keltisch Vuurfeest' : 'Zonnewende / Equinox',
      type: 'sabbat',
      color: '#10b981', // emerald
      badge: '🌿 Keltisch',
      description: celtic.sabbat.descriptionDutch,
    });
  }
  if (celtic.tree.dayOfMonth === 1) {
    events.push({
      id: `celtic-tree-${year}-${month + 1}-${day}`,
      calendar: 'celtic',
      title: `Intrede Boommaand: ${celtic.tree.treeDutch}`,
      subtitle: `Ogham: ${celtic.tree.oghamLetter} (${celtic.tree.name})`,
      type: 'boommaand',
      color: '#059669',
      badge: '🌳 Boomkalender',
      description: `Begin van de 28-daagse periode van de ${celtic.tree.treeDutch}. ${celtic.tree.description}`,
    });
  }

  // Maya Tzolk'in Highlights (e.g. Master tone 13, Portal days, Tone 1)
  if (maya.tzolkin.number === 1) {
    events.push({
      id: `maya-tzolkin-1-${year}-${month + 1}-${day}`,
      calendar: 'maya_tzolkin',
      title: `Trezena Begin: 1 ${maya.tzolkin.dayName}`,
      subtitle: `${maya.tzolkin.glyphSymbol} ${maya.tzolkin.meaningDutch}`,
      type: 'trezena',
      color: '#f59e0b', // amber
      badge: '☀️ Tzolk\'in',
      description: `Eerste dag van een nieuwe 13-daagse Tzolk'in golf onder leiding van ${maya.tzolkin.dayName}.`,
    });
  } else if (maya.tzolkin.number === 13) {
    events.push({
      id: `maya-tzolkin-13-${year}-${month + 1}-${day}`,
      calendar: 'maya_tzolkin',
      title: `Trezena Afronding: 13 ${maya.tzolkin.dayName}`,
      subtitle: `Toon 13: Kosmische Vlucht & Integratie`,
      type: 'trezena_end',
      color: '#d97706',
      badge: '☀️ Tzolk\'in',
      description: `De 13e dag van de trezena cyclus: tijd voor transcendentie en hogere integratie.`,
    });
  }

  // Haab' Highlights (Wayeb' period & Chum / Seating of Month)
  if (maya.haab.isWayeb) {
    events.push({
      id: `haab-wayeb-${year}-${month + 1}-${day}`,
      calendar: 'haab',
      title: `Wayeb' Dag ${maya.haab.day + 1} van 5`,
      subtitle: 'Heilige Maya Binnenwereld',
      type: 'wayeb',
      color: '#ec4899', // pink
      badge: '🏺 Haab\' Wayeb\'',
      description: `Een van de 5 heilige overgangsdagen tussen de Haab' zonnecycli. Tijd van rituele vuren en contemplatie.`,
    });
  } else if (maya.haab.day === 0) {
    events.push({
      id: `haab-chum-${year}-${month + 1}-${day}`,
      calendar: 'haab',
      title: `Zetel van ${maya.haab.monthName} (Chum)`,
      subtitle: maya.haab.meaningDutch,
      type: 'haab_maand',
      color: '#8b5cf6', // purple
      badge: '🏺 Haab\'',
      description: `Eerste dag (troon) van de 20-daagse Haab' maand ${maya.haab.monthName}.`,
    });
  }

  // Essene Feasts & Tekufot
  if (essene.feastName) {
    events.push({
      id: `essene-feast-${year}-${month + 1}-${day}`,
      calendar: 'essene',
      title: essene.feastName,
      subtitle: `${essene.monthNameDutch}, Dag ${essene.dayOfMonth}`,
      type: 'essenen_feest',
      color: '#06b6d4', // cyan
      badge: '📜 Essenen',
      description: essene.feastDescription || 'Feestdag volgens de Dode Zeerollen.',
    });
  } else if (essene.isTekufah && essene.tekufahName) {
    events.push({
      id: `essene-tekufah-${year}-${month + 1}-${day}`,
      calendar: 'essene',
      title: essene.tekufahName,
      subtitle: `Dag 91 van ${essene.seasonNameDutch}`,
      type: 'tekufah',
      color: '#0891b2',
      badge: '📜 Tekufah',
      description: `Herdenkingsdag van de seizoenswisseling in de 364-dagen zonnecyclus van de Essenen.`,
    });
  }

  // Astronomical events
  astroEvents.forEach((ae, idx) => {
    events.push({
      id: `astro-${year}-${month + 1}-${day}-${idx}`,
      calendar: 'astronomical',
      title: ae.title,
      subtitle: ae.type === 'moon_phase' ? `Illuminatie ${Math.round(moon.fraction * 100)}%` : 'Kosmisch Fenomeen',
      type: ae.type,
      color: '#eab308', // yellow
      badge: '✨ Kosmos',
      description: ae.description,
    });
  });

  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    date,
    dateString,
    day,
    month,
    year,
    dayOfWeek,
    isToday,
    isCurrentMonth,
    julianDayNumber: jdn,
    astronomical: {
      moon,
      events: astroEvents,
    },
    maya,
    haab: maya.haab,
    essene,
    celtic,
    events,
  };
}

/**
 * Generates a 6-week Gregorian Month view grid (exactly 42 days: 7 columns x 6 rows)
 * Starting on Monday (European / standard convention)
 */
export function getSixWeekMonthGrid(year: number, month: number): UnifiedDayInfo[] {
  // First day of target month
  const firstOfMonth = new Date(year, month, 1);
  const dayOfWeekFirst = firstOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
  // Monday is 1, so offset from Monday:
  // If Monday (1) -> 0 days before
  // If Sunday (0) -> 6 days before
  const mondayOffset = (dayOfWeekFirst - 1 + 7) % 7;

  // Grid start date
  const gridStart = new Date(year, month, 1 - mondayOffset);

  const days: UnifiedDayInfo[] = [];

  // Exactly 42 days (6 weeks x 7 days)
  for (let i = 0; i < 42; i++) {
    const curDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    days.push(getUnifiedDayInfo(curDate, month));
  }

  return days;
}

/**
 * Generates a 7-day Week view grid
 */
export function getWeekGrid(date: Date): UnifiedDayInfo[] {
  const dayOfWeek = date.getDay();
  const mondayOffset = (dayOfWeek - 1 + 7) % 7;
  const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset);

  const days: UnifiedDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const curDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
    days.push(getUnifiedDayInfo(curDate));
  }

  return days;
}
