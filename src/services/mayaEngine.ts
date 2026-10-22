// Maya Engine: Long Count, Tzolk'in, Haab', Lord of the Night
import { MayaCalendarData, MayaTzolkinDate, MayaHaabDate, MayaLongCount } from '../types/calendar';
import { getJulianDayNumber } from './astronomicalEngine';

// GMT Correlation Constant (Goodman-Martínez-Thompson)
export const MAYA_GMT_CORRELATION = 584283;

// The 20 Tzolk'in Day Signs
export const TZOLKIN_SIGNS = [
  { name: 'Imix', dutch: 'Draak / Krokodil (Oerwater, Creatie, Oorsprong)', symbol: '🐊', keyword: 'Voeding & Geboorte' },
  { name: 'Ik\'', dutch: 'Wind / Adem (Geest, Communicatie, Inspiratie)', symbol: '💨', keyword: 'Adem & Geest' },
  { name: 'Ak\'b\'al', dutch: 'Nacht / Huis (Droomtijd, Diepte, Mysterie)', symbol: '🌌', keyword: 'Introspectie & Dromen' },
  { name: 'K\'an', dutch: 'Zaad / Hagedis (Potentieel, Vruchtbaarheid, Creatie)', symbol: '🌱', keyword: 'Zaad van Bewustzijn' },
  { name: 'Chikchan', dutch: 'Slang (Levenskracht, Kundalini, Instinkt)', symbol: '🐍', keyword: 'Passie & Vitaliteit' },
  { name: 'Kimi', dutch: 'Wereldoverbrugging / Dood (Transformatie, Loslaten)', symbol: '💀', keyword: 'Wedergeboorte' },
  { name: 'Manik\'', dutch: 'Hert / Hand (Genezing, Realisatie, Voltooiing)', symbol: '🦌', keyword: 'Helen & Kracht' },
  { name: 'Lamat', dutch: 'Ster / Konijn (Venus, Harmonie, Schoonheid, Kunst)', symbol: '✨', keyword: 'Kosmische Harmonie' },
  { name: 'Muluk', dutch: 'Maan / Water (Zuivering, Herinnering, Stroming)', symbol: '💧', keyword: 'Zuiverend Water' },
  { name: 'Ok', dutch: 'Hond (Onvoorwaardelijke Liefde, Loyaliteit, Hart)', symbol: '🐕', keyword: 'Liefde & Gids' },
  { name: 'Chuwen', dutch: 'Aap (Spel, Magie, Kosmische Wever, Kunstenaar)', symbol: '🐒', keyword: 'Spel & Illusie' },
  { name: 'Eb\'', dutch: 'Mens / Gras (Vrije Wil, Toewijding, Levenspad)', symbol: '🌿', keyword: 'Wijsheid & Vrije Wil' },
  { name: 'B\'en', dutch: 'Hemelwandelaar / Riet (Moed, Groei, Pilaar)', symbol: '🎋', keyword: 'Moed & Verkenning' },
  { name: 'Ix', dutch: 'Tovenaar / Jaguar (Sjamaan, Magie, Aanwezigheid)', symbol: '🐆', keyword: 'Tijdloosheid & Magie' },
  { name: 'Men', dutch: 'Adelaar (Hoge Visie, Globaal Bewustzijn, Vlucht)', symbol: '🦅', keyword: 'Visie & Hoop' },
  { name: 'Kib\'', dutch: 'Krijger / Uil (Moed, Intelligentie, Innerlijke Stem)', symbol: '🦉', keyword: 'Vraagstelling & Gratie' },
  { name: 'Kab\'an', dutch: 'Aarde / Beweging (Synchroniciteit, Evolutie, Kracht)', symbol: '🌍', keyword: 'Aardeverbinding' },
  { name: 'Etz\'nab\'', dutch: 'Spiegel / Vuursteen (Waarheid, Zuiver Zien, Helderheid)', symbol: '🪞', keyword: 'Reflectie & Waarheid' },
  { name: 'Kawak', dutch: 'Storm (Zuiverend Vuur, Transmutatie, Energie)', symbol: '⚡', keyword: 'Zelfvernieuwing' },
  { name: 'Ajaw', dutch: 'Zon / Heer (Verlichting, Eenheid, Kosmisch Meesterschap)', symbol: '☀️', keyword: 'Universeel Bewustzijn' },
];

