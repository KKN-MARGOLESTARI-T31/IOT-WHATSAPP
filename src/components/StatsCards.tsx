'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
    total_contacts: number;
    total_messages: number;
    messages_today: number;
    messages_inbound: number;
    messages_outbound: number;
}

export default function StatsCards() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();

            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Contacts',
            value: stats.total_contacts || 0,
            icon: '👥',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Messages',
            value: stats.total_messages || 0,
            icon: '💬',
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Today',
            value: stats.messages_today || 0,
            icon: '📅',
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Inbound',
            value: stats.messages_inbound || 0,
            icon: '📥',
            color: 'from-orange-500 to-orange-600',
        },
        {
            title: 'Outbound',
            value: stats.messages_outbound || 0,
            icon: '📤',
            color: 'from-pink-500 to-pink-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                        <div className={`text-3xl bg-gradient-to-r ${card.color} w-12 h-12 rounded-lg flex items-center justify-center shadow-md`}>
                            <span className="filter brightness-125">{card.icon}</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{card.value.toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
