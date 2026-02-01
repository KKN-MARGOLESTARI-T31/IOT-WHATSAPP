import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';

/**
 * GET /api/stats - Get dashboard statistics
 */
export async function GET(request: NextRequest) {
    try {
        const stats = await getDashboardStats();

        return NextResponse.json({
            success: true,
            stats
        });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
