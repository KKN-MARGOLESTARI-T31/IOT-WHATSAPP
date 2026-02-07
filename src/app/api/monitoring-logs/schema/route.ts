import { NextRequest, NextResponse } from 'next/server';
import { executeSourceQuery } from '@/lib/db-source';

/**
 * GET /api/monitoring-logs/schema
 * Check the schema of water_level_readings table
 */
export async function GET(request: NextRequest) {
    try {
        // Get table schema
        const schema = await executeSourceQuery(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' 
              AND table_name = 'water_level_readings'
            ORDER BY ordinal_position
        `);

        // Get sample data
        const sample = await executeSourceQuery(`
            SELECT * FROM water_level_readings 
            ORDER BY timestamp DESC 
            LIMIT 3
        `);

        return NextResponse.json({
            success: true,
            schema: schema,
            sample: sample
        });

    } catch (error: any) {
        console.error('Error checking schema:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to check schema'
        }, { status: 500 });
    }
}
