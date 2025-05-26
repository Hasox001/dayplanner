# Ultra Day Planner 🚀

Ein moderner, interaktiver Tagesplaner mit professionellem PDF-Export, gebaut mit Next.js und TypeScript.

![Ultra Day Planner](https://img.shields.io/badge/Version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🕒 Intelligente Zeitplanung
- **Flexible Zeitslots** mit konfigurierbaren Intervallen (15-60 Min)
- **Automatische Dauer-Berechnung** für Aufgaben
- **Smart Blocking** - längere Aufgaben blockieren nachfolgende Zeitslots automatisch
- **Drag & Drop** Interface für intuitive Bedienung

### 📝 Aufgaben-Management
- **Kategorien**: Arbeit, Persönlich, Gesundheit, Sonstiges
- **Prioritäten**: Niedrig, Mittel, Hoch (mit Farbcodierung)
- **Beschreibungen** für detaillierte Aufgabenplanung
- **Echtzeit-Updates** ohne Seitenneuladen

### 📊 Produktivitäts-Tracking
- **Live-Statistiken** mit Produktivitätsrate
- **Visuelle Fortschrittsanzeige**
- **Tagesübersicht** mit belegten/verfügbaren Slots

### 📄 Professioneller PDF-Export
- **Strukturierte PDF-Berichte** mit Tabellen-Layout
- **Screenshot-Export** für visuellen Überblick
- **Automatische Formatierung** und Seitennummerierung
- **Statistiken** und Produktivitätsauswertung

### 🎨 Modernes Design
- **Glassmorphism UI** mit eleganten Animationen
- **Dark Theme** für augenschonende Nutzung
- **Responsive Design** für Desktop und Mobile
- **Framer Motion** Animationen für flüssige UX

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone https://github.com/Hasox001/dayplanner.git
cd dayplanner

# Abhängigkeiten installieren
npm install

# Development Server starten
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

## 🛠️ Technologie-Stack

- **Framework**: Next.js 14 (React 18)
- **Sprache**: TypeScript 5
- **Styling**: Tailwind CSS
- **Animationen**: Framer Motion
- **PDF-Export**: jsPDF + html2canvas
- **Icons**: Lucide React

## 📖 Verwendung

### 1. Zeitslots konfigurieren
- Öffnen Sie die Einstellungen (Zahnrad-Symbol)
- Stellen Sie Arbeitszeit und Intervall ein
- Wählen Sie Arbeitstage aus

### 2. Aufgaben hinzufügen
- Klicken Sie auf "Aufgabe hinzufügen" in einem Zeitslot
- Geben Sie Titel und Beschreibung ein
- Wählen Sie Dauer, Kategorie und Priorität
- Speichern Sie die Aufgabe

### 3. PDF exportieren
- Klicken Sie auf "Strukturierte PDF" für Textformat
- Oder "Screenshot PDF" für visuellen Export
- PDF wird automatisch heruntergeladen

## 🔧 Konfiguration

### Einstellungen anpassen
```typescript
// Standard-Konfiguration
const settings = {
  startTime: '08:00',
  interval: 30,        // Minuten
  endTime: '18:00',
  workingDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr']
};
```

### Kategorien erweitern
```typescript
// In types/index.ts
type Category = 'work' | 'personal' | 'health' | 'other' | 'custom';
```

## 📦 Build & Deployment

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start

# Projekt linting
npm run lint
```

### Vercel Deployment
```bash
# Vercel CLI installieren
npm i -g vercel

# Deploy
vercel
```

## 🤝 Beitragen

1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/AmazingFeature`)
3. **Changes committen** (`git commit -m 'Add some AmazingFeature'`)
4. **Branch pushen** (`git push origin feature/AmazingFeature`)
5. **Pull Request** öffnen

## 📋 Roadmap

- [ ] 📱 Mobile App (React Native)
- [ ] 🔄 Cloud-Synchronisation
- [ ] 📅 Wochen-/Monatsansicht
- [ ] 🔔 Push-Benachrichtigungen
- [ ] 📈 Erweiterte Analytics
- [ ] 🎯 Ziele und Habit Tracking
- [ ] 👥 Team-Kollaboration
- [ ] 🔌 API-Integration (Google Calendar, Outlook)

## 📝 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe `LICENSE` Datei für Details.

## 👨‍💻 Autor

**Hasox001**
- GitHub: [@Hasox001](https://github.com/Hasox001)

## ⭐ Unterstützung

Wenn Ihnen dieses Projekt gefällt, geben Sie ihm einen ⭐ auf GitHub!

---

**Ultra Day Planner** - Maximiere deine Produktivität mit intelligentem Zeitmanagement! 🚀