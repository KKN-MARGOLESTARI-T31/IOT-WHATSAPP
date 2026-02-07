'use client';

import { useEffect, useState } from 'react';

interface DeviceStatus {
    is_connected: boolean;
    db_status: {
        status: string;
        reason?: string;
        timestamp: number;
    } | null;
}

export default function ConnectionAlert() {
    const [status, setStatus] = useState<DeviceStatus | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check status immediately
        checkStatus();

        // Poll every 30 seconds
        const interval = setInterval(checkStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        try {
            const res = await fetch('/api/device-status');
            const data = await res.json();
            if (data.success) {
                setStatus(data);

                // Reset dismissed if status changes
                if (data.is_connected) {
                    setDismissed(false);
                }
            }
        } catch (error) {
            console.error('Failed to check device status:', error);
        }
    };

    // Don't show if no status or dismissed or connected
    if (!status || dismissed || status.is_connected) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                            WhatsApp Disconnected
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>
                                {status.db_status?.reason || 'Device connection lost'}
                            </p>
                            <p className="mt-2 font-semibold">
                                Please reconnect your WhatsApp device:
                            </p>
                            <ol className="mt-1 list-decimal list-inside space-y-1">
                                <li>Login to <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-900">fonnte.com</a></li>
                                <li>Scan QR code with WhatsApp</li>
                                <li>Wait for connection</li>
                            </ol>
                        </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={() => setDismissed(true)}
                            className="inline-flex text-red-400 hover:text-red-500"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
