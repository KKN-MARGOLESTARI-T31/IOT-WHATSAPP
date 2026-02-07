-- Add New User: stinart123@gmail.com
-- Password: ladusing
-- Hash generated via bcrypt (rounds=10)

INSERT INTO users (email, password_hash, name, role)
VALUES (
  'stinart123@gmail.com',
  '$2b$10$.bhbkbOzQVuFJe25svirax4a0YS1HsijjjXP8xGzLaJFkEpa',
  'Stinart User',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '$2b$10$.bhbkbOzQVuFJe25svirax4a0YS1HsijjjXP8xGzLaJFkEpa';

-- Verify
SELECT id, email, name, role, is_active, created_at
FROM users
WHERE email = 'stinart123@gmail.com';
