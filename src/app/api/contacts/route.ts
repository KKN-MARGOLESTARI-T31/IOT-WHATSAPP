import { NextRequest, NextResponse } from 'next/server';
import { getAllContacts } from '@/lib/db';

/**
 * GET /api/contacts - Get all contacts
 */
export async function GET(request: NextRequest) {
    try {
        const contacts = await getAllContacts();

        return NextResponse.json({
            success: true,
            contacts,
            count: contacts.length
        });
    } catch (error: any) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
