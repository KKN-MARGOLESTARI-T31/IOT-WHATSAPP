
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function cleanup() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        console.log('Deleting all auto-reply rules...');
        await sql`DELETE FROM auto_reply_rules`;
        console.log('✅ All auto-reply rules deleted successfully.');
    } catch (error) {
        console.error('❌ Error deleting rules:', error);
        process.exit(1);
    }
}

cleanup();
