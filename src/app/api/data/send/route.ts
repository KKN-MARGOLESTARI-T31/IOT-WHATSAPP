import { NextRequest, NextResponse } from 'next/server';
import { verifySession, addToMessageQueue, updateMessageQueueStatus, logAuditAction } from '@/lib/auth';
import { querySourceData } from '@/lib/db-source';
import { sendTextMessage, validatePhoneNumber } from '@/lib/whatsapp-fonnte';

/**
 * POST /api/data/send
 * Query source database and send data to WhatsApp
 * Source DB is READ-ONLY - no modifications made
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

        const { tableName, phoneColumn, messageColumn, whereClause, limit } = await request.json();

        if (!tableName || !phoneColumn) {
            return NextResponse.json(
                { error: 'Table name and phone column are required' },
                { status: 400 }
            );
        }

        // Query source database (READ-ONLY)
        let columns = [phoneColumn];
        if (messageColumn) {
            columns.push(messageColumn);
        } else {
            columns = ['*']; // Get all columns if message column not specified
        }

        const data = await querySourceData(tableName, columns, whereClause, limit || 10);

        if (!data || data.length === 0) {
            return NextResponse.json({
                success: true,
                sent: 0,
                failed: 0,
                message: 'No data found to send'
            });
        }

        // Send messages to WhatsApp
        let sentCount = 0;
        let failedCount = 0;
        const results = [];

        for (const row of data) {
            try {
                const phone = row[phoneColumn];
                if (!phone) {
                    failedCount++;
                    continue;
                }

                // Validate and format phone number
                const cleanPhone = validatePhoneNumber(phone);

                // Build message from data
                let message = '';
                if (messageColumn && row[messageColumn]) {
                    message = row[messageColumn];
                } else {
                    // If no message column specified, create message from all fields
                    message = Object.entries(row)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                }

                // Add to message queue first (in auth DB)
                const queueItem = await addToMessageQueue(
                    cleanPhone,
                    message,
                    `${tableName}:${row.id || row[Object.keys(row)[0]]}`, // source reference
                    user.id
                );

                // Send via Fonnte
                const result = await sendTextMessage(cleanPhone, message);

                if (result.success) {
                    await updateMessageQueueStatus(queueItem.id, 'sent');
                    sentCount++;
                    results.push({ phone: cleanPhone, status: 'sent' });
                } else {
                    await updateMessageQueueStatus(queueItem.id, 'failed', result.error);
                    failedCount++;
                    results.push({ phone: cleanPhone, status: 'failed', error: result.error });
                }

            } catch (error: any) {
                failedCount++;
                results.push({ phone: row[phoneColumn], status: 'failed', error: error.message });
            }
        }

        // Log audit action
        await logAuditAction(
            user.id,
            'SEND_FROM_SOURCE_DB',
            'message_queue',
            undefined,
            { tableName, sent: sentCount, failed: failedCount }
        );

        return NextResponse.json({
            success: true,
            sent: sentCount,
            failed: failedCount,
            total: data.length,
            results
        });

    } catch (error: any) {
        console.error('Error sending from source DB:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to send messages' },
            { status: 500 }
        );
    }
}
