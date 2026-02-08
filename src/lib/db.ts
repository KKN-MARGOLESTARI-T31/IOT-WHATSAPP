// Auth Database Connection (Neon #1)
// This database stores user auth, sessions, and message queue
import { neon } from '@neondatabase/serverless';
import { querySourceData, executeSourceQuery } from './db-source';


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
 * Uses new dual database schema: users, message_queue, audit_logs
 */
export async function getDashboardStats() {
    try {
        const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM message_queue) as total_messages,
        (SELECT COUNT(*) FROM message_queue WHERE created_at >= CURRENT_DATE) as messages_today,
        (SELECT COUNT(*) FROM audit_logs WHERE action = 'INCOMING_MESSAGE') as messages_inbound,
        (SELECT COUNT(*) FROM message_queue WHERE status = 'sent') as messages_outbound,
        (SELECT COUNT(*) FROM auto_reply_rules WHERE is_active = true) as active_auto_replies
    `;

        return stats[0];
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        throw error;
    }
}

/**
 * Get recent messages from message_queue
 */
export async function getRecentMessages(limit: number = 50, offset: number = 0) {
    try {
        const messages = await sql`
      SELECT 
        id,
        phone_number,
        message as message_body,
        status,
        sent_at as created_at,
        source_db_ref,
        error_message
      FROM message_queue
      ORDER BY created_at DESC
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
 * Get messages by phone number from message_queue
 */
export async function getMessagesByPhone(phoneNumber: string, limit: number = 50) {
    try {
        const messages = await sql`
      SELECT * FROM message_queue 
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
 * Get all unique phone numbers from message_queue
 */
export async function getAllContacts() {
    try {
        const contacts = await sql`
      SELECT 
        phone_number,
        COUNT(*) as message_count,
        MAX(created_at) as last_message_at,
        MAX(CASE WHEN status = 'sent' THEN 1 ELSE 0 END)::boolean as has_sent_messages
      FROM message_queue
      GROUP BY phone_number
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


/**
 * Helper: Get Menu Message
 */
function getMenuMessage(): string {
    return `🤖 *MENU UTAMA*

Silakan balas dengan angka pilihan:

1️⃣ *MONITORING LOGS*
   _Lihat 5 data monitoring terakhir_

2️⃣ *ON OFF PUMP*
   _Cek status & kontrol pompa_

Kenyamanan Anda adalah prioritas kami! 🌿`;
}

/**
 * Helper: Get Monitoring Logs (Menu 1)
 */
async function getMonitoringLogs(): Promise<string> {
    try {
        // 1. Fetch latest monitoring data from monitoring_logs table
        // Columns: id, battery_level, ph_value, level, temperature, signal_strength, created_at, deviceId, pump_status
        const logs = await querySourceData(
            'monitoring_logs',
            ['*'],
            undefined, // No where clause (fetch latest from any device)
            1, // Limit to 1 latest record for the detailed view
            'created_at DESC'
        );

        if (!logs || logs.length === 0) {
            return '📭 Belum ada data monitoring.';
        }

        const log = logs[0];

        // 2. Format Data       
        // Date
        const date = log.created_at ? new Date(log.created_at) : new Date();
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        };
        const dateStr = date.toLocaleString('id-ID', options);

        // pH Status
        const phVal = parseFloat(log.ph_value) || 0;
        let phStatus = '(normal)';
        if (phVal < 6.5) phStatus = '(asam)';
        if (phVal > 7.5) phStatus = '(basa)';

        // Pump Status (from monitoring_logs directly)
        // Value is string "true" or "false"
        const pumpStatus = (log.pump_status === 'true' || log.pump_status === true) ? 'Hidup' : 'Mati';

        // Temperature
        // User requested "Suhu: Tidak tersedia" (if 0 or null)
        const temp = log.temperature || 0;
        const tempStr = temp > 0 ? `${temp}°C` : 'Tidak tersedia';

        return `📊 *Data Monitoring – Sawah*

🕒 Waktu: ${dateStr}
💧 pH Air: ${phVal} ${phStatus}
📏 Ketinggian Air: ${log.level} cm
🔋 Baterai: ${log.battery_level}%
📡 Sinyal: ${log.signal_strength}
🚿 Status Pompa: ${pumpStatus}
🌡️ Suhu: ${tempStr}`;

    } catch (error) {
        console.error('Error fetching monitoring logs:', error);
        return '❌ Gagal mengambil data monitoring.';
    }
}

/**
 * Helper: Get Pump Status & Control Info (Menu 2)
 */
async function getPumpStatus(): Promise<string> {
    try {
        // Use 'sawah' as deviceId per integration guide
        const rows = await querySourceData(
            'device_controls',
            ['"deviceId"', '"command"', '"updatedAt"'],
            `"deviceId" = 'sawah' AND "mode" = 'PUMP'`,
            1,
            '"updatedAt" DESC'
        );

        let status = 'UNKNOWN';
        let lastUpdate = '-';

        if (rows && rows.length > 0) {
            status = rows[0].command === 'ON' ? 'ON ✅' : 'OFF 🔴';
            lastUpdate = new Date(rows[0].updatedAt).toLocaleString('id-ID');
        }

        // Dynamic reply option based on status
        // If ON, suggest OFF. If OFF, suggest ON.
        const toggleCommand = status.includes('ON') ? 'OFF' : 'ON';
        const toggleDesc = status.includes('ON') ? 'Matikan pompa' : 'Nyalakan pompa';

        return `🔌 *KONTROL POMPA (SAWAH)*\n\nStatus saat ini: *${status}*\nTerakhir update: ${lastUpdate}\n\nBalas *${toggleCommand}* untuk ${toggleDesc.toLowerCase()}.`;
    } catch (error) {
        console.error('Error fetching pump status:', error);
        return '❌ Gagal mengambil status pompa.';
    }
}

/**
 * Helper: Handle Pump Control (PUMP ON/OFF)
 * Follows "Integrasi Sistem Eksternal" guide strictly.
 */
async function handlePumpControl(command: 'ON' | 'OFF'): Promise<string> {
    try {
        const cmdValue = command; // 'ON' or 'OFF'

        let query = '';

        if (cmdValue === 'ON') {
            // Transaction for ON: Update device_controls AND reset pump_timers
            // Using DO block because neon driver supports single statement only
            query = `
                DO $$
                BEGIN
                    -- 1. Insert/Update device_controls
                    INSERT INTO device_controls (id, "deviceId", mode, command, "updatedAt", "createdAt", "actionBy", reason)
                    VALUES (
                        gen_random_uuid(), 
                        'sawah', 
                        'PUMP', 
                        'ON', 
                        NOW(), 
                        NOW(), 
                        'WhatsApp Bot', 
                        'Manual Remote WA'
                    )
                    ON CONFLICT ("deviceId", mode)
                    DO UPDATE SET 
                        command = 'ON', 
                        "updatedAt" = NOW(), 
                        "actionBy" = 'WhatsApp Bot',
                        reason = 'Manual Remote WA';

                    -- 2. Reset Timer Otomatis (Prevent auto-off race condition)
                    INSERT INTO pump_timers (id, mode, duration, "startTime", "isManualMode", "updatedAt", "createdAt")
                    VALUES (gen_random_uuid(), 'sawah', NULL, NULL, true, NOW(), NOW())
                    ON CONFLICT (mode)
                    DO UPDATE SET 
                        duration = NULL, 
                        "startTime" = NULL, 
                        "isManualMode" = true, 
                        "updatedAt" = NOW();
                END $$;
            `;
        } else {
            // Transaction for OFF: Just update device_controls (usually sufficient to stop)
            query = `
                INSERT INTO device_controls (id, "deviceId", mode, command, "updatedAt", "createdAt", "actionBy", reason)
                VALUES (
                    gen_random_uuid(), 
                    'sawah', 
                    'PUMP', 
                    'OFF', 
                    NOW(), 
                    NOW(), 
                    'WhatsApp Bot', 
                    'Manual Remote WA'
                )
                ON CONFLICT ("deviceId", mode)
                DO UPDATE SET 
                    command = 'OFF', 
                    "updatedAt" = NOW(), 
                    "actionBy" = 'WhatsApp Bot',
                    reason = 'Manual Remote WA';
            `;
        }

        // Execute via helper
        await executeSourceQuery(query);

        return `✅ Perintah *PUMP ${command}* berhasil dikirim ke Sawah!`;
    } catch (error) {
        console.error('Error handling pump control:', error);
        return `❌ Gagal mengirim perintah PUMP ${command}.`;
    }
}

/**
 * Helper: Get Status Lahan (Menu 3)
 */
function getStatusLahan(): string {
    return `🚧 *STATUS LAHAN*\n\nFitur ini sedang dalam pengembangan (Unfinished). Nantikan update selanjutnya!`;
}

/**
 * Helper: Get Admin Message (Menu 4)
 */
function getAdminMessage(): string {
    return `👨‍💻 *ADMIN MESSAGE*\n\nJika ada kendala, silakan hubungi admin kami:\n\n📞 WA: 0812-3456-7890 (Budi)\n✉️ Email: admin@example.com`;
}

/**
 * Helper: Get Riwayat (Menu 5)
 */
async function getRiwayat(): Promise<string> {
    try {
        // Fetch last 5 history from device_controls
        const rows = await querySourceData(
            'device_controls',
            ['"command"', '"updatedAt"'],
            `"deviceId" = 'sawah' AND "mode" = 'PUMP'`,
            5,
            '"updatedAt" DESC'
        ); // Note: proper history might need a separate history table, using device_controls for now checking latest updates if it stores history (usually it stores state). 
        // If device_controls is state-only, we might need to check if there's a history table or just show current state. 
        // Assuming there isn't a dedicated history table yet based on context, so showing general text.

        return `📜 *RIWAYAT AKTIVITAS*\n\nFitur riwayat detail sedang disiapkan. Saat ini Anda bisa memantau status terkini di menu Monitoring & Pump Control.`;
    } catch (error) {
        return '❌ Gagal mengambil data riwayat.';
    }
}


/**
 * Check if a message matches any auto-reply rule
 */
export async function checkAutoReply(messageBody: string): Promise<string | null> {
    try {
        const cleanMessage = messageBody.toUpperCase().trim();

        // --- DYNAMIC MENU LOGIC ---

        // 1. MENU
        if (cleanMessage === 'MENU' || cleanMessage === 'CEK') {
            return getMenuMessage();
        }

        // 2. NUMBER OPTIONS
        if (cleanMessage === '1') {
            return await getMonitoringLogs();
        }
        if (cleanMessage === '2') {
            return await getPumpStatus();
        }


        // 3. PUMP COMMANDS
        if (cleanMessage === 'ON') {
            return await handlePumpControl('ON');
        }
        if (cleanMessage === 'OFF') {
            return await handlePumpControl('OFF');
        }

        // --- END DYNAMIC LOGIC ---

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

        return `❌ Maaf, kami tidak mengerti perintah Anda.\n\nSilakan ketik *MENU* atau *CEK* untuk melihat pilihan yang tersedia.`;
    } catch (error) {
        console.error('Error in checkAutoReply:', error);
        return null; // Keep null on error to avoid spamming error messages
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
