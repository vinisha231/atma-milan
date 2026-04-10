import {
  getNameNumber, getLifePathNumber, getBirthNumber,
  getGana, getNadi, getVarna, getYoni, getSunSign, getElement,
  GANA_LABEL, NADI_LABEL, YONI_ENGLISH, RASHI_ENGLISH, ELEMENT_ENGLISH,
  GanaType, NadiType, VarnaType, YoniAnimal, ElementType,
} from './numerology'
import { PersonInfo, CompatibilityMetric, CompatibilityResult, MetricLevel } from '../types'

// ─── Scoring matrices ─────────────────────────────────────────────────────────

const GANA_SCORES: Record<GanaType, Record<GanaType, number>> = {
  Deva:     { Deva: 6, Manushya: 5, Rakshasa: 1 },
  Manushya: { Deva: 5, Manushya: 6, Rakshasa: 3 },
  Rakshasa: { Deva: 1, Manushya: 3, Rakshasa: 6 },
}

const VARNA_ORDER: VarnaType[] = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra']
function varnaScore(v1: VarnaType, v2: VarnaType): number {
  const diff = Math.abs(VARNA_ORDER.indexOf(v1) - VARNA_ORDER.indexOf(v2))
  return Math.max(1, 4 - diff)
}

const ELEMENT_SCORES: Record<ElementType, Record<ElementType, number>> = {
  Agni:    { Agni: 4, Prithvi: 2, Vayu: 5, Jala: 1 },
  Prithvi: { Agni: 2, Prithvi: 4, Vayu: 3, Jala: 5 },
  Vayu:    { Agni: 5, Prithvi: 3, Vayu: 3, Jala: 2 },
  Jala:    { Agni: 1, Prithvi: 5, Vayu: 2, Jala: 4 },
}

const SIGN_POS: Record<string, number> = {
  Mesha: 1, Vrishabha: 2, Mithuna: 3, Karka: 4,
  Simha: 5, Kanya: 6,    Tula: 7,    Vrishchika: 8,
  Dhanu: 9, Makara: 10,  Kumbha: 11, Meena: 12,
}

function bhakootScore(s1: string, s2: string): number {
  const p1 = SIGN_POS[s1] ?? 1
  const p2 = SIGN_POS[s2] ?? 5
  const diff = Math.abs(p1 - p2)
  const minDiff = Math.min(diff, 12 - diff)
  if ([2, 3, 4, 5, 6].includes(minDiff)) return 0
  if (minDiff === 0) return 5
  return 7
}

const YONI_SCORES: Record<YoniAnimal, Record<YoniAnimal, number>> = {
  Ashva:  { Ashva: 4, Gaja: 3, Mesha: 2, Sarpa: 2, Shvana: 3, Nakula: 3, Mriga: 3 },
  Gaja:   { Ashva: 3, Gaja: 4, Mesha: 3, Sarpa: 2, Shvana: 2, Nakula: 3, Mriga: 3 },
  Mesha:  { Ashva: 2, Gaja: 3, Mesha: 4, Sarpa: 3, Shvana: 3, Nakula: 2, Mriga: 3 },
  Sarpa:  { Ashva: 2, Gaja: 2, Mesha: 3, Sarpa: 4, Shvana: 2, Nakula: 3, Mriga: 2 },
  Shvana: { Ashva: 3, Gaja: 2, Mesha: 3, Sarpa: 2, Shvana: 4, Nakula: 3, Mriga: 3 },
  Nakula: { Ashva: 3, Gaja: 3, Mesha: 2, Sarpa: 3, Shvana: 3, Nakula: 4, Mriga: 2 },
  Mriga:  { Ashva: 3, Gaja: 3, Mesha: 3, Sarpa: 2, Shvana: 3, Nakula: 2, Mriga: 4 },
}

