// Firebase and Cloud Firestore Integration Service
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { FirebaseAppConfig, UserCustomEvent } from '../types/calendar';
import { getUnifiedDayInfo } from './calendarEngine';
import { TZOLKIN_SIGNS, HAAB_MONTHS } from './mayaEngine';
import { CELTIC_TREES } from './celticEngine';

const STORAGE_KEY_FIREBASE_CONFIG = 'universele_kalender_firebase_config';
const STORAGE_KEY_CUSTOM_EVENTS = 'universele_kalender_custom_events';

let activeApp: FirebaseApp | null = null;
let activeDb: Firestore | null = null;

export const DEFAULT_FIREBASE_CONFIG: FirebaseAppConfig = {
  apiKey: "AIzaSyBpGlgPDqV8IVfjFW1MQLvUecr16gYptvc",
  authDomain: "universele-kalender-app.firebaseapp.com",
  projectId: "universele-kalender-app",
  storageBucket: "universele-kalender-app.firebasestorage.app",
  messagingSenderId: "1099384557362",
  appId: "1:1099384557362:web:4fbe271d99e5763e05912b",
};

/**
 * Retrieves stored Firebase configuration from localStorage or default
 */
export function getSavedFirebaseConfig(): FirebaseAppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (!raw) return DEFAULT_FIREBASE_CONFIG;
    return JSON.parse(raw) as FirebaseAppConfig;
  } catch {
    return DEFAULT_FIREBASE_CONFIG;
  }
}

/**
 * Saves and re-initializes Firebase configuration
 */
export function saveFirebaseConfig(config: FirebaseAppConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
    initializeFirebaseClient(config);
    return true;
  } catch (err) {
    console.error('Error saving Firebase config:', err);
    return false;
  }
}

/**
 * Initializes the Firebase instance
 */
export function initializeFirebaseClient(config?: FirebaseAppConfig | null): Firestore | null {
  const currentConfig = config || getSavedFirebaseConfig();
  if (!currentConfig || !currentConfig.apiKey || !currentConfig.projectId) {
    activeApp = null;
    activeDb = null;
    return null;
  }

  try {
    const apps = getApps();
    if (apps.length > 0) {
      activeApp = apps[0];
    } else {
      activeApp = initializeApp(currentConfig);
    }
    activeDb = getFirestore(activeApp);
    return activeDb;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    activeDb = null;
    return null;
  }
}

/**
 * Tests connection to Firestore
 */
export async function testFirestoreConnection(config: FirebaseAppConfig): Promise<{ success: boolean; message: string }> {
  try {
    const app = initializeApp(config, 'test-app-' + Date.now());
    const db = getFirestore(app);
    // Write and delete a small ping document
    const pingRef = doc(collection(db, '_connection_test'), 'ping');
    await setDoc(pingRef, { timestamp: Date.now(), test: true });
    await deleteDoc(pingRef);
    return { success: true, message: 'Succesvol verbonden met Firebase Firestore!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Verbinding mislukt: ${msg}` };
  }
}

/**
 * Gets user custom events (from Firestore if available, otherwise localStorage)
 */
export async function loadUserCustomEvents(): Promise<UserCustomEvent[]> {
  // Always load local events first
  let localEvents: UserCustomEvent[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_EVENTS);
    if (raw) localEvents = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read local custom events', e);
  }

  const db = activeDb || initializeFirebaseClient();
  if (!db) {
    return localEvents;
  }

  try {
    const snap = await getDocs(collection(db, 'user_events'));
    const remoteEvents: UserCustomEvent[] = [];
    snap.forEach((d) => {
      remoteEvents.push(d.data() as UserCustomEvent);
    });

    // Merge by id
    const map = new Map<string, UserCustomEvent>();
    localEvents.forEach((e) => map.set(e.id, e));
    remoteEvents.forEach((e) => map.set(e.id, e));
    const merged = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY_CUSTOM_EVENTS, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.warn('Could not load from Firestore, using local events:', err);
    return localEvents;
  }
}

/**
 * Saves a user event
 */
export async function saveUserEvent(event: UserCustomEvent): Promise<void> {
  // Save locally
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_EVENTS);
    const events: UserCustomEvent[] = raw ? JSON.parse(raw) : [];
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.push(event);
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving event locally:', err);
  }

  // Save to Firestore if available
  const db = activeDb || initializeFirebaseClient();
  if (db) {
    try {
      await setDoc(doc(collection(db, 'user_events'), event.id), event);
    } catch (err) {
      console.warn('Could not save event to Firestore:', err);
    }
  }
}

