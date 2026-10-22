# Universele Kalender 🌌
> **Harmonie tussen 6 Tijdsdimensies (1926 — 2056)**

Een geavanceerde, esthetische en wiskundig precieze webapplicatie die 6 verschillende kalendersystemen gelijktijdig synchroniseert, visualiseert en integreert met **Firebase Firestore**.

---

## 📅 De 6 Geïntegreerde Kalendersystemen

1. **Onze Standaard Burgerkalender (Gregoriaans)**
   - Volledige Gregoriaanse tijdrekening met schrikkeljaren en feestdagen.
   - Computus-algoritme voor verplaatsbare christelijke feestdagen (Pasen, Pinksteren, Hemelvaart).
   - Standaard maandweergave met **6 weken (42 dagen)**.

2. **Historische Kalender van de Essenen (364 Dagen / Dode Zeerollen)**
   - Gebaseerd op de teksten van Qumran, het Boek der Jubileeën en 1 Henoch.
   - Precies **364 dagen** = **52 volle weken** (begint op woensdag, de 4e scheppingsdag waarop zon, maan en sterren werden geschapen).
   - 4 seizoenen van precies 91 dagen (30 + 30 + 31 dagen). De 31e dag is de *Tekufah* (seizoensgedenkdag).
   - Feestdagen vallen elk jaar op exact dezelfde weekdag: Pascha (di-avond), Matzot (wo), Omer (zo), Wekenfeest / Tarwe (zo), Nieuwe Wijn (zo), Nieuwe Olie (zo), Houtofferfeest, Yom Teruah (wo), Yom Kippur (vr), Sukkot (wo).

3. **Maya Tzolk'in Heilige Kalender (260 Dagen)**
   - 20 Heilige Zonnetekens (Imix t/m Ajaw) × 13 Scheppingstonen.
   - Berekening via de archeologische **Goodman-Martínez-Thompson (GMT 584283)** correlatie.
   - Weergave van Trezena-golven (13-daagse periodes) en de Heer van de Nacht ($G_1 - G_9$).

4. **Maya Haab' Zonnecyclus (365 Dagen)**
   - 18 maanden (uinals) van 20 dagen (Pop t/m Kumk'u) = 360 dagen.
   - 5 heilige overgangsdagen (**Wayeb'**).
   - Dag 0 is de "Zetel van de maand" (*Chum*).
   - Kalenderwiel (*Calendar Round*) van 52 Haab-jaren (18.980 dagen).

5. **Keltische Kalender & Het Wiel van het Jaar**
   - **8 Sabbats**: Samhain (Nieuwjaar), Yule (Winterzonnewende), Imbolc (Sint-Brigid), Ostara (Lente-equinox), Beltane (Meifeest), Litha (Zomerzonnewende), Lughnasadh (Oogstfeest), Mabon (Herfst-equinox).
   - **13 Ogham Boommaanden** van elk 28 dagen (Beth, Luis, Nion, Fearn, Saille, Uath, Duir, Tinne, Coll, Muin, Gort, Ngetal, Ruis).
   - **De Naamloze Dag / Dag van het Geheim**: 23 december (gewijd aan de Maretak).
   - Cyclus van de Donkere Helft (*Samonios*) en Lichte Helft (*Giamonios*).

6. **Astronomische Kalender & Kosmische Cycli**
   - Exacte maanfase (Nieuwe Maan, Wassende Sikkel, Eerste Kwartier, Wassende Maan, Volle Maan, Afnemende Maan, Laatste Kwartier, Afnemende Sikkel).
   - Percentage verlichting (0% - 100%) en maanleeftijd in dagen (0.0 - 29.53d).
   - Astrologisch dierenriemteken van de maan (Ram t/m Vissen).
   - Traditionele volle maannamen (Wolfsmaan, Wormmaan, Oogstmaan, etc.).
   - Jaarlijkse pieken van meteorenzwermen (Quadrantiden, Perseïden, Geminiden, etc.) en astronomische equinoxen/solstitia.

---

## 🚀 Weergaven (Views)

- **Standaard Maand View (6 Weken)**: 42-cel raster (7 kolommen × 6 rijen) zodat elke maand perfect past ongeacht de begindag. Bevat visuele badges voor de andere kalenders en filterbare event-pills.
- **Week View**: Horizontale / verticale vergelijking van 7 dagen waarin alle 6 kalenderdimensies naast elkaar staan.
- **Jaar View**: Overzicht van alle 12 maanden met activiteitsindicatoren en grote jaarovergangen.
- **View op basis van de Essenen Kalender**: Volledig gestructureerd volgens de 4 kwartalen (Tekufot), 12 maanden en vaste scheppingsdagen.
- **View op basis van de Maya & Haab Kalender**: Blader door de 18 Haab maanden en de 5 dagen van Wayeb' gekoppeld aan de Tzolk'in tekens.
- **View op basis van de Keltische Kalender**: Het Wiel van het Jaar en de 13 Ogham boommaanden.
- **Astronomische View**: Overzicht van alle lunaties (Nieuwe & Volle Manen), meteorenzwermen en hemelverschijnselen.

---

## ☁️ Firebase Firestore Integratie & 130 Jaar Export

De app bestrijkt **100 jaar in het verleden tot 30 jaar in de toekomst (1926 — 2056)**:
- **Cloud Firestore Synchronisatie**: Klik in de app op de knop **Firebase DB** om uw eigen Firebase project te koppelen en met één klik alle definities, fasenamen en events gebatcht te uploaden.
- **Offline JSON Database Export**: Klik op **"Download JSON"** of voer het onderstaande commando uit in uw terminal:
  ```bash
  npm run export-db
  ```
  Dit genereert direct het bestand: `public/firebase-database-export-1926-2056.json`.
- **Persoonlijke Notities**: Klik op een willekeurige dag om een notitie of intentie op te slaan. Deze wordt direct bewaard in LocalStorage en gesynchroniseerd met Firestore!

---

## 🛠️ Lokale Ontwikkeling

```bash
# Dependencies installeren
npm install

# Lokale server starten
npm run dev

# Productie build genereren
npm run build
```
