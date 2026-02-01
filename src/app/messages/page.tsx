import MessageList from '@/components/MessageList';

export default function MessagesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
                <p className="text-gray-600">View all WhatsApp message history</p>
            </div>

            {/* Messages Container */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="max-h-[700px] overflow-y-auto pr-2">
                    <MessageList limit={100} autoRefresh={true} />
                </div>
            </div>
        </div>
    );
}
