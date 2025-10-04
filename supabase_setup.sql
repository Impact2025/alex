-- =====================================================
-- AJAX Performance Suite - Database Setup
-- =====================================================
-- Kopieer en plak deze SQL in Supabase SQL Editor
-- (https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new)

-- 1. Create user_points table (persistent points storage)
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  weekly_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  unlocked_achievements JSONB DEFAULT '[]'::jsonb,
  activity_counts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create daily_entries table (dagboek entries)
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ochtend data
  morning_sleep INTEGER,
  morning_goal TEXT,
  morning_physical INTEGER,
  morning_mental INTEGER,
  morning_concentration INTEGER,
  morning_control INTEGER,

  -- Gedachten dump
  thoughts TEXT,

  -- Challenge voltooid
  challenge_completed BOOLEAN DEFAULT FALSE,

  -- Avondritueel missies (completed mission IDs)
  completed_missions JSONB DEFAULT '[]'::jsonb,

  -- Pyjama dribbel
  dribbel_dare TEXT,
  dribbel_try TEXT,

  -- Dankbaarheid (3 items)
  gratitude_1 TEXT,
  gratitude_2 TEXT,
  gratitude_3 TEXT,

  -- Totaal punten verdiend vandaag
  points_earned INTEGER DEFAULT 0,

  -- Unique constraint: one entry per user per day
  UNIQUE(user_id, entry_date)
);

-- 2. Create match_day_entries table (wedstrijddag data)
CREATE TABLE IF NOT EXISTS match_day_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Pre-match rituelen (array of completed ritual IDs)
  pre_match_completed JSONB DEFAULT '{}'::jsonb,

  -- Post-match reflectie
  post_match_rating INTEGER,
  post_match_proud TEXT,
  post_match_improve TEXT,
  post_match_energy TEXT,

  -- Points earned on match day
  points_earned INTEGER DEFAULT 0,

  -- Unique constraint: one match entry per user per day
  UNIQUE(user_id, match_date)
);

-- 3. Enable Row Level Security
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_day_entries ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for user_points
CREATE POLICY "Users can view own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points"
  ON user_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points"
  ON user_points FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. Create RLS Policies for daily_entries
-- Users can only see their own entries
CREATE POLICY "Users can view own daily entries"
  ON daily_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can insert own daily entries"
  ON daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own daily entries"
  ON daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete own daily entries"
  ON daily_entries FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Create RLS Policies for match_day_entries
CREATE POLICY "Users can view own match entries"
  ON match_day_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own match entries"
  ON match_day_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own match entries"
  ON match_day_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own match entries"
  ON match_day_entries FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_points_user_id
  ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date
  ON daily_entries(user_id, entry_date DESC);

CREATE INDEX IF NOT EXISTS idx_match_entries_user_date
  ON match_day_entries(user_id, match_date DESC);

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create triggers for updated_at
CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_match_entries_updated_at
  BEFORE UPDATE ON match_day_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Setup compleet!
-- =====================================================
-- Nu kun je de app gebruiken en alle data wordt
-- automatisch opgeslagen in de database.
-- =====================================================
