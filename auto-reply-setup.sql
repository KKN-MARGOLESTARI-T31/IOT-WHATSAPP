-- ========================================
-- AUTO-REPLY RULES TABLE
-- ========================================
-- Add this to Auth Database

CREATE TABLE IF NOT EXISTS auto_reply_rules (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) UNIQUE NOT NULL,
  reply_message TEXT NOT NULL,
  match_type VARCHAR(50) DEFAULT 'exact' CHECK (match_type IN ('exact', 'contains', 'starts_with')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_auto_reply_keyword ON auto_reply_rules(keyword);
CREATE INDEX IF NOT EXISTS idx_auto_reply_active ON auto_reply_rules(is_active);

-- Create trigger for updated_at
CREATE TRIGGER update_auto_reply_rules_updated_at 
  BEFORE UPDATE ON auto_reply_rules
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INSERT SAMPLE AUTO-REPLY RULES
-- ========================================

INSERT INTO auto_reply_rules (keyword, reply_message, match_type)
VALUES 
  -- Menu bantuan
  ('help', E'🤖 *MENU BANTUAN*\n\n1️⃣ HELP - Menu bantuan\n2️⃣ INFO - Informasi produk\n3️⃣ HARGA - Daftar harga\n4️⃣ KONTAK - Hubungi kami\n5️⃣ STATUS - Cek status pesanan\n\nSilakan ketik keyword di atas untuk info lebih lanjut.', 'exact'),
  
  -- Informasi produk
  ('info', E'📱 *INFORMASI PRODUK*\n\nKami menyediakan:\n✅ WhatsApp Bot Automation\n✅ Database Integration\n✅ Custom Solutions\n✅ API Integration\n\nKetik HARGA untuk lihat paket harga.', 'exact'),
  
  -- Daftar harga
  ('harga', E'💰 *DAFTAR HARGA*\n\n📦 Paket Basic\nRp 500.000/bulan\n- 1000 pesan/hari\n- Auto-reply\n- Dashboard\n\n📦 Paket Pro\nRp 1.000.000/bulan\n- Unlimited pesan\n- Advanced features\n- Priority support\n\n📦 Paket Enterprise\nHubungi kami untuk custom pricing\n\nKetik KONTAK untuk info lebih lanjut.', 'exact'),
  
  -- Kontak
  ('kontak', E'📞 *HUBUNGI KAMI*\n\n📧 Email: info@example.com\n📱 Phone: 0812-3456-7890\n🌐 Website: www.example.com\n⏰ Jam kerja: 09:00 - 17:00 WIB\n\nTerima kasih! 🙏', 'exact'),
  
  -- Status pesanan
  ('status', E'📦 *CEK STATUS PESANAN*\n\nUntuk cek status pesanan, silakan kirim:\nSTATUS [Nomor Pesanan]\n\nContoh:\nSTATUS #12345\n\nAtau hubungi customer service kami.', 'exact'),
  
  -- Terima kasih (contains)
  ('terima kasih', E'🙏 Sama-sama! Senang bisa membantu.\n\nAda yang bisa kami bantu lagi?\nKetik HELP untuk menu.', 'contains'),
  
  -- Salam (starts_with)
  ('halo', E'👋 Halo! Selamat datang!\n\nAda yang bisa kami bantu?\nKetik HELP untuk lihat menu.', 'starts_with'),
  ('hai', E'👋 Hai! Selamat datang!\n\nAda yang bisa kami bantu?\nKetik HELP untuk lihat menu.', 'starts_with')
ON CONFLICT (keyword) DO NOTHING;

-- ========================================
-- VERIFY INSTALLATION
-- ========================================

SELECT '=== AUTO-REPLY RULES CREATED ===' as status;

SELECT 
  keyword,
  LEFT(reply_message, 50) || '...' as preview,
  match_type,
  is_active
FROM auto_reply_rules
ORDER BY keyword;
