# ॐ Ātmā Milan — Vedic Soul Compatibility

> *"Milan"* (मिलन) means *union* or *meeting* in Sanskrit.  
> *"Ātmā"* (आत्मा) means *soul*.  
> Together: **Soul Union** — a compatibility checker rooted in ancient Hindu Jyotish astrology.

**Live site →** https://vinisha231.github.io/atma-milan/

---

## What it does

Enter two names (and optionally birthdates, age, and gender) to receive a full **Ashtakoota** compatibility analysis — the same 8-metric system used in traditional Hindu matchmaking for thousands of years.

### The 8 Sacred Metrics

| Metric | Sanskrit | Max Points | What it measures |
|--------|----------|-----------|-----------------|
| Name Harmony | Nāmaanka Sāmaanjasya | 8 | Vibrational resonance of names (Chaldean numerology) |
| Temperament | Gaṇa Maitri | 6 | Nature type — Deva, Manushya, or Rakshasa |
| Spiritual Path | Varṇa | 4 | Dharmic archetype — Brahmin, Kshatriya, Vaishya, Shudra |
| Natural Affinity | Yoni | 4 | Animal archetype (Horse, Elephant, Ram, Serpent…) |
| Life Force | Nāḍī | 8 | Prāṇic channel / Ayurvedic dosha — Ādi, Madhya, Antya |
| Emotional Bond | Bhakoot | 7 | Sun-sign (Rashi) positional harmony |
| Element Harmony | Tattva Sāmaanjasya | 5 | Agni, Prithvi, Vayu, Jala compatibility |
| Destiny Stars | Tārā | 3 | Birth-number cosmic alignment |
| **Total** | **Ashtakoota** | **45** | |

Scores map to five verdicts: **Divine Union · Blessed Souls · Harmonious Hearts · Karmic Connection · Sacred Challenge**.

---

## Tech stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 + custom CSS (glass morphism, gold glow) |
| Fonts | Cinzel · Crimson Text · Inter (Google Fonts) |
| Hosting | GitHub Pages (auto-deploy via Actions) |
| Numerology engine | Chaldean system — pure TypeScript, zero dependencies |

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173/atma-milan/](http://localhost:5173/atma-milan/)

```bash
npm run build   # production build → dist/
npm run preview # preview the build
```

---

## Project structure

```
src/
├── types/
│   └── index.ts              # PersonInfo, CompatibilityResult, MetricCard types
├── utils/
│   ├── numerology.ts         # Chaldean engine — Gana, Nadi, Varna, Yoni, Rashi, Tattva
│   └── compatibility.ts      # Ashtakoota scoring — all 8 metrics + verdicts
└── components/
    ├── Background.tsx         # Animated starfield + mandala SVG
    ├── Header.tsx             # Floating Om symbol + gold gradient title
    ├── InputForm.tsx          # Dual-person form with optional fields
    ├── ScoreCircle.tsx        # Animated SVG gauge with eased counter
    ├── MetricCard.tsx         # Individual metric — score bar, tap-to-expand
    └── Results.tsx            # Full results page — verdict, grid, share
```

---

## Algorithm overview

- **Name only:** Chaldean name number → Nāmaanka, Gaṇa, Varṇa, Yoni, Nāḍī
- **+ Birthdate:** Life path number → refined Gaṇa/Varṇa, Sun sign (Rashi) → Bhakoot, Tattva, Tārā
- **+ Gender:** Influences Purusha/Prakriti energy balance in future expansions

The score is computed as a raw total out of 45, then displayed as a percentage.

---

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds the Vite app and deploys to GitHub Pages automatically.

To enable Pages on your fork: **Settings → Pages → Source: GitHub Actions**.

---

## Disclaimer

Ātmā Milan is offered for cultural insight, entertainment, and self-reflection. It is not a substitute for professional astrological consultation.  
*"The stars incline — they do not compel."*

---

Made with devotion · ॐ नमः शिवाय
