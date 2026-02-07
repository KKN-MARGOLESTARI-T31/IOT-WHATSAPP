-- ========================================
-- COMPLETE DATABASE RESET - DELETE EVERYTHING
-- ========================================
-- This will DROP ALL TABLES in the database
-- Run this in Neon SQL Editor for Auth Database

-- ========================================
-- STEP 1: DROP ALL TABLES (COMPREHENSIVE)
-- ========================================

-- Drop ALL tables in public schema
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Drop all sequences
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public')
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
    
    -- Drop all functions
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public')
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.routine_name) || ' CASCADE';
    END LOOP;
END $$;

-- ========================================
-- STEP 2: VERIFY DATABASE IS CLEAN
-- ========================================

SELECT 'Tables before recreation:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- ========================================
-- STEP 3: CREATE NEW TABLES
-- ========================================

-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for auth tokens  
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp configuration
CREATE TABLE wa_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for tracking actions
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Message queue/history (messages sent from source DB)
CREATE TABLE message_queue (
  id SERIAL PRIMARY KEY,
  source_db_ref VARCHAR(255),
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_by INTEGER REFERENCES users(id)
);

-- ========================================
-- STEP 4: CREATE INDEXES
-- ========================================

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_message_queue_status ON message_queue(status);
CREATE INDEX idx_message_queue_created ON message_queue(created_at DESC);

-- ========================================
-- STEP 5: CREATE TRIGGERS
-- ========================================

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wa_config_updated_at 
  BEFORE UPDATE ON wa_config
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- STEP 6: INSERT DEFAULT DATA
-- ========================================

-- Default admin user
-- Email: admin@whatsappbot.com
-- Password: admin123
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@whatsappbot.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin User',
  'admin'
);

-- Default Fonnte configuration
INSERT INTO wa_config (key, value, description)
VALUES 
  ('fonnte_token', '', 'Fonnte API Token'),
  ('default_country_code', '62', 'Default country code for phone numbers (Indonesia)'),
  ('max_batch_size', '100', 'Maximum number of messages to send in one batch');

-- ========================================
-- STEP 7: VERIFY FINAL STATE
-- ========================================

SELECT '=== DATABASE RESET COMPLETE ===' as status;

SELECT 'Tables created:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT 'Default user created:' as info;
SELECT id, email, name, role, is_active, created_at
FROM users;

SELECT 'Config entries:' as info;
SELECT key, value, description
FROM wa_config;

SELECT '=== LOGIN CREDENTIALS ===' as status;
SELECT 'Email: admin@whatsappbot.com' as credential
UNION ALL
SELECT 'Password: admin123';

-- ========================================
-- DONE!
-- ========================================
