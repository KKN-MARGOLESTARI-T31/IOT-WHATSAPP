# 🚀 Quick Start - Fonnte Integration

Panduan super cepat untuk mulai menggunakan WhatsApp bot dengan Fonnte.

## ✅ Checklist Setup (10 menit)

### 1. Neon Database (2 menit)
```bash
# 1. Buka https://console.neon.tech/
# 2. Create Project → Copy connection string
# 3. SQL Editor → Paste isi migration.sql → Run
```

### 2. Fonnte Account (5 menit)
```bash
# 1. Daftar di https://fonnte.com
# 2. Isi pulsa minimal 50rb
# 3. Hubungkan WhatsApp (scan QR)
# 4. Copy API token dari Account/Setting
```

### 3. Setup Project (3 menit)
```bash
# Clone & install
git clone <repo-url>
cd meta-wa-bot
npm install

# Environment
cp .env.example .env.local

# Edit .env.local dengan:
# - DATABASE_URL dari Neon
# - FONNTE_TOKEN dari Fonnte

# Run!
npm run dev
```

---

## 🧪 Testing (2 menit)

### Test 1: Send Message
1. Buka http://localhost:3000/dashboard
2. Isi phone: `08123456789`
3. Tulis message → Send
4. ✅ Cek WhatsApp

### Test 2: Receive Message (dengan ngrok)
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Ngrok
ngrok http 3000

# Fonnte → Setting → Webhook URL:
# https://xxx.ngrok.io/api/webhook-fonnte

# Kirim WA → Cek /messages page
```

### Test 3: Auto-Reply
```sql
-- Neon SQL Editor
INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
VALUES ('halo', 'Halo! Saya bot 🤖', 'exact', true);

-- Kirim WA: "halo"
-- Bot auto-reply! ✅
```

---

## 📱 Format Phone Number

Fonnte accept:
- ✅ `628123456789` (recommended)
- ✅ `08123456789` (auto-convert)
- ✅ `+628123456789`

---

## 💡 Tips

1. **Hemat Pulsa**: Gunakan auto-reply untuk FAQ
2. **Monitor**: Check dashboard Fonnte untuk usage
3. **Production**: Deploy ke Vercel (gratis!)
4. **Backup**: Neon auto-backup database

---

## 📚 Dokumentasi Lengkap

- [SETUP-FONNTE.md](./SETUP-FONNTE.md) - Complete guide
- [README.md](./README.md) - Project overview
- [Fonnte Docs](https://docs.fonnte.com) - API reference

---

## 🆘 Need Help?

**Common issues:**
- Token invalid → Cek di Fonnte dashboard
- Pesan tidak terkirim → Cek device status & pulsa
- Webhook tidak jalan → Pastikan ngrok running

**Support:**
- Fonnte: support@fonnte.com
- WhatsApp support langsung dari dashboard Fonnte

---

**🎉 Selamat! Bot WhatsApp Anda siap digunakan!**
