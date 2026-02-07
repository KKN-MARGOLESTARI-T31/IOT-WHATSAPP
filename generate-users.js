const bcrypt = require('bcryptjs');
const fs = require('fs');

// Generate hashes
const hash1 = bcrypt.hashSync('admin123', 10);
const hash2 = bcrypt.hashSync('ladusing', 10);

console.log('Generated hashes:');
console.log('User 1 (admin@whatsappbot.com):');
console.log('  Password: admin123');
console.log('  Hash:', hash1);
console.log('');
console.log('User 2 (stinart123@gmail.com):');
console.log('  Password: ladusing');
console.log('  Hash:', hash2);
console.log('');

// Generate SQL
const sql = `-- Auto-generated User Seeds
-- Generated: ${new Date().toISOString()}

-- User 1: admin@whatsappbot.com
-- Password: admin123
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'admin@whatsappbot.com',
  '${hash1}',
  'Admin User',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '${hash1}',
    is_active = true;

-- User 2: stinart123@gmail.com
-- Password: ladusing
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'stinart123@gmail.com',
  '${hash2}',
  'Stinart User',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = '${hash2}',
    is_active = true;

-- Verify
SELECT id, email, name, role, is_active FROM users ORDER BY id;
`;

// Save to file
fs.writeFileSync('seed-users-final.sql', sql);
console.log('SQL saved to: seed-users-final.sql');
console.log('');
console.log('Verify hashes:');
console.log('admin123 matches:', bcrypt.compareSync('admin123', hash1));
console.log('ladusing matches:', bcrypt.compareSync('ladusing', hash2));
