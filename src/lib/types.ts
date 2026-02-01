// TypeScript types for Meta WhatsApp Bot

// Contact type
export interface Contact {
  id: number;
  phone_number: string;
  name?: string;
  profile_name?: string;
  created_at: Date;
  updated_at: Date;
}

// Message type
export interface Message {
  id: number;
  message_id?: string;
  contact_id?: number;
  phone_number: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contacts';
  message_body?: string;
  media_url?: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp?: number;
  created_at: Date;
}

// Auto Reply Rule type
export interface AutoReplyRule {
  id: number;
  keyword: string;
  reply_message: string;
  is_active: boolean;
  match_type: 'exact' | 'contains' | 'starts_with';
  created_at: Date;
  updated_at: Date;
}

// Broadcast Campaign type
export interface BroadcastCampaign {
  id: number;
  name: string;
  message: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduled_at?: Date;
  sent_count: number;
  failed_count: number;
  created_at: Date;
  completed_at?: Date;
}

// Meta Webhook payload types
export interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

export interface WebhookChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    contacts?: WebhookContact[];
    messages?: WebhookMessage[];
    statuses?: WebhookStatus[];
  };
  field: string;
}

export interface WebhookContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contacts';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  video?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  audio?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  document?: {
    id: string;
    filename: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

export interface WebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
  }>;
}

// API Request/Response types
export interface SendMessageRequest {
  phone_number: string;
  message: string;
  message_type?: 'text';
}

export interface SendMessageResponse {
  success: boolean;
  message_id?: string;
  error?: string;
}

export interface DashboardStats {
  total_contacts: number;
  total_messages: number;
  messages_today: number;
  messages_inbound: number;
  messages_outbound: number;
}
