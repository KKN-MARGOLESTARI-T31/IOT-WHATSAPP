import { neon } from '@neondatabase/serverless';

// Get database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon SQL instance
export const sql = neon(DATABASE_URL);

// Database helper functions

/**
 * Get or create a contact by phone number
 */
export async function getOrCreateContact(phoneNumber: string, profileName?: string) {
    try {
        // Try to get existing contact
        const existing = await sql`
      SELECT * FROM contacts WHERE phone_number = ${phoneNumber}
    `;

        if (existing.length > 0) {
            return existing[0];
        }

        // Create new contact
        const newContact = await sql`
      INSERT INTO contacts (phone_number, profile_name)
      VALUES (${phoneNumber}, ${profileName || null})
      RETURNING *
    `;

        return newContact[0];
    } catch (error) {
        console.error('Error in getOrCreateContact:', error);
        throw error;
    }
}

/**
 * Save a message to the database
 */
export async function saveMessage(data: {
    messageId?: string;
    phoneNumber: string;
    messageType: string;
    messageBody?: string;
    mediaUrl?: string;
    direction: 'inbound' | 'outbound';
    status?: string;
    timestamp?: number;
}) {
    try {
        // Get or create contact
        const contact = await getOrCreateContact(data.phoneNumber);

        // Insert message
        const result = await sql`
      INSERT INTO messages (
        message_id, contact_id, phone_number, message_type, 
        message_body, media_url, direction, status, timestamp
      )
      VALUES (
        ${data.messageId || null},
        ${contact.id},
        ${data.phoneNumber},
        ${data.messageType},
        ${data.messageBody || null},
        ${data.mediaUrl || null},
        ${data.direction},
        ${data.status || 'sent'},
        ${data.timestamp || Date.now()}
      )
      RETURNING *
    `;

        return result[0];
    } catch (error) {
        console.error('Error in saveMessage:', error);
        throw error;
    }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
    try {
        const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM contacts) as total_contacts,
        (SELECT COUNT(*) FROM messages) as total_messages,
        (SELECT COUNT(*) FROM messages WHERE created_at >= CURRENT_DATE) as messages_today,
        (SELECT COUNT(*) FROM messages WHERE direction = 'inbound') as messages_inbound,
        (SELECT COUNT(*) FROM messages WHERE direction = 'outbound') as messages_outbound
    `;

        return stats[0];
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        throw error;
    }
}

/**
 * Get recent messages with contact info
 */
export async function getRecentMessages(limit: number = 50, offset: number = 0) {
    try {
        const messages = await sql`
      SELECT 
        m.*,
        c.name as contact_name,
        c.profile_name as contact_profile_name
      FROM messages m
      LEFT JOIN contacts c ON m.contact_id = c.id
      ORDER BY m.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

        return messages;
    } catch (error) {
        console.error('Error in getRecentMessages:', error);
        throw error;
    }
}

/**
 * Get messages by phone number
 */
export async function getMessagesByPhone(phoneNumber: string, limit: number = 50) {
    try {
        const messages = await sql`
      SELECT * FROM messages 
      WHERE phone_number = ${phoneNumber}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

        return messages;
    } catch (error) {
        console.error('Error in getMessagesByPhone:', error);
        throw error;
    }
}

/**
 * Get all contacts
 */
export async function getAllContacts() {
    try {
        const contacts = await sql`
      SELECT 
        c.*,
        COUNT(m.id) as message_count,
        MAX(m.created_at) as last_message_at
      FROM contacts c
      LEFT JOIN messages m ON c.id = m.contact_id
      GROUP BY c.id
      ORDER BY last_message_at DESC NULLS LAST
    `;

        return contacts;
    } catch (error) {
        console.error('Error in getAllContacts:', error);
        throw error;
    }
}

/**
 * Get active auto-reply rules
 */
export async function getActiveAutoReplyRules() {
    try {
        const rules = await sql`
      SELECT * FROM auto_reply_rules 
      WHERE is_active = true
      ORDER BY id ASC
    `;

        return rules;
    } catch (error) {
        console.error('Error in getActiveAutoReplyRules:', error);
        throw error;
    }
}

/**
 * Check if a message matches any auto-reply rule
 */
export async function checkAutoReply(messageBody: string): Promise<string | null> {
    try {
        const rules = await getActiveAutoReplyRules();
        const lowerMessage = messageBody.toLowerCase().trim();

        for (const rule of rules) {
            const lowerKeyword = rule.keyword.toLowerCase().trim();

            switch (rule.match_type) {
                case 'exact':
                    if (lowerMessage === lowerKeyword) {
                        return rule.reply_message;
                    }
                    break;
                case 'contains':
                    if (lowerMessage.includes(lowerKeyword)) {
                        return rule.reply_message;
                    }
                    break;
                case 'starts_with':
                    if (lowerMessage.startsWith(lowerKeyword)) {
                        return rule.reply_message;
                    }
                    break;
            }
        }

        return null;
    } catch (error) {
        console.error('Error in checkAutoReply:', error);
        return null;
    }
}

/**
 * Update message status
 */
export async function updateMessageStatus(messageId: string, status: string) {
    try {
        const result = await sql`
      UPDATE messages 
      SET status = ${status}
      WHERE message_id = ${messageId}
      RETURNING *
    `;

        return result[0];
    } catch (error) {
        console.error('Error in updateMessageStatus:', error);
        throw error;
    }
}
