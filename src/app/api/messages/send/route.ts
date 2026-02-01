import { NextRequest, NextResponse } from 'next/server';
import { sendTextMessage, validatePhoneNumber } from '@/lib/whatsapp-fonnte';
import { saveMessage } from '@/lib/db';


/**
 * POST /api/messages/send - Send a WhatsApp message
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone_number, message, message_type = 'text' } = body;

        // Validate input
        if (!phone_number || !message) {
            return NextResponse.json(
                { success: false, error: 'Phone number and message are required' },
                { status: 400 }
            );
        }

        // Validate and format phone number for Fonnte
        const cleanPhone = validatePhoneNumber(phone_number);
        if (!cleanPhone) {
            return NextResponse.json(
                { success: false, error: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        console.log(`Sending message to ${cleanPhone}: ${message}`);

        // Send message via WhatsApp API
        const result = await sendTextMessage(cleanPhone, message);

        if (result.success && result.message_id) {
            // Save the sent message to database
            await saveMessage({
                messageId: result.message_id,
                phoneNumber: cleanPhone,
                messageType: message_type,
                messageBody: message,
                direction: 'outbound',
                status: 'sent',
                timestamp: Date.now()
            });

            return NextResponse.json({
                success: true,
                message_id: result.message_id,
                message: 'Message sent successfully'
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to send message' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error in send message API:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
