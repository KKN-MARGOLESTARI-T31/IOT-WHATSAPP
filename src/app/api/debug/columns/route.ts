import { NextRequest, NextResponse } from 'next/server';
import { executeSourceQuery } from '@/lib/db-source';

export async function GET(request: NextRequest) {
    try {
        const columns = await executeSourceQuery(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'monitoring_logs'
        `);
        return NextResponse.json({ columns });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