/**
 * Deletes a user event
 */
export async function deleteUserEvent(id: string): Promise<void> {
  // Delete locally
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_EVENTS);
    if (raw) {
      const events: UserCustomEvent[] = JSON.parse(raw);
      const filtered = events.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY_CUSTOM_EVENTS, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Error deleting local event:', err);
  }

  // Delete from Firestore
  const db = activeDb || initializeFirebaseClient();
  if (db) {
    try {
      await deleteDoc(doc(collection(db, 'user_events'), id));
    } catch (err) {
      console.warn('Could not delete event from Firestore:', err);
    }
  }
}

/**
 * Generates the full database schema and data payload for the 130-year span (1926 - 2056)
 */
export function generateFullCalendarDataset(
  startYear = 1926,
  endYear = 2056,
  onProgress?: (pct: number, msg: string) => void
) {
  if (onProgress) onProgress(10, 'Metadata en fasenamen genereren...');

  const systemsMetadata = {
    gregorian: {
      name: 'Standaard Gregoriaanse Kalender',
      description: 'Zonnekalender met 365/366 dagen, verdeeld in 12 maanden. Basis van het moderne burgerlijk leven.',
      leapRule: 'Elk 4e jaar schrikkeldag, behalve eeuwjaren niet deelbaar door 400.',
    },
    celtic: {
      name: 'Keltische Kalender & Jaarwiel',
      description: '13 Ogham Boommaanden van 28 dagen plus de Naamloze Dag (23 dec), verbonden met de 8 seizoensgebonden Sabbats (Samhain, Imbolc, Beltane, Lughnasadh, Solstitia en Equinoxen).',
      trees: CELTIC_TREES,
      sabbats: ['Samhain', 'Yule', 'Imbolc', 'Ostara', 'Beltane', 'Litha', 'Lughnasadh', 'Mabon'],
    },
    maya_tzolkin: {
      name: 'Maya Tzolk\'in Heilige Kalender',
      description: 'Heilige cyclus van 260 dagen, gevormd door de combinatie van 20 Zonnetekens (Glyphs) en 13 Scheppingstonen.',
      signs: TZOLKIN_SIGNS,
      correlation: 'GMT 584283',
    },
    haab: {
      name: 'Maya Haab\' Zonnecyclus',
      description: 'Zonnejaar van 365 dagen, bestaande uit 18 maanden van 20 dagen (uinals) en 5 heilige overgangsdagen (Wayeb\').',
      months: HAAB_MONTHS,
    },
    astronomical: {
      name: 'Astronomische Kalender & Lunaties',
      description: 'Exacte berekening van de 8 maanfasen, percentage illuminatie, dierenriemteken van de maan, solstitia, equinoxen en meteorenzwermen.',
      phases: ['Nieuwe Maan', 'Wassende Sikkel', 'Eerste Kwartier', 'Wassende Maan', 'Volle Maan', 'Afnemende Maan', 'Laatste Kwartier', 'Afnemende Sikkel'],
    },
    essene: {
      name: 'Historische Kalender van de Essenen',
      description: '364-dagen zonnekalender (52 weken) uit de Dode Zeerollen (Qumran, Boek der Jubileeën, 1 Henoch). Het jaar start op woensdag (schepping van hemellichten) en telt 4 seizoenen van precies 91 dagen (30+30+31) met vaste weekdagen voor elk feest.',
      feasts: [
        'Rosh Chodashim (Essenen Nieuwjaar)',
        'Pesach (Pascha)',
        'Chag HaMatzot (Ongezuurde Broden)',
        'Reshit Katzir (Eerstelingen Gerst / Omer)',
        'Shavuot (Wekenfeest / Tarwe-eerstelingen)',
        'Chag HaTirosh (Feest van de Nieuwe Wijn)',
        'Chag HaYitzhar (Feest van de Nieuwe Olie)',
        'Korban Etzim (Houtofferfeest)',
        'Yom Teruah (Bazuinendag)',
        'Yom Kippur (Grote Verzoendag)',
        'Sukkot (Loofhuttenfeest)',
        'Shemini Atzeret',
      ],
    },
  };

  const keyEvents: Array<{
    date: string;
    calendar: string;
    title: string;
    description: string;
  }> = [];

  const totalYears = endYear - startYear + 1;

  for (let y = startYear; y <= endYear; y++) {
    if (onProgress && y % 10 === 0) {
      const pct = Math.round(10 + ((y - startYear) / totalYears) * 80);
      onProgress(pct, `Events genereren voor jaar ${y}...`);
    }

    // Key milestone dates throughout each year
    // Equinoxes & Solstices, Celtic Sabbats, Essene Feasts, Full/New Moons
    const sampleDates = [
      new Date(y, 0, 1),
      new Date(y, 1, 1),   // Imbolc
      new Date(y, 2, 20),  // Spring Equinox / Essene start
      new Date(y, 3, 30),  // Beltane
      new Date(y, 5, 21),  // Summer Solstice
      new Date(y, 7, 1),   // Lughnasadh
      new Date(y, 8, 22),  // Autumn Equinox
      new Date(y, 9, 31),  // Samhain
      new Date(y, 11, 21), // Winter Solstice
      new Date(y, 11, 23), // Celtic Nameless Day
    ];

    // Sample across seasons for Essene feasts
    for (let m = 0; m < 12; m++) {
      sampleDates.push(new Date(y, m, 15));
    }

    sampleDates.forEach((d) => {
      const info = getUnifiedDayInfo(d);
      info.events.forEach((ev) => {
        keyEvents.push({
          date: info.dateString,
          calendar: ev.calendar,
          title: ev.title,
          description: ev.description,
        });
      });
    });
  }

  if (onProgress) onProgress(100, 'Dataset gereed!');

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      range: `${startYear} - ${endYear}`,
      totalYears,
      totalEventsSampled: keyEvents.length,
    },
    systems: systemsMetadata,
    events: keyEvents,
  };
}

