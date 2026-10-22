// Celtic Calendar Engine: Wheel of the Year (8 Sabbats) & 13 Ogham Tree Months
import { CelticCalendarData, CelticTreeMonth } from '../types/calendar';

export interface TreeDefinition {
  monthNumber: number;
  name: string;
  treeDutch: string;
  oghamLetter: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  description: string;
}

export const CELTIC_TREES: TreeDefinition[] = [
  {
    monthNumber: 1,
    name: 'Beth',
    treeDutch: 'Berk (Birch)',
    oghamLetter: 'ᚁ',
    startMonth: 12,
    startDay: 24,
    endMonth: 1,
    endDay: 20,
    description: 'Nieuw begin, zuivering, geboorte en vernieuwde energie.',
  },
  {
    monthNumber: 2,
    name: 'Luis',
    treeDutch: 'Lijsterbes (Rowan)',
    oghamLetter: 'ᚂ',
    startMonth: 1,
    startDay: 21,
    endMonth: 2,
    endDay: 17,
    description: 'Bescherming, visie, magische kracht en bescherming tegen onheil.',
  },
  {
    monthNumber: 3,
    name: 'Nion',
    treeDutch: 'Es (Ash)',
    oghamLetter: 'ᚅ',
    startMonth: 2,
    startDay: 18,
    endMonth: 3,
    endDay: 17,
    description: 'Verbinding tussen hemel en aarde, kosmische levensboom, wijsheid.',
  },
  {
    monthNumber: 4,
    name: 'Fearn',
    treeDutch: 'Els (Alder)',
    oghamLetter: 'ᚃ',
    startMonth: 3,
    startDay: 18,
    endMonth: 4,
    endDay: 14,
    description: 'Moed, leiderschap, innerlijke kracht en vlam van inspiratie.',
  },
  {
    monthNumber: 5,
    name: 'Saille',
    treeDutch: 'Wilg (Willow)',
    oghamLetter: 'ᚄ',
    startMonth: 4,
    startDay: 15,
    endMonth: 5,
    endDay: 12,
    description: 'Vrouwelijke intuïtie, dromen, vloeibaarheid en diepe emoties.',
  },
  {
    monthNumber: 6,
    name: 'Uath',
    treeDutch: 'Meidoorn (Hawthorn)',
    oghamLetter: 'ᚆ',
    startMonth: 5,
    startDay: 13,
    endMonth: 6,
    endDay: 9,
    description: 'Poort naar het Andere Rijk, reiniging, bescherming en hartkracht.',
  },
  {
    monthNumber: 7,
    name: 'Duir',
    treeDutch: 'Eik (Oak)',
    oghamLetter: 'ᚇ',
    startMonth: 6,
    startDay: 10,
    endMonth: 7,
    endDay: 7,
    description: 'Soevereiniteit, uithoudingsvermogen, wijsheid, stabiliteit en moed.',
  },
  {
    monthNumber: 8,
    name: 'Tinne',
    treeDutch: 'Hulst (Holly)',
    oghamLetter: 'ᚈ',
    startMonth: 7,
    startDay: 8,
    endMonth: 8,
    endDay: 4,
    description: 'Bescherming in de schaduw, volharding, loyaliteit en rechtvaardigheid.',
  },
  {
    monthNumber: 9,
    name: 'Coll',
    treeDutch: 'Hazelaar (Hazel)',
    oghamLetter: 'ᚉ',
    startMonth: 8,
    startDay: 5,
    endMonth: 9,
    endDay: 1,
    description: 'Kennis van de zalm der wijsheid, poëzie, waarzeggerij en creativiteit.',
  },
  {
    monthNumber: 10,
    name: 'Muin',
    treeDutch: 'Wijnstok (Vine)',
    oghamLetter: 'ᚋ',
    startMonth: 9,
    startDay: 2,
    endMonth: 9,
    endDay: 29,
    description: 'Oogst van de ziel, extase, waarheid, loslaten en profetische visie.',
  },
  {
    monthNumber: 11,
    name: 'Gort',
    treeDutch: 'Klimop (Ivy)',
    oghamLetter: 'ᚌ',
    startMonth: 9,
    startDay: 30,
    endMonth: 10,
    endDay: 27,
    description: 'Veerkracht, overleven in tegenspoed, doorzettingsvermogen en trouw.',
  },
  {
    monthNumber: 12,
    name: 'Ngetal',
    treeDutch: 'Riet (Reed)',
    oghamLetter: 'ᚍ',
    startMonth: 10,
    startDay: 28,
    endMonth: 11,
    endDay: 24,
    description: 'Directe handeling, diepe worteling, eenheid en zuivere intentie.',
  },
  {
    monthNumber: 13,
    name: 'Ruis',
    treeDutch: 'Vlier (Elder)',
    oghamLetter: 'ᚎ',
    startMonth: 11,
    startDay: 25,
    endMonth: 12,
    endDay: 22,
    description: 'Voltooiing, dood en wedergeboorte, transformatie en magische doorgang.',
  },
];

/**
 * Calculates Celtic Tree Month and Wheel of the Year Sabbat for any date
 */
