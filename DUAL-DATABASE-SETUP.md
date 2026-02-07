# Dual Database Setup Guide

Quick setup guide untuk dual database architecture.

## 📋 Overview

Aplikasi menggunakan 2 database Neon terpisah:
- **Auth DB**: User login, sessions, message queue
- **Source DB**: Data eksternal yang akan dikirim ke WhatsApp

## 🚀 Quick Setup

### 1. Create 2 Neon Databases

**Database #1 - Auth Database:**
```bash
# 1. Buka https://console.neon.tech/
# 2. Create new project: "whatsapp-bot-auth"
# 3. Copy connection string
```

**Database #2 - Source Database:**
```bash
# 1. Create another project: "whatsapp-bot-source"
# 2. Copy connection string
# (Atau gunakan database existing yang sudah ada)
```

### 2. Run Migrations

**Auth Database:**
```bash
# Run auth-migration.sql
psql 'postgresql://...auth-db-url...' -f auth-migration.sql
```

**Source Database:**
```bash
# Jika database baru, buat sample table:
psql 'postgresql://...source-db-url...'

# Contoh table untuk testing:
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20),
  message_content TEXT,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Insert sample data:
INSERT INTO notifications (phone_number, message_content)
VALUES ('628123456789', 'Test notification dari database');
```

### 3. Configure Environment

Edit `.env.local`:
```env
# Auth Database (Neon #1)
DATABASE_URL=postgresql://auth-db-connection-string

# Source Database (Neon #2)
SOURCE_DATABASE_URL=postgresql://source-db-connection-string

# Fonnte
FONNTE_TOKEN=your-fonnte-token
```

### 4. Run Application

```bash
npm run dev
```

## 🔐 Default Login

```
Email: admin@whatsappbot.com
Password: admin123
```

> ⚠️ **IMPORTANT**: Change default password setelah first login!

### Change Password (via SQL):

```sql
# Generate new password hash (bcrypt):
# Use online tool: https://bcrypt-generator.com/
# Or use Node.js:
# const bcrypt = require('bcryptjs');
# const hash = await bcrypt.hash('new_password', 10);

UPDATE users 
SET password_hash = '$2a$10$your_new_hash_here'
WHERE email = 'admin@whatsappbot.com';
```

## 📊 Usage Flow

1. **Login** → `/login`
2. **View Source DB** → `/data-source`
3. **Query Data** → API akan fetch data from source DB
4. **Send to WhatsApp** → Select data & send via Fonnte

## 🔧 Customize untuk Source DB Anda

Edit `src/lib/db-source.ts`:

```typescript
// Customize function ini sesuai struktur DB Anda
export async function getDataForNotification() {
  const data = await sourceDb`
    SELECT 
      id,
      phone_number,      -- kolom phone
      your_message_col,  -- kolom message
      created_at
    FROM your_table_name
    WHERE your_condition = true
    LIMIT 100
  `;
  return data;
}
```

## 💡 Common Use Cases

### 1. IoT Sensor Notifications
```sql
-- Source DB
SELECT sensor_id, phone_number, alert_message
FROM sensor_readings
WHERE alert_level = 'CRITICAL' AND sent = false;
```

### 2. Order Notifications
```sql
-- Source DB
SELECT order_id, customer_phone, order_status
FROM orders
WHERE status_changed = true AND notified = false;
```

### 3. Appointment Reminders
```sql
-- Source DB  
SELECT appointment_id, patient_phone, reminder_text
FROM appointments
WHERE DATE(scheduled_date) = CURRENT_DATE + 1
  AND reminded = false;
```

## 🛠️ Troubleshooting

### ❌ "relation does not exist"
- Run `auth-migration.sql` on auth database
- Check DATABASE_URL points to correct DB

### ❌ "Source database not configured"
- Add SOURCE_DATABASE_URL to `.env.local`
- Restart dev server

### ❌ Can't login
- Verify auth-migration.sql was run
- Check default user exists:
  ```sql
  SELECT * FROM users WHERE email = 'admin@whatsappbot.com';
  ```

## 📝 Next Steps

1. Customize `getDataForNotification()` for your source DB
2. Build UI untuk select & preview data
3. Add message template customization
4. Setup cron job for automatic notifications

---

**Need help?** Check `dual-db-plan.md` for architecture details.
