-- Auto-generated User Seeds
-- Generated: 2026-02-01T17:17:49.816Z

-- User 1: admin@whatsappbot.com
-- Password: admin123
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'admin@whatsappbot.com',
  '$2b$10$xs3nZ3BWauSTzo5.FjdTpOuS1T4gWFiL16Co5oCabyFrG24ceV7Ba',
  'Admin User',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '$2b$10$xs3nZ3BWauSTzo5.FjdTpOuS1T4gWFiL16Co5oCabyFrG24ceV7Ba',
    is_active = true;

-- User 2: stinart123@gmail.com
-- Password: ladusing
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'stinart123@gmail.com',
  '$2b$10$ba6BzrqKbdDHWxvS0DLar.6DeoOCMQngE1YUurZP9kQoCylj4xGhu',
  'Stinart User',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '$2b$10$ba6BzrqKbdDHWxvS0DLar.6DeoOCMQngE1YUurZP9kQoCylj4xGhu',
    is_active = true;

-- Verify
SELECT id, email, name, role, is_active FROM users ORDER BY id;
