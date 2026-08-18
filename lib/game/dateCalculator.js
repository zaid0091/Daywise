/**
 * Daywise Date Calculator Engine
 * Handles weekday calculation and leap year checks independently of external APIs.
 */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Check if a given year is a leap year in the Gregorian calendar.
 * @param {number} year
 * @returns {boolean}
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculates the day of the week for a valid Gregorian date.
 * Uses Zeller's Congruence for a deterministic calculation.
 * 
 * @param {number} year - Four digit year (e.g. 2026)
 * @param {number} month - 1-based month (1 = Jan, 12 = Dec)
 * @param {number} day - 1-based day of month
 * @returns {string} - Weekday name ("Monday" to "Sunday")
 */
export function calculateWeekDay(year, month, day) {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}`);
  }
  
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) {
    throw new Error(`Invalid day: ${day} for month: ${month}, year: ${year}`);
  }

  let q = day;
  let m = month;
  let y = year;

  // In Zeller's, January and February are counted as months 13 and 14 of the previous year
  if (m === 1 || m === 2) {
    m += 12;
    y -= 1;
  }

  const K = y % 100;
  const J = Math.floor(y / 100);

  // Zeller's Congruence formula
  let h = (q + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) - 2 * J) % 7;
  
  if (h < 0) {
    h = (h + 7) % 7;
  }

  const zellerToStandardMap = {
    0: 6, // Sat
    1: 0, // Sun
    2: 1, // Mon
    3: 2, // Tue
    4: 3, // Wed
    5: 4, // Thu
    6: 5, // Fri
  };

  return WEEKDAYS[zellerToStandardMap[h]];
}

/**
 * Returns the maximum number of days in a given month.
 * @param {number} year 
 * @param {number} month - 1-based month
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

/**
 * Returns the Doomsday anchor date for a given month in a specific year.
 * @param {number} year 
 * @param {number} month - 1-based month
 * @returns {number} - Anchor day of month
 */
export function getMonthAnchorDate(year, month) {
  const leap = isLeapYear(year);
  switch (month) {
    case 1: return leap ? 4 : 3;
    case 2: return leap ? 29 : 28;
    case 3: return 14; // Pi Day
    case 4: return 4;
    case 5: return 9;
    case 6: return 6;
    case 7: return 11;
    case 8: return 8;
    case 9: return 5;
    case 10: return 10;
    case 11: return 7;
    case 12: return 12;
    default: return 0;
  }
}

/**
 * Generates an educational step-by-step breakdown using the Doomsday Rule.
 * 
 * @param {number} year 
 * @param {number} month - 1-based month
 * @param {number} day 
 * @returns {object} - Steps explanation
 */
export function getDoomsdayExplanation(year, month, day) {
  const century = Math.floor(year / 100) * 100;
  const Y = year % 100;
  
  // Century anchor mapping
  // 1600 = Tue(2), 1700 = Sun(0), 1800 = Fri(5), 1900 = Wed(3), 2000 = Tue(2), etc.
  const centuryAnchors = {
    1600: { day: "Tuesday", code: 2 },
    1700: { day: "Sunday", code: 0 },
    1800: { day: "Friday", code: 5 },
    1900: { day: "Wednesday", code: 3 },
    2000: { day: "Tuesday", code: 2 },
    2100: { day: "Sunday", code: 0 },
    2200: { day: "Friday", code: 5 },
    2300: { day: "Wednesday", code: 3 },
    2400: { day: "Tuesday", code: 2 },
  };

  const centData = centuryAnchors[century] || { day: "Tuesday", code: 2 }; // fallback

  const a = Math.floor(Y / 12);
  const b = Y % 12;
  const c = Math.floor(b / 4);
  const yearOffset = (a + b + c) % 7;
  
  const yearDoomsdayCode = (centData.code + yearOffset) % 7;
  const yearDoomsdayDay = WEEKDAYS[yearDoomsdayCode];

  const monthAnchorDay = getMonthAnchorDate(year, month);
  const targetDiff = day - monthAnchorDay;
  const targetDiffMod = ((targetDiff % 7) + 7) % 7;
  const targetDiffSign = targetDiff >= 0 ? "+" : "-";
  
  const finalCode = (yearDoomsdayCode + targetDiff) % 7;
  const finalCodeAdjusted = (finalCode + 7) % 7;
  const finalDay = WEEKDAYS[finalCodeAdjusted];

  return {
    centuryStr: `${century}s Anchor`,
    centuryDay: centData.day,
    centuryCode: centData.code,
    yearDigits: Y,
    yearDiv12: a,
    yearRem12: b,
    yearLeaps: c,
    yearOffset,
    yearDoomsdayDay,
    yearDoomsdayCode,
    monthName: MONTH_NAMES[month - 1],
    monthAnchorDay,
    targetDiff,
    targetDiffAbs: Math.abs(targetDiff),
    targetDiffSign,
    finalDay,
  };
}
