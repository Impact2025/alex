import { supabase } from './supabaseClient';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Get or create today's entry
export const getTodayEntry = async (userId) => {
  const today = getTodayDate();

  try {
    let { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', today)
      .single();

    if (error && error.code === 'PGRST116') {
      // No entry exists, create one
      const { data: newEntry, error: insertError } = await supabase
        .from('daily_entries')
        .insert([{
          user_id: userId,
          entry_date: today,
          completed_missions: []
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newEntry;
    }

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error getting today entry:', err);
    return null;
  }
};

// Save morning check-in data
export const saveMorningCheckin = async (userId, data) => {
  const today = getTodayDate();

  try {
    const { data: result, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        morning_sleep: data.sleep,
        morning_goal: data.goal,
        morning_physical: data.physical,
        morning_mental: data.mental,
        morning_concentration: data.concentration,
        morning_control: data.control
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (err) {
    console.error('Error saving morning checkin:', err);
    return null;
  }
};

// Save thoughts
export const saveThoughts = async (userId, thoughts) => {
  const today = getTodayDate();

  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        thoughts: thoughts
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving thoughts:', err);
    return null;
  }
};

// Mark challenge as completed
export const saveChallenge = async (userId) => {
  const today = getTodayDate();

  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        challenge_completed: true
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving challenge:', err);
    return null;
  }
};

// Save completed mission
export const saveCompletedMission = async (userId, missionId) => {
  const today = getTodayDate();

  try {
    // First get current entry
    const entry = await getTodayEntry(userId);
    const currentMissions = entry?.completed_missions || [];

    // Add new mission if not already there
    if (!currentMissions.includes(missionId)) {
      currentMissions.push(missionId);
    }

    const { data, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        completed_missions: currentMissions
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving mission:', err);
    return null;
  }
};

// Save dribbel data
export const saveDribbelData = async (userId, dare, tryText) => {
  const today = getTodayDate();

  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        dribbel_dare: dare,
        dribbel_try: tryText
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving dribbel:', err);
    return null;
  }
};

// Save gratitude data
export const saveGratitudeData = async (userId, gratitude1, gratitude2, gratitude3) => {
  const today = getTodayDate();

  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        gratitude_1: gratitude1,
        gratitude_2: gratitude2,
        gratitude_3: gratitude3
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving gratitude:', err);
    return null;
  }
};

// Save total points earned today
export const savePointsEarned = async (userId, pointsEarned) => {
  const today = getTodayDate();

  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: userId,
        entry_date: today,
        points_earned: pointsEarned
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving points:', err);
    return null;
  }
};

// Get all entries for a user (for dagboek view)
export const getAllEntries = async (userId, limit = 30) => {
  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error getting entries:', err);
    return [];
  }
};

// Get specific entry by date
export const getEntryByDate = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (err) {
    console.error('Error getting entry by date:', err);
    return null;
  }
};
