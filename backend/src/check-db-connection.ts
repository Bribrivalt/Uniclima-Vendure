/**
 * Database connection verification script
 * Run with: npm run db:check
 * 
 * Verifies that the PostgreSQL database is accessible and properly configured.
 */
import 'dotenv/config';
import { Client } from 'pg';

async function checkDbConnection(): Promise<void> {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'vendure',
        user: process.env.DB_USERNAME || 'vendure',
        password: process.env.DB_PASSWORD || 'vendure',
    };

    console.log('🔍 Checking database connection...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user}`);
    console.log('');

    const client = new Client(config);

    try {
        await client.connect();
        console.log('✅ Successfully connected to PostgreSQL!');

        // Check database version
        const versionResult = await client.query('SELECT version()');
        console.log(`📊 PostgreSQL Version: ${versionResult.rows[0].version.split(',')[0]}`);

        // Check if any Vendure tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%vendure%' OR table_name LIKE '%product%' OR table_name LIKE '%channel%'
            ORDER BY table_name
            LIMIT 10
        `);

        if (tablesResult.rows.length > 0) {
            console.log('📋 Vendure tables found:');
            tablesResult.rows.forEach(row => {
                console.log(`   - ${row.table_name}`);
            });
        } else {
            console.log('📋 No Vendure tables found (fresh database)');
            console.log('   Run migrations to initialize the schema.');
        }

        // Count total tables
        const countResult = await client.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log(`📊 Total tables in database: ${countResult.rows[0].count}`);

        await client.end();
        console.log('');
        console.log('✅ Database connection check completed successfully!');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Database connection failed!');
        console.error(`   Error: ${error.message}`);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('');
            console.error('💡 Troubleshooting tips:');
            console.error('   1. Make sure PostgreSQL is running');
            console.error('   2. Check if the database container is up: docker-compose up db');
            console.error('   3. Verify the DB_HOST in your .env file');
        } else if (error.code === '3D000') {
            console.error('');
            console.error('💡 Database does not exist. Create it with:');
            console.error(`   CREATE DATABASE ${config.database};`);
        } else if (error.code === '28P01') {
            console.error('');
            console.error('💡 Authentication failed. Check your DB_USERNAME and DB_PASSWORD');
        }
        
        await client.end().catch(() => {});
        process.exit(1);
    }
}

checkDbConnection();