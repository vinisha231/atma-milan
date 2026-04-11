/**
 * compatibility.ts
 * Ashtakoota matching engine — authentic Jyotish when birth time is provided,
 * Chaldean-numerology fallback otherwise.
 *
 * Precision levels:
 *   HIGH   — birthdate + birthTime + utcOffset → real Moon Nakshatra
 *   MEDIUM — birthdate only → Sun sign + numerology hybrids
 *   LOW    — name only → pure Chaldean numerology
 */

import {
  getNameNumber, getLifePathNumber, getBirthNumber,
  getGana as getGanaNumerology,
  getNadi as getNadiNumerology,
  getVarna as getVarnaNumerology,
  getYoni as getYoniNumerology,
  getSunSign, getElement,
  GANA_LABEL, NADI_LABEL,
  ELEMENT_ENGLISH,
  GanaType, NadiType, VarnaType, ElementType,
} from './numerology'

import {
  moonSiderealLongitude, birthToJDE,
} from './ephemeris'

import {
  getNakshatraFromLongitude, getMoonRashi,
  getTaraScoreFromNakshatras, getYoniScore,
  GANA_SCORE, RASHI_ENGLISH, YONI_ENGLISH,
  NakshatraData, YoniAnimal,
} from './nakshatra'

import { PersonInfo, CompatibilityMetric, CompatibilityResult, MetricLevel, Precision } from '../types'

// ─── Legacy Yoni (name first-letter) kept for LOW precision ──────────────────
// Maps to the 7-animal subset used before — still used as fallback.
const LEGACY_YONI_SCORES: Record<string, Record<string, number>> = {
  Ashva:  { Ashva: 4, Gaja: 3, Mesha: 2, Sarpa: 2, Shvana: 3, Nakula: 3, Mriga: 3 },
  Gaja:   { Ashva: 3, Gaja: 4, Mesha: 3, Sarpa: 2, Shvana: 2, Nakula: 3, Mriga: 3 },
  Mesha:  { Ashva: 2, Gaja: 3, Mesha: 4, Sarpa: 3, Shvana: 3, Nakula: 2, Mriga: 3 },
  Sarpa:  { Ashva: 2, Gaja: 2, Mesha: 3, Sarpa: 4, Shvana: 2, Nakula: 3, Mriga: 2 },
  Shvana: { Ashva: 3, Gaja: 2, Mesha: 3, Sarpa: 2, Shvana: 4, Nakula: 3, Mriga: 3 },
  Nakula: { Ashva: 3, Gaja: 3, Mesha: 2, Sarpa: 3, Shvana: 3, Nakula: 4, Mriga: 2 },
  Mriga:  { Ashva: 3, Gaja: 3, Mesha: 3, Sarpa: 2, Shvana: 3, Nakula: 2, Mriga: 4 },
}

// ─── Varna order for scoring ──────────────────────────────────────────────────

const VARNA_ORDER: VarnaType[] = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra']
function varnaScore(v1: VarnaType, v2: VarnaType): number {
  return Math.max(1, 4 - Math.abs(VARNA_ORDER.indexOf(v1) - VARNA_ORDER.indexOf(v2)))
}

// ─── Element / Bhakoot helpers ────────────────────────────────────────────────

const ELEMENT_SCORE: Record<ElementType, Record<ElementType, number>> = {
  Agni:    { Agni: 4, Prithvi: 2, Vayu: 5, Jala: 1 },
  Prithvi: { Agni: 2, Prithvi: 4, Vayu: 3, Jala: 5 },
  Vayu:    { Agni: 5, Prithvi: 3, Vayu: 3, Jala: 3 },
  Jala:    { Agni: 1, Prithvi: 5, Vayu: 3, Jala: 4 },
}

const SIGN_POS: Record<string, number> = {
  Mesha: 1, Vrishabha: 2, Mithuna: 3, Karka: 4,
  Simha: 5, Kanya: 6,    Tula: 7,    Vrishchika: 8,
  Dhanu: 9, Makara: 10,  Kumbha: 11, Meena: 12,
}

function bhakootScore(sign1: string, sign2: string): number {
  const p1 = SIGN_POS[sign1] ?? 1
  const p2 = SIGN_POS[sign2] ?? 5
  const d  = Math.min(Math.abs(p1 - p2), 12 - Math.abs(p1 - p2))
  if ([2, 3, 4, 5, 6].includes(d)) return 0
  if (d === 0) return 5
  return 7
}

