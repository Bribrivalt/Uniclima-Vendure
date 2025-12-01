/**
 * Standalone migration runner script
 * Run with: npm run migrations:run
 * 
 * This script runs pending migrations without starting the full Vendure server.
 * Useful for CI/CD pipelines and production deployments.
 */
import { runMigrations } from '@vendure/core';
import { config } from './vendure-config';

async function main() {
    console.log('🔄 Running database migrations...');
    console.log(`📦 Database: ${process.env.DB_NAME || 'vendure'}`);
    console.log(`🖥️  Host: ${process.env.DB_HOST || 'localhost'}`);
    
    try {
        await runMigrations(config);
        console.log('✅ Migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

main();