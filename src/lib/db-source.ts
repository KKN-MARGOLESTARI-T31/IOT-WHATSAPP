import { neon } from '@neondatabase/serverless';

// Source Database Connection (Database eksternal yang datanya akan dikirim ke WhatsApp)
const SOURCE_DB_URL = process.env.SOURCE_DATABASE_URL;

if (!SOURCE_DB_URL) {
    console.warn('Warning: SOURCE_DATABASE_URL not configured. Source database features will be disabled.');
}

export const sourceDb = SOURCE_DB_URL ? neon(SOURCE_DB_URL) : null;

/**
 * Test source database connection
 */
export async function testSourceConnection() {
    if (!sourceDb) {
        return { success: false, error: 'Source database not configured' };
    }

    try {
        const result = await sourceDb`SELECT 1 as test`;
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Source DB connection error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get available tables from source database
 */
export async function getSourceTables() {
    if (!sourceDb) throw new Error('Source database not configured');

    try {
        const tables = await sourceDb`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
        return tables;
    } catch (error) {
        console.error('Error getting source tables:', error);
        throw error;
    }
}

/**
 * Get columns for a specific table
 */
export async function getTableColumns(tableName: string) {
    if (!sourceDb) throw new Error('Source database not configured');

    try {
        const columns = await sourceDb`
      SELECT 
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      ORDER BY ordinal_position
    `;
        return columns;
    } catch (error) {
        console.error('Error getting table columns:', error);
        throw error;
    }
}

/**
 * Query data from source database
 * 
 * Example usage:
 * const data = await querySourceData('your_table', ['id', 'phone', 'message'], 'status = pending', 100);
 */
export async function querySourceData(
    tableName: string,
    columns: string[] = ['*'],
    whereClause?: string,
    limit: number = 100,
    orderBy?: string
) {
    if (!sourceDb) throw new Error('Source database not configured');

    try {
        const columnsStr = columns.join(', ');
        const whereStr = whereClause ? `WHERE ${whereClause}` : '';
        const orderByStr = orderBy ? `ORDER BY ${orderBy}` : '';

        // Note: Using template literal for table/column names (not user input)
        // For dynamic queries, consider using a query builder
        const query = `
      SELECT ${columnsStr}
      FROM ${tableName}
      ${whereStr}
      ${orderByStr}
      LIMIT ${limit}
    `;

        const data = await sourceDb(query);
        return data;
    } catch (error) {
        console.error('Error querying source data:', error);
        throw error;
    }
}

/**
 * Execute custom SQL query on source database
 * WARNING: Use with caution! Validate input to prevent SQL injection
 */
export async function executeSourceQuery(query: string) {
    if (!sourceDb) throw new Error('Source database not configured');

    try {
        const result = await sourceDb(query);
        return result;
    } catch (error) {
        console.error('Error executing source query:', error);
        throw error;
    }
}

/**
 * Get data from source database (READ-ONLY)
 * Customize this based on your source database structure
 * 
 * Example: Get records with phone numbers for WhatsApp notification
 */
export async function queryForWhatsApp(
    tableName: string,
    phoneColumn: string = 'phone_number',
    messageColumn?: string,
    whereClause?: string,
    limit: number = 100
) {
    if (!sourceDb) throw new Error('Source database not configured');

    try {
        let selectColumns = phoneColumn;
        if (messageColumn) {
            selectColumns += `, ${messageColumn}`;
        } else {
            selectColumns += ', *';
        }

        const whereStr = whereClause ? `WHERE ${whereClause}` : '';

        const query = `
      SELECT ${selectColumns}
      FROM ${tableName}
      ${whereStr}
      LIMIT ${limit}
    `;

        const data = await sourceDb(query);
        return data;
    } catch (error) {
        console.error('Error querying for WhatsApp:', error);
        throw error;
    }
}

// ⚠️ IMPORTANT: Source database is READ-ONLY
// All modifications (tracking sent status, etc) are stored in Auth DB message_queue table
// Do NOT add UPDATE/INSERT/DELETE functions for source database
