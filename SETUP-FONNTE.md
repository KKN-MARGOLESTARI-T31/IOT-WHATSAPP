# Fonnte WhatsApp Bot - Neon Database Integration

Setup guide untuk menggunakan Fonnte API (alternatif Meta WhatsApp API).

## 🎯 Kenapa Fonnte?

- ✅ **Tidak perlu Meta Developer account**
- ✅ **Setup cepat** (< 10 menit)
- ✅ **Lebih mudah** untuk pemula
- ✅ **Support Indonesia** yang baik
- ✅ **Harga terjangkau** (mulai ~50rb/bulan)

---

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Neon Database Account (gratis di [neon.tech](https://neon.tech))
- ✅ Akun Fonnte (daftar di [fonnte.com](https://fonnte.com))

---

## Step 1: Setup Neon Database

1. **Buat Database di Neon**
   - Buka [Neon Console](https://console.neon.tech/)
   - Click "Create Project"
   - Pilih region terdekat
   - Copy Connection String

2. **Jalankan Migration**
   - Buka Neon Console → SQL Editor
   - Copy paste isi file `migration.sql`
   - Click "Run" untuk execute

---

## Step 2: Setup Fonnte Account

### 2.1 Daftar & Login

1. Buka [https://fonnte.com](https://fonnte.com)
2. Klik "Daftar" atau "Sign Up"
3. Isi data:
   - Email
   - Password
   - Nomor WhatsApp
4. Verifikasi email

### 2.2 Isi Pulsa

1. Login ke dashboard Fonnte
2. Klik "Isi Pulsa" di menu
3. Pilih nominal (minimal 50rb untuk mulai)
4. Pilih metode pembayaran:
   - Transfer Bank
   - E-wallet (GoPay, OVO, Dana)
   - QRIS
5. Selesaikan pembayaran

### 2.3 Hubungkan WhatsApp

1. Di dashboard, klik "Device/Perangkat"
2. Klik "Tambah Device"
3. Scan QR Code dengan WhatsApp:
   - Buka WhatsApp di HP
   - Klik titik 3 → Linked Devices
   - Klik "Link a Device"
   - Scan QR code yang muncul
4. ✅ Status berubah jadi "Connected"

### 2.4 Dapatkan Token

1. Di dashboard Fonnte, klik "Account" atau "Setting"
2. Cari section **"API Token"**
3. Copy token (format: `xxxxx+xxxxxxxxxxxxxxx`)
4. Simpan token ini dengan aman

### 2.5 Setup Webhook

1. Di dashboard Fonnte → Setting/Pengaturan
2. Cari **"Webhook URL for Incoming Message"**
3. Isi dengan URL webhook Anda:
   - Development (pakai ngrok): `https://abc123.ngrok.io/api/webhook-fonnte`
   - Production: `https://your-domain.com/api/webhook-fonnte`
4. Click "Save"

---

## Step 3: Configure Project

### 3.1 Install Dependencies

```bash
cd meta-wa-bot
npm install
```

### 3.2 Setup Environment Variables

1. **Copy template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit .env.local**
   ```env
   # Neon Database
   DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

   # Fonnte API Token (dari dashboard Fonnte)
   FONNTE_TOKEN=xxxxx+xxxxxxxxxxxxxxx

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

---

## Step 4: Setup Webhook (Local Development)

Untuk testing local, gunakan ngrok agar Fonnte bisa kirim webhook.

### 4.1 Install & Run ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 3000
```

Output:
```
Forwarding  https://abc123def456.ngrok.io -> http://localhost:3000
```

### 4.2 Update Webhook di Fonnte

1. Copy HTTPS URL dari ngrok (e.g., `https://abc123def456.ngrok.io`)
2. Login Fonnte → Setting
3. Webhook URL: `https://abc123def456.ngrok.io/api/webhook-fonnte`
4. Click "Save"

---

## Step 5: Run Application

```bash
# Start dev server
npm run dev
```

Buka: [http://localhost:3000](http://localhost:3000)

---

## Step 6: Testing

### Test 1: Send Message from Dashboard

1. Buka [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. Di form "Send Message":
   - Phone: `08123456789` (nomor HP Anda)
   - Message: "Test dari Fonnte bot"
3. Klik "Send Message"
4. ✅ Cek WhatsApp, pesan harus masuk

### Test 2: Receive Message

1. Kirim WhatsApp ke nomor yang terkoneksi di Fonnte
2. Tulis: "Halo bot"
3. ✅ Cek [http://localhost:3000/messages](http://localhost:3000/messages)
4. Pesan harus muncul real-time

### Test 3: Auto-Reply

1. Tambah auto-reply rule di Neon SQL Editor:
   ```sql
   INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
   VALUES ('halo', 'Halo! Ada yang bisa saya bantu?', 'exact', true);
   ```

2. Kirim WhatsApp: "halo"
3. ✅ Bot akan auto-reply: "Halo! Ada yang bisa saya bantu?"

---

## Step 7: Production Deployment

### Deploy ke Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fonnte integration"
   git push
   ```

2. **Deploy di Vercel**
   - Login [vercel.com](https://vercel.com)
   - Import project
   - Add environment variables:
     - `DATABASE_URL`
     - `FONNTE_TOKEN`
     - `NEXT_PUBLIC_APP_URL`
   - Deploy

3. **Update Webhook di Fonnte**
   - Production URL: `https://your-app.vercel.app/api/webhook-fonnte`

---

## 💰 Biaya Fonnte

### Paket Harga (estimasi)
- **Starter**: Rp 50.000 - 100.000/bulan
  - ~1000-2000 pesan
  - 1 device
  
- **Regular**: Rp 200.000 - 500.000/bulan
  - ~5000-10000 pesan
  - Multiple devices

### Tips Hemat
- Gunakan auto-reply untuk mengurangi manual chat
- Monitor penggunaan di dashboard
- Set limit di auto-reply rules

---

## 📊 Fonnte vs Meta API

| Feature | Fonnte | Meta WhatsApp API |
|---------|--------|-------------------|
| Setup | ⭐⭐⭐⭐⭐ Mudah | ⭐⭐ Rumit |
| Biaya | 💰 Terjangkau | 💰💰 Enterprise |
| Developer Account | ❌ Tidak perlu | ✅ Wajib Meta Dev |
| Verifikasi Bisnis | ❌ Tidak perlu | ✅ Wajib verifikasi |
| Support | ✅ Indonesia | ⚠️ English only |
| Stability | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🔧 Troubleshooting

### ❌ Token Invalid
**Problem**: Error 401 atau token tidak valid

**Solutions**:
- Cek token di dashboard Fonnte → Account
- Copy ulang token (jangan ada spasi)
- Pastikan pulsa Fonnte masih ada

### ❌ Pesan Tidak Terkirim
**Problem**: Pesan tidak sampai ke WhatsApp

**Solutions**:
- Cek device status di Fonnte (harus "Connected")
- Pastikan pulsa Fonnte cukup
- Cek format phone number (harus 628xxx atau 08xxx)
- Lihat logs di dashboard Fonnte

### ❌ Webhook Tidak Jalan
**Problem**: Pesan masuk tidak tercatat di database

**Solutions**:
- Pastikan ngrok masih running
- Cek webhook URL di Fonnte sudah benar
- Test webhook: kirim pesan, cek ngrok terminal untuk request
- Pastikan endpoint `/api/webhook-fonnte` accessible

### ❌ WhatsApp Terputus
**Problem**: Device status "Disconnected"

**Solutions**:
- Scan ulang QR code
- Pastikan HP tidak logout dari WhatsApp Web
- Check internet connection HP

---

## 📱 Fitur Fonnte yang Bisa Digunakan

### Sudah Terintegrasi
- ✅ Send text message
- ✅ Send image with caption
- ✅ Send document/file
- ✅ Receive incoming messages
- ✅ Auto-reply
- ✅ Webhook notifications

### Bisa Ditambahkan (API tersedia)
- 📋 Broadcast to multiple numbers
- 📋 Send button messages
- 📋 Send template messages
- 📋 Group management
- 📋 Message scheduling

---

## 🎉 Summary

Setup Fonnte lebih mudah dibanding Meta WhatsApp API:

✅ **No Meta Developer Account needed**  
✅ **No Business Verification needed**  
✅ **Quick setup** (10 menit vs 1-2 hari)  
✅ **Indonesia support**  
✅ **Affordable pricing**  

Perfect untuk:
- 🏢 UKM/Small business
- 👨‍💻 Developer pemula
- 🧪 Prototyping & testing
- 📚 Learning project

---

**Need help?**
- Fonnte Docs: [https://docs.fonnte.com](https://docs.fonnte.com)
- WhatsApp Support: Ada di dashboard Fonnte
- Email: support@fonnte.com
