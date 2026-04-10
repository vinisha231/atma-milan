/**
 * ephemeris.ts
 * Simplified Moon position calculator based on Jean Meeus,
 * "Astronomical Algorithms" 2nd ed., Chapter 47.
 *
 * Accuracy: ±0.3° in longitude — sufficient to determine the correct
 * Nakshatra (each spans 13.33°) in all but extreme boundary cases.
 */

const DEG = Math.PI / 180

function rad(d: number) { return d * DEG }
function norm360(d: number): number { return ((d % 360) + 360) % 360 }

// ─── Julian Day ──────────────────────────────────────────────────────────────

/**
 * Convert UTC calendar date+time to Julian Day Number.
 * @param year  Full year (e.g. 1990)
 * @param month 1–12
 * @param day   1–31
 * @param hour  0–23 (UTC)
 * @param min   0–59 (UTC)
 */
export function toJulianDay(
  year: number, month: number, day: number,
  hour = 12, min = 0,
): number {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day + (hour + min / 60) / 24 + B - 1524.5
  )
}

// ─── Moon tropical longitude ─────────────────────────────────────────────────

/**
 * Moon's tropical ecliptic longitude in degrees [0, 360) for a given JDE.
 * Uses 50 of the principal periodic terms from Meeus Table 47.A.
 */
export function moonTropicalLongitude(jde: number): number {
  const T  = (jde - 2451545.0) / 36525

  // Fundamental arguments (degrees)
  const Lp = norm360(218.3164477 + 481267.88123421*T - 0.0015786*T*T + T*T*T/538841    - T*T*T*T/65194000)
  const D  = norm360(297.8501921 + 445267.1114034*T  - 0.0018819*T*T + T*T*T/545868    - T*T*T*T/113065000)
  const M  = norm360(357.5291092 + 35999.0502909*T   - 0.0001536*T*T + T*T*T/24490000)
  const Mp = norm360(134.9633964 + 477198.8675055*T  + 0.0087414*T*T + T*T*T/69699     - T*T*T*T/14712000)
  const F  = norm360(93.2720950  + 483202.0175233*T  - 0.0036539*T*T - T*T*T/3526000   + T*T*T*T/863310000)

  const Dr = rad(D), Mr = rad(M), Mpr = rad(Mp), Fr = rad(F)

  // Eccentricity correction for terms involving M
  const E  = 1 - 0.002516*T - 0.0000074*T*T

  // Longitude correction (×10⁻⁶ degrees)
  let dL = 0
  dL += 6288774 * Math.sin(Mpr)
  dL += 1274027 * Math.sin(2*Dr - Mpr)
  dL +=  658314 * Math.sin(2*Dr)
  dL +=  213618 * Math.sin(2*Mpr)
  dL -= (185116 * Math.sin(Mr)) * E
  dL -=  114332 * Math.sin(2*Fr)
  dL +=   58793 * Math.sin(2*Dr - 2*Mpr)
  dL +=  (57066 * Math.sin(2*Dr - Mr - Mpr)) * E
  dL +=   53322 * Math.sin(2*Dr + Mpr)
  dL +=  (45758 * Math.sin(2*Dr - Mr)) * E
  dL -= ( 40923 * Math.sin(Mr - Mpr)) * E
  dL -=   34720 * Math.sin(Dr)
  dL -= ( 30383 * Math.sin(Mr + Mpr)) * E
  dL +=   15327 * Math.sin(2*Dr - 2*Fr)
  dL -=   12528 * Math.sin(Mpr + 2*Fr)
  dL +=   10980 * Math.sin(Mpr - 2*Fr)
  dL +=   10675 * Math.sin(4*Dr - Mpr)
  dL +=   10034 * Math.sin(3*Mpr)
  dL +=    8548 * Math.sin(4*Dr - 2*Mpr)
  dL -= (  7888 * Math.sin(2*Dr + Mr - Mpr)) * E
  dL -= (  6766 * Math.sin(2*Dr + Mr)) * E
  dL -=    5163 * Math.sin(Dr - Mpr)
  dL += (  4987 * Math.sin(Dr + Mr)) * E
  dL += (  4036 * Math.sin(2*Dr - Mr + Mpr)) * E
  dL +=    3994 * Math.sin(2*Dr + 2*Mpr)
  dL +=    3861 * Math.sin(4*Dr)
  dL +=    3665 * Math.sin(2*Dr - 3*Mpr)
  dL -= (  2689 * Math.sin(Mr - 2*Mpr)) * E
  dL -=    2602 * Math.sin(2*Dr - Mpr + 2*Fr)
  dL += (  2390 * Math.sin(2*Dr - Mr - 2*Mpr)) * E
  dL -=    2348 * Math.sin(Dr + Mpr)
  dL += (  2236 * Math.sin(2*Dr - 2*Mr)) * E * E
  dL -= (  2120 * Math.sin(Mr + 2*Mpr)) * E
  dL -= (  2069 * Math.sin(2*Mr)) * E * E
  dL +=    2048 * Math.sin(2*Dr - 2*Mr - Mpr)
  dL -=    1773 * Math.sin(2*Dr + Mpr - 2*Fr)
  dL -=    1595 * Math.sin(2*Dr + 2*Fr)
  dL += (  1215 * Math.sin(4*Dr - Mr - Mpr)) * E
  dL -=    1110 * Math.sin(2*Mpr + 2*Fr)
  dL -=     892 * Math.sin(3*Dr - Mpr)
  dL -= (   810 * Math.sin(2*Dr + Mr + Mpr)) * E
  dL += (   759 * Math.sin(4*Dr - Mr - 2*Mpr)) * E
  dL -= (   713 * Math.sin(2*Mr - Mpr)) * E * E
  dL -= (   700 * Math.sin(2*Dr + 2*Mr - Mpr)) * E * E
  dL += (   691 * Math.sin(2*Dr + Mr - 2*Mpr)) * E
  dL += (   596 * Math.sin(2*Dr - Mr - 2*Fr)) * E
  dL +=     549 * Math.sin(4*Dr + Mpr)
  dL +=     537 * Math.sin(4*Mpr)
  dL += (   520 * Math.sin(4*Dr - Mr)) * E
  dL -=     487 * Math.sin(Dr - 2*Mpr)

  return norm360(Lp + dL / 1_000_000)
}

