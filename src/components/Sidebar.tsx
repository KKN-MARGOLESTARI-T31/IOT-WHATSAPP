'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Messages', href: '/messages', icon: '💬' },
        { name: 'Contacts', href: '/contacts', icon: '👥' },
        { name: 'Auto-Reply', href: '/auto-reply', icon: '🤖' },
        { name: 'Broadcast', href: '/broadcast', icon: '📢' },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen shadow-2xl">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="text-4xl">💚</div>
                    <div>
                        <h1 className="text-xl font-bold">WhatsApp Bot</h1>
                        <p className="text-xs text-gray-400">Meta API Integration</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700 bg-gray-900">
                <div className="text-xs text-gray-400 text-center">
                    <p>Powered by Meta WhatsApp API</p>
                    <p className="mt-1">& Neon Database</p>
                </div>
            </div>
        </div>
    );
}