// The 18 Haab' Months + Wayeb'
export const HAAB_MONTHS = [
  { name: 'Pop', dutch: 'Mat (Begin van het Nieuwe Haab Jaar)', meaning: 'Nieuw Begin & Zuivering' },
  { name: 'Wo', dutch: 'Zwarte Nacht (Conjuratie, Schaduwwerk)', meaning: 'Innerlijk Werk & Rust' },
  { name: 'Sip', dutch: 'Rode Storm (Jacht, Zintuiglijke Scherpzinnigheid)', meaning: 'Moed & Focus' },
  { name: 'Sotz\'', dutch: 'Vleermuis (Overgang, Drempel van de Onderwereld)', meaning: 'Schaduw & Observatie' },
  { name: 'Sek', dutch: 'Dood / Rust (Aarde & Hemel Verbinding)', meaning: 'Reiniging van Geest' },
  { name: 'Xul', dutch: 'Hond / Einde (Beëindiging van het eerste kwart)', meaning: 'Loyaliteit & Afronding' },
  { name: 'Yaxk\'in', dutch: 'Nieuwe Zon (Zomervoorbode, Warmte van K\'inich Ajaw)', meaning: 'Verlichting & Levensvreugde' },
  { name: 'Mol', dutch: 'Water / Oogst (Verzamelen van wolken en gaven)', meaning: 'Verzamelen & Zegeningen' },
  { name: 'Ch\'en', dutch: 'Zwarte Storm (Maanbron, Stilte in de grot)', meaning: 'Meditatie & Diepte' },
  { name: 'Yax', dutch: 'Groene Storm (Ontluiken, Eerste scheuten)', meaning: 'Vitaliteit & Verjonging' },
  { name: 'Zac', dutch: 'Witte Storm (Reinheid, Zuiverende dauw)', meaning: 'Puurheid & Onschuld' },
  { name: 'Ceh', dutch: 'Rode Storm (Hert, Vuur van transformatie)', meaning: 'Kracht & Openheid' },
  { name: 'Mac', dutch: 'Afsluiting / Schuilplaats (Ouderlingen, Wijsheid)', meaning: 'Afsluiting & Voldoening' },
  { name: 'K\'ank\'in', dutch: 'Gele Zon (Rijping van gewassen)', meaning: 'Rijping & Gulheid' },
  { name: 'Muan', dutch: 'Uil / Regenwolk (Vruchtbare buien, Mist)', meaning: 'Transformatie & Water' },
  { name: 'Pax', dutch: 'Muziek / Oorlogstrommel (Het plantenfeest)', meaning: 'Muziek & Gemeenschap' },
  { name: 'K\'ayab', dutch: 'Schildpad (Zang, Geduld van de Moeder Aarde)', meaning: 'Geduld & Vaste Grond' },
  { name: 'Kumk\'u', dutch: 'Graanschuur / Kookpot (Overvloed vóór de stilte)', meaning: 'Volheid & Oogstfeest' },
  { name: 'Wayeb\'', dutch: 'De 5 Heilige / Ongelukkige Dagen (De rust tussen de werelden)', meaning: 'Stilte, Bezinning & Heilige Vuren' },
];

/**
 * Calculates Maya Long Count, Tzolk'in and Haab' for a given Gregorian date
 */
export function calculateMayaCalendar(date: Date): MayaCalendarData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jdn = getJulianDayNumber(year, month, day);
  const days = jdn - MAYA_GMT_CORRELATION;

  // 1. Long Count breakdown
  // 1 Baktun = 144,000 days
  // 1 Katun = 7,200 days
  // 1 Tun = 360 days
  // 1 Uinal = 20 days
  // 1 Kin = 1 day
  let rem = days;
  const baktun = Math.floor(rem / 144000);
  rem %= 144000;
  if (rem < 0) rem += 144000;

  const katun = Math.floor(rem / 7200);
  rem %= 7200;

  const tun = Math.floor(rem / 360);
  rem %= 360;

  const uinal = Math.floor(rem / 20);
  const kin = rem % 20;

  const fullLongCount = `${baktun}.${katun}.${tun}.${uinal}.${kin}`;

  // 2. Lord of the Night (G1 through G9)
  // Epoch 0.0.0.0.0 was G9
  const gIndex = ((days - 1) % 9 + 9) % 9 + 1;

  // 3. Tzolk'in (260-day cycle: 13 numbers x 20 signs)
  // Epoch was 4 Ajaw (number 4, Ajaw index 19)
  const tzolkinNumber = ((days + 3) % 13 + 13) % 13 + 1;
  const tzolkinSignIndex = ((days + 19) % 20 + 20) % 20;
  const tzolkinSignObj = TZOLKIN_SIGNS[tzolkinSignIndex];

  // Trezena (the 13-day wave ruled by the sign of tone 1)
  const trecenaSignIndex = ((tzolkinSignIndex - (tzolkinNumber - 1)) % 20 + 20) % 20;
  const trecenaLead = TZOLKIN_SIGNS[trecenaSignIndex];

  const tzolkin: MayaTzolkinDate = {
    number: tzolkinNumber,
    dayName: tzolkinSignObj.name,
    meaningDutch: tzolkinSignObj.dutch,
    glyphSymbol: tzolkinSignObj.symbol,
    trecenaNumber: trecenaSignIndex + 1,
    trecenaName: trecenaLead.name,
  };

  // 4. Haab' (365-day solar cycle: 18 x 20 + 5)
  // At epoch 0.0.0.0.0 it was 8 Kumk'u (Kumk'u is month index 17, day 8 = 348 days offset)
  const haabDayIndex = ((days + 348) % 365 + 365) % 365;

  let haabMonthIndex: number;
  let haabDay: number;
  let isWayeb = false;

  if (haabDayIndex < 360) {
    haabMonthIndex = Math.floor(haabDayIndex / 20);
    haabDay = haabDayIndex % 20;
  } else {
    haabMonthIndex = 18; // Wayeb'
    haabDay = haabDayIndex - 360; // 0 to 4
    isWayeb = true;
  }

  const haabMonthObj = HAAB_MONTHS[haabMonthIndex];
  const isChum = haabDay === 0;

  const haab: MayaHaabDate = {
    day: haabDay,
    monthName: haabMonthObj.name,
    monthIndex: haabMonthIndex,
    isWayeb,
    meaningDutch: haabMonthObj.dutch,
    isChum,
  };

  const calendarRound = `${tzolkin.number} ${tzolkin.dayName} ${haab.day} ${haab.monthName}`;

  const longCount: MayaLongCount = {
    baktun,
    katun,
    tun,
    uinal,
    kin,
    fullString: fullLongCount,
    lordOfNight: gIndex,
    calendarRound,
  };

  return {
    tzolkin,
    haab,
    longCount,
  };
}
