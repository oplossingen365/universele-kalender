// Astronomical Engine: Moon phases, Zodiac, Solstices, Equinoxes, Meteor Showers
import { MoonPhaseInfo, AstroEvent } from '../types/calendar';

/**
 * Calculates Julian Day Number (JDN) for a given Gregorian date
 */
export function getJulianDayNumber(year: number, month: number, day: number): number {
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

/**
 * Calculates exact moon phase, illumination fraction, age in days, and zodiac sign
 */
export function calculateMoonPhase(date: Date): MoonPhaseInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jdn = getJulianDayNumber(year, month, day);

  // Known New Moon reference point: Jan 6, 2000 at 18:14 UTC (JDN 2451549.26)
  const synodicMonth = 29.530588853;
  const daysSinceRef = jdn - 2451549.5;
  const newMoons = daysSinceRef / synodicMonth;
  const cycleFraction = newMoons - Math.floor(newMoons);
  const ageDays = cycleFraction * synodicMonth;
  const phaseAngle = cycleFraction * 360; // 0 to 360 degrees

  // Illumination fraction (1 - cos(angle)) / 2
  const rad = (phaseAngle * Math.PI) / 180;
  const fraction = Math.round(((1 - Math.cos(rad)) / 2) * 100) / 100;

  // Determine Moon phase name
  let phase: MoonPhaseInfo['phase'];
  let phaseNameDutch: string;
  let isMajorPhase = false;

  // Tolerate ~1.2 days around exact quarter points for major phase highlight
  if (ageDays < 1.4 || ageDays >= 28.1) {
    phase = 'new_moon';
    phaseNameDutch = 'Nieuwe Maan';
    isMajorPhase = true;
  } else if (ageDays < 6.0) {
    phase = 'waxing_crescent';
    phaseNameDutch = 'Wassende Sikkel';
  } else if (ageDays < 8.8) {
    phase = 'first_quarter';
    phaseNameDutch = 'Eerste Kwartier';
    isMajorPhase = true;
  } else if (ageDays < 13.4) {
    phase = 'waxing_gibbous';
    phaseNameDutch = 'Wassende Maan';
  } else if (ageDays < 16.1) {
    phase = 'full_moon';
    phaseNameDutch = 'Volle Maan';
    isMajorPhase = true;
  } else if (ageDays < 20.7) {
    phase = 'waning_gibbous';
    phaseNameDutch = 'Afnemende Maan';
  } else if (ageDays < 23.5) {
    phase = 'last_quarter';
    phaseNameDutch = 'Laatste Kwartier';
    isMajorPhase = true;
  } else {
    phase = 'waning_crescent';
    phaseNameDutch = 'Afnemende Sikkel';
  }

  // Traditional Full Moon names
  const traditionalNames: { [m: number]: string } = {
    1: 'Wolfsmaan',
    2: 'Sneeuwmaan',
    3: 'Wormmaan',
    4: 'Roze Maan',
    5: 'Bloemmaan',
    6: 'Aardbeienmaan',
    7: 'Bokmaan',
    8: 'Steurmaan',
    9: 'Oogstmaan',
    10: 'Jagersmaan',
    11: 'Bevermaan',
    12: 'Koude Maan',
  };

  const traditionalName = phase === 'full_moon' ? traditionalNames[month] : undefined;

  // Approximate Zodiac sign of the moon
  // The Moon completes an orbit through the 12 signs in ~27.3216 days (sidereal month)
  // Ref date Jan 1, 2000 at JDN 2451545.0, Moon was in Scorpio (~225°)
  const siderealMonth = 27.321582;
  const moonLongitude = ((jdn - 2451545.0) / siderealMonth) * 360 + 225;
  const normalizedLong = ((moonLongitude % 360) + 360) % 360;
  const zodiacSigns = [
    'Ram (Aries) ♈',
    'Stier (Taurus) ♉',
    'Tweelingen (Gemini) ♊',
    'Kreeft (Cancer) ♋',
    'Leeuw (Leo) ♌',
    'Maagd (Virgo) ♍',
    'Weegschaal (Libra) ♎',
    'Schorpioen (Scorpio) ♏',
    'Boogschutter (Sagittarius) ♐',
    'Steenbok (Capricorn) ♑',
    'Waterman (Aquarius) ♒',
    'Vissen (Pisces) ♓',
  ];
  const signIndex = Math.floor(normalizedLong / 30) % 12;
  const moonSign = zodiacSigns[signIndex];

  return {
    phase,
    phaseNameDutch,
    fraction,
    phaseAngle: Math.round(phaseAngle * 10) / 10,
    ageDays: Math.round(ageDays * 10) / 10,
    isMajorPhase,
    traditionalName,
    moonSign,
  };
}

