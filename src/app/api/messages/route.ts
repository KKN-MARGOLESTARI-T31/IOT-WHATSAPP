import { NextRequest, NextResponse } from 'next/server';
import { getRecentMessages, getMessagesByPhone } from '@/lib/db';

/**
 * GET /api/messages - Get messages (all or by phone number)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const phone = searchParams.get('phone');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let messages;

        if (phone) {
            // Get messages for specific phone number
            messages = await getMessagesByPhone(phone, limit);
        } else {
            // Get recent messages
            messages = await getRecentMessages(limit, offset);
        }

        return NextResponse.json({
            success: true,
            messages,
            count: messages.length
        });
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