// Name number compatibility (Chaldean)
const NAME_COMPAT: Record<number, number[]> = {
  1: [1, 3, 5, 9], 2: [2, 4, 6, 8], 3: [1, 3, 5, 9],
  4: [2, 4, 8],    5: [1, 3, 5, 7], 6: [2, 4, 6, 9],
  7: [5, 7],       8: [2, 4, 8],    9: [1, 3, 6, 9],
  11: [1, 3, 9],   22: [2, 4, 8],   33: [3, 6, 9],
}
function namaankScore(n1: number, n2: number): number {
  if (n1 === n2) return 8
  if (NAME_COMPAT[n1]?.includes(n2)) return 6
  if (NAME_COMPAT[n2]?.includes(n1)) return 5
  return 2
}

function taraScore(b1: number, b2: number): number {
  const diff = Math.abs(b1 - b2)
  if (diff === 0 || diff === 1) return 3
  if (diff === 2 || diff === 7) return 2
  return 1
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function level(score: number, max: number): MetricLevel {
  const pct = score / max
  if (pct >= 0.75) return 'excellent'
  if (pct >= 0.55) return 'good'
  if (pct >= 0.35) return 'average'
  return 'poor'
}

function firstName(p: PersonInfo) { return p.name.split(' ')[0] }

// ─── Main function ────────────────────────────────────────────────────────────

export function calculateCompatibility(p1: PersonInfo, p2: PersonInfo): CompatibilityResult {
  const n1 = getNameNumber(p1.name)
  const n2 = getNameNumber(p2.name)
  const lp1 = p1.birthdate ? getLifePathNumber(p1.birthdate) : n1
  const lp2 = p2.birthdate ? getLifePathNumber(p2.birthdate) : n2
  const b1  = p1.birthdate ? getBirthNumber(p1.birthdate) : n1
  const b2  = p2.birthdate ? getBirthNumber(p2.birthdate) : n2

  const gana1  = getGana(lp1);  const gana2  = getGana(lp2)
  const nadi1  = getNadi(p1.name); const nadi2  = getNadi(p2.name)
  const varna1 = getVarna(lp1); const varna2 = getVarna(lp2)
  const yoni1  = getYoni(p1.name); const yoni2  = getYoni(p2.name)
  const sign1  = p1.birthdate ? getSunSign(p1.birthdate) : 'Mesha'
  const sign2  = p2.birthdate ? getSunSign(p2.birthdate) : 'Simha'
  const elem1  = getElement(sign1); const elem2  = getElement(sign2)

  const sc = {
    namaank: namaankScore(n1, n2),
    gana:    GANA_SCORES[gana1][gana2],
    varna:   varnaScore(varna1, varna2),
    yoni:    YONI_SCORES[yoni1][yoni2],
    nadi:    nadi1 !== nadi2 ? 8 : 0,
    bhakoot: (p1.birthdate && p2.birthdate) ? bhakootScore(sign1, sign2) : 4,
    tattva:  ELEMENT_SCORES[elem1][elem2],
    tara:    taraScore(b1, b2),
  }

  const totalScore = Object.values(sc).reduce((a, b) => a + b, 0)
  const maxScore   = 8 + 6 + 4 + 4 + 8 + 7 + 5 + 3 // = 45
  const percentage = Math.round((totalScore / maxScore) * 100)

  const f1 = firstName(p1)
  const f2 = firstName(p2)

  const metrics: CompatibilityMetric[] = [
    {
      id: 'namaank', name: 'Name Harmony', sanskritName: 'Nāmaanka Sāmaanjasya',
      icon: '✦', score: sc.namaank, maxScore: 8,
      description: `${f1}'s name vibration ${n1} unites with ${f2}'s ${n2}`,
      detail: sc.namaank >= 6
        ? 'Your names resonate at a harmonious vibrational frequency, creating a natural sense of recognition and ease the moment you speak each other\'s names.'
        : sc.namaank >= 4
        ? 'Your name energies carry moderate harmony — some areas flow naturally while others invite deeper understanding.'
        : 'Your name vibrations present a karmic challenge, calling for greater patience and effort to find common ground.',
      level: level(sc.namaank, 8),
    },
    {
      id: 'gana', name: 'Temperament', sanskritName: 'Gaṇa Maitri',
      icon: '◈', score: sc.gana, maxScore: 6,
      description: `${gana1} Gaṇa meets ${gana2} Gaṇa`,
      detail: sc.gana === 6
        ? `Both souls share the ${gana1} nature — ${GANA_LABEL[gana1]}. This shared temperament breeds profound understanding and natural trust.`
        : sc.gana >= 4
        ? `${gana1} and ${gana2} natures find balance through their complementary strengths, each filling what the other lacks.`
        : `The ${gana1} and ${gana2} temperaments face a karmic tension. With conscious devotion and shared spiritual practice, this can forge extraordinary resilience.`,
      level: level(sc.gana, 6),
    },
    {
      id: 'varna', name: 'Spiritual Path', sanskritName: 'Varṇa',
      icon: '⬡', score: sc.varna, maxScore: 4,
      description: `${varna1} path meets ${varna2} path`,
      detail: sc.varna === 4
        ? `You walk the same ${varna1} dharmic road — aligned in spiritual purpose, values, and life philosophy.`
        : sc.varna >= 3
        ? 'Your dharmic paths are closely aligned, sharing similar values while each brings a unique perspective to the union.'
        : 'Your spiritual journeys differ in approach, offering the rich opportunity for profound mutual growth and expanded vision.',
      level: level(sc.varna, 4),
    },
    {
      id: 'yoni', name: 'Natural Affinity', sanskritName: 'Yoni',
      icon: '❋', score: sc.yoni, maxScore: 4,
      description: `${YONI_ENGLISH[yoni1]} (${f1}) + ${YONI_ENGLISH[yoni2]} (${f2})`,
      detail: sc.yoni === 4
        ? `Sharing the ${YONI_ENGLISH[yoni1]} nature, you possess an instinctual understanding of each other's deepest needs and impulses.`
        : sc.yoni >= 3
        ? 'Your natural energies complement each other well, creating an organic physical and emotional ease in each other\'s presence.'
        : 'Your instinctual natures differ, requiring mindful attention to each other\'s fundamental needs and rhythms.',
      level: level(sc.yoni, 4),
    },
    {
      id: 'nadi', name: 'Life Force', sanskritName: 'Nāḍī',
      icon: '∞', score: sc.nadi, maxScore: 8,
      description: sc.nadi === 8
        ? `${nadi1} Nāḍī harmonizes with ${nadi2} Nāḍī`
        : `Both carry ${nadi1} Nāḍī — a karmic mirror`,
      detail: sc.nadi === 8
        ? `Your pranic channels flow in different streams — ${NADI_LABEL[nadi1 as NadiType]} and ${NADI_LABEL[nadi2 as NadiType]} — creating vital energetic balance, good health harmony, and generational blessings.`
        : `Nāḍī Dosha is present — you share the same ${nadi1} life-force constitution. The Vedas counsel devotion, spiritual practice, and sacred rituals (Dosha Nivarana Puja) to remedy and strengthen the bond.`,
      level: level(sc.nadi, 8),
    },
    {
      id: 'bhakoot', name: 'Emotional Bond', sanskritName: 'Bhakoot',
      icon: '♡', score: sc.bhakoot, maxScore: 7,
      description: (p1.birthdate && p2.birthdate)
        ? `${sign1} (${RASHI_ENGLISH[sign1]}) aligns with ${sign2} (${RASHI_ENGLISH[sign2]})`
        : 'Derived from name energy (add birthdate for precision)',
      detail: sc.bhakoot >= 6
        ? 'Your Rashis form an auspicious alignment, blessing your union with emotional fulfillment, shared prosperity, and familial harmony.'
        : sc.bhakoot >= 4
        ? 'Your signs carry meaningful emotional compatibility, with sincere effort blossoming into deep, lasting connection.'
        : 'This placement calls for conscious attention to emotional support and family dynamics — challenges that love and understanding can transform.',
      level: level(sc.bhakoot, 7),
    },
    {
      id: 'tattva', name: 'Element Harmony', sanskritName: 'Tattva Sāmaanjasya',
      icon: '△', score: sc.tattva, maxScore: 5,
      description: `${ELEMENT_ENGLISH[elem1]} (${f1}) + ${ELEMENT_ENGLISH[elem2]} (${f2})`,
      detail: sc.tattva === 5
        ? `${ELEMENT_ENGLISH[elem1]} and ${ELEMENT_ENGLISH[elem2]} create perfect natural chemistry — your elemental natures ignite and sustain each other with beautiful ease.`
        : sc.tattva >= 3
        ? 'Your elemental natures are moderately compatible, offering both comfort and the spark of interesting differences.'
        : `${ELEMENT_ENGLISH[elem1]} and ${ELEMENT_ENGLISH[elem2]} present an elemental tension that, navigated consciously, forges extraordinarily deep and transformative bonds.`,
      level: level(sc.tattva, 5),
    },
    {
      id: 'tara', name: 'Destiny Stars', sanskritName: 'Tārā',
      icon: '★', score: sc.tara, maxScore: 3,
      description: `Birth vibrations ${b1} and ${b2} in cosmic alignment`,
      detail: sc.tara === 3
        ? 'The stars shine brightly on your union — your birth numbers signal fortunate timing, shared destiny, and Lakshmi\'s blessings.'
        : sc.tara === 2
        ? 'Your stars are moderately aligned, indicating a meaningful connection with meaningful karmic lessons woven through your journey.'
        : 'Your birth stars ask you to consciously cultivate fortune through shared devotion, righteous living, and gratitude practices.',
      level: level(sc.tara, 3),
    },
  ]

  // ─── Verdict ───────────────────────────────────────────────────────────────
  let verdict: string, verdictDetail: string, accentColor: string, emoji: string

  if (percentage >= 88) {
    verdict = 'Divine Union'
    verdictDetail = `${f1} and ${f2}, the cosmos itself rejoices in your meeting. Your souls have traveled across many lifetimes to find each other in this sacred moment. The ancient wisdom of Jyotish reveals an exceptionally rare and blessed union — one written in the stars before either of you drew your first breath. Together, you are complete.`
    accentColor = '#FFD700'; emoji = '🌟'
  } else if (percentage >= 73) {
    verdict = 'Blessed Souls'
    verdictDetail = `${f1} and ${f2}, your union carries the blessings of Brahma himself. The Ashtakoota reveals deep harmony between your souls — a compatibility that blooms more beautifully with each passing season. You are well-matched companions on this sacred journey of dharma, love, and spiritual growth.`
    accentColor = '#FF9933'; emoji = '✨'
  } else if (percentage >= 57) {
    verdict = 'Harmonious Hearts'
    verdictDetail = `${f1} and ${f2}, your bond is one of meaningful harmony with beautiful potential. Like the lotus that blooms in muddy waters, your love has the wisdom and strength to rise above any challenge. With mutual devotion and shared spiritual practice, your partnership will deepen and flourish magnificently.`
    accentColor = '#66BB6A'; emoji = '💫'
  } else if (percentage >= 40) {
    verdict = 'Karmic Connection'
    verdictDetail = `${f1} and ${f2}, your meeting is no accident — you are bound by karmic threads woven across many lifetimes. This relationship holds profound lessons and transformative growth for both souls. With patience, understanding, and a shared spiritual path, you can transcend every challenge the stars present.`
    accentColor = '#42A5F5'; emoji = '🌙'
  } else {
    verdict = 'Sacred Challenge'
    verdictDetail = `${f1} and ${f2}, the ancient wisdom reveals significant karmic obstacles in this union. Yet the Vedas teach that even the most challenging unions serve the soul's highest evolution. Great sages have shown that conscious love, devotion to Dharma, and the grace of the Divine can overcome any planetary adversity.`
    accentColor = '#EF5350'; emoji = '🔮'
  }

  return { person1: p1, person2: p2, totalScore, maxScore, percentage, metrics, verdict, verdictDetail, accentColor, emoji }
}
