/**
 * Daywise Structured Lessons Database
 * Contains details, content slides, math walkthrough examples, and checkpoint quizzes
 * for John Conway's Doomsday Rule training.
 */
export const LESSONS = [
  {
    id: "the-idea",
    title: "1. The Idea",
    description: "Discover what the Doomsday Rule is and why anyone can calculate calendar days in their head.",
    estimatedTime: "4 mins",
    order: 1,
    sections: [
      {
        title: "The Calendar Secret",
        text: "The Doomsday Rule is an algorithm designed by mathematician John Conway. It lets you determine the day of the week for any date without looking at a calendar. It works because every year has a 'Doomsday'—a specific day of the week that falls on several highly memorable calendar dates.",
      },
      {
        title: "The Mappings",
        text: "To perform calculations mentally, we represent weekdays as codes from 0 to 6. Memorize this sequence:\n\n0 = Sunday (None)\n1 = Monday\n2 = Tuesday\n3 = Wednesday\n4 = Thursday\n5 = Friday\n6 = Saturday\n\nThink of Sunday as '0' and Saturday as '6'. All calculations are done modulo 7.",
      },
    ],
    examples: [
      {
        date: "Sunday",
        steps: ["Sunday corresponds to Code 0.", "Adding 3 days: 0 + 3 = Code 3 (Wednesday)."],
      },
    ],
    quiz: {
      question: "Which day of the week corresponds to code 5?",
      options: ["Tuesday", "Thursday", "Friday", "Saturday"],
      correct: "Friday",
      explanation: "Weekdays are coded as 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat.",
    },
  },
  {
    id: "anchor-days",
    title: "2. Anchor Days",
    description: "Learn how dates sync within a year, sharing the exact same day of the week.",
    estimatedTime: "5 mins",
    order: 2,
    sections: [
      {
        title: "Synchronized Dates",
        text: "In any single year, certain dates are guaranteed to fall on the exact same weekday. For example, in 2026, April 4th, June 6th, and August 8th are all Saturdays. If you know that one of these dates is a Saturday, you instantly know the others are too!",
      },
      {
        title: "The Key Weekday",
        text: "This shared weekday is called the year's 'Doomsday'. Every year has its own Doomsday. Once you calculate this single day, finding any other date's weekday becomes a matter of counting days relative to the nearest synchronized anchor date.",
      },
    ],
    examples: [
      {
        date: "Sync Check",
        steps: [
          "If December 12 (12/12) is Tuesday in a certain year, then June 6 (6/6) and August 8 (8/8) are also Tuesdays in that same year.",
        ],
      },
    ],
    quiz: {
      question: "If a year's Doomsday is Thursday, what day of the week is June 6 (6/6)?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: "Thursday",
      explanation: "June 6 (6/6) is a Doomsday anchor date. Therefore, it always falls on the year's Doomsday, which is Thursday in this example.",
    },
  },
  {
    id: "century-anchors",
    title: "3. Century Anchors",
    description: "Determine the starting anchor day for any historical century in history.",
    estimatedTime: "6 mins",
    order: 3,
    sections: [
      {
        title: "Century Cycles",
        text: "The Gregorian calendar repeats its pattern every 400 years. Because of this, century anchor days cycle in a predictable 4-step sequence: Friday, Wednesday, Tuesday, Sunday. We use these anchors as the baseline day code for the start of each century.",
      },
      {
        title: "Century Anchors to Memorize",
        text: "Keep these four standard anchor codes in mind:\n\n• 1800s (1800-1899) = Friday (Code 5)\n• 1900s (1900-1999) = Wednesday (Code 3)\n• 2000s (2000-2099) = Tuesday (Code 2)\n• 2100s (2100-2199) = Sunday (Code 0)\n\nThese repeat (e.g. 1600s was Tuesday, 1700s Sunday, 2200s Friday).",
      },
    ],
    examples: [
      {
        date: "Century Reference",
        steps: [
          "For any year in the 1900s (like 1945), start with anchor Wednesday (Code 3).",
          "For any year in the 2000s (like 2026), start with anchor Tuesday (Code 2).",
        ],
      },
    ],
    quiz: {
      question: "What is the century anchor day code for the 1900s?",
      options: ["0 (Sunday)", "2 (Tuesday)", "3 (Wednesday)", "5 (Friday)"],
      correct: "3 (Wednesday)",
      explanation: "The 1900s century anchor is Wednesday, which corresponds to code 3.",
    },
  },
  {
    id: "year-calculation",
    title: "4. Year Calculation",
    description: "Master Conway's simple division formula to find the year offset.",
    estimatedTime: "8 mins",
    order: 4,
    sections: [
      {
        title: "The Year Offset Formula",
        text: "To find a year's Doomsday, calculate its offset relative to the century anchor. Let Y be the last two digits of the year (e.g., 26 for 2026). Use Conway's division rule:\n\n1. Divide Y by 12: a = Y / 12 (integer division)\n2. Find remainder: b = Y % 12\n3. Leap years in remainder: c = b / 4 (integer division)\n4. Year Offset = (a + b + c) % 7",
      },
      {
        title: "Division Example",
        text: "Let's calculate for year Y = 26:\n\n• 26 / 12 = 2 (so a = 2)\n• 26 % 12 = 2 (so b = 2)\n• 2 / 4 = 0 (so c = 0)\n• Sum = 2 + 2 + 0 = 4.\n\nAdding offset 4 to Tuesday (2000s Century Anchor = 2) gives Saturday (6). Thus, Saturday is the Doomsday for 2026.",
      },
    ],
    examples: [
      {
        date: "Year 1985 (Y=85)",
        steps: [
          "85 / 12 = 7 (a = 7)",
          "85 % 12 = 1 (b = 1)",
          "1 / 4 = 0 (c = 0)",
          "Sum = 7 + 1 + 0 = 8. (8 % 7 = 1 offset).",
          "Century anchor (1900s) = Wednesday (3). Wednesday + 1 day = Thursday.",
        ],
      },
    ],
    quiz: {
      question: "What is the Year Offset sum (a + b + c) for the year 2012 (Y = 12)?",
      options: ["1", "2", "3", "4"],
      correct: "1",
      explanation: "Y = 12. 12 / 12 = 1 (a = 1). 12 % 12 = 0 (b = 0). 0 / 4 = 0 (c = 0). Sum = 1 + 0 + 0 = 1.",
    },
  },
  {
    id: "month-anchors",
    title: "5. Month Anchors",
    description: "Memorize the core dates that fall on Doomsday for all twelve months.",
    estimatedTime: "6 mins",
    order: 5,
    sections: [
      {
        title: "Even Months (The Doubles)",
        text: "Even months correspond directly to double dates, which fall on Doomsday in any year:\n\n• April: 4/4\n• June: 6/6\n• August: 8/8\n• October: 10/10\n• December: 12/12",
      },
      {
        title: "Odd Months (9-to-5 / 7-11)",
        text: "Odd months use inverse pairings, which can be memorized with wordplay:\n\n• May and September (9-to-5): 5/9 (May 9) and 9/5 (Sep 5)\n• July and November (7-11): 7/11 (Jul 11) and 11/7 (Nov 7)\n• March (Pi Day): 3/14",
      },
      {
        title: "January and February",
        text: "January and February anchors change depending on whether it is a leap year:\n\n• Common Years: Jan 3 & Feb 28 (last day of Feb)\n• Leap Years: Jan 4 & Feb 29 (last day of Feb)\n\nTip: Think of these anchors as 3/4 (Jan) and 'last day' (Feb).",
      },
    ],
    examples: [
      {
        date: "October Anchor",
        steps: ["October (month 10) anchor date is 10/10.", "If Doomsday is Friday, October 10 is Friday."],
      },
    ],
    quiz: {
      question: "What is the Doomsday anchor date for September?",
      options: ["September 5", "September 7", "September 9", "September 11"],
      correct: "September 5",
      explanation: "September uses the '9-to-5' pairing. Month 9 (September) anchor is September 5 (9/5).",
    },
  },
  {
    id: "putting-together",
    title: "6. Putting It Together",
    description: "Connect Century, Year, and Month anchors to solve a full calculation.",
    estimatedTime: "7 mins",
    order: 6,
    sections: [
      {
        title: "The Four-Step Routine",
        text: "To calculate any random date:\n\n1. Find Century Anchor code.\n2. Find Year Offset and add it to get the Year Doomsday.\n3. Match the closest Month Doomsday Anchor date.\n4. Add or subtract days from the target date to get the final weekday code.",
      },
      {
        title: "Walkthrough: October 15, 1985",
        text: "Let's perform the calculation:\n\n1. Century (1900s): Wednesday (3).\n2. Year (85): Offset is 1 (85/12 = 7 R 1, 1/4 = 0. Sum = 8 % 7 = 1). Year Doomsday = Wednesday + 1 = Thursday (4).\n3. Month (Oct): Anchor is October 10 (Thursday).\n4. Target (15): October 15 is 5 days after October 10. Thursday (4) + 5 = 9. Modulo 7: 9 - 7 = 2 (Tuesday). Result: Tuesday!",
      },
    ],
    examples: [
      {
        date: "July 24, 2026",
        steps: [
          "Century anchor (2000s) = Tuesday (2).",
          "Year Doomsday (2026) = Saturday (6).",
          "July anchor = July 11 (Saturday).",
          "July 24 is 13 days after July 11. (13 % 7 = 6). Saturday + 6 days = Friday. Result: Friday!",
        ],
      },
    ],
    quiz: {
      question: "If a year's Doomsday is Friday (5), what day of the week is December 15?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      correct: "Tuesday",
      explanation: "December anchor is 12/12 (Friday). December 15 is 3 days after December 12. Friday (5) + 3 days = 8. (8 % 7 = 1) = Monday. Wait, let's look at options: Tuesday, Wednesday, Thursday, Friday? Let's check: Friday + 3 days: Fri (5) -> Sat (6) -> Sun (0) -> Mon (1). Ah! Let's choose the correct mapping. If 12/12 is Friday, 12/15 is Monday. Let's make sure the options include Monday, or let's re-verify: Friday + 3 is Monday. Let's fix the question options in data to include Monday.",
    },
  },
  {
    id: "leap-years",
    title: "7. Leap Years",
    description: "Understand how leap years adjust calculations for January and February.",
    estimatedTime: "5 mins",
    order: 7,
    sections: [
      {
        title: "Divisible by Four",
        text: "Leap years occur every 4 years (divisible by 4, except for century years not divisible by 400). A leap year inserts an extra day (Feb 29). This shift only affects the months *before* the insertion: January and February.",
      },
      {
        title: "Adjusted Anchors",
        text: "For months March through December, anchors remain identical. For Jan and Feb, anchors shift forward by 1 day:\n\n• Common Year: Jan 3, Feb 28\n• Leap Year: Jan 4, Feb 29\n\nAlways check if the year Y is divisible by 4 (e.g. Y=24 is a leap year; Y=26 is a common year).",
      },
    ],
    examples: [
      {
        date: "Leap Check",
        steps: [
          "Year 2024: 24 is divisible by 4 (leap year). January anchor is Jan 4.",
          "Year 2026: 26 is not divisible by 4 (common year). January anchor is Jan 3.",
        ],
      },
    ],
    quiz: {
      question: "What is the Doomsday anchor date for January in a leap year like 2024?",
      options: ["January 1", "January 3", "January 4", "January 5"],
      correct: "January 4",
      explanation: "In leap years, the January Doomsday anchor is January 4 (instead of January 3 in common years).",
    },
  },
  {
    id: "speed-techniques",
    title: "8. Speed Techniques",
    description: "Acquire mental arithmetic shortcuts to cut down solve times to under 5 seconds.",
    estimatedTime: "6 mins",
    order: 8,
    sections: [
      {
        title: "Modulo 7 Shortcuts",
        text: "When counting days forward or backward from an anchor, don't count by ones. Use multiples of 7 (7, 14, 21, 28) to jump close to your target immediately. For example, if July 11 is Monday, then July 25 (11 + 14) is also Monday. July 24 is Tuesday? No, July 24 is one day before Monday = Sunday.",
      },
      {
        title: "Subtraction Shortcuts",
        text: "Instead of adding large numbers, subtract. E.g., if you need to add 6 days, it is equivalent to subtracting 1 day (6 % 7 = -1). Adding 5 days is equivalent to subtracting 2 days. This drastically reduces mental count-up efforts.",
      },
    ],
    examples: [
      {
        date: "Counting Jump",
        steps: [
          "Target: August 29. Anchor: August 8.",
          "August 8 + 21 days (three 7s) = August 29.",
          "So, August 29 falls exactly on Doomsday!",
        ],
      },
    ],
    quiz: {
      question: "Adding 5 days to a weekday is equivalent to subtracting how many days?",
      options: ["1 day", "2 days", "3 days", "4 days"],
      correct: "2 days",
      explanation: "Since weekdays cycle every 7 days, adding 5 days (5) is equivalent to subtracting 2 days (5 - 7 = -2).",
    },
  },
  {
    id: "mental-shortcuts",
    title: "9. Mental Shortcuts",
    description: "Learn to memorize year offsets and anchors for current active decades.",
    estimatedTime: "5 mins",
    order: 9,
    sections: [
      {
        title: "Anchor Memorization",
        text: "If you practice often, you will naturally start memorizing the Doomsday for active years. Instead of calculating from scratch each time, memorize:\n\n• 2024 = Thursday (Code 4)\n• 2025 = Friday (Code 5)\n• 2026 = Saturday (Code 6)\n• 2027 = Sunday (Code 0)\n\nThis shortcuts Steps 1 and 2 entirely, letting you solve recent dates in 2 seconds!",
      },
      {
        title: "Even/Odd Year Hacks",
        text: "For odd years, remember: Conway's formula offset is constant for consecutive years unless crossed by a leap year. Keep a mental map of the current decade anchor codes.",
      },
    ],
    examples: [
      {
        date: "Direct Fetch",
        steps: [
          "Target: May 15, 2026.",
          "We know 2026 Doomsday is Saturday (6).",
          "May anchor is 5/9 (Saturday).",
          "May 15 is 6 days after May 9. Saturday + 6 days = Friday. Result: Friday!",
        ],
      },
    ],
    quiz: {
      question: "What is the Doomsday day code for the year 2026?",
      options: ["Thursday (4)", "Friday (5)", "Saturday (6)", "Sunday (0)"],
      correct: "Saturday (6)",
      explanation: "The Doomsday for 2026 is Saturday (Code 6). In 2026, 4/4, 6/6, 8/8, 10/10, and 12/12 are all Saturdays.",
    },
  },
  {
    id: "mastery",
    title: "10. Mastery",
    description: "Unlock calendar math mastery. Synthesize your training and push your limits.",
    estimatedTime: "6 mins",
    order: 10,
    sections: [
      {
        title: "The Completed Formula",
        text: "You now possess the entire toolset to calculate the weekday for any Gregorian date in history. Practice is the only barrier left to true mental calculation mastery.",
      },
      {
        title: "The Ultimate Flow",
        text: "1. Century: 1800s (5), 1900s (3), 2000s (2), 2100s (0).\n2. Year: (Y/12 + Y%12 + (Y%12)/4) % 7.\n3. Month: Jan (3/4), Feb (28/29), Mar (14), Apr (4), May (9), Jun (6), Jul (11), Aug (8), Sep (5), Oct (10), Nov (7), Dec (12).\n4. Offset: Add/Subtract target distance.\n\nPractice in the Practice Deck to hone this skill!",
      },
    ],
    examples: [
      {
        date: "July 20, 1969",
        steps: [
          "1900s anchor = Wednesday (3).",
          "69 offset = 2 (Sum: 5 + 9 + 2 = 16. 16 % 7 = 2). Year Doomsday = Friday (5).",
          "July anchor = July 11 (Friday).",
          "July 20 is Doomsday + 9. 9 % 7 = 2. Friday + 2 days = Sunday. Result: Sunday!",
        ],
      },
    ],
    quiz: {
      question: "What day of the week was July 20, 1969?",
      options: ["Monday", "Wednesday", "Friday", "Sunday"],
      correct: "Sunday",
      explanation: "As calculated, 1969 Doomsday is Friday. July 11 is Friday. July 20 is 9 days after July 11. Friday + 2 days = Sunday.",
    },
  },
];

// Quick adjustment: fix options/correct key for putting-together quiz to include Monday
LESSONS.find(l => l.id === "putting-together").quiz.options = ["Monday", "Tuesday", "Thursday", "Friday"];
LESSONS.find(l => l.id === "putting-together").quiz.correct = "Monday";
