import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getSourceTables, getTableColumns } from '@/lib/db-source';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const token = request.cookies.get('session_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await verifySession(token);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get tables from source database
        const tables = await getSourceTables();

        return NextResponse.json({
            success: true,
            tables
        });
    } catch (error: any) {
        console.error('Error getting tables:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to get tables' },
            { status: 500 }
        );
    }
}
