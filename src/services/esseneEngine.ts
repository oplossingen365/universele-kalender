// Essene Calendar Engine (364-day Solar Calendar / Dead Sea Scrolls / Qumran / Jubilees / Enoch)
import { EsseneCalendarData } from '../types/calendar';

const DAY_NAMES = [
  'Zondag (1e dag)',
  'Maandag (2e dag)',
  'Dinsdag (3e dag)',
  'Woensdag (4e dag - Scheppingsdag Lichten)',
  'Donderdag (5e dag)',
  'Vrijdag (6e dag - Voorbereidingsdag)',
  'Sabbat (7e dag - Rustdag)',
];

/**
 * Finds the Wednesday anchor for the Essene New Year (Month 1, Day 1) for a given Gregorian year.
 * The Essene year begins on the Wednesday on or after March 20 (Vernal Equinox).
 */
export function getEsseneYearAnchor(gregorianYear: number): Date {
  const march20 = new Date(gregorianYear, 2, 20); // March 20
  const dayOfWeek = march20.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

  let daysToAdd = (3 - dayOfWeek + 7) % 7;
  // If March 20 is already Wednesday, daysToAdd is 0
  const anchor = new Date(gregorianYear, 2, 20 + daysToAdd);
  anchor.setHours(0, 0, 0, 0);
  return anchor;
}

/**
 * Converts any Gregorian date into the 364-day Essene calendar
 */
