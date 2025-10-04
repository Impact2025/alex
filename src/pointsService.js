import { supabase } from './supabaseClient';

// Get or create user points record
export const getUserPoints = async (userId) => {
  try {
    let { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No record exists, create one
      const { data: newRecord, error: insertError } = await supabase
        .from('user_points')
        .insert([{
          user_id: userId,
          total_points: 0,
          weekly_points: 0,
          current_streak: 0,
          unlocked_achievements: [],
          activity_counts: {
            early_bird: 0,
            quotes_read: 0,
            match_rituals: 0,
            breathing_sessions: 0,
            toolbox_uses: 0,
            perfect_preps: 0
          }
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newRecord;
    }

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error getting user points:', err);
    return null;
  }
};

// Update user points
export const updateUserPoints = async (userId, pointsData) => {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: pointsData.totalPoints,
        weekly_points: pointsData.weeklyPoints,
        current_streak: pointsData.currentStreak,
        unlocked_achievements: pointsData.unlockedAchievements,
        activity_counts: pointsData.activityCounts,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating user points:', err);
    return null;
  }
};

// Save points to database (debounced to avoid too many writes)
let saveTimeout = null;
export const savePointsDebounced = (userId, pointsData) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    updateUserPoints(userId, pointsData);
  }, 1000); // Save 1 second after last change
};
