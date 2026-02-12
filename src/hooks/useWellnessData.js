import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for managing wellness data
 * Handles streaks, history, and wellness metrics
 */
export const useWellnessData = () => {
  const { user } = useAuth();
  const [wellnessData, setWellnessData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadWellnessData();
  }, [user]);

  const loadWellnessData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user's wellness profile
      const { data: profile, error: profileError } = await supabase
        .from('wellness_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setWellnessData(profile || {
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        total_days: 0
      });

      // Load recent history
      const { data: historyData, error: historyError } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(30);

      if (historyError) {
        throw historyError;
      }

      setHistory(historyData || []);
    } catch (err) {
      console.error('Error loading wellness data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async (increment = true) => {
    if (!wellnessData) return;

    try {
      const newStreak = increment
        ? wellnessData.current_streak + 1
        : 0;

      const longestStreak = Math.max(
        wellnessData.longest_streak || 0,
        newStreak
      );

      const { data, error } = await supabase
        .from('wellness_profiles')
        .upsert({
          user_id: user.id,
          current_streak: newStreak,
          longest_streak: longestStreak,
          total_days: (wellnessData.total_days || 0) + (increment ? 1 : 0),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setWellnessData(data);
      return { success: true, data };
    } catch (err) {
      console.error('Error updating streak:', err);
      return { success: false, error: err.message };
    }
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyEntries = history.filter(entry => {
      const entryDate = new Date(entry.entry_date);
      return entryDate >= weekAgo;
    });

    return {
      daysCompleted: weeklyEntries.length,
      totalDays: 7,
      completionRate: Math.round((weeklyEntries.length / 7) * 100),
      entries: weeklyEntries
    };
  };

  return {
    wellnessData,
    history,
    loading,
    error,
    loadWellnessData,
    updateStreak,
    getWeeklyStats
  };
};

export default useWellnessData;
