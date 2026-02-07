import bcrypt from 'bcryptjs';
import { sql } from './db'; // Auth database
import crypto from 'crypto';

/**
 * Create a new user
 */
export async function createUser(email: string, password: string, name?: string, role: 'admin' | 'user' = 'user') {
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const users = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${passwordHash}, ${name || email}, ${role})
      RETURNING id, email, name, role, created_at
    `;

        return users[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Verify user credentials and return user if valid
 */
export async function verifyUser(email: string, password: string) {
    try {
        const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email} AND is_active = true
    `;

        if (users.length === 0) return null;

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
    } catch (error) {
        console.error('Error verifying user:', error);
        return null;
    }
}

/**
 * Create session token for user
 */
export async function createSession(userId: number) {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const sessions = await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
      RETURNING id, token, expires_at
    `;

        return sessions[0];
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

/**
 * Verify session token and return user if valid
 */
export async function verifySession(token: string) {
    try {
        const sessions = await sql`
      SELECT s.*, u.id as user_id, u.email, u.name, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token}
        AND s.expires_at > CURRENT_TIMESTAMP
        AND u.is_active = true
    `;

        if (sessions.length === 0) return null;

        const session = sessions[0];
        return {
            id: session.user_id,
            email: session.email,
            name: session.name,
            role: session.role
        };
    } catch (error) {
        console.error('Error verifying session:', error);
        return null;
    }
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string) {
    try {
        await sql`
      DELETE FROM sessions
      WHERE token = ${token}
    `;
        return true;
    } catch (error) {
        console.error('Error deleting session:', error);
        return false;
    }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions() {
    try {
        await sql`
      DELETE FROM sessions
      WHERE expires_at < CURRENT_TIMESTAMP
    `;
        return true;
    } catch (error) {
        console.error('Error cleaning up sessions:', error);
        return false;
    }
}

/**
 * Log user action to audit log
 */
export async function logAuditAction(
    userId: number,
    action: string,
    entityType?: string,
    entityId?: number,
    details?: any
) {
    try {
        await sql`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (${userId}, ${action}, ${entityType || null}, ${entityId || null}, ${JSON.stringify(details) || null})
    `;
    } catch (error) {
        console.error('Error logging audit action:', error);
    }
}

/**
 * Add message to queue
 */
export async function addToMessageQueue(
    phoneNumber: string,
    message: string,
    sourceDbRef?: string,
    sentBy?: number
) {
    try {
        const result = await sql`
      INSERT INTO message_queue (phone_number, message, source_db_ref, sent_by)
      VALUES (${phoneNumber}, ${message}, ${sourceDbRef || null}, ${sentBy || null})
      RETURNING *
    `;
        return result[0];
    } catch (error) {
        console.error('Error adding to message queue:', error);
        throw error;
    }
}

/**
 * Update message queue status
 */
export async function updateMessageQueueStatus(
    id: number,
    status: 'sent' | 'failed',
    errorMessage?: string
) {
    try {
        await sql`
      UPDATE message_queue
      SET status = ${status},
          sent_at = CURRENT_TIMESTAMP,
          error_message = ${errorMessage || null}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error('Error updating message queue:', error);
        throw error;
    }
}

/**
 * Get message queue
 */
export async function getMessageQueue(status?: 'pending' | 'sent' | 'failed', limit = 100) {
    try {
        if (status) {
            return await sql`
        SELECT * FROM message_queue
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
        } else {
            return await sql`
        SELECT * FROM message_queue
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
        }
    } catch (error) {
        console.error('Error getting message queue:', error);
        throw error;
    }
}
