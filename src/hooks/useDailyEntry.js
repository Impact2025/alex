import { useState, useEffect } from 'react';
import * as dailyEntryService from '../dailyEntryService';
import { useAuth } from '../contexts/AuthContext';
import { announceSuccess, announceError } from '../utils/announcer';

/**
 * Custom hook for managing daily entries
 * Handles loading, saving, and syncing daily wellness data
 */
export const useDailyEntry = () => {
  const { user } = useAuth();
  const [dailyEntry, setDailyEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load today's entry on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadTodayEntry();
  }, [user]);

  const loadTodayEntry = async () => {
    try {
      setLoading(true);
      setError(null);

      const entry = await dailyEntryService.getTodayEntry(user.id);
      setDailyEntry(entry);
    } catch (err) {
      console.error('Error loading daily entry:', err);
      setError(err.message);
      announceError('Failed to load daily entry');
    } finally {
      setLoading(false);
    }
  };

  const saveDailyEntry = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const saved = await dailyEntryService.saveTodayEntry(user.id, data);
      setDailyEntry(saved);

      announceSuccess('Daily entry saved');
      return { success: true, data: saved };
    } catch (err) {
      console.error('Error saving daily entry:', err);
      setError(err.message);
      announceError('Failed to save daily entry');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDailyEntry = async (updates) => {
    try {
      const updated = {
        ...dailyEntry,
        ...updates
      };

      const result = await saveDailyEntry(updated);
      return result;
    } catch (err) {
      console.error('Error updating daily entry:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    dailyEntry,
    loading,
    error,
    loadTodayEntry,
    saveDailyEntry,
    updateDailyEntry
  };
};

export default useDailyEntry;
