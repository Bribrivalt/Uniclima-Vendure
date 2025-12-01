#!/bin/bash
# ============================================
# Database Connection Verification Script
# ============================================
# Run from project root: ./scripts/check-db.sh
# ============================================

set -e

echo "🔍 Checking PostgreSQL database connection..."
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed or not in PATH"
        exit 1
    fi
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Check if the db service is running
if ! $COMPOSE_CMD ps db 2>/dev/null | grep -q "Up"; then
    echo "⚠️  Database container is not running."
    echo "   Starting database container..."
    $COMPOSE_CMD up -d db
    echo "   Waiting for database to be ready..."
    sleep 5
fi

# Check PostgreSQL readiness
echo "📡 Checking PostgreSQL readiness..."
if $COMPOSE_CMD exec -T db pg_isready -U vendure -d vendure; then
    echo "✅ PostgreSQL is ready!"
else
    echo "❌ PostgreSQL is not ready"
    echo ""
    echo "💡 Troubleshooting:"
    echo "   1. Check container logs: $COMPOSE_CMD logs db"
    echo "   2. Restart database: $COMPOSE_CMD restart db"
    echo "   3. Check environment variables in .env"
    exit 1
fi

echo ""

# Test connection from backend container (if running)
if $COMPOSE_CMD ps backend 2>/dev/null | grep -q "Up"; then
    echo "📡 Testing connection from backend container..."
    $COMPOSE_CMD exec -T backend npm run db:check 2>/dev/null || echo "   (Backend db:check not available yet)"
fi

echo ""

# Show database info
echo "📊 Database Information:"
$COMPOSE_CMD exec -T db psql -U vendure -d vendure -c "SELECT version();" 2>/dev/null | head -3 || true

echo ""

# Count tables
TABLE_COUNT=$($COMPOSE_CMD exec -T db psql -U vendure -d vendure -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")
echo "📋 Tables in database: $TABLE_COUNT"

if [ "$TABLE_COUNT" -eq "0" ]; then
    echo ""
    echo "⚠️  Database is empty. Run migrations to initialize:"
    echo "   $COMPOSE_CMD exec backend npm run migrations:generate"
    echo "   $COMPOSE_CMD exec backend npm run migrations:run"
fi

echo ""
echo "✅ Database check completed!"