# 🤖 Auto-Reply WhatsApp Bot

## Cara Kerja Auto-Reply

Ketika ada yang kirim pesan ke nomor WA Anda, bot akan otomatis balas berdasarkan **keyword** yang dikirim.

---

## 📋 Contoh Penggunaan

### Customer kirim:
```
HELP
```

### Bot otomatis balas:
```
Halo! Berikut menu bantuan:
1. HELP - Lihat menu bantuan
2. INFO - Informasi produk
3. HARGA - Daftar harga
4. KONTAK - Hubungi kami

Silakan ketik keyword di atas.
```

---

## ⚙️ Setup Auto-Reply

### Metode 1: Via Fonnte Dashboard (Simple)

1. **Login ke [fonnte.com](https://fonnte.com)**
2. **Klik "Autoreply"**
3. **Tambah Auto-Reply Rule:**
   - Keyword: `help`
   - Reply: `Halo! Berikut menu bantuan...`
4. **Save**

**Kelebihan:**
- ✅ Simple, tidak perlu coding
- ✅ Langsung aktif
- ✅ Bisa setup di dashboard

**Kekurangan:**
- ❌ Terbatas fitur Fonnte
- ❌ Tidak terintegrasi dengan database Anda

---

### Metode 2: Via Webhook + Database (Advanced)

Webhook sudah ada di **`/api/webhook-fonnte`**, tapi perlu database table untuk rules.

#### Step 1: Buat Table Auto-Reply Rules

**Di Auth Database**, jalankan SQL ini:

```sql
CREATE TABLE auto_reply_rules (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) UNIQUE NOT NULL,
  reply_message TEXT NOT NULL,
  match_type VARCHAR(50) DEFAULT 'exact' CHECK (match_type IN ('exact', 'contains', 'starts_with')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample rules
INSERT INTO auto_reply_rules (keyword, reply_message, match_type)
VALUES 
  ('help', E'🤖 *MENU BANTUAN*\n\n1. HELP - Menu bantuan\n2. INFO - Informasi produk\n3. HARGA - Daftar harga\n4. KONTAK - Hubungi kami\n\nSilakan ketik keyword di atas untuk info lebih lanjut.', 'exact'),
  ('info', E'📱 *INFORMASI PRODUK*\n\nKami menyediakan:\n- WhatsApp Bot Automation\n- Database Integration\n- Custom Solutions\n\nKetik HARGA untuk lihat harga.', 'exact'),
  ('harga', E'💰 *DAFTAR HARGA*\n\nPaket Basic: Rp 500.000/bulan\nPaket Pro: Rp 1.000.000/bulan\nPaket Enterprise: Hubungi kami\n\nKetik KONTAK untuk info lebih lanjut.', 'exact'),
  ('kontak', E'📞 *KONTAK KAMI*\n\nEmail: info@example.com\nPhone: 0812-3456-7890\nWebsite: www.example.com\n\nTerima kasih!', 'exact');

-- Create trigger for updated_at
CREATE TRIGGER update_auto_reply_rules_updated_at 
  BEFORE UPDATE ON auto_reply_rules
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

#### Step 2: Update `checkAutoReply()` Function

File: `src/lib/db.ts` (Auth database)

Tambahkan function ini:

```typescript
/**
 * Check if message matches any auto-reply rule
 */
export async function checkAutoReply(message: string): Promise<string | null> {
  try {
    const cleanMessage = message.trim().toLowerCase();
    
    // Check exact match first
    let rules = await sql`
      SELECT reply_message 
      FROM auto_reply_rules
      WHERE LOWER(keyword) = ${cleanMessage}
        AND match_type = 'exact'
        AND is_active = true
      LIMIT 1
    `;
    
    if (rules.length > 0) {
      return rules[0].reply_message;
    }
    
    // Check contains
    rules = await sql`
      SELECT reply_message, keyword
      FROM auto_reply_rules
      WHERE match_type = 'contains'
        AND is_active = true
        AND ${cleanMessage} LIKE '%' || LOWER(keyword) || '%'
      ORDER BY LENGTH(keyword) DESC
      LIMIT 1
    `;
    
    if (rules.length > 0) {
      return rules[0].reply_message;
    }
    
    // Check starts_with
    rules = await sql`
      SELECT reply_message
      FROM auto_reply_rules
      WHERE match_type = 'starts_with'
        AND is_active = true
        AND ${cleanMessage} LIKE LOWER(keyword) || '%'
      ORDER BY LENGTH(keyword) DESC
      LIMIT 1
    `;
    
    if (rules.length > 0) {
      return rules[0].reply_message;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking auto-reply:', error);
    return null;
  }
}
```

---

## 🎯 Match Types Explained

### 1. **exact** - Harus sama persis
```
Keyword: "help"
✅ Match: "help", "HELP", "Help"
❌ No match: "help me", "need help"
```

### 2. **contains** - Ada keyword di dalam pesan
```
Keyword: "harga"
✅ Match: "harga dong", "mau tanya harga", "cek harga dulu"
❌ No match: "harganya", "discount"
```

### 3. **starts_with** - Pesan dimulai dengan keyword
```
Keyword: "info"
✅ Match: "info dong", "info produk"
❌ No match: "minta info", "butuh info"
```

---

## 🔧 Setup Webhook di Fonnte

1. **Login ke [fonnte.com](https://fonnte.com)**
2. **Klik "Setting"**
3. **Webhook URL:**
   ```
   https://your-domain.vercel.app/api/webhook-fonnte
   ```
   Untuk development (ngrok):
   ```
   https://abc123.ngrok.io/api/webhook-fonnte
   ```
4. **Save**

---

## 📱 Testing Auto-Reply

### Test 1: Exact Match
```
Send: "help"
Expected: Menu bantuan lengkap
```

### Test 2: Case Insensitive
```
Send: "HELP" atau "Help"
Expected: Menu bantuan (sama)
```

### Test 3: Contains
```
Send: "mau tanya harga"
Expected: Daftar harga
(Jika keyword "harga" dengan match_type='contains')
```

---

## 📊 Monitor Auto-Reply

Check di Auth Database:

```sql
-- Lihat semua rules
SELECT * FROM auto_reply_rules WHERE is_active = true;

-- Lihat pesan yang masuk (dari webhook)
SELECT * FROM messages 
WHERE direction = 'inbound'
ORDER BY timestamp DESC
LIMIT 10;

-- Lihat auto-reply yang terkirim
SELECT * FROM messages
WHERE direction = 'outbound'
  AND timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
```

---

## 🎨 UI untuk Manage Auto-Reply (Optional)

Bisa buat halaman `/auto-reply` untuk manage rules tanpa perlu SQL:

- **Add Rule** - Tambah keyword baru
- **Edit Rule** - Update response
- **Delete Rule** - Hapus rule
- **Toggle Active** - Enable/disable

---

## 🚀 Quick Start

### Option A: Simple (Fonnte Dashboard)
1. Login fonnte.com
2. Set auto-reply di dashboard
3. Done! ✅

### Option B: Advanced (Database + Webhook)
1. Run SQL create table di atas
2. Insert sample rules
3. Setup webhook URL di Fonnte
4. Test kirim "help" ke nomor WA
5. Bot auto-reply! 🤖

---

## 💡 Tips

1. **Gunakan emoji** untuk respon lebih menarik
2. **Singkat & jelas** - WhatsApp user suka singkat
3. **Include CTA** - Call-to-action di akhir
4. **Test dulu** sebelum production
5. **Monitor** - Lihat keyword apa yang sering ditanya

---

**Rekomendasi:**
- Start dengan **Fonnte Dashboard** (simple)
- Upgrade ke **Database** jika butuh custom logic

Mau saya buatkan table auto-reply di database sekarang? 🤖
