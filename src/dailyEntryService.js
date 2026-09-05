// Dagelijkse entries worden lokaal opgeslagen (localStorage). De Supabase-client
// is een mock die niets persisteert, dus schrijven/lezen gebeurt hier rechtstreeks
// in localStorage zodat het Logboek daadwerkelijk iets te tonen heeft.
const STORAGE_KEY = 'groeipad_daily_entries';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const readStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const writeStore = (store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const getLocalEntry = (userId, date) => {
  const store = readStore();
  return store[userId]?.[date] || null;
};

const upsertLocalEntry = (userId, date, fields) => {
  const store = readStore();
  if (!store[userId]) store[userId] = {};
  const existing = store[userId][date] || { id: date, user_id: userId, entry_date: date, completed_missions: [] };
  store[userId][date] = { ...existing, ...fields };
  writeStore(store);
  return store[userId][date];
};

// Get or create today's entry
export const getTodayEntry = async (userId) => {
  const today = getTodayDate();
  return getLocalEntry(userId, today) || upsertLocalEntry(userId, today, {});
};

// Save morning check-in data
export const saveMorningCheckin = async (userId, data) => {
  const today = getTodayDate();
  return upsertLocalEntry(userId, today, {
    morning_sleep: data.sleep,
    morning_goal: data.goal,
    morning_physical: data.physical,
    morning_mental: data.mental,
    morning_concentration: data.concentration,
    morning_control: data.control,
  });
};

// Save thoughts
export const saveThoughts = async (userId, thoughts) => {
  const today = getTodayDate();
  return upsertLocalEntry(userId, today, { thoughts });
};

// Mark challenge as completed
export const saveChallenge = async (userId) => {
  const today = getTodayDate();
  return upsertLocalEntry(userId, today, { challenge_completed: true });
};

// Save completed mission
export const saveCompletedMission = async (userId, missionId) => {
  const today = getTodayDate();
  const entry = getLocalEntry(userId, today);
  const currentMissions = entry?.completed_missions || [];
  if (!currentMissions.includes(missionId)) currentMissions.push(missionId);
  return upsertLocalEntry(userId, today, { completed_missions: currentMissions });
};

// Save dribbel data
export const saveDribbelData = async (userId, dare, tryText) => {
  const today = getTodayDate();
  return upsertLocalEntry(userId, today, { dribbel_dare: dare, dribbel_try: tryText });
};

// Save gratitude data (+ optioneel zelfcompassie-antwoord)
export const saveGratitudeData = async (userId, gratitude1, gratitude2, gratitude3, selfCompassion) => {
  const today = getTodayDate();
  return upsertLocalEntry(userId, today, {
    gratitude_1: gratitude1,
    gratitude_2: gratitude2,
    gratitude_3: gratitude3,
    self_compassion: selfCompassion,
  });
};

// Save total points earned today
export const savePointsEarned = async (userId, pointsEarned) => {
  const today = getTodayDate();
  return upsertLocalEntry(userId, today, { points_earned: pointsEarned });
};

// Get all entries for a user (for dagboek view), nieuwste eerst
export const getAllEntries = async (userId, limit = 30) => {
  const store = readStore();
  const entries = Object.values(store[userId] || {});
  return entries
    .sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1))
    .slice(0, limit);
};

// Get specific entry by date
export const getEntryByDate = async (userId, date) => getLocalEntry(userId, date);
