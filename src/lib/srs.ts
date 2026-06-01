import { SRSRecord } from '../types';

/**
 * SuperMemo-2 (SM-2) Algorithm Implementation.
 * 
 * Quality values:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout.
 */
export function calculateNextReview(record: SRSRecord, quality: number): SRSRecord {
  let { repetition, interval, easiness } = record;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < 1.3) {
    easiness = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...record,
    repetition,
    interval,
    easiness,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

export function createNewSRSRecord(id: string, wordArabic: string, wordEnglish: string): SRSRecord {
  return {
    id,
    wordArabic,
    wordEnglish,
    repetition: 0,
    interval: 1,
    easiness: 2.5,
    nextReviewDate: new Date().toISOString(), // Due immediately
  };
}
