/**
 * nakshatra.ts
 * Complete 27-Nakshatra (lunar mansion) data for Ashtakoota matching.
 *
 * Sources: Brihat Parashara Hora Shastra + standard Jyotish reference tables.
 * All five Nakshatra-derived Ashtakoota attributes are assigned per Nakshatra,
 * not approximated from numerology.
 */

import { GanaType, NadiType, VarnaType } from './numerology'

// ─── Extended Yoni (14 animals, not 7) ────────────────────────────────────────

export type YoniAnimal =
  | 'Ashva'    // Horse
  | 'Gaja'     // Elephant
  | 'Mesha'    // Ram / Sheep
  | 'Sarpa'    // Serpent
  | 'Shvana'   // Dog
  | 'Marjara'  // Cat
  | 'Mushaka'  // Rat / Mouse
  | 'Go'       // Cow / Bull
  | 'Mahisha'  // Buffalo
  | 'Vyaghra'  // Tiger
  | 'Mriga'    // Deer / Hare
  | 'Vanara'   // Monkey
  | 'Nakula'   // Mongoose
  | 'Simha'    // Lion

export const YONI_ENGLISH: Record<YoniAnimal, string> = {
  Ashva:   'Horse',
  Gaja:    'Elephant',
  Mesha:   'Ram',
  Sarpa:   'Serpent',
  Shvana:  'Dog',
  Marjara: 'Cat',
  Mushaka: 'Mouse',
  Go:      'Cow',
  Mahisha: 'Buffalo',
  Vyaghra: 'Tiger',
  Mriga:   'Deer',
  Vanara:  'Monkey',
  Nakula:  'Mongoose',
  Simha:   'Lion',
}

// ─── Nakshatra record ─────────────────────────────────────────────────────────

export interface NakshatraData {
  index:       number        // 0–26
  name:        string        // Sanskrit
  english:     string        // English transliteration
  lord:        string        // Ruling planet
  gana:        GanaType
  nadi:        NadiType
  varna:       VarnaType
  yoni:        YoniAnimal
  yoniGender:  'male' | 'female'
  startDeg:    number        // starting sidereal longitude (degrees)
}

// ─── The 27 Nakshatras ────────────────────────────────────────────────────────
// Attributes per Parashara / standard Ashtakoota matching tables.
// Gana: Deva=divine, Manushya=human, Rakshasa=demon
// Nadi: Adi=Vata, Madhya=Pitta, Antya=Kapha  — cycles Adi→Madhya→Antya→Antya→Madhya→Adi…
// Varna: Brahmin, Kshatriya, Vaishya, Shudra (Parashara tradition)
// Yoni: animal archetype + gender (determines physical/instinctual affinity)

