import { NextRequest, NextResponse } from 'next/server';
import { saveMessage, checkAutoReply } from '@/lib/db';
import { sendTextMessage } from '@/lib/whatsapp-fonnte';

/**
 * POST handler - Receive webhook events from Fonnte
 * Fonnte sends POST requests when messages are received
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Fonnte webhook received:', JSON.stringify(body, null, 2));

        // Fonnte webhook format:
        // {
        //   "device": "628xxxx",
        //   "sender": "628xxxx",
        //   "message": "Hello",
        //   "member": "Name",
        //   "type": "text"
        // }

        const { sender, message, member, type, device } = body;

        if (!sender || !message) {
            return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
        }

        // Save the incoming message to database
        const savedMessage = await saveMessage({
            phoneNumber: sender,
            messageType: type || 'text',
            messageBody: message,
            direction: 'inbound',
            status: 'delivered',
            timestamp: Date.now()
        });

        console.log(`Saved incoming message from ${sender}: ${message}`);

        // Check for auto-reply rules (only for text messages)
        if (type === 'text' && message) {
            const autoReplyText = await checkAutoReply(message);

            if (autoReplyText) {
                console.log(`Auto-reply triggered for message: ${message}`);

                // Send auto-reply via Fonnte
                const result = await sendTextMessage(sender, autoReplyText);

                if (result.success && result.message_id) {
                    // Save the auto-reply message to database
                    await saveMessage({
                        messageId: result.message_id,
                        phoneNumber: sender,
                        messageType: 'text',
                        messageBody: autoReplyText,
                        direction: 'outbound',
                        status: 'sent',
                        timestamp: Date.now()
                    });

                    console.log(`Auto-reply sent to ${sender}`);
                }
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error processing Fonnte webhook:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * GET handler - For testing purposes
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({
        message: 'Fonnte webhook endpoint is active',
        endpoint: '/api/webhook-fonnte'
    }, { status: 200 });
}
