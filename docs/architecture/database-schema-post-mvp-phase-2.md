# 9. Database Schema (Post-MVP - Phase 2)

**Important Note:** This database schema is designed for **Phase 2 implementation** after MVP launch. The MVP operates entirely with localStorage and static files. This section prepares the migration path from localStorage to PostgreSQL via Supabase.

### Migration Strategy: localStorage → PostgreSQL

The database schema is designed to seamlessly accommodate the existing localStorage data structure, enabling smooth migration without breaking changes to the application logic.

### PostgreSQL Schema (Supabase)

```sql
-- Main session tracking table
CREATE TABLE assessment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('en', 'ar')),
    current_step VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_time TIMESTAMP WITH TIME ZONE,
    selected_format VARCHAR(20) CHECK (selected_format IN ('scenarios', 'traits', 'sais')),
    calculated_type VARCHAR(4),
    confidence DECIMAL(3,2),
    progress INTEGER DEFAULT 0,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual question responses
CREATE TABLE question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('core', 'extended')),
    response_type VARCHAR(20) NOT NULL CHECK (response_type IN ('binary', 'distribution')),
    selected_option CHAR(1) CHECK (selected_option IN ('A', 'B')),
    distribution_a INTEGER CHECK (distribution_a BETWEEN 0 AND 5),
    distribution_b INTEGER CHECK (distribution_b BETWEEN 0 AND 5),
    mbti_dimension VARCHAR(4) NOT NULL CHECK (mbti_dimension IN ('E-I', 'S-N', 'T-F', 'J-P')),
    response_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER, -- milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- SAIS distribution constraint
    CONSTRAINT valid_sais_distribution 
        CHECK (
            (response_type = 'distribution' AND distribution_a + distribution_b = 5) 
            OR response_type = 'binary'
        )
);

-- MBTI calculation results
CREATE TABLE mbti_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    calculated_type VARCHAR(4) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    assessment_format VARCHAR(20) NOT NULL,
    language VARCHAR(2) NOT NULL,
    
    -- Dimension scores
    ei_score DECIMAL(3,2) NOT NULL,
    ei_preference CHAR(1) NOT NULL CHECK (ei_preference IN ('E', 'I')),
    sn_score DECIMAL(3,2) NOT NULL,
    sn_preference CHAR(1) NOT NULL CHECK (sn_preference IN ('S', 'N')),
    tf_score DECIMAL(3,2) NOT NULL,
    tf_preference CHAR(1) NOT NULL CHECK (tf_preference IN ('T', 'F')),
    jp_score DECIMAL(3,2) NOT NULL,
    jp_preference CHAR(1) NOT NULL CHECK (jp_preference IN ('J', 'P')),
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat conversation logs
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    language VARCHAR(2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching lead capture
CREATE TABLE coaching_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    mbti_type VARCHAR(4),
    interest_level VARCHAR(20) CHECK (interest_level IN ('low', 'medium', 'high')),
    preferred_contact VARCHAR(20) CHECK (preferred_contact IN ('email', 'phone', 'whatsapp')),
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_session_id ON assessment_sessions(session_id);
CREATE INDEX idx_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_results_session_id ON mbti_results(session_id);
CREATE INDEX idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX idx_leads_submitted_at ON coaching_leads(submitted_at);

-- Row Level Security (RLS) policies
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_leads ENABLE ROW LEVEL SECURITY;

-- Migration utility function
CREATE OR REPLACE FUNCTION migrate_localstorage_session(
    p_session_data JSONB
) RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
BEGIN
    -- Insert main session
    INSERT INTO assessment_sessions (
        session_id, language, current_step, start_time,
        selected_format, calculated_type, progress, is_complete
    ) VALUES (
        p_session_data->>'sessionId',
        p_session_data->>'language',
        p_session_data->>'currentStep',
        (p_session_data->>'startTime')::timestamp,
        p_session_data->>'selectedFormat',
        p_session_data->>'calculatedType',
        (p_session_data->>'progress')::integer,
        (p_session_data->>'isComplete')::boolean
    ) RETURNING id INTO v_session_id;
    
    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;
```
