/**
 * Realistic sample data for the Smart Gap Finder prototype.
 * No live York University system integrations — this is fixture data only.
 *
 * Times are stored as 24-hour "HH:MM" strings for easy comparison and
 * formatted for display with formatTime().
 */

// --- Sample class timetable for one commuter student -----------------------
// A full week (Mon–Fri) of realistic York University CS/commuter classes.
export const SAMPLE_TIMETABLE = [
  {
    id: 'mon-c1',
    day: 'Monday',
    course: 'ADMS 2590',
    title: 'Management Accounting',
    location: 'Seymour Schulich Bldg, Rm 118',
    start: '08:30',
    end: '10:00',
  },
  {
    id: 'mon-c2',
    day: 'Monday',
    course: 'EECS 3461',
    title: 'User Interfaces',
    location: 'Lassonde Bldg, Rm 105',
    start: '13:00',
    end: '14:30',
  },
  {
    id: 'tue-c1',
    day: 'Tuesday',
    course: 'EECS 1012',
    title: 'Net-Centric Intro to Computing',
    location: 'Bergeron Centre, Rm 101',
    start: '09:00',
    end: '10:00',
  },
  {
    id: 'tue-c2',
    day: 'Tuesday',
    course: 'EECS 3461',
    title: 'User Interfaces — Lab',
    location: 'Lassondon Bldg, Rm 220',
    start: '12:00',
    end: '13:00',
  },
  {
    id: 'wed-c1',
    day: 'Wednesday',
    course: 'ADMS 2590',
    title: 'Management Accounting',
    location: 'Seymour Schulich Bldg, Rm 118',
    start: '08:30',
    end: '10:00',
  },
  {
    id: 'wed-c2',
    day: 'Wednesday',
    course: 'EECS 3101',
    title: 'Design and Analysis of Algorithms',
    location: 'Vari Hall, Rm 1010',
    start: '11:30',
    end: '13:00',
  },
  {
    id: 'thu-c1',
    day: 'Thursday',
    course: 'EECS 1012',
    title: 'Net-Centric Intro to Computing',
    location: 'Bergeron Centre, Rm 101',
    start: '09:00',
    end: '10:00',
  },
  {
    id: 'fri-c1',
    day: 'Friday',
    course: 'EECS 3101',
    title: 'Design and Analysis of Algorithms',
    location: 'Vari Hall, Rm 1010',
    start: '11:30',
    end: '13:00',
  },
  {
    id: 'fri-c2',
    day: 'Friday',
    course: 'ADMS 2590',
    title: 'Management Accounting — Tutorial',
    location: 'Seymour Schulich Bldg, Rm 205',
    start: '15:00',
    end: '16:00',
  },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// --- Workout library ------------------------------------------------------
// Each workout lists a duration (minutes) and a short exercise list so the
// plan summary reads naturally. Only workouts whose duration fits inside a
// gap (with a small buffer to reach the gym and change) are recommended.
export const WORKOUTS = [
  {
    id: 'w-quick-strength',
    name: 'Quick Strength',
    minutes: 30,
    type: 'Strength',
    level: 'Beginner',
    exercises: [
      'Goblet squats — 3×8',
      'Dumbbell rows — 3×8',
      'Push-ups — 3×10',
      'Plank hold — 3×30s',
    ],
  },
  {
    id: 'w-express-hiit',
    name: 'Express HIIT',
    minutes: 20,
    type: 'Cardio',
    level: 'Intermediate',
    exercises: [
      'Burpees — 30s on / 15s rest',
      'Mountain climbers — 30s on / 15s rest',
      'Jump squats — 30s on / 15s rest',
      'Repeat circuit 3×',
    ],
  },
  {
    id: 'w-mobility-stretch',
    name: 'Mobility & Stretch',
    minutes: 15,
    type: 'Recovery',
    level: 'All levels',
    exercises: [
      'Hip openers — 90s each side',
      'Cat-cow flow — 60s',
      'Thoracic rotations — 60s each way',
      'Hamstring stretch — 60s each side',
    ],
  },
  {
    id: 'w-upper-body',
    name: 'Upper Body Basics',
    minutes: 45,
    type: 'Strength',
    level: 'Intermediate',
    exercises: [
      'Bench press — 4×6',
      'Seated rows — 4×8',
      'Shoulder press — 3×8',
      'Bicep curls — 3×10',
    ],
  },
  {
    id: 'w-leg-day',
    name: 'Leg Day Express',
    minutes: 40,
    type: 'Strength',
    level: 'Intermediate',
    exercises: [
      'Back squats — 4×6',
      'Romanian deadlifts — 3×8',
      'Walking lunges — 3×10',
      'Calf raises — 3×15',
    ],
  },
  {
    id: 'w-cardio-run',
    name: 'Treadmill Run',
    minutes: 25,
    type: 'Cardio',
    level: 'Intermediate',
    exercises: [
      '5 min warm-up walk',
      '15 min steady run',
      '5 min cool-down walk',
    ],
  },
  {
    id: 'w-core-circuit',
    name: 'Core Circuit',
    minutes: 15,
    type: 'Strength',
    level: 'Beginner',
    exercises: [
      'Dead bugs — 45s',
      'Bicycle crunches — 45s',
      'Russian twists — 45s',
      'Repeat 3×',
    ],
  },
];

// --- Gym occupancy predictions --------------------------------------------
// Predicted average occupancy at the Tait McKenzie fitness centre, keyed by
// hour-of-day (24h). Derived from typical student gym traffic patterns.
// 'Low' = plenty of free equipment, 'Medium' = may wait for popular machines,
// 'High' = expect crowding.
export const OCCUPANCY_BY_HOUR = {
  6: 'Low',
  7: 'Low',
  8: 'Medium',
  9: 'Medium',
  10: 'Low',
  11: 'Low',
  12: 'High',
  13: 'High',
  14: 'Medium',
  15: 'Medium',
  16: 'High',
  17: 'High',
  18: 'High',
  19: 'High',
  20: 'Medium',
  21: 'Low',
  22: 'Low',
};

// Minimum buffer (minutes) reserved for walking to the gym and changing, so a
// recommended workout never starts the instant a class ends.
export const TRAVEL_BUFFER_MIN = 15;

// Earliest and latest the gym is open (24h).
export const GYM_OPEN = '06:00';
export const GYM_CLOSE = '23:00';

// --- Helpers --------------------------------------------------------------

/** Convert "HH:MM" to minutes since midnight. */
export function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Convert minutes since midnight back to "HH:MM". */
export function fromMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Format "HH:MM" (24h) as "h:mm AM/PM". */
export function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Predicted occupancy level for a gap, based on its start hour. */
export function occupancyForGap(gap) {
  const startHour = Math.floor(toMinutes(gap.start) / 60);
  return OCCUPANCY_BY_HOUR[startHour] || 'Medium';
}

/**
 * Compute free gaps between classes for a given day.
 * A gap is the window between one class ending and the next starting, bounded
 * by gym opening hours. Only gaps >= buffer + 15 min are considered usable.
 */
export function findGapsForDay(classes) {
  if (!classes || classes.length === 0) {
    return [];
  }
  const sorted = [...classes].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  const gaps = [];
  const openMins = toMinutes(GYM_OPEN);
  const closeMins = toMinutes(GYM_CLOSE);

  for (let i = 0; i < sorted.length; i++) {
    const gapStart = Math.max(toMinutes(sorted[i].end), openMins);
    const gapEnd = i + 1 < sorted.length
      ? Math.min(toMinutes(sorted[i + 1].start), closeMins)
      : closeMins;

    const duration = gapEnd - gapStart;
    const usableMinutes = duration - TRAVEL_BUFFER_MIN;
    if (gapEnd > gapStart && usableMinutes >= 15) {
      gaps.push({
        id: `gap-${sorted[i].id}`,
        start: fromMinutes(gapStart),
        end: fromMinutes(gapEnd),
        duration,
        usableMinutes,
        afterClass: sorted[i],
        beforeClass: i + 1 < sorted.length ? sorted[i + 1] : null,
      });
    }
  }
  return gaps;
}

/**
 * Recommend workouts that fit within a gap's usable time.
 * Sorted shortest-first so the most likely-to-fit option appears first.
 */
export function recommendWorkouts(gap) {
  return WORKOUTS
    .filter((w) => w.minutes <= gap.usableMinutes)
    .sort((a, b) => a.minutes - b.minutes);
}
