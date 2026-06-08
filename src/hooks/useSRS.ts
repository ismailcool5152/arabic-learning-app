import { useState, useCallback, useEffect } from 'react';
import { SRSRecord } from '../types';
import { calculateNextReview, createNewSRSRecord } from '../lib/srs';
import { appStorage } from '../lib/appStorage';

export function useSRS() {
  const [records, setRecords] = useState<SRSRecord[]>(() => {
    try {
      const stored = appStorage.getItem('quranic_arabic_srs_records');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [dueCountBadge, setDueCountBadge] = useState(0);

  useEffect(() => {
    try {
      appStorage.setItem('quranic_arabic_srs_records', JSON.stringify(records));
    } catch (e) {}

    // Calculate due count
    const now = new Date();
    const count = records.filter(r => new Date(r.nextReviewDate) <= now).length;
    setDueCountBadge(count);
  }, [records]);

  const addWordToReview = useCallback((id: string, arabic: string, english: string) => {
    setRecords(prev => {
      // Check if already exists
      if (prev.some(r => r.id === id)) {
        return prev;
      }
      return [...prev, createNewSRSRecord(id, arabic, english)];
    });
  }, []);

  const submitReview = useCallback((id: string, quality: number) => {
    setRecords(prev => {
      return prev.map(r => {
        if (r.id === id) {
          return calculateNextReview(r, quality);
        }
        return r;
      });
    });
  }, []);

  const getDueReviews = useCallback(() => {
    const now = new Date();
    return records.filter(r => new Date(r.nextReviewDate) <= now).sort((a, b) => {
      // Sort by interval (ascending), then repetition
      if (a.interval !== b.interval) return a.interval - b.interval;
      return a.repetition - b.repetition;
    });
  }, [records]);

  const getAllRecords = useCallback(() => {
    return [...records];
  }, [records]);

  return {
    records,
    dueCountBadge,
    addWordToReview,
    submitReview,
    getDueReviews,
    getAllRecords
  };
}