export const NAKSHATRAS: NakshatraData[] = [
  // 0
  { index:  0, name: 'Ashwini',          english: 'Ashwini',           lord: 'Ketu',    startDeg:   0,      gana: 'Deva',     nadi: 'Adi',    varna: 'Vaishya',   yoni: 'Ashva',   yoniGender: 'male'   },
  // 1
  { index:  1, name: 'Bharani',          english: 'Bharani',           lord: 'Venus',   startDeg:  13.333, gana: 'Manushya', nadi: 'Madhya', varna: 'Kshatriya', yoni: 'Gaja',    yoniGender: 'male'   },
  // 2
  { index:  2, name: 'Krittika',         english: 'Krittika',          lord: 'Sun',     startDeg:  26.667, gana: 'Rakshasa', nadi: 'Antya',  varna: 'Brahmin',   yoni: 'Mesha',   yoniGender: 'female' },
  // 3
  { index:  3, name: 'Rohini',           english: 'Rohini',            lord: 'Moon',    startDeg:  40,     gana: 'Manushya', nadi: 'Antya',  varna: 'Shudra',    yoni: 'Sarpa',   yoniGender: 'male'   },
  // 4
  { index:  4, name: 'Mrigashira',       english: 'Mrigashira',        lord: 'Mars',    startDeg:  53.333, gana: 'Deva',     nadi: 'Madhya', varna: 'Vaishya',   yoni: 'Sarpa',   yoniGender: 'female' },
  // 5
  { index:  5, name: 'Ardra',            english: 'Ardra',             lord: 'Rahu',    startDeg:  66.667, gana: 'Manushya', nadi: 'Adi',    varna: 'Shudra',    yoni: 'Shvana',  yoniGender: 'female' },
  // 6
  { index:  6, name: 'Punarvasu',        english: 'Punarvasu',         lord: 'Jupiter', startDeg:  80,     gana: 'Deva',     nadi: 'Adi',    varna: 'Vaishya',   yoni: 'Marjara', yoniGender: 'female' },
  // 7
  { index:  7, name: 'Pushya',           english: 'Pushya',            lord: 'Saturn',  startDeg:  93.333, gana: 'Deva',     nadi: 'Madhya', varna: 'Kshatriya', yoni: 'Mesha',   yoniGender: 'male'   },
  // 8
  { index:  8, name: 'Ashlesha',         english: 'Ashlesha',          lord: 'Mercury', startDeg: 106.667, gana: 'Rakshasa', nadi: 'Antya',  varna: 'Brahmin',   yoni: 'Marjara', yoniGender: 'male'   },
  // 9
  { index:  9, name: 'Magha',            english: 'Magha',             lord: 'Ketu',    startDeg: 120,     gana: 'Rakshasa', nadi: 'Antya',  varna: 'Kshatriya', yoni: 'Mushaka', yoniGender: 'male'   },
  // 10
  { index: 10, name: 'Purva Phalguni',   english: 'Purva Phalguni',    lord: 'Venus',   startDeg: 133.333, gana: 'Manushya', nadi: 'Madhya', varna: 'Brahmin',   yoni: 'Mushaka', yoniGender: 'female' },
  // 11
  { index: 11, name: 'Uttara Phalguni',  english: 'Uttara Phalguni',   lord: 'Sun',     startDeg: 146.667, gana: 'Manushya', nadi: 'Adi',    varna: 'Kshatriya', yoni: 'Go',      yoniGender: 'female' },
  // 12
  { index: 12, name: 'Hasta',            english: 'Hasta',             lord: 'Moon',    startDeg: 160,     gana: 'Deva',     nadi: 'Adi',    varna: 'Vaishya',   yoni: 'Mahisha', yoniGender: 'male'   },
  // 13
  { index: 13, name: 'Chitra',           english: 'Chitra',            lord: 'Mars',    startDeg: 173.333, gana: 'Rakshasa', nadi: 'Madhya', varna: 'Vaishya',   yoni: 'Vyaghra', yoniGender: 'female' },
  // 14
  { index: 14, name: 'Swati',            english: 'Swati',             lord: 'Rahu',    startDeg: 186.667, gana: 'Deva',     nadi: 'Antya',  varna: 'Shudra',    yoni: 'Mahisha', yoniGender: 'female' },
  // 15
  { index: 15, name: 'Vishakha',         english: 'Vishakha',          lord: 'Jupiter', startDeg: 200,     gana: 'Rakshasa', nadi: 'Antya',  varna: 'Kshatriya', yoni: 'Vyaghra', yoniGender: 'male'   },
  // 16
  { index: 16, name: 'Anuradha',         english: 'Anuradha',          lord: 'Saturn',  startDeg: 213.333, gana: 'Deva',     nadi: 'Madhya', varna: 'Shudra',    yoni: 'Mriga',   yoniGender: 'female' },
  // 17
  { index: 17, name: 'Jyeshtha',         english: 'Jyeshtha',          lord: 'Mercury', startDeg: 226.667, gana: 'Rakshasa', nadi: 'Adi',    varna: 'Brahmin',   yoni: 'Mriga',   yoniGender: 'male'   },
  // 18
  { index: 18, name: 'Moola',            english: 'Moola',             lord: 'Ketu',    startDeg: 240,     gana: 'Rakshasa', nadi: 'Adi',    varna: 'Kshatriya', yoni: 'Shvana',  yoniGender: 'male'   },
  // 19
  { index: 19, name: 'Purva Ashadha',    english: 'Purva Ashadha',     lord: 'Venus',   startDeg: 253.333, gana: 'Manushya', nadi: 'Madhya', varna: 'Brahmin',   yoni: 'Vanara',  yoniGender: 'male'   },
  // 20
  { index: 20, name: 'Uttara Ashadha',   english: 'Uttara Ashadha',    lord: 'Sun',     startDeg: 266.667, gana: 'Manushya', nadi: 'Antya',  varna: 'Kshatriya', yoni: 'Nakula',  yoniGender: 'female' },
  // 21
  { index: 21, name: 'Shravana',         english: 'Shravana',          lord: 'Moon',    startDeg: 280,     gana: 'Deva',     nadi: 'Antya',  varna: 'Vaishya',   yoni: 'Vanara',  yoniGender: 'female' },
  // 22
  { index: 22, name: 'Dhanishtha',       english: 'Dhanishtha',        lord: 'Mars',    startDeg: 293.333, gana: 'Rakshasa', nadi: 'Madhya', varna: 'Vaishya',   yoni: 'Simha',   yoniGender: 'female' },
  // 23
  { index: 23, name: 'Shatabhisha',      english: 'Shatabhisha',       lord: 'Rahu',    startDeg: 306.667, gana: 'Rakshasa', nadi: 'Adi',    varna: 'Shudra',    yoni: 'Ashva',   yoniGender: 'female' },
  // 24
  { index: 24, name: 'Purva Bhadrapada', english: 'Purva Bhadrapada',  lord: 'Jupiter', startDeg: 320,     gana: 'Manushya', nadi: 'Adi',    varna: 'Brahmin',   yoni: 'Simha',   yoniGender: 'male'   },
  // 25
  { index: 25, name: 'Uttara Bhadrapada',english: 'Uttara Bhadrapada', lord: 'Saturn',  startDeg: 333.333, gana: 'Manushya', nadi: 'Madhya', varna: 'Kshatriya', yoni: 'Go',      yoniGender: 'male'   },
  // 26
  { index: 26, name: 'Revati',           english: 'Revati',            lord: 'Mercury', startDeg: 346.667, gana: 'Deva',     nadi: 'Antya',  varna: 'Brahmin',   yoni: 'Gaja',    yoniGender: 'female' },
]

