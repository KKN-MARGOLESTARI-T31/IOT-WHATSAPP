'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

interface Table {
    table_name: string;
}

export default function DataSourcePage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await fetch('/api/data/tables');
            const data = await response.json();

            if (data.success) {
                setTables(data.tables);
            } else {
                setError(data.error || 'Failed to fetch tables');
            }
        } catch (err) {
            setError('An error occurred while fetching tables');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Source</h1>
                        <p className="text-gray-600">View and send data from source database to WhatsApp</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="mt-4 text-gray-600">Loading tables...</p>
                        </div>
                    )}

                    {/* Tables List */}
                    {!loading && !error && (
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Available Tables</h2>

                            {tables.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    No tables found in source database. <br />
                                    Make sure SOURCE_DATABASE_URL is configured correctly.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tables.map((table) => (
                                        <div
                                            key={table.table_name}
                                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 text-xl">📊</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{table.table_name}</h3>
                                                    <p className="text-sm text-gray-500">Click to view data</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-3">📝 How to use</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Configure SOURCE_DATABASE_URL in your .env.local file</li>
                            <li>Click on a table to preview data</li>
                            <li>Select records to send via WhatsApp</li>
                            <li>Customize message format before sending</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
