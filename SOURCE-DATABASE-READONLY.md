# Source Database - READ ONLY

⚠️ **IMPORTANT**: Source database is **READ-ONLY**

## Policy

- ✅ **SELECT** - OK untuk query data
- ❌ **UPDATE** - TIDAK mengubah data
- ❌ **INSERT** - TIDAK menambah data  
- ❌ **DELETE** - TIDAK menghapus data

## How It Works

1. **Query Source DB** → Ambil data dengan SELECT
2. **Send to WhatsApp** → Kirim via Fonnte
3. **Log di Auth DB** → Simpan status di `message_queue` table

**Source database tetap tidak berubah!**

## Tracking Sent Messages

Status pengiriman disimpan di **Auth Database** (`message_queue` table), bukan di source DB.

```sql
-- Auth Database
SELECT * FROM message_queue
WHERE source_db_ref LIKE 'your_table%'
ORDER BY created_at DESC;
```

## Example Usage

### 1. Query Data (Preview)

```typescript
POST /api/data/query
{
  "tableName": "your_table_name",
  "columns": ["phone_number", "name", "message"],
  "whereClause": "status = 'active'",
  "limit": 10
}
```

### 2. Send to WhatsApp

```typescript
POST /api/data/send
{
  "tableName": "your_table_name",
  "phoneColumn": "phone_number",  // kolom yang berisi nomor HP
  "messageColumn": "message",      // kolom yang berisi pesan (optional)
  "whereClause": "status = 'active'",
  "limit": 10
}
```

**Result**: Data dikirim ke WhatsApp, tapi source DB tetap sama!

## Message Format

### Opsi 1: Pakai kolom message
Jika punya kolom khusus untuk message, isi parameter `messageColumn`.

### Opsi 2: Auto-generate dari semua kolom
Jika tidak specify `messageColumn`, sistem akan buat message dari semua field:

```
id: 123
name: John Doe
phone_number: 08123456789
status: active
```

## Monitoring

Cek status pengiriman di Auth DB:

```sql
-- Berapa banyak yang terkirim
SELECT status, COUNT(*) 
FROM message_queue
GROUP BY status;

-- Lihat pesan yang gagal
SELECT * FROM message_queue
WHERE status = 'failed'
ORDER BY created_at DESC;
```

---

**Summary**: Source DB dibaca saja, semua log disimpan di Auth DB! 🔒
