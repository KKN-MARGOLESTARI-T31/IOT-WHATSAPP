import { NextRequest, NextResponse } from 'next/server';
import { executeSourceQuery } from '@/lib/db-source';

export async function GET(request: NextRequest) {
    try {
        const tables = await executeSourceQuery(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        return NextResponse.json({ tables });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
