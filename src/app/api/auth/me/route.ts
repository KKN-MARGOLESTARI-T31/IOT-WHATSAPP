import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('session_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );
        }

        const user = await verifySession(token);

        if (!user) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user
        });
    } catch (error: any) {
        console.error('Session verification error:', error);
        return NextResponse.json(
            { success: false, user: null },
            { status: 500 }
        );
    }
}