/**
 * Returns astronomical events occurring on a specific date (Equinoxes, Solstices, Meteor Showers, Major Moon Phases)
 */
export function getAstronomicalEvents(date: Date, moon: MoonPhaseInfo): AstroEvent[] {
  const events: AstroEvent[] = [];
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 1. Major Moon phase events
  if (moon.isMajorPhase) {
    if (moon.phase === 'full_moon') {
      events.push({
        title: `Volle Maan (${moon.traditionalName || 'Maan'})`,
        type: 'moon_phase',
        description: `100% verlicht. Traditie: ${moon.traditionalName || 'Volle Maan'}. Maan staat in ${moon.moonSign}.`,
      });
    } else if (moon.phase === 'new_moon') {
      events.push({
        title: 'Nieuwe Maan',
        type: 'moon_phase',
        description: `Maan begint een nieuwe synodische cyclus. Tijd voor intenties en nieuw begin.`,
      });
    } else if (moon.phase === 'first_quarter') {
      events.push({
        title: 'Eerste Kwartier (50%)',
        type: 'moon_phase',
        description: `Wassende halve maan. Fase van actie, groei en besluitvorming.`,
      });
    } else if (moon.phase === 'last_quarter') {
      events.push({
        title: 'Laatste Kwartier (50%)',
        type: 'moon_phase',
        description: `Afnemende halve maan. Fase van integratie, reflectie en afronding.`,
      });
    }
  }

  // 2. Solstices & Equinoxes
  if (month === 3 && (day === 20 || day === 21)) {
    events.push({
      title: 'Astronomische Lente-equinox',
      type: 'equinox',
      description: 'Het astronomische begin van de lente. Dag en nacht zijn overal ter aarde even lang.',
    });
  } else if (month === 6 && (day === 20 || day === 21)) {
    events.push({
      title: 'Astronomische Zomerzonnewende',
      type: 'solstice',
      description: 'Langste dag van het jaar op het noordelijk halfrond. Zon bereikt hoogste stand.',
    });
  } else if (month === 9 && (day === 22 || day === 23)) {
    events.push({
      title: 'Astronomische Herfst-equinox',
      type: 'equinox',
      description: 'Het astronomische begin van de herfst. Dag en nacht zijn in volmaakt evenwicht.',
    });
  } else if (month === 12 && (day === 21 || day === 22)) {
    events.push({
      title: 'Astronomische Winterzonnewende',
      type: 'solstice',
      description: 'Kortste dag en langste nacht van het jaar. Terugkeer van het zonlicht.',
    });
  }

  // 3. Prominent annual meteor showers
  if (month === 1 && day === 3) {
    events.push({
      title: 'Meteorenzwerm Quadrantiden (Piek)',
      type: 'meteor_shower',
      description: 'Intense meteorenzwerm met tot 120 vallende sterren per uur.',
    });
  } else if (month === 4 && day === 22) {
    events.push({
      title: 'Meteorenzwerm Lyriden (Piek)',
      type: 'meteor_shower',
      description: 'Een van de oudst bekende meteorenzwermen, met heldere vuurbollen.',
    });
  } else if (month === 5 && day === 6) {
    events.push({
      title: 'Meteorenzwerm Eta Aquariïden (Piek)',
      type: 'meteor_shower',
      description: 'Meteorenzwerm afkomstig van komeet Halley.',
    });
  } else if (month === 8 && (day === 12 || day === 13)) {
    events.push({
      title: 'Meteorenzwerm Perseïden (Piek)',
      type: 'meteor_shower',
      description: 'De beroemde "Tranen van Laurentius", met tientallen heldere meteoren per uur.',
    });
  } else if (month === 10 && day === 21) {
    events.push({
      title: 'Meteorenzwerm Orioniden (Piek)',
      type: 'meteor_shower',
      description: 'Snelle meteoren afkomstig van de stofdeeltjes van komeet Halley.',
    });
  } else if (month === 11 && day === 17) {
    events.push({
      title: 'Meteorenzwerm Leoniden (Piek)',
      type: 'meteor_shower',
      description: 'Beroemd om spectaculaire meteorenstormen om de ~33 jaar.',
    });
  } else if (month === 12 && (day === 13 || day === 14)) {
    events.push({
      title: 'Meteorenzwerm Geminiden (Piek)',
      type: 'meteor_shower',
      description: 'Koning der meteorenzwermen: tot 150 heldere, veelkleurige vallende sterren per uur.',
    });
  }

  return events;
}