export function calculateEsseneCalendar(date: Date): EsseneCalendarData {
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  current.setHours(0, 0, 0, 0);

  let gregYear = current.getFullYear();
  let anchor = getEsseneYearAnchor(gregYear);

  // If the date is before this year's anchor, it belongs to the previous Essene year
  if (current.getTime() < anchor.getTime()) {
    gregYear -= 1;
    anchor = getEsseneYearAnchor(gregYear);
  }

  // Calculate day index (0-363)
  const msDiff = current.getTime() - anchor.getTime();
  let dayIndex = Math.floor(msDiff / (1000 * 60 * 60 * 24));

  // If beyond 364 days (intercalation transition), cap or wrap
  if (dayIndex >= 364) {
    dayIndex = 363;
  }

  // Each of the 4 seasons has 91 days (30 + 30 + 31)
  const seasonNumber = Math.floor(dayIndex / 91) + 1; // 1: Spring, 2: Summer, 3: Autumn, 4: Winter
  const dayInSeason = dayIndex % 91; // 0 to 90

  let monthInSeason: number;
  let dayOfMonth: number;

  if (dayInSeason < 30) {
    monthInSeason = 1;
    dayOfMonth = dayInSeason + 1;
  } else if (dayInSeason < 60) {
    monthInSeason = 2;
    dayOfMonth = dayInSeason - 30 + 1;
  } else {
    monthInSeason = 3;
    dayOfMonth = dayInSeason - 60 + 1; // 1 to 31
  }

  const month = (seasonNumber - 1) * 3 + monthInSeason; // 1 to 12

  // In the Essene calendar, day 0 (Month 1 Day 1) is Wednesday (dayOfWeek index 3)
  // Day of week formula: (3 + dayIndex) % 7
  // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday (Sabbath)
  const dowIndex = (3 + dayIndex) % 7;
  const isSabbath = dowIndex === 6;

  // Tekufah: 31st day of month 3, 6, 9, 12 (day 90 of each season, always a Tuesday!)
  const isTekufah = dayOfMonth === 31;
  let tekufahName: string | undefined;

  if (isTekufah) {
    const tekufahNames = [
      'Tekufah Tammuz (Zomer Gedenkdag)',
      'Tekufah Tishrei (Herfst Gedenkdag)',
      'Tekufah Tevet (Winter Gedenkdag)',
      'Tekufah Nisan (Lente Gedenkdag & Afsluiting Cyclus)',
    ];
    tekufahName = tekufahNames[seasonNumber - 1];
  } else if (dayIndex === 0) {
    tekufahName = 'Tekufah Nisan (Lente Gedenkdag & Hoofd der Maanden)';
  }

  const seasonNamesDutch = [
    'Lente (Tekufah Nisan)',
    'Zomer (Tekufah Tammuz)',
    'Herfst (Tekufah Tishrei)',
    'Winter (Tekufah Tevet)',
  ];

  const monthNamesHebrew = [
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

  // Feasts according to Dead Sea Scrolls / Temple Scroll
  let feastName: string | undefined;
  let feastDescription: string | undefined;

  if (month === 1 && dayOfMonth === 1) {
    feastName = 'Rosh Chodashim (Essenen Nieuwjaar)';
    feastDescription = 'Eerste dag van het heilige zonnejaar. Woensdag, de dag dat zon, maan en sterren werden geschapen.';
  } else if (month === 1 && dayOfMonth === 14) {
    feastName = 'Pesach (Pascha)';
    feastDescription = 'Avond van de bevrijding en het Paschamaal (altijd dinsdagavond in Qumran).';
  } else if (month === 1 && dayOfMonth === 15) {
    feastName = 'Chag HaMatzot (Ongezuurde Broden)';
    feastDescription = 'Eerste dag van het Feest der Ongezuurde Broden (altijd woensdag).';
  } else if (month === 1 && dayOfMonth === 21) {
    feastName = 'Zevende Dag van Ongezuurde Broden';
    feastDescription = 'Slotdag van het Matzotfeest (altijd dinsdag).';
  } else if (month === 1 && dayOfMonth === 26) {
    feastName = 'Reshit Katzir (Eerstelingen van de Gerst / Omer)';
    feastDescription = 'Het bewegen van de Omer-schoof (altijd de eerste zondag na het Matzot-feest).';
  } else if (month === 3 && dayOfMonth === 15) {
    feastName = 'Shavuot (Wekenfeest / Eerstelingen van de Tarwe)';
    feastDescription = 'Verbondsgelofte en Tarwe-eerstelingenfeest, precies 50 dagen na de Gerst-omer (altijd zondag).';
  } else if (month === 5 && dayOfMonth === 3) {
    feastName = 'Chag HaTirosh (Feest van de Nieuwe Wijn)';
    feastDescription = 'Uniek Essenenfeest uit de Tempelrol: precies 50 dagen na Shavuot (altijd zondag). Plengen van nieuwe wijn.';
  } else if (month === 6 && dayOfMonth === 22) {
    feastName = 'Chag HaYitzhar (Feest van de Nieuwe Olie)';
    feastDescription = 'Uniek Essenenfeest uit de Tempelrol: precies 50 dagen na het Wijnfeest (altijd zondag). Geheiligde olijfolie.';
  } else if (month === 6 && dayOfMonth >= 23 && dayOfMonth <= 28) {
    feastName = `Korban Etzim (Houtofferfeest, Dag ${dayOfMonth - 22})`;
    feastDescription = 'Zesdaags feest waarin de stammen hout brachten voor het altaar van het heiligdom.';
  } else if (month === 7 && dayOfMonth === 1) {
    feastName = 'Yom Teruah (Gedenkdag der Bazuinen)';
    feastDescription = 'Heilige bazuindag aan het begin van het zevende zevental (altijd woensdag).';
  } else if (month === 7 && dayOfMonth === 10) {
    feastName = 'Yom Kippur (Grote Verzoendag)';
    feastDescription = 'Hoogste dag van vasten en verzoening (in het Essenen systeem altijd op een vrijdag).';
  } else if (month === 7 && dayOfMonth === 15) {
    feastName = 'Sukkot (Loofhuttenfeest - Dag 1)';
    feastDescription = 'Zeven dagen wonen in loofhutten ter herinnering aan de woestijnreis (altijd woensdag).';
  } else if (month === 7 && dayOfMonth === 22) {
    feastName = 'Shemini Atzeret (Slotfeest)';
    feastDescription = 'Achtste dag van de heilige samenkomst (altijd woensdag).';
  }

  return {
    year: gregYear,
    seasonNumber,
    seasonNameDutch: seasonNamesDutch[seasonNumber - 1],
    month,
    monthNameDutch: monthNamesHebrew[month - 1],
    dayOfMonth,
    dayOfWeek: dowIndex + 1, // 1: Sunday, 7: Sabbath
    dayOfWeekDutch: DAY_NAMES[dowIndex],
    isTekufah,
    tekufahName,
    feastName,
    feastDescription,
    isSabbath,
  };
}