export function calculateCelticCalendar(date: Date): CelticCalendarData {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // 1. Check for the Nameless Day (23 December)
  const isNamelessDay = month === 12 && day === 23;

  let tree: CelticTreeMonth;

  if (isNamelessDay) {
    tree = {
      name: 'Naamloze Dag',
      treeDutch: 'Maretak (Dag van het Geheim)',
      oghamLetter: 'ᚙ',
      description: 'De dag buiten de tijd, gewijd aan de Maretak. Scharnierpunt tussen dood en wedergeboorte.',
      monthNumber: 0,
      dayOfMonth: 1,
    };
  } else {
    // Find matching tree month
    let matchedDef = CELTIC_TREES.find((t) => {
      if (t.startMonth === t.endMonth) {
        return month === t.startMonth && day >= t.startDay && day <= t.endDay;
      } else if (t.startMonth > t.endMonth) {
        // Wraps over New Year (Beth: 24 Dec - 20 Jan)
        return (month === t.startMonth && day >= t.startDay) || (month === t.endMonth && day <= t.endDay);
      } else {
        return (
          (month === t.startMonth && day >= t.startDay) ||
          (month === t.endMonth && day <= t.endDay)
        );
      }
    });

    if (!matchedDef) {
      matchedDef = CELTIC_TREES[0]; // fallback
    }

    // Calculate approximate day in tree month (1 to 28)
    let dayInTree = 1;
    if (month === matchedDef.startMonth) {
      dayInTree = day - matchedDef.startDay + 1;
    } else {
      // Day carried from previous month part
      const daysInPrev = matchedDef.startMonth === 12 ? 31 - matchedDef.startDay + 1 : 28;
      dayInTree = Math.min(28, daysInPrev + day);
    }
    if (dayInTree < 1) dayInTree = 1;
    if (dayInTree > 28) dayInTree = 28;

    tree = {
      name: matchedDef.name,
      treeDutch: matchedDef.treeDutch,
      oghamLetter: matchedDef.oghamLetter,
      description: matchedDef.description,
      monthNumber: matchedDef.monthNumber,
      dayOfMonth: dayInTree,
    };
  }

  // 2. Wheel of the Year (8 Sabbats)
  let sabbat: CelticCalendarData['sabbat'] | undefined;

  if (month === 10 && (day === 31 || day === 1)) {
    sabbat = {
      name: 'Samhain',
      type: 'groot_vuurfeest',
      descriptionDutch: 'Keltisch Nieuwjaar. Begin van de donkere helft van het jaar. Eerbetoon aan voorouders en de sluier tussen werelden.',
      isExactDay: day === 31 || day === 1,
    };
  } else if (month === 12 && (day === 21 || day === 22)) {
    sabbat = {
      name: 'Yule / Winterzonnewende',
      type: 'zonnewende',
      descriptionDutch: 'Wedergeboorte van het licht. De Eikkoning overwint de Hulstkoning. Langste nacht van het jaar.',
      isExactDay: true,
    };
  } else if (month === 2 && (day === 1 || day === 2)) {
    sabbat = {
      name: 'Imbolc (Sint Brigid)',
      type: 'groot_vuurfeest',
      descriptionDutch: 'Het eerste ontwaken van het land en het zaad in de aarde. Zuivering, inspiratie en melk van de ooien.',
      isExactDay: true,
    };
  } else if (month === 3 && (day === 20 || day === 21)) {
    sabbat = {
      name: 'Ostara / Lente-equinox',
      type: 'equinox',
      descriptionDutch: 'Volmaakt evenwicht tussen dag en nacht. Het ontluiken van nieuw leven, vogelzang en vruchtbaarheid.',
      isExactDay: true,
    };
  } else if ((month === 4 && day === 30) || (month === 5 && day === 1)) {
    sabbat = {
      name: 'Beltane',
      type: 'groot_vuurfeest',
      descriptionDutch: 'Begin van de lichte helft van het jaar. Groot vruchtbaarheidsfeest, meibomen en vreugdevuren van vuurgod Belenus.',
      isExactDay: true,
    };
  } else if (month === 6 && (day === 21 || day === 22)) {
    sabbat = {
      name: 'Litha / Zomerzonnewende',
      type: 'zonnewende',
      descriptionDutch: 'Hoogste stand van de zon. Triomf van het licht, waarna de Hulstkoning zachtjes de scepter overneemt.',
      isExactDay: true,
    };
  } else if (month === 8 && (day === 1 || day === 2)) {
    sabbat = {
      name: 'Lughnasadh / Lammas',
      type: 'groot_vuurfeest',
      descriptionDutch: 'Eerste graanoogst. Feest ter ere van de zonnegod Lugh en zijn pleegmoeder Tailtiu.',
      isExactDay: true,
    };
  } else if (month === 9 && (day === 22 || day === 23)) {
    sabbat = {
      name: 'Mabon / Herfst-equinox',
      type: 'equinox',
      descriptionDutch: 'Tweede oogst. Dankbaarheid voor de gaven van de aarde en voorbereiding op de naderende winterstilte.',
      isExactDay: true,
    };
  }

  // 3. Celtic Half of the Year: Donker (Samhain tot Beltane) vs Licht (Beltane tot Samhain)
  const isDarkHalf =
    (month === 11 || month === 12 || month === 1 || month === 2 || month === 3 || month === 4) ||
    (month === 10 && day >= 31);

  return {
    tree,
    sabbat,
    isNamelessDay,
    seasonHalf: isDarkHalf ? 'donker' : 'licht',
  };
}