// ─── Namaanka (name numerology) ───────────────────────────────────────────────

const NAME_COMPAT: Record<number, number[]> = {
  1: [1,3,5,9], 2: [2,4,6,8], 3: [1,3,5,9], 4: [2,4,8],
  5: [1,3,5,7], 6: [2,4,6,9], 7: [5,7],      8: [2,4,8], 9: [1,3,6,9],
  11: [1,3,9], 22: [2,4,8], 33: [3,6,9],
}
function namaankScore(n1: number, n2: number): number {
  if (n1 === n2) return 8
  if (NAME_COMPAT[n1]?.includes(n2)) return 6
  if (NAME_COMPAT[n2]?.includes(n1)) return 5
  return 2
}

// Legacy Tara (birth-number-based) for medium/low precision
function taraScoreLegacy(b1: number, b2: number): number {
  const d = Math.min(Math.abs(b1 - b2), 9 - Math.abs(b1 - b2))
  if (d <= 1) return 3
  if (d <= 3) return 2
  return 1
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function level(score: number, max: number): MetricLevel {
  const r = score / max
  if (r >= 0.75) return 'excellent'
  if (r >= 0.55) return 'good'
  if (r >= 0.30) return 'average'
  return 'poor'
}

function firstName(p: PersonInfo) { return p.name.split(' ')[0] }

// ─── Per-person Nakshatra resolution ─────────────────────────────────────────

interface PersonResolved {
  nameNum:    number
  lifePath:   number
  birthNum:   number
  gana:       GanaType
  nadi:       NadiType
  varna:      VarnaType
  yoni:       string           // YoniAnimal (may be legacy 7-set)
  yoniGender: 'male' | 'female'
  sign:       string           // Rashi name
  element:    ElementType
  nakshatra?: NakshatraData    // defined only for HIGH precision
  precision:  Precision
}

function resolvePerson(p: PersonInfo): PersonResolved {
  const nameNum  = getNameNumber(p.name)
  const lifePath = p.birthdate ? getLifePathNumber(p.birthdate) : nameNum
  const birthNum = p.birthdate ? getBirthNumber(p.birthdate)    : nameNum

  // HIGH precision: compute actual Nakshatra from Moon's sidereal longitude
  if (p.birthdate && p.birthTime && p.utcOffset !== undefined) {
    const jde      = birthToJDE(p.birthdate, p.birthTime, p.utcOffset)
    const sidLon   = moonSiderealLongitude(jde)
    const nk       = getNakshatraFromLongitude(sidLon)
    const moonSign = getMoonRashi(sidLon)
    const element  = getElement(moonSign)

    return {
      nameNum, lifePath, birthNum,
      gana:       nk.gana,
      nadi:       nk.nadi,
      varna:      nk.varna,
      yoni:       nk.yoni,
      yoniGender: nk.yoniGender,
      sign:       moonSign,
      element,
      nakshatra:  nk,
      precision:  'high',
    }
  }

  // MEDIUM precision: birthdate available but no time
  if (p.birthdate) {
    const sunSign = getSunSign(p.birthdate)
    return {
      nameNum, lifePath, birthNum,
      gana:       getGanaNumerology(lifePath),
      nadi:       getNadiNumerology(p.name),
      varna:      getVarnaNumerology(lifePath),
      yoni:       getYoniNumerology(p.name),
      yoniGender: 'male',   // unknown; will use legacy yoni matrix
      sign:       sunSign,
      element:    getElement(sunSign),
      precision:  'medium',
    }
  }

  // LOW precision: name only
  return {
    nameNum, lifePath, birthNum,
    gana:       getGanaNumerology(nameNum),
    nadi:       getNadiNumerology(p.name),
    varna:      getVarnaNumerology(nameNum),
    yoni:       getYoniNumerology(p.name),
    yoniGender: 'male',
    sign:       'Mesha',
    element:    'Agni',
    precision:  'low',
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculateCompatibility(p1: PersonInfo, p2: PersonInfo): CompatibilityResult {
  const r1 = resolvePerson(p1)
  const r2 = resolvePerson(p2)

  const f1 = firstName(p1)
  const f2 = firstName(p2)

  // Determine overall precision (lowest of the two)
  const precisionRank: Record<Precision, number> = { high: 2, medium: 1, low: 0 }
  const overallPrecision: Precision =
    precisionRank[r1.precision] <= precisionRank[r2.precision] ? r1.precision : r2.precision

  // ─── Score calculation ────────────────────────────────────────────────────

  // 1. Namaanka (name numerology) — always Chaldean
  const sc_namaank = namaankScore(r1.nameNum, r2.nameNum)

  // 2. Gana
  const sc_gana = GANA_SCORE[r1.gana][r2.gana]

  // 3. Varna
  const sc_varna = varnaScore(r1.varna, r2.varna)

  // 4. Yoni — use full 14-animal matrix when both are HIGH, else legacy 7-animal
  let sc_yoni: number
  if (r1.precision === 'high' && r2.precision === 'high') {
    sc_yoni = getYoniScore(r1.yoni as YoniAnimal, r1.yoniGender, r2.yoni as YoniAnimal, r2.yoniGender)
  } else {
    const y1 = r1.yoni as string
    const y2 = r2.yoni as string
    sc_yoni = LEGACY_YONI_SCORES[y1]?.[y2] ?? 2
  }

  // 5. Nadi — same Nadi = 0 (dosha), different = 8
  const sc_nadi = r1.nadi !== r2.nadi ? 8 : 0

  // 6. Bhakoot — from Moon signs when HIGH precision, Sun signs when MEDIUM, estimated when LOW
  let sc_bhakoot: number
  const hasSigns = r1.sign !== 'Mesha' || r2.sign !== 'Mesha' || r1.precision !== 'low'
  sc_bhakoot = hasSigns ? bhakootScore(r1.sign, r2.sign) : 4

  // 7. Tattva (element harmony)
  const sc_tattva = ELEMENT_SCORE[r1.element][r2.element]

  // 8. Tara — real Nakshatra count when both HIGH, else birth-number estimate
  let sc_tara: number
  if (r1.nakshatra && r2.nakshatra) {
    sc_tara = getTaraScoreFromNakshatras(r1.nakshatra.index, r2.nakshatra.index)
  } else {
    sc_tara = taraScoreLegacy(r1.birthNum, r2.birthNum)
  }

  const totalScore = sc_namaank + sc_gana + sc_varna + sc_yoni + sc_nadi + sc_bhakoot + sc_tattva + sc_tara
  const maxScore   = 8 + 6 + 4 + 4 + 8 + 7 + 5 + 3   // = 45
  const percentage = Math.round((totalScore / maxScore) * 100)

  // ─── Precision-aware description helpers ─────────────────────────────────

  function signLabel(r: PersonResolved) {
    const rashi = RASHI_ENGLISH[r.sign] ?? r.sign
    return r.precision === 'high'
      ? `${r.sign} (${rashi}) — Moon sign`
      : `${r.sign} (${rashi}) — Sun sign`
  }

  function nkLabel(r: PersonResolved) {
    return r.nakshatra
      ? `${r.nakshatra.name} Nakshatra`
      : `est. from ${r.precision === 'medium' ? 'birthdate' : 'name'}`
  }

  // ─── Build metrics ────────────────────────────────────────────────────────

  const metrics: CompatibilityMetric[] = [
    {
      id: 'namaank', name: 'Name Harmony', sanskritName: 'Nāmaanka',
      icon: '✦', score: sc_namaank, maxScore: 8,
      description: `Name vibration ${r1.nameNum} (${f1}) meets ${r2.nameNum} (${f2})`,
      detail: sc_namaank >= 6
        ? 'Your names resonate at a harmonious Chaldean frequency — a natural recognition lives in the very sound of each other\'s names.'
        : sc_namaank >= 4
        ? 'Your name vibrations hold moderate harmony, with pockets of ease and some areas calling for deeper understanding.'
        : 'A vibrational challenge in your names invites greater patience — harmony is built consciously.',
      level: level(sc_namaank, 8),
    },
    {
      id: 'gana', name: 'Temperament', sanskritName: 'Gaṇa Maitri',
      icon: '◈', score: sc_gana, maxScore: 6,
      description: `${r1.gana} Gaṇa (${f1}, ${nkLabel(r1)}) × ${r2.gana} Gaṇa (${f2}, ${nkLabel(r2)})`,
      detail: sc_gana === 6
        ? `Both share the ${r1.gana} nature — ${GANA_LABEL[r1.gana]}. This shared temperament creates an almost instinctive understanding.`
        : sc_gana >= 4
        ? `${r1.gana} and ${r2.gana} temperaments complement each other — different enough to be fascinating, close enough to understand.`
        : `The ${r1.gana} and ${r2.gana} natures carry a karmic tension. Conscious devotion and shared practice transform this into resilience.`,
      level: level(sc_gana, 6),
    },
    {
      id: 'varna', name: 'Spiritual Path', sanskritName: 'Varṇa',
      icon: '⬡', score: sc_varna, maxScore: 4,
      description: `${r1.varna} (${f1}) × ${r2.varna} (${f2})`,
      detail: sc_varna === 4
        ? `Both walk the ${r1.varna} dharmic path — aligned in spiritual purpose, values, and how you seek the divine.`
        : sc_varna >= 3
        ? 'Your dharmic paths are closely aligned, sharing values while each brings a complementary perspective.'
        : 'Your spiritual journeys differ in approach — a rich invitation for mutual growth and expanded vision.',
      level: level(sc_varna, 4),
    },
    {
      id: 'yoni', name: 'Natural Affinity', sanskritName: 'Yoni',
      icon: '❋', score: sc_yoni, maxScore: 4,
      description: r1.precision === 'high' && r2.precision === 'high'
        ? `${YONI_ENGLISH[r1.yoni as YoniAnimal]} ♂♀ ${r1.yoniGender} (${f1}) × ${YONI_ENGLISH[r2.yoni as YoniAnimal]} ${r2.yoniGender} (${f2})`
        : `${r1.yoni.replace('Ashva','Horse').replace('Gaja','Elephant').replace('Mesha','Ram').replace('Sarpa','Serpent').replace('Shvana','Dog').replace('Nakula','Mongoose').replace('Mriga','Deer')} (${f1}) × ${r2.yoni.replace('Ashva','Horse').replace('Gaja','Elephant').replace('Mesha','Ram').replace('Sarpa','Serpent').replace('Shvana','Dog').replace('Nakula','Mongoose').replace('Mriga','Deer')} (${f2})`,
      detail: sc_yoni === 4
        ? 'Your Yoni natures are perfectly aligned — an instinctive, wordless understanding of each other\'s deepest drives and desires.'
        : sc_yoni === 0
        ? 'Yoni Dosha is present — your animal natures are natural opposites. This calls for exceptional patience with each other\'s instincts, which love and devotion can remedy.'
        : sc_yoni >= 3
        ? 'Your natural energies complement each other well, creating physical and emotional ease in each other\'s presence.'
        : 'Your instinctual natures differ — mindful attention to each other\'s rhythms and needs will build a strong foundation.',
      level: level(sc_yoni, 4),
    },
    {
      id: 'nadi', name: 'Life Force', sanskritName: 'Nāḍī',
      icon: '∞', score: sc_nadi, maxScore: 8,
      description: sc_nadi === 8
        ? `${r1.nadi} Nāḍī (${f1}) harmonises with ${r2.nadi} Nāḍī (${f2})`
        : `Both carry ${r1.nadi} Nāḍī — Nāḍī Doṣa present`,
      detail: sc_nadi === 8
        ? `Your prāṇic channels flow in different streams — ${NADI_LABEL[r1.nadi]} and ${NADI_LABEL[r2.nadi]} — creating perfect energetic balance, health harmony, and generational blessings.`
        : `Nāḍī Doṣa: both share ${r1.nadi} constitution (${NADI_LABEL[r1.nadi]}). The Vedas counsel shared devotion, Doṣa-Nivaraṇa Pūjā, and conscious attention to health and progeny.`,
      level: level(sc_nadi, 8),
    },
    {
      id: 'bhakoot', name: 'Emotional Bond', sanskritName: 'Bhakoota',
      icon: '♡', score: sc_bhakoot, maxScore: 7,
      description: `${signLabel(r1)} aligns with ${signLabel(r2)}`,
      detail: sc_bhakoot >= 6
        ? `Your ${overallPrecision === 'high' ? 'Moon' : 'Sun'} signs form an auspicious alignment, blessing your union with emotional depth, shared prosperity, and longevity.`
        : sc_bhakoot >= 4
        ? 'Your signs carry meaningful emotional resonance. With open communication, a deep and lasting connection flourishes.'
        : 'This placement calls for special attention to emotional support and family dynamics — conscious care is healing.',
      level: level(sc_bhakoot, 7),
    },
    {
      id: 'tattva', name: 'Element Harmony', sanskritName: 'Tattva',
      icon: '△', score: sc_tattva, maxScore: 5,
      description: `${ELEMENT_ENGLISH[r1.element]} (${f1}) + ${ELEMENT_ENGLISH[r2.element]} (${f2})`,
      detail: sc_tattva === 5
        ? `${ELEMENT_ENGLISH[r1.element]} and ${ELEMENT_ENGLISH[r2.element]} create perfect natural chemistry — your elemental natures ignite and sustain each other.`
        : sc_tattva >= 3
        ? 'Your elemental natures offer comfortable harmony with just enough difference to spark growth.'
        : `${ELEMENT_ENGLISH[r1.element]} and ${ELEMENT_ENGLISH[r2.element]} present an elemental tension that, navigated with awareness, forges unbreakable bonds.`,
      level: level(sc_tattva, 5),
    },
    {
      id: 'tara', name: 'Destiny Stars', sanskritName: 'Tārā',
      icon: '★', score: sc_tara, maxScore: 3,
      description: r1.nakshatra && r2.nakshatra
        ? `${r1.nakshatra.name} → ${r2.nakshatra.name} Nakshatra count`
        : `Birth numbers ${r1.birthNum} and ${r2.birthNum} in cosmic alignment`,
      detail: sc_tara === 3
        ? 'The Tārā alignment is fully auspicious in both directions — the stars bless your union with fortunate timing and shared destiny.'
        : sc_tara === 2
        ? 'Tārā is auspicious in one direction — a meaningful connection with purposeful karmic lessons woven through your journey.'
        : 'Both Tārā counts fall on inauspicious positions — the stars ask you to cultivate fortune through devotion and righteous living together.',
      level: level(sc_tara, 3),
    },
  ]

  // ─── Verdict ──────────────────────────────────────────────────────────────

  let verdict: string, verdictDetail: string, accentColor: string, emoji: string

  if (percentage >= 88) {
    verdict = 'Divine Union'
    verdictDetail = `${f1} and ${f2}, the cosmos itself rejoices in your meeting. Your souls have traveled across countless lifetimes to find each other in this sacred moment. The ancient wisdom of Jyotish reveals an exceptionally rare and blessed union — one inscribed in the stars before either of you drew your first breath. Together, you are luminously complete.`
    accentColor = '#FFD700'; emoji = '🌟'
  } else if (percentage >= 73) {
    verdict = 'Blessed Souls'
    verdictDetail = `${f1} and ${f2}, your union carries the warm blessings of Brahma. The Ashtakoota reveals deep harmony between your souls — a compatibility that blooms more beautifully with each passing season. You are superbly matched companions on this sacred journey of dharma, love, and mutual liberation.`
    accentColor = '#FF9933'; emoji = '✨'
  } else if (percentage >= 58) {
    verdict = 'Harmonious Hearts'
    verdictDetail = `${f1} and ${f2}, your bond holds meaningful harmony and beautiful potential. Like the lotus rising from muddy waters, your love has the inner strength to bloom above every challenge. With mutual devotion and shared practice, your partnership will deepen and flourish magnificently.`
    accentColor = '#66BB6A'; emoji = '💫'
  } else if (percentage >= 40) {
    verdict = 'Karmic Connection'
    verdictDetail = `${f1} and ${f2}, your meeting is no accident — karmic threads bind your souls across many lifetimes. This relationship carries profound lessons and transformative growth for both. With patience, genuine understanding, and the grace of shared devotion, you can transcend every challenge the stars present.`
    accentColor = '#42A5F5'; emoji = '🌙'
  } else {
    verdict = 'Sacred Challenge'
    verdictDetail = `${f1} and ${f2}, the ancient wisdom reveals significant karmic obstacles in this union. Yet the Vedas teach that conscious love, righteous living, and sincere devotion to the Divine can overcome any planetary arrangement. This path asks for courage — and courage forges the most extraordinary bonds.`
    accentColor = '#EF5350'; emoji = '🔮'
  }

  // ─── PersonAstro objects ──────────────────────────────────────────────────

  const astro1: import('../types').PersonAstro = {
    nakshatra: r1.nakshatra?.name,
    moonRashi: r1.precision === 'high' ? r1.sign : undefined,
    precision: r1.precision,
  }
  const astro2: import('../types').PersonAstro = {
    nakshatra: r2.nakshatra?.name,
    moonRashi: r2.precision === 'high' ? r2.sign : undefined,
    precision: r2.precision,
  }

  return {
    person1: p1, person2: p2,
    astro1, astro2,
    totalScore, maxScore, percentage,
    metrics, verdict, verdictDetail, accentColor, emoji,
  }
}
