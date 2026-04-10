// Chaldean Numerology — rooted in ancient Vedic tradition via Babylonian influence

const CHALDEAN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 7, p: 8, q: 1, r: 2,
  s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7,
}

export function reduceToSingleDigit(n: number): number {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n
  return reduceToSingleDigit(
    String(n).split('').reduce((s, d) => s + parseInt(d), 0)
  )
}

export function getNameNumber(name: string): number {
  const sum = name
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('')
    .reduce((acc, c) => acc + (CHALDEAN[c] ?? 0), 0)
  return reduceToSingleDigit(sum) || 1
}

export function getLifePathNumber(birthdate: string): number {
  const sum = birthdate
    .replace(/\D/g, '')
    .split('')
    .reduce((s, d) => s + parseInt(d), 0)
  return reduceToSingleDigit(sum) || 1
}

export function getBirthNumber(birthdate: string): number {
  const day = parseInt(birthdate.split('-')[2] ?? '1')
  return reduceToSingleDigit(day) || 1
}

// ─── Gana (temperament) ───────────────────────────────────────────────────────

export type GanaType = 'Deva' | 'Manushya' | 'Rakshasa'

export function getGana(num: number): GanaType {
  if ([1, 3, 9, 11].includes(num)) return 'Deva'
  if ([2, 5, 6, 22].includes(num)) return 'Manushya'
  return 'Rakshasa'
}

export const GANA_LABEL: Record<GanaType, string> = {
  Deva:     'Divine — noble, compassionate, spiritually inclined',
  Manushya: 'Human — practical, balanced, worldly',
  Rakshasa: 'Fierce — passionate, intense, strong-willed',
}

// ─── Nadi (life-force channel / Ayurvedic dosha) ─────────────────────────────

export type NadiType = 'Adi' | 'Madhya' | 'Antya'

export function getNadi(name: string): NadiType {
  const vowelSum = name
    .toLowerCase()
    .replace(/[^aeiou]/g, '')
    .split('')
    .reduce((s, v) => s + (CHALDEAN[v] ?? 0), 0)
  const mod = vowelSum % 3
  if (mod === 1) return 'Adi'
  if (mod === 2) return 'Madhya'
  return 'Antya'
}

export const NADI_LABEL: Record<NadiType, string> = {
  Adi:    'Vāta — creative, quick-minded, changeable',
  Madhya: 'Pitta — sharp, driven, ambitious',
  Antya:  'Kapha — steady, nurturing, enduring',
}

// ─── Varna (spiritual archetype) ─────────────────────────────────────────────

export type VarnaType = 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra'

export function getVarna(num: number): VarnaType {
  if ([1, 2, 11].includes(num)) return 'Brahmin'
  if ([3, 4].includes(num))     return 'Kshatriya'
  if ([5, 6, 22].includes(num)) return 'Vaishya'
  return 'Shudra'
}

// ─── Yoni (animal archetype from first letter) ───────────────────────────────

export type YoniAnimal = 'Ashva' | 'Gaja' | 'Mesha' | 'Sarpa' | 'Shvana' | 'Nakula' | 'Mriga'

export const YONI_ENGLISH: Record<YoniAnimal, string> = {
  Ashva:  'Horse',
  Gaja:   'Elephant',
  Mesha:  'Ram',
  Sarpa:  'Serpent',
  Shvana: 'Dog',
  Nakula: 'Mongoose',
  Mriga:  'Deer',
}

export function getYoni(name: string): YoniAnimal {
  const c = name.toLowerCase().charAt(0)
  if ('abcd'.includes(c))  return 'Ashva'
  if ('efgh'.includes(c))  return 'Gaja'
  if ('ijkl'.includes(c))  return 'Mesha'
  if ('mnop'.includes(c))  return 'Sarpa'
  if ('qrst'.includes(c))  return 'Shvana'
  if ('uvw'.includes(c))   return 'Nakula'
  return 'Mriga'
}

// ─── Sun sign (Rashi) from birthdate ─────────────────────────────────────────

export function getSunSign(birthdate: string): string {
  const [, mm, dd] = birthdate.split('-').map(Number)
  if ((mm === 3 && dd >= 21) || (mm === 4 && dd <= 19))  return 'Mesha'
  if ((mm === 4 && dd >= 20) || (mm === 5 && dd <= 20))  return 'Vrishabha'
  if ((mm === 5 && dd >= 21) || (mm === 6 && dd <= 20))  return 'Mithuna'
  if ((mm === 6 && dd >= 21) || (mm === 7 && dd <= 22))  return 'Karka'
  if ((mm === 7 && dd >= 23) || (mm === 8 && dd <= 22))  return 'Simha'
  if ((mm === 8 && dd >= 23) || (mm === 9 && dd <= 22))  return 'Kanya'
  if ((mm === 9 && dd >= 23) || (mm === 10 && dd <= 22)) return 'Tula'
  if ((mm === 10 && dd >= 23) || (mm === 11 && dd <= 21)) return 'Vrishchika'
  if ((mm === 11 && dd >= 22) || (mm === 12 && dd <= 21)) return 'Dhanu'
  if ((mm === 12 && dd >= 22) || (mm === 1 && dd <= 19))  return 'Makara'
  if ((mm === 1 && dd >= 20) || (mm === 2 && dd <= 18))   return 'Kumbha'
  return 'Meena'
}

export const RASHI_ENGLISH: Record<string, string> = {
  Mesha: 'Aries', Vrishabha: 'Taurus', Mithuna: 'Gemini', Karka: 'Cancer',
  Simha: 'Leo', Kanya: 'Virgo', Tula: 'Libra', Vrishchika: 'Scorpio',
  Dhanu: 'Sagittarius', Makara: 'Capricorn', Kumbha: 'Aquarius', Meena: 'Pisces',
}

// ─── Tattva (element) ─────────────────────────────────────────────────────────

export type ElementType = 'Agni' | 'Prithvi' | 'Vayu' | 'Jala'

export const SIGN_ELEMENT: Record<string, ElementType> = {
  Mesha: 'Agni',    Simha: 'Agni',    Dhanu: 'Agni',
  Vrishabha: 'Prithvi', Kanya: 'Prithvi', Makara: 'Prithvi',
  Mithuna: 'Vayu',  Tula: 'Vayu',     Kumbha: 'Vayu',
  Karka: 'Jala',    Vrishchika: 'Jala', Meena: 'Jala',
}

export function getElement(sign: string): ElementType {
  return SIGN_ELEMENT[sign] ?? 'Agni'
}

export const ELEMENT_ENGLISH: Record<ElementType, string> = {
  Agni: 'Fire', Prithvi: 'Earth', Vayu: 'Air', Jala: 'Water',
}
