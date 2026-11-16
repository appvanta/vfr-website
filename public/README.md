# Bilder-Ordner — public/

Hier liegen alle statischen Bilder der Website. In Next.js werden Dateien aus
`public/` automatisch unter `/` ausgeliefert, z. B. `public/team/lena.jpg` ist
im Browser unter `/team/lena.jpg` erreichbar.

## Ordner-Struktur

### `public/logos/`
Logos der Förderträger. **Bereits befüllt** — werden in
`components/Foerderung.tsx` automatisch angezeigt.

### `public/team/`
Portraits der Dozent:innen und des Verwaltungsteams.
**Empfohlene Dateinamen** (passend zur Komponente `app/team/page.tsx`):
- `geschaeftsfuehrung.jpg`
- `paedagogische-leitung.jpg`
- `dozent-recht.jpg`
- `dozent-paedagogik.jpg`
- `trainer-be.jpg`
- `trainer-ce.jpg`
- `trainer-a.jpg`
- `verwaltung.jpg`

**Format:** JPG, mind. 600 × 750 px (Hochformat 4:5), max. 1 MB pro Bild.

### `public/hero/`
Große Header-Bilder für Startseite und Unterseiten.
**Empfohlene Dateinamen:**
- `startseite.jpg` — Hauptbild der Startseite
- `ausbildung.jpg` — Fahrlehrerausbildung-Seite
- `fortbildung.jpg` — Fortbildungsseite
- `weiterbildung.jpg`
- `kontakt.jpg`
- `team.jpg`

**Format:** JPG, mind. 2000 × 1200 px (Querformat), max. 400 KB pro Bild
(komprimiert für schnellen Ladevorgang).

### `public/campus/`
Fotos der Räumlichkeiten (Schulungsräume, Smartboards, Aufenthaltsbereich,
Parkplatz).
**Dateinamen frei** — z. B. `schulungsraum-1.jpg`, `foyer.jpg`.

### `public/fahrzeuge/`
Ausbildungsfahrzeuge (PKW, Motorrad, LKW, Bus).
**Dateinamen frei** — z. B. `pkw.jpg`, `motorrad.jpg`, `lkw.jpg`, `bus.jpg`.

### `public/impressionen/`
Gallerie-Bilder für die Impressionen-Seite.
**Dateinamen frei** — z. B. `impression-01.jpg`, `impression-02.jpg`.

### `public/vfr-logo.jpg`
Das Hauptlogo der VFR (bereits vorhanden).

## So bindest du Bilder ein

Sobald du Bilder in einen der Ordner legst, sag mir Bescheid. Ich tausche dann
die aktuellen Unsplash-Platzhalter in `lib/images.ts` und den Komponenten
gegen die lokalen Dateien aus.

**Beispiel:** Wenn du `public/hero/startseite.jpg` abgelegt hast, ersetze ich
in `lib/images.ts` die Zeile
```ts
hero: "https://images.unsplash.com/...",
```
durch
```ts
hero: "/hero/startseite.jpg",
```

## Hinweise zu Fotos

- **Format:** Vorzugsweise JPG (für Fotos) oder WebP. SVG nur für Logos/Icons.
- **Komprimierung:** Vor Upload mit Tools wie [Squoosh](https://squoosh.app) oder
  [TinyJPG](https://tinyjpg.com) auf ~70 % Qualität bringen — spart Ladezeit.
- **Freigabe:** Bei Portraits und Fotos mit Personen vorab schriftliche Zustimmung
  einholen (Formular bei Bedarf gern via mich erstellen lassen).
- **Benennung:** Kleinbuchstaben, Bindestriche statt Leerzeichen,
  keine Umlaute im Dateinamen (`fuer` statt `für`).