// ─── Ayanamsa ────────────────────────────────────────────────────────────────

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees for a given JDE.
 * Value at J2000.0 = 23.8530°, precessing ~50.29 arcsec/year.
 */
export function lahiriAyanamsa(jde: number): number {
  const T = (jde - 2451545.0) / 36525
  // 23.85282° at J2000, rate = 50.29"/yr = 1.3969°/century
  return 23.85282 + T * 1.39659
}

// ─── Sidereal Moon ───────────────────────────────────────────────────────────

/**
 * Moon's sidereal (Lahiri) longitude in degrees [0, 360).
 * This is the primary input for Nakshatra/Rashi determination.
 */
export function moonSiderealLongitude(jde: number): number {
  return norm360(moonTropicalLongitude(jde) - lahiriAyanamsa(jde))
}

// ─── Convenience: parse form inputs → JDE ───────────────────────────────────

/**
 * Convert a date string (YYYY-MM-DD), optional time string (HH:MM),
 * and UTC offset (hours, e.g. 5.5 for IST) to a Julian Day Number.
 *
 * If no time provided, uses noon local time as a reasonable default.
 */
export function birthToJDE(
  birthdate: string,
  birthTime?: string,
  utcOffset = 0,
): number {
  const [y, m, d] = birthdate.split('-').map(Number)
  let localHour = 12, localMin = 0

  if (birthTime) {
    const [hh, mm] = birthTime.split(':').map(Number)
    localHour = hh ?? 12
    localMin  = mm ?? 0
  }

  // Convert local time to UTC
  const utcDecimal  = localHour + localMin / 60 - utcOffset
  const utcHour     = Math.floor(((utcDecimal % 24) + 24) % 24)
  const utcMin      = Math.round((((utcDecimal % 24) + 24) % 24 - utcHour) * 60)
  // Day offset if UTC crosses midnight
  const dayOffset   = Math.floor(((utcDecimal % 24) + 24) % 24 === utcHour ? (utcDecimal < 0 ? -1 : utcDecimal >= 24 ? 1 : 0) : 0)

  return toJulianDay(y, m, d + dayOffset, utcHour, utcMin)
}
