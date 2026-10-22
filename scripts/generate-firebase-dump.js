// Standalone Node script to export the complete 130-year database (1926-2056) to JSON
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Julian Day Number calculator
function getJulianDayNumber(year, month, day) {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

// Maya Long Count, Tzolk'in and Haab
const MAYA_GMT = 584283;
const TZOLKIN_SIGNS = [
  'Imix', 'Ik\'', 'Ak\'b\'al', 'K\'an', 'Chikchan',
  'Kimi', 'Manik\'', 'Lamat', 'Muluk', 'Ok',
  'Chuwen', 'Eb\'', 'B\'en', 'Ix', 'Men',
  'Kib\'', 'Kab\'an', 'Etz\'nab\'', 'Kawak', 'Ajaw'
];
const HAAB_MONTHS = [
  'Pop', 'Wo', 'Sip', 'Sotz\'', 'Sek', 'Xul',
  'Yaxk\'in', 'Mol', 'Ch\'en', 'Yax', 'Zac', 'Ceh',
  'Mac', 'K\'ank\'in', 'Muan', 'Pax', 'K\'ayab', 'Kumk\'u', 'Wayeb\''
];

function getMaya(jdn) {
  const days = jdn - MAYA_GMT;
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

  const tzolkinNum = ((days + 3) % 13 + 13) % 13 + 1;
  const tzolkinSign = TZOLKIN_SIGNS[((days + 19) % 20 + 20) % 20];

  const haabDayIndex = ((days + 348) % 365 + 365) % 365;
  let haabM = haabDayIndex < 360 ? Math.floor(haabDayIndex / 20) : 18;
  let haabD = haabDayIndex < 360 ? haabDayIndex % 20 : haabDayIndex - 360;

  return {
    longCount: `${baktun}.${katun}.${tun}.${uinal}.${kin}`,
    tzolkin: `${tzolkinNum} ${tzolkinSign}`,
    haab: `${haabD} ${HAAB_MONTHS[haabM]}`,
  };
}

// Essene anchor
function getEsseneAnchor(y) {
  const m20 = new Date(y, 2, 20);
  const dow = m20.getDay();
  const add = (3 - dow + 7) % 7;
  return new Date(y, 2, 20 + add);
}

function getEssene(d) {
  let y = d.getFullYear();
  let anchor = getEsseneAnchor(y);
  if (d.getTime() < anchor.getTime()) {
    y -= 1;
    anchor = getEsseneAnchor(y);
  }
  const diff = Math.floor((d.getTime() - anchor.getTime()) / 86400000);
  const dayIdx = Math.min(363, Math.max(0, diff));
  const season = Math.floor(dayIdx / 91) + 1;
  const dayInSeason = dayIdx % 91;
  let mInSeason = dayInSeason < 30 ? 1 : dayInSeason < 60 ? 2 : 3;
  let dayInM = dayInSeason < 30 ? dayInSeason + 1 : dayInSeason < 60 ? dayInSeason - 30 + 1 : dayInSeason - 60 + 1;
  const m = (season - 1) * 3 + mInSeason;
  return { season, month: m, day: dayInM, isTekufah: dayInM === 31 };
}

// Generate dataset
console.log('Genereren van 130-jaar database (1926 - 2056)...');
const startYear = 1926;
const endYear = 2056;
const events = [];

for (let y = startYear; y <= endYear; y++) {
  // Key festival dates
  const milestones = [
    { date: `${y}-01-01`, title: 'Nieuwjaar / Beth Boommaand' },
    { date: `${y}-02-01`, title: 'Imbolc (Keltisch Vuurfeest)' },
    { date: `${y}-03-20`, title: 'Lente-equinox & Ostara' },
    { date: `${y}-04-30`, title: 'Beltane (Keltisch Meifeest)' },
    { date: `${y}-06-21`, title: 'Zomerzonnewende & Litha' },
    { date: `${y}-08-01`, title: 'Lughnasadh (Oogstfeest)' },
    { date: `${y}-09-22`, title: 'Herfst-equinox & Mabon' },
    { date: `${y}-10-31`, title: 'Samhain (Keltisch Nieuwjaar)' },
    { date: `${y}-12-21`, title: 'Winterzonnewende & Yule' },
    { date: `${y}-12-23`, title: 'Keltische Naamloze Dag (Maretak)' },
  ];

  milestones.forEach((m) => {
    const [year, month, day] = m.date.split('-').map(Number);
    const jdn = getJulianDayNumber(year, month, day);
    const maya = getMaya(jdn);
    const ess = getEssene(new Date(year, month - 1, day));

    events.push({
      date: m.date,
      title: m.title,
      mayaLongCount: maya.longCount,
      mayaTzolkin: maya.tzolkin,
      mayaHaab: maya.haab,
      esseneMonth: ess.month,
      esseneDay: ess.day,
      esseneTekufah: ess.isTekufah,
    });
  });
}

const payload = {
  metadata: {
    title: 'Universele Kalender Firebase Database Dump',
    range: `${startYear} - ${endYear}`,
    totalYears: endYear - startYear + 1,
    totalKeyEvents: events.length,
    generatedAt: new Date().toISOString(),
  },
  events,
};

const outputPath = path.resolve(__dirname, '../public/firebase-database-export-1926-2056.json');
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
console.log(`Database succesvol geëxporteerd naar: ${outputPath}`);
console.log(`Totaal aantal gebeurtenissen: ${events.length}`);
