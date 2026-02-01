# Setup Guide - Meta WhatsApp Bot

Panduan langkah demi langkah untuk setup aplikasi WhatsApp Bot dengan Meta API dan Neon Database.

## Prerequisite

Sebelum memulai, pastikan Anda memiliki:
- ✅ Node.js 18+ installed
- ✅ Git installed  
- ✅ Meta Business Account
- ✅ Neon Database Account (gratis di [neon.tech](https://neon.tech))

---

## Step 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd meta-wa-bot

# Install dependencies
npm install
```

---

## Step 2: Setup Neon Database

1. **Buat Database di Neon**
   - Buka [Neon Console](https://console.neon.tech/)
   - Click "Create Project"
   - Pilih region terdekat
   - Copy Connection String

2. **Jalankan Migration**
   - Buka Neon Console → SQL Editor
   - Copy paste isi file `migration.sql`
   - Click "Run" untuk execute semua SQL commands

3. **Verify Tables Created**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   
   Should show: `contacts`, `messages`, `config`, `auto_reply_rules`, `broadcast_campaigns`, `broadcast_recipients`

---

## Step 3: Setup Meta WhatsApp Business API

### 3.1 Create Meta App

1. Buka [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Pilih "Business" sebagai app type
4. Isi App Name, Contact Email
5. Click "Create App"

### 3.2 Add WhatsApp Product

1. Di App Dashboard, scroll ke "Add Products"
2. Find "WhatsApp" → Click "Set Up"
3. Pilih atau buat Business Portfolio

### 3.3 Get Phone Number ID

1. Buka WhatsApp → Getting Started
2. Di section "Send and receive messages"
3. Copy **Phone Number ID** (format: 123456789012345)
4. Copy **WhatsApp Business Account ID**

### 3.4 Generate Access Token

#### For Testing (24 hours)
1. Di WhatsApp → API Setup
2. Copy **Temporary Access Token**

#### For Production (Permanent)
1. Buka Meta Business Settings → System Users
2. Create System User
3. Generate Token → Select permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
4. Never expires → Copy token

### 3.5 Send Test Message

Test di WhatsApp → Getting Started → Send Message:
```bash
curl -X POST \
  'https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages' \
  -H 'Authorization: Bearer ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "to": "62812XXXXXXXX",
    "type": "text",
    "text": {
      "body": "Hello from WhatsApp API!"
    }
  }'
```

Jika berhasil, Anda akan terima pesan di WhatsApp!

---

## Step 4: Configure Environment Variables

1. **Copy template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit .env.local**
   ```env
   # Paste connection string dari Neon
   DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

   # Meta WhatsApp API
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxx

   # Generate random string untuk webhook verification
   WEBHOOK_VERIFY_TOKEN=my_super_secret_token_12345

   # For local development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

---

## Step 5: Setup Webhook (Local Development)

Untuk menerima pesan, Meta perlu akses ke webhook endpoint Anda.
Karena localhost tidak accessible dari internet, gunakan ngrok.

### 5.1 Install & Run ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel ke port 3000
ngrok http 3000
```

Output akan seperti ini:
```
Forwarding  https://abc123def456.ngrok.io -> http://localhost:3000
```

Copy HTTPS URL (e.g., `https://abc123def456.ngrok.io`)

### 5.2 Configure Webhook di Meta

1. Buka WhatsApp → Configuration → Webhook
2. Click "Edit"
3. **Callback URL**: `https://abc123def456.ngrok.io/api/webhook`
4. **Verify Token**: `my_super_secret_token_12345` (sama dengan .env.local)
5. Click "Verify and Save"

✅ Jika sukses, akan ada checkmark hijau.

6. Click "Manage" → Subscribe to:
   - ✅ `messages`
   - ✅ `message_status_updates`

---

## Step 6: Run Application

```bash
# Start development server
npm run dev
```

Buka browser: [http://localhost:3000](http://localhost:3000)

---

## Step 7: Test Complete Flow

### Test 1: Send Message from Dashboard
1. Buka [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. Isi phone number: `628123456789` (ganti dengan nomor WhatsApp Anda)
3. Tulis pesan: "Test dari dashboard"
4. Click "Send Message"
5. ✅ Cek WhatsApp Anda, pesan harus masuk

### Test 2: Receive Message
1. Kirim WhatsApp ke test number dari Meta (nomor yang ada di Getting Started)
2. Tulis: "Halo bot"
3. ✅ Cek [http://localhost:3000/messages](http://localhost:3000/messages)
4. Pesan harus muncul di list

### Test 3: Auto-Reply
1. Tambah auto-reply rule di Neon SQL Editor:
   ```sql
   INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
   VALUES ('test', 'Terima kasih telah mengirim test!', 'contains', true);
   ```

2. Kirim WhatsApp: "test aja"
3. ✅ Bot akan auto-reply: "Terima kasih telah mengirim test!"

---

## Step 8: Production Deployment

### Deploy ke Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy di Vercel**
   - Login [Vercel](https://vercel.com/)
   - Click "Import Project"
   - Select repository
   - Add Environment Variables (copy dari .env.local)
   - Click "Deploy"

3. **Update Webhook URL**
   - Setelah deploy, copy production URL (e.g., `https://my-wa-bot.vercel.app`)
   - Buka Meta WhatsApp → Configuration → Webhook
   - Edit Callback URL: `https://my-wa-bot.vercel.app/api/webhook`
   - Click "Verify and Save"

4. **Update .env Production**
   ```env
   NEXT_PUBLIC_APP_URL=https://my-wa-bot.vercel.app
   ```

---

## Common Issues & Solutions

### ❌ Webhook Verification Failed
**Problem**: Meta can't verify webhook
**Solutions**:
- Pastikan ngrok running
- Pastikan Next.js dev server running
- `WEBHOOK_VERIFY_TOKEN` di .env.local sama dengan Meta settings
- Check ngrok URL masih aktif (free tier expires setiap 2 jam)

### ❌ Database Connection Error
**Problem**: `DATABASE_URL environment variable is not set`
**Solutions**:
- File harus `.env.local` bukan `.env`
- Restart dev server setelah ubah .env.local
- Pastikan connection string valid

### ❌ Message Send Failed
**Problem**: Error 403 atau 401
**Solutions**:
- Access token expired (regenerate)
- Phone Number ID salah
- Phone number format salah (harus: country_code + number, no spaces)

### ❌ Message Not Received
**Problem**: Kirim WA tapi tidak masuk database
**Solutions**:
- Cek webhook subscribed to `messages`
- Check ngrok terminal untuk incoming requests
- Buka browser console di /messages page untuk errors
- Check Meta Dashboard → Webhooks untuk delivery logs

---

## Next Steps

✅ Setup complete! Sekarang Anda bisa:
- Monitor messages di Dashboard
- Send messages dari UI
- Setup auto-reply rules
- View contact list
- Check statistics

📚 Baca [README.md](./README.md) untuk dokumentasi lengkap.

---

**🎉 Selamat! WhatsApp Bot Anda sudah siap digunakan!**
