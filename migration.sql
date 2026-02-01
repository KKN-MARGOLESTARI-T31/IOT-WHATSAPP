-- Meta WhatsApp Bot Database Schema for Neon PostgreSQL

-- Contacts table - stores WhatsApp contacts
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  profile_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table - stores all incoming and outgoing messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) UNIQUE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  message_body TEXT,
  media_url TEXT,
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  timestamp BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuration table - stores app settings and API keys
CREATE TABLE IF NOT EXISTS config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-reply rules table - stores keyword-based auto-reply rules
CREATE TABLE IF NOT EXISTS auto_reply_rules (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  reply_message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  match_type VARCHAR(20) DEFAULT 'contains' CHECK (match_type IN ('exact', 'contains', 'starts_with')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Broadcast campaigns table - stores broadcast message campaigns
CREATE TABLE IF NOT EXISTS broadcast_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed')),
  scheduled_at TIMESTAMP,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Broadcast recipients table - tracks individual broadcast sends
CREATE TABLE IF NOT EXISTS broadcast_recipients (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES broadcast_campaigns(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  message_id VARCHAR(255),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_phone ON messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_auto_reply_active ON auto_reply_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_broadcast_campaign ON broadcast_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_contact ON broadcast_recipients(contact_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auto_reply_updated_at BEFORE UPDATE ON auto_reply_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