// ─── Rashi names ──────────────────────────────────────────────────────────────

export const RASHI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya',     'Tula',    'Vrishchika',
  'Dhanu', 'Makara',    'Kumbha',  'Meena',
]

export const RASHI_ENGLISH: Record<string, string> = {
  Mesha: 'Aries', Vrishabha: 'Taurus', Mithuna: 'Gemini', Karka: 'Cancer',
  Simha: 'Leo',   Kanya: 'Virgo',      Tula: 'Libra',     Vrishchika: 'Scorpio',
  Dhanu: 'Sagittarius', Makara: 'Capricorn', Kumbha: 'Aquarius', Meena: 'Pisces',
}

// ─── Lookup functions ─────────────────────────────────────────────────────────

/** Get Nakshatra data from sidereal Moon longitude (degrees). */
export function getNakshatraFromLongitude(siderealLon: number): NakshatraData {
  const index = Math.floor(((siderealLon % 360) + 360) % 360 / (360 / 27))
  return NAKSHATRAS[Math.min(index, 26)]
}

/** Get sidereal Rashi (Moon sign) index 0–11 from sidereal longitude. */
export function getRashiIndex(siderealLon: number): number {
  return Math.floor(((siderealLon % 360) + 360) % 360 / 30)
}

/** Get sidereal Rashi name from sidereal longitude. */
export function getMoonRashi(siderealLon: number): string {
  return RASHI_NAMES[getRashiIndex(siderealLon)]
}

// ─── Tara (from Nakshatra indices) ───────────────────────────────────────────

/**
 * Tara score (0–3) calculated by counting from one Nakshatra to another.
 * Checked in both directions; auspicious Taras (2,4,6,8,9) score 3/3,
 * inauspicious (1,3,5,7) score 0/3.  Half marks for each direction.
 */
export function getTaraScoreFromNakshatras(nk1: number, nk2: number): number {
  function taraClass(from: number, to: number): 'good' | 'bad' {
    const count = ((to - from + 27) % 27) + 1  // 1–27
    const tara  = ((count - 1) % 9) + 1         // 1–9
    return [2, 4, 6, 8, 9].includes(tara) ? 'good' : 'bad'
  }
  const fwd = taraClass(nk1, nk2)
  const rev = taraClass(nk2, nk1)
  if (fwd === 'good' && rev === 'good') return 3
  if (fwd === 'good' || rev === 'good') return 2
  return 0
}

// ─── Yoni compatibility (14-animal full matrix) ───────────────────────────────

// Natural enemy pairs — 0 points
const YONI_ENEMIES = new Set<string>([
  'Ashva-Mahisha', 'Mahisha-Ashva',     // Horse vs Buffalo
  'Gaja-Simha',    'Simha-Gaja',         // Elephant vs Lion
  'Mesha-Vanara',  'Vanara-Mesha',       // Ram vs Monkey
  'Sarpa-Nakula',  'Nakula-Sarpa',       // Serpent vs Mongoose
  'Shvana-Mriga',  'Mriga-Shvana',       // Dog vs Deer
  'Marjara-Mushaka','Mushaka-Marjara',   // Cat vs Mouse
  'Go-Vyaghra',    'Vyaghra-Go',         // Cow vs Tiger
])

// Friendly pairs — 4 points (same animal scores 4 by same-key logic)
const YONI_FRIENDS = new Set<string>([
  'Ashva-Ashva', 'Gaja-Gaja', 'Mesha-Mesha', 'Sarpa-Sarpa',
  'Shvana-Shvana', 'Marjara-Marjara', 'Mushaka-Mushaka', 'Go-Go',
  'Mahisha-Mahisha', 'Vyaghra-Vyaghra', 'Mriga-Mriga',
  'Vanara-Vanara', 'Nakula-Nakula', 'Simha-Simha',
  // Cross-gender same-animal pairs (male+female of same animal = very compatible)
])

export function getYoniScore(a1: YoniAnimal, g1: 'male'|'female', a2: YoniAnimal, g2: 'male'|'female'): number {
  const key = `${a1}-${a2}`
  if (YONI_ENEMIES.has(key)) return 0
  if (a1 === a2) return 4  // same animal, any gender combo
  if (YONI_FRIENDS.has(key)) return 4
  // Opposite-gender pairs of non-enemy animals
  if (g1 !== g2) return 3
  return 2  // same gender, neutral animals
}

// ─── Gana compatibility ───────────────────────────────────────────────────────

export const GANA_SCORE: Record<GanaType, Record<GanaType, number>> = {
  Deva:     { Deva: 6, Manushya: 5, Rakshasa: 1 },
  Manushya: { Deva: 5, Manushya: 6, Rakshasa: 3 },
  Rakshasa: { Deva: 1, Manushya: 3, Rakshasa: 6 },
}