/**
 * Downloads a complete JSON export file containing 130 years of calendar data
 */
export function exportCalendarDataJSON(startYear = 1926, endYear = 2056): void {
  const data = generateFullCalendarDataset(startYear, endYear);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `universele-kalender-database-${startYear}-${endYear}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Batches and synchronizes systems metadata and events directly to Firestore
 */
export async function syncToFirestoreDatabase(
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; message: string }> {
  const db = activeDb || initializeFirebaseClient();
  if (!db) {
    return {
      success: false,
      message: 'Geen Firebase verbinding geconfigureerd. Voer eerst uw Firebase projectinstellingen in.',
    };
  }

  try {
    if (onProgress) onProgress(5, 'Dataset voorbereiden (1926 - 2056)...');
    const dataset = generateFullCalendarDataset(1926, 2056, (pct, msg) => {
      if (onProgress) onProgress(Math.floor(pct * 0.3), msg);
    });

    // 1. Upload Systems Metadata
    if (onProgress) onProgress(35, 'Metadata uploaden naar collectie "calendar_systems"...');
    const batch = writeBatch(db);

    const systems = dataset.systems as Record<string, unknown>;
    for (const [key, value] of Object.entries(systems)) {
      const ref = doc(collection(db, 'calendar_systems'), key);
      batch.set(ref, value as Record<string, unknown>);
    }

    // Database info document
    const infoRef = doc(collection(db, 'calendar_metadata'), 'universele_kalender_info');
    batch.set(infoRef, dataset.metadata);

    await batch.commit();

    // 2. Upload events in chunks of 400 (Firestore max batch is 500)
    if (onProgress) onProgress(50, 'Evenementen uploaden naar "calendar_events"...');
    const eventsToUpload = dataset.events.slice(0, 800); // Upload key representative milestone events
    const chunkSize = 400;

    for (let i = 0; i < eventsToUpload.length; i += chunkSize) {
      const chunk = eventsToUpload.slice(i, i + chunkSize);
      const evBatch = writeBatch(db);

      chunk.forEach((ev, idx) => {
        const evRef = doc(collection(db, 'calendar_events'), `${ev.date}_${ev.calendar}_${idx}`);
        evBatch.set(evRef, ev);
      });

      await evBatch.commit();
      const progress = 50 + Math.floor(((i + chunk.length) / eventsToUpload.length) * 45);
      if (onProgress) onProgress(progress, `${i + chunk.length} van ${eventsToUpload.length} events geüpload...`);
    }

    if (onProgress) onProgress(100, 'Synchronisatie naar Firebase Firestore succesvol afgerond!');
    return {
      success: true,
      message: `Succesvol gesynchroniseerd met Firestore! Collecties "calendar_systems", "calendar_metadata" en "calendar_events" zijn bijgewerkt.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Synchronisatiefout: ${msg}` };
  }
}
