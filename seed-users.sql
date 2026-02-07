-- Seeding 2 Users for WhatsApp Bot
-- Generated: 2026-02-02

-- User 1: admin@whatsappbot.com
-- Password: admin123
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@whatsappbot.com',
  '$2b$10$WKZtZ8Ej/Ej/zbumS.8oCeXZ2PfIyeTWEPNnYTFNLM/7f3uQPriX',
  'Admin User',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '$2b$10$WKZtZ8Ej/Ej/zbumS.8oCeXZ2PfIyeTWEPNnYTFNLM/7f3uQPriX';

-- User 2: stinart123@gmail.com
-- Password: ladusing
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'stinart123@gmail.com',
  '$2b$10$loipaUqRXsfvKFnnHiRWgu',
  'Stinart User',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '$2b$10$loipaUqRXsfvKFnnHiRWgu';

-- Verify all users
SELECT 
  id, 
  email, 
  name, 
  role, 
  is_active,
  created_at
FROM users
ORDER BY id;

SELECT '=== USERS SEEDED ===' as status;
SELECT 'Total users: ' || COUNT(*) as info FROM users;
