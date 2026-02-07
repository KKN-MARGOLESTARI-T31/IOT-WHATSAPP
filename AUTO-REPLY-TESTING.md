# 🧪 Auto-Reply Testing Guide

## ✅ Setup Complete!

Auto-reply system sudah aktif dengan **8 keywords**:

| Keyword | Type | Preview |
|---------|------|---------|
| `help` | exact | 🤖 MENU BANTUAN... |
| `info` | exact | 📱 INFORMASI PRODUK... |
| `harga` | exact | 💰 DAFTAR HARGA... |
| `kontak` | exact | 📞 HUBUNGI KAMI... |
| `status` | exact | 📦 CEK STATUS PESANAN... |
| `terima kasih` | contains | 🙏 Sama-sama!... |
| `halo` | starts_with | 👋 Halo! Selamat datang!... |
| `hai` | starts_with | 👋 Hai! Selamat datang!... |

---

## 🧪 Testing Scenarios

### Test 1: Exact Match - "help"
**Send to WA:**
```
help
```

**Expected Reply:**
```
🤖 *MENU BANTUAN*

1️⃣ HELP - Menu bantuan
2️⃣ INFO - Informasi produk
3️⃣ HARGA - Daftar harga
4️⃣ KONTAK - Hubungi kami
5️⃣ STATUS - Cek status pesanan

Silakan ketik keyword di atas untuk info lebih lanjut.
```

---

### Test 2: Exact Match (Case Insensitive) - "INFO"
**Send to WA:**
```
INFO
```

**Expected Reply:**
```
📱 *INFORMASI PRODUK*

Kami menyediakan:
✅ WhatsApp Bot Automation
✅ Database Integration
✅ Custom Solutions
✅ API Integration

Ketik HARGA untuk lihat paket harga.
```

---

### Test 3: Contains - "terima kasih"
**Send to WA:**
```
oke terima kasih ya
```

**Expected Reply:**
```
🙏 Sama-sama! Senang bisa membantu.

Ada yang bisa kami bantu lagi?
Ketik HELP untuk menu.
```

---

### Test 4: Starts With - "halo"
**Send to WA:**
```
halo kak
```

**Expected Reply:**
```
👋 Halo! Selamat datang!

Ada yang bisa kami bantu?
Ketik HELP untuk lihat menu.
```

---

### Test 5: Harga
**Send to WA:**
```
harga
```

**Expected Reply:**
```
💰 *DAFTAR HARGA*

📦 Paket Basic
Rp 500.000/bulan
- 1000 pesan/hari
- Auto-reply
- Dashboard

📦 Paket Pro
Rp 1.000.000/bulan
- Unlimited pesan
- Advanced features
- Priority support

📦 Paket Enterprise
Hubungi kami untuk custom pricing

Ketik KONTAK untuk info lebih lanjut.
```

---

## 🔧 Setup Webhook (IMPORTANT!)

Agar auto-reply berfungsi, webhook harus disetup di Fonnte:

### 1. **Development (Local Testing)**

Gunakan **ngrok** untuk expose local server:

```bash
# Install ngrok
# Download dari: https://ngrok.com/download

# Run ngrok
ngrok http 3001

# Copy HTTPS URL, contoh:
https://abc123.ngrok.io
```

**Set di Fonnte:**
1. Login ke [fonnte.com](https://fonnte.com)
2. Klik **Settings**
3. **Webhook URL:**
   ```
   https://abc123.ngrok.io/api/webhook-fonnte
   ```
4. Save

---

### 2. **Production (Deployed)**

Setelah deploy ke Vercel/hosting:

**Set di Fonnte:**
1. Login ke [fonnte.com](https://fonnte.com)
2. Klik **Settings**
3. **Webhook URL:**
   ```
   https://your-domain.vercel.app/api/webhook-fonnte
   ```
4. Save

---

## 📞 How to Test

### Step 1: Setup Webhook
- Set webhook URL di Fonnte (lihat di atas)

### Step 2: Send Test Message
- Buka WhatsApp
- Kirim ke nomor device Fonnte Anda
- Ketik: `help`

### Step 3: Check Response
- Bot seharusnya auto-reply dalam 1-2 detik
- Check console/logs untuk debugging

### Step 4: Check Database
```sql
-- Lihat pesan masuk
SELECT * FROM messages 
WHERE direction = 'inbound'
ORDER BY created_at DESC
LIMIT 5;

-- Lihat auto-reply terkirim
SELECT * FROM messages
WHERE direction = 'outbound'
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🐛 Troubleshooting

### ❌ Auto-reply tidak jalan

**Check 1: Webhook URL**
```bash
# Test webhook endpoint
curl https://your-domain.com/api/webhook-fonnte

# Should return:
{"message":"Fonnte webhook endpoint is active","endpoint":"/api/webhook-fonnte"}
```

**Check 2: Table exists**
```sql
SELECT * FROM auto_reply_rules WHERE is_active = true;
-- Should return 8 rows
```

**Check 3: Console logs**
```bash
# Check npm run dev terminal
# Should see:
# "Fonnte webhook received: ..."
# "Auto-reply triggered for message: help"
# "Auto-reply sent to 628xxx"
```

**Check 4: Fonnte device status**
- Login fonnte.com
- Device harus status: **Connected**
- Expiry harus belum lewat

---

## ➕ Add Custom Rules

### Via SQL (Manual)
```sql
INSERT INTO auto_reply_rules (keyword, reply_message, match_type)
VALUES (
  'promo',
  E'🎉 *PROMO SPESIAL*\n\nDiskon 20% untuk paket Pro!\nValid sampai akhir bulan.\n\nKetik HARGA untuk info lengkap.',
  'exact'
);
```

### Via UI (Coming Soon)
Akan ada halaman `/auto-reply` untuk manage rules tanpa SQL.

---

## 📊 Monitor Performance

```sql
-- Keyword paling populer
SELECT 
  ar.keyword,
  COUNT(m.id) as total_triggered
FROM auto_reply_rules ar
LEFT JOIN messages m ON m.message_body ILIKE '%' || ar.keyword || '%'
  AND m.direction = 'inbound'
WHERE ar.is_active = true
GROUP BY ar.keyword
ORDER BY total_triggered DESC;

-- Response time
SELECT 
  AVG(
    EXTRACT(EPOCH FROM (
      SELECT MIN(m2.created_at) 
      FROM messages m2 
      WHERE m2.direction = 'outbound' 
        AND m2.phone_number = m1.phone_number
        AND m2.created_at > m1.created_at
    ) - m1.created_at)
  ) as avg_response_seconds
FROM messages m1
WHERE m1.direction = 'inbound';
```

---

## ✅ Success Checklist

- [x] Table `auto_reply_rules` created
- [x] 8 sample rules inserted
- [x] `checkAutoReply()` function exists
- [x] Webhook endpoint `/api/webhook-fonnte` ready
- [ ] Webhook URL set di Fonnte
- [ ] Test message sent
- [ ] Auto-reply received ✅

---

**Ready to test!** Kirim "help" ke nomor WA Anda sekarang! 🚀
