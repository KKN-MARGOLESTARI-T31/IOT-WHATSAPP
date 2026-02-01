'use client';

import StatsCards from '@/components/StatsCards';
import SendMessageForm from '@/components/SendMessageForm';
import MessageList from '@/components/MessageList';


export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Monitor your WhatsApp bot activity and send messages</p>
            </div>

            {/* Statistics Cards */}
            <StatsCards />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Message Form */}
                <div>
                    <SendMessageForm onMessageSent={() => {
                        // Refresh messages list when a new message is sent
                        window.location.reload();
                    }} />
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Messages</h2>
                    <div className="max-h-[500px] overflow-y-auto pr-2">
                        <MessageList limit={10} autoRefresh={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
