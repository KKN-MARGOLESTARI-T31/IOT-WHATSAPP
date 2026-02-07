import { NextRequest, NextResponse } from 'next/server';
import { executeSourceQuery } from '@/lib/db-source';

export async function GET(request: NextRequest) {
    try {
        const query = `
            DO $$
            BEGIN
                -- 1. Insert/Update device_controls
                INSERT INTO device_controls (id, "deviceId", mode, command, "updatedAt", "createdAt", "actionBy", reason)
                VALUES (
                    gen_random_uuid(), 
                    'sawah', 
                    'PUMP', 
                    'ON', 
                    NOW(), 
                    NOW(), 
                    'Debug Bot', 
                    'Debug Test'
                )
                ON CONFLICT ("deviceId", mode)
                DO UPDATE SET 
                    command = 'ON', 
                    "updatedAt" = NOW(), 
                    "actionBy" = 'Debug Bot',
                    reason = 'Debug Test';

                -- 2. Reset Timer Otomatis (Prevent auto-off race condition)
                INSERT INTO pump_timers (id, mode, duration, "startTime", "isManualMode", "updatedAt", "createdAt")
                VALUES (gen_random_uuid(), 'sawah', NULL, NULL, true, NOW(), NOW())
                ON CONFLICT (mode)
                DO UPDATE SET 
                    duration = NULL, 
                    "startTime" = NULL, 
                    "isManualMode" = true, 
                    "updatedAt" = NOW();
            END $$;
        `;

        const result = await executeSourceQuery(query);
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            detail: error.detail || 'No detail'
        }, { status: 500 });
    }
}
