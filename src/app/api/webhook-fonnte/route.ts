import { NextRequest, NextResponse } from 'next/server';
import { checkAutoReply } from '@/lib/db';
import { sendTextMessage } from '@/lib/whatsapp-fonnte';
import { sql } from '@/lib/db';

/**
 * POST handler - Receive webhook events from Fonnte
 * Fonnte sends different types of webhooks:
 * 1. Incoming messages - has "sender" and "message"
 * 2. Message status - has "state" (sent/delivered/read)
 * 3. Device status - has "status" (connect/disconnect)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Fonnte webhook received:', JSON.stringify(body, null, 2));

        const { sender, message, member, type, device, state, status, reason } = body;

        // Handle device status updates
        if (status === 'disconnect' || status === 'connect') {
            console.log(`Device ${device} status: ${status}${reason ? ` - ${reason}` : ''}`);

            // Log device status
            await sql`
                INSERT INTO audit_logs (action, entity_type, details)
                VALUES (
                    'DEVICE_STATUS',
                    'webhook',
                    ${JSON.stringify({ device, status, reason, timestamp: body.timestamp })}
                )
            `;

            return NextResponse.json({ success: true, type: 'device_status' }, { status: 200 });
        }

        // Handle message status updates (sent, delivered, read)
        if (state && !sender) {
            console.log(`Message status update: ${state}`);
            return NextResponse.json({ success: true, type: 'message_status' }, { status: 200 });
        }

        // Handle incoming messages
        if (sender && message) {
            // Log incoming message to audit_logs
            await sql`
                INSERT INTO audit_logs (action, entity_type, details)
                VALUES (
                    'INCOMING_MESSAGE',
                    'webhook',
                    ${JSON.stringify({ sender, message, member, type, device })}
                )
            `;

            console.log(`📨 Incoming message from ${sender}: ${message}`);

            // LOOP PROTECTION: Ignore messages sent by the bot itself
            // Fonnte (free tier) adds a footer to API messages. We must not reply to them.
            if (message.includes('Sent via fonnte.com') || message.startsWith('❌ Maaf, kami tidak mengerti') || message.startsWith('🤖 *MENU UTAMA*')) {
                console.log('🛑 Ignoring bot loop / self-message');
                return NextResponse.json({ success: true, type: 'ignored_self_message' }, { status: 200 });
            }

            // Check for auto-reply rules (only for text messages)
            if (type === 'text' || !type) { // Default to text if type not specified
                const autoReplyText = await checkAutoReply(message);

                if (autoReplyText) {
                    console.log(`🤖 Auto-reply triggered for message: ${message}`);

                    // Send auto-reply via Fonnte
                    const result = await sendTextMessage(sender, autoReplyText);

                    if (result.success) {
                        // Log auto-reply sent to message_queue
                        await sql`
                            INSERT INTO message_queue (
                                phone_number,
                                message,
                                status,
                                sent_at,
                                source_db_ref
                            )
                            VALUES (
                                ${sender},
                                ${autoReplyText},
                                'sent',
                                CURRENT_TIMESTAMP,
                                ${'auto_reply:' + message}
                            )
                        `;

                        console.log(`✅ Auto-reply sent to ${sender}`);
                    } else {
                        // Log failed auto-reply
                        await sql`
                            INSERT INTO message_queue (
                                phone_number,
                                message,
                                status,
                                error_message,
                                source_db_ref
                            )
                            VALUES (
                                ${sender},
                                ${autoReplyText},
                                'failed',
                                ${result.error || 'Unknown error'},
                                ${'auto_reply:' + message}
                            )
                        `;

                        console.error(`❌ Auto-reply failed for ${sender}:`, result.error);
                    }
                } else {
                    console.log(`ℹ️ No auto-reply rule matched for: ${message}`);
                }
            }

            return NextResponse.json({ success: true, type: 'incoming_message' }, { status: 200 });
        }

        // Unknown webhook type
        console.log('⚠️ Unknown webhook type received');
        return NextResponse.json({ success: true, type: 'unknown' }, { status: 200 });

    } catch (error) {
        console.error('❌ Error processing Fonnte webhook:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

/**
 * GET handler - For testing purposes
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({
        message: 'Fonnte webhook endpoint is active',
        endpoint: '/api/webhook-fonnte',
        methods: ['GET', 'POST']
    }, { status: 200 });
}
