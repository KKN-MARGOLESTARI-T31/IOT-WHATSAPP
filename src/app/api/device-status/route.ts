import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getDeviceStatus as getFonnteStatus } from '@/lib/whatsapp-fonnte';

/**
 * GET /api/device-status
 * Returns current WhatsApp device connection status
 */
export async function GET(request: NextRequest) {
    try {
        // Get latest device status from audit_logs
        const latestStatus = await sql`
            SELECT details, created_at
            FROM audit_logs
            WHERE action = 'DEVICE_STATUS'
            ORDER BY created_at DESC
            LIMIT 1
        `;

        let dbStatus = null;
        if (latestStatus.length > 0) {
            const details = latestStatus[0].details;
            dbStatus = {
                status: details.status,
                reason: details.reason,
                timestamp: details.timestamp || latestStatus[0].created_at,
                last_checked: latestStatus[0].created_at
            };
        }

        // Also check live status from Fonnte API
        const fonnteStatus = await getFonnteStatus();

        return NextResponse.json({
            success: true,
            db_status: dbStatus,
            fonnte_status: fonnteStatus,
            is_connected: fonnteStatus.success && fonnteStatus.data?.device_status === 'connect'
        });

    } catch (error) {
        console.error('Error fetching device status:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch device status'
        }, { status: 500 });
    }
}
