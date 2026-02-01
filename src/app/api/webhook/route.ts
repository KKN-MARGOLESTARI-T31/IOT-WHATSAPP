import { NextRequest, NextResponse } from 'next/server';
import { saveMessage, checkAutoReply, updateMessageStatus } from '@/lib/db';
import { sendTextMessage, markMessageAsRead } from '@/lib/whatsapp';
import type { WebhookEntry, WebhookMessage, WebhookStatus } from '@/lib/types';

const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

/**
 * GET handler - Webhook verification from Meta
 * Meta will send a GET request to verify the webhook endpoint
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('hub.mode');
        const token = searchParams.get('hub.verify_token');
        const challenge = searchParams.get('hub.challenge');

        console.log('Webhook verification request:', { mode, token: token?.substring(0, 5) + '...' });

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('Webhook verified successfully');
                return new NextResponse(challenge, { status: 200 });
            } else {
                console.error('Webhook verification failed: Invalid token');
                return NextResponse.json({ error: 'Invalid verify token' }, { status: 403 });
            }
        }

        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    } catch (error) {
        console.error('Error in webhook verification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST handler - Receive webhook events from Meta
 * Meta will send POST requests when messages are received or status updates occur
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Webhook received:', JSON.stringify(body, null, 2));

        // Meta sends an object with an entry array
        if (body.object === 'whatsapp_business_account') {
            const entries: WebhookEntry[] = body.entry;

            for (const entry of entries) {
                for (const change of entry.changes) {
                    const value = change.value;

                    // Handle incoming messages
                    if (value.messages && value.messages.length > 0) {
                        await handleIncomingMessages(value.messages, value.contacts);
                    }

                    // Handle message status updates
                    if (value.statuses && value.statuses.length > 0) {
                        await handleStatusUpdates(value.statuses);
                    }
                }
            }

            return NextResponse.json({ success: true }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid webhook object' }, { status: 400 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * Handle incoming WhatsApp messages
 */
async function handleIncomingMessages(messages: WebhookMessage[], contacts?: any[]) {
    for (const message of messages) {
        try {
            const from = message.from;
            const messageId = message.id;
            const timestamp = parseInt(message.timestamp);

            // Get contact profile name if available
            const contact = contacts?.find(c => c.wa_id === from);
            const profileName = contact?.profile?.name;

            // Extract message content based on type
            let messageBody = '';
            let mediaUrl = '';

            switch (message.type) {
                case 'text':
                    messageBody = message.text?.body || '';
                    break;
                case 'image':
                    messageBody = message.image?.caption || '';
                    mediaUrl = message.image?.id || '';
                    break;
                case 'video':
                    messageBody = message.video?.caption || '';
                    mediaUrl = message.video?.id || '';
                    break;
                case 'audio':
                    mediaUrl = message.audio?.id || '';
                    break;
                case 'document':
                    messageBody = message.document?.caption || '';
                    mediaUrl = message.document?.id || '';
                    break;
                case 'location':
                    messageBody = `Location: ${message.location?.latitude}, ${message.location?.longitude}`;
                    break;
            }

            // Save the incoming message to database
            await saveMessage({
                messageId,
                phoneNumber: from,
                messageType: message.type,
                messageBody,
                mediaUrl,
                direction: 'inbound',
                status: 'delivered',
                timestamp
            });

            console.log(`Saved incoming message from ${from}: ${messageBody}`);

            // Mark message as read
            await markMessageAsRead(messageId);

            // Check for auto-reply rules (only for text messages)
            if (message.type === 'text' && messageBody) {
                const autoReplyText = await checkAutoReply(messageBody);

                if (autoReplyText) {
                    console.log(`Auto-reply triggered for message: ${messageBody}`);

                    // Send auto-reply
                    const result = await sendTextMessage(from, autoReplyText);

                    if (result.success && result.message_id) {
                        // Save the auto-reply message to database
                        await saveMessage({
                            messageId: result.message_id,
                            phoneNumber: from,
                            messageType: 'text',
                            messageBody: autoReplyText,
                            direction: 'outbound',
                            status: 'sent',
                            timestamp: Date.now()
                        });

                        console.log(`Auto-reply sent to ${from}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error handling incoming message:', error);
        }
    }
}

/**
 * Handle message status updates
 */
async function handleStatusUpdates(statuses: WebhookStatus[]) {
    for (const status of statuses) {
        try {
            const messageId = status.id;
            const messageStatus = status.status;

            // Update message status in database
            await updateMessageStatus(messageId, messageStatus);

            console.log(`Updated message ${messageId} status to ${messageStatus}`);
        } catch (error) {
            console.error('Error handling status update:', error);
        }
    }
}
