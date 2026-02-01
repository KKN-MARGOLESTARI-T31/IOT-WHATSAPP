'use client';

import { useEffect, useState } from 'react';

export default function AutoReplyPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Auto-Reply Rules</h1>
                <p className="text-gray-600">Configure automatic responses based on keywords</p>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Auto-Reply Feature</h2>
                <p className="text-gray-600 mb-4">
                    This feature allows you to set up automatic responses based on keywords in incoming messages.
                </p>
                <div className="bg-white rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                    <h3 className="font-semibold mb-2">How it works:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create rules with keywords and reply messages</li>
                        <li>• Choose match types: exact, contains, or starts with</li>
                        <li>• Enable/disable rules anytime</li>
                        <li>• Responses are sent automatically when keywords match</li>
                    </ul>
                </div>
                <p className="text-sm text-gray-500">
                    To add auto-reply rules, insert them directly into the <code className="bg-white px-2 py-1 rounded">auto_reply_rules</code> table in your database.
                </p>
            </div>

            {/* Example SQL */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Example SQL Commands</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {`-- Add an exact match rule
INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
VALUES ('halo', 'Halo! Ada yang bisa saya bantu?', 'exact', true);

-- Add a contains match rule
INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
VALUES ('info', 'Untuk informasi lebih lanjut, silakan hubungi admin.', 'contains', true);

-- Add a starts with rule
INSERT INTO auto_reply_rules (keyword, reply_message, match_type, is_active)
VALUES ('help', 'Berikut adalah daftar perintah yang tersedia...', 'starts_with', true);`}
                </pre>
            </div>
        </div>
    );
}
