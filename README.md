# Fonnte WhatsApp Bot - Neon Database Integration

Web application untuk mengintegrasikan Neon PostgreSQL database dengan WhatsApp menggunakan **Fonnte API**.

> **Why Fonnte?** Tidak perlu Meta Developer account, setup lebih mudah, dan support Indonesia!

## 📋 Features

- ✅ **Send Messages**: Kirim pesan WhatsApp dari dashboard (via Fonnte)
- ✅ **Receive Messages**: Terima pesan via webhook
- ✅ **Contact Management**: Kelola kontak WhatsApp
- ✅ **Message History**: Lihat riwayat pesan (inbound & outbound)
- ✅ **Auto-Reply**: Balas otomatis berdasarkan keyword
- ✅ **Dashboard Statistics**: Monitor aktivitas bot
- 🚧 **Broadcast**: Kirim pesan ke multiple contacts (coming soon)

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL (Serverless)
- **WhatsApp API**: Fonnte
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Akun [Neon Database](https://neon.tech) (gratis)
- Akun [Fonnte](https://fonnte.com) (berbayar, ~50rb/bulan)

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd meta-wa-bot
   npm install
   ```

2. **Setup Database**
   - Buat project di [Neon Console](https://console.neon.tech/)
   - Copy connection string
   - Run `migration.sql` di SQL Editor

3. **Setup Fonnte**
   - Daftar di [fonnte.com](https://fonnte.com)
   - Isi pulsa (minimal 50rb)
   - Hubungkan WhatsApp (scan QR)
   - Copy API token dari dashboard

4. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   DATABASE_URL=postgresql://...
   FONNTE_TOKEN=xxxxx+xxxxxxxxxxxxxxx
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run**
   ```bash
   npm run dev
   ```
   
   Buka [http://localhost:3000](http://localhost:3000)

📚 **Lihat [SETUP-FONNTE.md](./SETUP-FONNTE.md) untuk panduan lengkap!**

---

## 🔌 API Endpoints

### Webhook
- `POST /api/webhook-fonnte` - Receive messages from Fonnte

### Messages
- `GET /api/messages` - Get messages (with optional phone filter)
- `POST /api/messages/send` - Send a message via Fonnte

### Contacts
- `GET /api/contacts` - Get all contacts

### Statistics
- `GET /api/stats` - Get dashboard statistics

---

## 📁 Project Structure

```
meta-wa-bot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── webhook-fonnte/route.ts  # Fonnte webhook
│   │   │   ├── messages/
│   │   │   ├── contacts/route.ts
│   │   │   └── stats/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── contacts/page.tsx
│   │   └── auto-reply/page.tsx
│   ├── components/
│   │   ├── SendMessageForm.tsx
│   │   ├── MessageList.tsx
│   │   ├── ContactList.tsx
│   │   └── Sidebar.tsx
│   └── lib/
│       ├── db.ts                    # Neon database
│       ├── whatsapp-fonnte.ts       # Fonnte API client
│       └── types.ts
├── migration.sql
├── SETUP-FONNTE.md                  # 👈 Setup guide
└── README.md
```

---

## 🤖 Auto-Reply Setup

```sql
-- Tambah rule di Neon SQL Editor
INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
VALUES ('halo', 'Halo! Ada yang bisa saya bantu?', 'exact', true);
```

Match types:
- **exact**: Pesan sama persis dengan keyword
- **contains**: Pesan mengandung keyword
- **starts_with**: Pesan dimulai dengan keyword

---

## 🚀 Deployment

### Deploy ke Vercel

1. Push to GitHub
2. Import di [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`
   - `FONNTE_TOKEN`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy
5. Update webhook di Fonnte → `https://your-app.vercel.app/api/webhook-fonnte`

---

## 💰 Fonnte Pricing

| Paket | Harga/bulan | Pesan |
|-------|-------------|-------|
| Starter | ~Rp 50rb | ~1000 |
| Regular | ~Rp 200rb | ~5000 |

---

## 📊 Fonnte vs Meta API

| Feature | Fonnte | Meta API |
|---------|--------|----------|
| Setup | ⭐⭐⭐⭐⭐ Mudah | ⭐⭐ Rumit |
| Developer Account | ❌ Tidak perlu | ✅ Wajib |
| Biaya | 💰 Terjangkau | 💰💰 Enterprise |
| Support | ✅ Indonesia | ⚠️ English |

---

## 🔧 Troubleshooting

### Token Invalid
- Cek token di dashboard Fonnte → Account
- Pastikan pulsa masih ada

### Pesan Tidak Terkirim  
- Cek device status (harus "Connected")
- Cek format phone: `628xxx` atau `08xxx`
- Lihat logs di dashboard Fonnte

### Webhook Tidak Jalan
- Pastikan webhook URL sudah di-set di Fonnte
- Test dengan ngrok untuk local dev
- Endpoint: `/api/webhook-fonnte`

**Lihat [SETUP-FONNTE.md](./SETUP-FONNTE.md) untuk troubleshooting lengkap**

---

## 📚 Documentation

- **[SETUP-FONNTE.md](./SETUP-FONNTE.md)** - Complete setup guide
- **[migration.sql](./migration.sql)** - Database schema
- **[Fonnte Docs](https://docs.fonnte.com)** - Fonnte API documentation

---

## 🎉 Summary

Web application siap pakai untuk integrasi WhatsApp dengan database:

✅ No Meta Developer account needed  
✅ Quick & easy setup  
✅ Auto-reply system  
✅ Message tracking  
✅ Contact management  
✅ Production-ready  

Perfect untuk UKM, prototyping, dan learning projects!

---

## 📄 License

MIT License

## 👨‍💻 Support

- Fonnte: [support@fonnte.com](mailto:support@fonnte.com)
- WhatsApp Support: Tersedia di dashboard Fonnte
