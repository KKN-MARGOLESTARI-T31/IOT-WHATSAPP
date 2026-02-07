import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { querySourceData } from '@/lib/db-source';

/**
 * POST /api/data/query
 * Query source database (READ-ONLY)
 * Preview data before sending
 */
export async function POST(request: NextRequest) {
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

        const { tableName, columns, whereClause, limit } = await request.json();

        if (!tableName) {
            return NextResponse.json(
                { error: 'Table name is required' },
                { status: 400 }
            );
        }

        // Query source database (READ-ONLY)
        const data = await querySourceData(
            tableName,
            columns || ['*'],
            whereClause,
            limit || 100
        );

        return NextResponse.json({
            success: true,
            data,
            count: data.length
        });

    } catch (error: any) {
        console.error('Error querying source database:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to query data' },
            { status: 500 }
        );
    }
}
