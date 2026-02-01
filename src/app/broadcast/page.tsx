'use client';

export default function BroadcastPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Broadcast</h1>
                <p className="text-gray-600">Send messages to multiple contacts at once</p>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">📢</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Broadcast Feature</h2>
                <p className="text-gray-600 mb-4">
                    Send bulk messages to multiple contacts simultaneously.
                </p>
                <div className="bg-white rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                    <h3 className="font-semibold mb-2">Planned features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create broadcast campaigns</li>
                        <li>• Select multiple contacts</li>
                        <li>• Schedule messages for later</li>
                        <li>• Track delivery status</li>
                        <li>• View campaign analytics</li>
                    </ul>
                </div>
                <p className="text-sm text-gray-500">
                    This feature is currently under development and will be available in a future update.
                </p>
            </div>
        </div>
    );
}
