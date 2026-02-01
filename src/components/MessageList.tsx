'use client';

import { useEffect, useState } from 'react';
import type { Message } from '@/lib/types';

interface MessageListProps {
    phoneNumber?: string;
    limit?: number;
    autoRefresh?: boolean;
}

export default function MessageList({ phoneNumber, limit = 50, autoRefresh = false }: MessageListProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        try {
            const params = new URLSearchParams();
            if (phoneNumber) params.append('phone', phoneNumber);
            if (limit) params.append('limit', limit.toString());

            const response = await fetch(`/api/messages?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setMessages(data.messages);
            } else {
                setError(data.error || 'Failed to load messages');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        // Auto-refresh if enabled
        if (autoRefresh) {
            const interval = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
            return () => clearInterval(interval);
        }
    }, [phoneNumber, limit, autoRefresh]);

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-lg">No messages yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[70%] ${msg.direction === 'outbound' ? 'order-2' : 'order-1'}`}>
                        <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${msg.direction === 'outbound'
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                        >
                            {/* Contact info for inbound messages */}
                            {msg.direction === 'inbound' && (
                                <div className="text-xs font-semibold text-gray-600 mb-1">
                                    {msg.contact_profile_name || msg.contact_name || msg.phone_number}
                                </div>
                            )}

                            {/* Message body */}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {msg.message_body || '(No content)'}
                            </p>

                            {/* Message metadata */}
                            <div className={`flex items-center gap-2 mt-2 text-xs ${msg.direction === 'outbound' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                <span>{formatTimestamp(msg.timestamp || new Date(msg.created_at).getTime())}</span>

                                {msg.direction === 'outbound' && (
                                    <span className="flex items-center gap-1">
                                        {msg.status === 'delivered' && '✓✓'}
                                        {msg.status === 'read' && '✓✓ Read'}
                                        {msg.status === 'sent' && '✓'}
                                        {msg.status === 'failed' && '✗'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
