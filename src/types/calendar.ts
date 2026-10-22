// Types for Universal Multi-Calendar System

export type CalendarSystemKey =
  | 'gregorian'
  | 'celtic'
  | 'maya_tzolkin'
  | 'haab'
  | 'astronomical'
  | 'essene';

export type MainViewType =
  | 'month'        // 6-week Gregorian month view
  | 'week'         // 7-day multi-calendar view
  | 'year'         // 12-month yearly overview
  | 'essene'       // Essene 4-season / 364-day view
  | 'maya'         // Maya Tzolk'in & Haab' cycle view
  | 'celtic'       // Celtic 13-tree & Wheel of the Year view
  | 'astronomical';// Lunar lunation & astronomical cycles view

// Moon Phase Types
export type MoonPhaseName =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface MoonPhaseInfo {
  phase: MoonPhaseName;
  phaseNameDutch: string;
  fraction: number;        // 0.0 to 1.0 (illumination)
  phaseAngle: number;       // 0 to 360 degrees
  ageDays: number;          // 0 to 29.53 days
  isMajorPhase: boolean;    // new, first quarter, full, last quarter
  traditionalName?: string; // e.g. "Wolfsmaan", "Oogstmaan"
  moonSign: string;         // Zodiac sign the moon is in
}

// Astronomical Event
export interface AstroEvent {
  title: string;
  type: 'equinox' | 'solstice' | 'eclipse' | 'meteor_shower' | 'moon_phase';
  description: string;
  exactDate?: string;
}

// Maya Long Count & Tzolk'in & Haab
export interface MayaTzolkinDate {
  number: number;           // 1 to 13
  dayName: string;          // e.g. "Imix", "Ik'", "Ajaw"
  meaningDutch: string;     // e.g. "Heer, Zon, Verlichting"
  glyphSymbol: string;      // Unicode/SVG symbol representation
  trecenaNumber: number;    // 1 to 20
  trecenaName: string;      // The leading sign of this 13-day wave
}

export interface MayaHaabDate {
  day: number;              // 0 to 19 (or 0-4 for Wayeb')
  monthName: string;        // e.g. "Pop", "Wo", "Kumk'u", "Wayeb'"
  monthIndex: number;       // 0 to 18
  isWayeb: boolean;         // 5 nameless sacred days
  meaningDutch: string;     // Seasonal meaning
  isChum: boolean;          // Day 0 is "Chum" (seating of month)
}

export interface MayaLongCount {
  baktun: number;
  katun: number;
  tun: number;
  uinal: number;
  kin: number;
  fullString: string;       // e.g. "13.0.13.15.4"
  lordOfNight: number;      // G1 to G9
  calendarRound: string;    // e.g. "4 Ajaw 8 Kumk'u"
}

export interface MayaCalendarData {
  tzolkin: MayaTzolkinDate;
  haab: MayaHaabDate;
  longCount: MayaLongCount;
}

// Essene 364-day Calendar (Dead Sea Scrolls / Qumran)
export interface EsseneCalendarData {
  year: number;             // Essene solar cycle count
  seasonNumber: number;     // 1: Lente (Nisan), 2: Zomer (Tammuz), 3: Herfst (Tishrei), 4: Winter (Tevet)
  seasonNameDutch: string;  // e.g. "Tekufah Lente (Nisan)"
  month: number;            // 1 to 12
  monthNameDutch: string;   // e.g. "1e Maand (Nisan)", "7e Maand (Tishrei)"
  dayOfMonth: number;       // 1 to 30 (or 31 on Tekufah days)
  dayOfWeek: number;        // Fixed 1 (Zondag) to 7 (Sabbat/Zaterdag), starts on 4 (Woensdag)
  dayOfWeekDutch: string;   // Fixed day of week name
  isTekufah: boolean;       // Seasonal memorial transition day (31st day of month 3, 6, 9, 12)
  tekufahName?: string;     // e.g. "Tekufah Nisan (Lente Gedenkdag)"
  feastName?: string;       // Feast day if applicable (Pascha, Omer, Tirosh, Yitzhar, Yom Kippur, etc.)
  feastDescription?: string;
  isSabbath: boolean;       // Falls on Sabbath (always day 4, 11, 18, 25 of every month!)
}

// Celtic Calendar (Wheel of the Year & 13 Tree Months)
export interface CelticTreeMonth {
  name: string;             // e.g. "Beth", "Luis", "Nion"
  treeDutch: string;        // e.g. "Berk", "Lijsterbes", "Es"
  oghamLetter: string;      // e.g. "ᚁ", "ᚂ", "ᚅ"
  description: string;      // Tree wisdom & keywords
  monthNumber: number;      // 1 to 13, or 0 for Nameless Day
  dayOfMonth: number;       // 1 to 28 (or 1 for Nameless day)
}

export interface CelticCalendarData {
  tree: CelticTreeMonth;
  sabbat?: {
    name: string;           // e.g. "Samhain", "Beltane", "Imbolc", "Lughnasadh", etc.
    type: 'groot_vuurfeest' | 'zonnewende' | 'equinox';
    descriptionDutch: string;
    isExactDay: boolean;
  };
  isNamelessDay: boolean;   // 23 December (The Nameless Day / Dag van het Geheim)
  seasonHalf: 'donker' | 'licht'; // Samonios (winter/donker) vs Giamonios (zomer/licht)
}

// Unified Day Information (combining all 6 systems)
export interface UnifiedDayInfo {
  date: Date;
  dateString: string;       // YYYY-MM-DD
  day: number;
  month: number;            // 0-11
  year: number;
  dayOfWeek: number;        // 0-6 (0 = Sunday, 1 = Monday, etc.)
  isToday: boolean;
  isCurrentMonth: boolean;
  julianDayNumber: number;

  // The 5 other systems
  astronomical: {
    moon: MoonPhaseInfo;
    events: AstroEvent[];
  };
  maya: MayaCalendarData;
  haab: MayaHaabDate;
  essene: EsseneCalendarData;
  celtic: CelticCalendarData;

  // Unified list of tags/events for filters
  events: CalendarEventItem[];
}

// Event item for filtering and display
export interface CalendarEventItem {
  id: string;
  calendar: CalendarSystemKey;
  title: string;
  subtitle?: string;
  type: string;
  color: string;
  badge: string;
  description: string;
}

// User-created custom event or note
export interface UserCustomEvent {
  id: string;
  dateString: string;       // YYYY-MM-DD
  title: string;
  description?: string;
  linkedCalendar?: CalendarSystemKey;
  tags?: string[];
  createdAt: number;
}

// Firebase Sync Configuration
export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}
