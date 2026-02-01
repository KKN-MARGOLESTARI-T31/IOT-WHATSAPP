import ContactList from '@/components/ContactList';

export default function ContactsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Contacts</h1>
                <p className="text-gray-600">Manage all your WhatsApp contacts</p>
            </div>

            {/* Contacts Table */}
            <ContactList />
        </div>
    );
}
