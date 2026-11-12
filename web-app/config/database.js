const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inventory_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
};

let pool = null;
let isConnected = false;

function getPool() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

/**
 * Test database connection and auto-initialize tables if needed
 */
async function initDatabase() {
    try {
        // First try connecting to MySQL server directly (without selecting DB) in case DB doesn't exist
        const rootConnection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await rootConnection.end();

        // Now test the pool connection with the actual database
        const p = getPool();
        const [rows] = await p.query('SHOW TABLES');
        isConnected = true;
        console.log(`[Database] Terhubung ke MySQL ${dbConfig.host}:${dbConfig.port} (database: ${dbConfig.database})`);

        // If database is empty, run schema.sql
        if (rows.length === 0) {
            console.log('[Database] Database masih kosong. Menjalankan migrasi awal dari schema.sql...');
            const schemaPath = path.join(__dirname, '../database/schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                // Split statements safely
                const statements = schemaSql
                    .split(/;\s*$/m)
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('use '));

                for (const statement of statements) {
                    try {
                        await p.query(statement);
                    } catch (stmtErr) {
                        // ignore minor seed duplications
                    }
                }
                console.log('[Database] Migrasi schema dan seed data berhasil dijalankan!');
            }
        }
        return true;
    } catch (err) {
        isConnected = false;
        console.warn(`[Database Warning] Gagal terhubung ke MySQL (${err.code || err.message}).`);
        console.warn(`[Database Info] Pastikan service MySQL/XAMPP sudah dinyalakan pada port ${dbConfig.port}.`);
        return false;
    }
}

module.exports = {
    getPool,
    initDatabase,
    isDbConnected: () => isConnected,
    dbConfig
};
