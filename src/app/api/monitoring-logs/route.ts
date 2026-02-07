import { NextRequest, NextResponse } from 'next/server';
import { querySourceData } from '@/lib/db-source';

/**
 * GET /api/monitoring-logs
 * Fetch monitoring logs from water_level_readings table
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');

        // Fetch monitoring logs - using all columns with *
        const logs = await querySourceData(
            'water_level_readings',
            ['*'],
            undefined, // No where clause
            limit
        );

        return NextResponse.json({
            success: true,
            count: logs.length,
            data: logs,
            message: logs.length === 0 ? 'No data found in water_level_readings table' : undefined
        });

    } catch (error: any) {
        console.error('Error fetching monitoring logs:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch monitoring logs'
        }, { status: 500 });
    }
}
