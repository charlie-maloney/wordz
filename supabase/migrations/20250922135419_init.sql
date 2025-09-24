-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create words table
CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    added_on TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- Create practice_sessions table
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    steps JSONB NOT NULL,
    total_steps INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create practice_session_results table
CREATE TABLE practice_session_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    word_id UUID REFERENCES words(id) ON DELETE
    SET NULL,
        score_delta INTEGER,
        correct BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create indexes for performance
CREATE INDEX idx_words_user_id ON words(user_id);
CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_words_is_deleted ON words(is_deleted);
CREATE INDEX idx_words_added_on ON words(added_on);
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_created_at ON practice_sessions(created_at);
CREATE INDEX idx_practice_sessions_is_completed ON practice_sessions(is_completed);
CREATE INDEX idx_practice_session_results_session_id ON practice_session_results(session_id);
CREATE INDEX idx_practice_session_results_word_id ON practice_session_results(word_id);
CREATE INDEX idx_user_profiles_is_deleted ON user_profiles(is_deleted);
-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE
UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_words_updated_at BEFORE
UPDATE ON words FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practice_sessions_updated_at BEFORE
UPDATE ON practice_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Add unique constraint for user_id + word combination to prevent duplicates
CREATE UNIQUE INDEX idx_words_user_word_unique ON words(user_id, LOWER(word))
WHERE is_deleted = FALSE;
CREATE UNIQUE INDEX idx_practice_session_results_id_step_id_unique ON practice_session_results (id, step_id);
-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_session_results ENABLE ROW LEVEL SECURITY;
-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR
SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON user_profiles FOR
UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR
INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Users can manage own words" ON words FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own sessions" ON practice_sessions FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own results" ON practice_session_results FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM practice_sessions
        WHERE id = session_id
            AND user_id::text = auth.uid()::text
    )
);
-- deletes anonymous users created more than 30 days ago
delete from auth.users
where is_anonymous is true
    and created_at < now() - interval '30 days';