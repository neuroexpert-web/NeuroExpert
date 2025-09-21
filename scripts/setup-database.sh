#!/bin/bash

# Setup database script for NeuroExpert Platform
# This script initializes the database and runs migrations

set -e  # Exit on any error

echo "🚀 Setting up NeuroExpert Database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from template"
        echo "🔧 Please edit .env file with your actual values before continuing"
        exit 1
    else
        echo "❌ .env.example file not found. Please create .env file manually"
        exit 1
    fi
fi

# Load environment variables
source .env

# Check if required environment variables are set
required_vars=("DATABASE_URL" "SECRET_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed"
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Check if PostgreSQL is accessible
echo "🔍 Checking database connectivity..."
python3 -c "
import os
import sys
from database import engine
import asyncio
from sqlalchemy import text

async def check_db():
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text('SELECT 1'))
            print('✅ Database connection successful')
            return True
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        return False

if not asyncio.run(check_db()):
    sys.exit(1)
"

if [ $? -ne 0 ]; then
    echo "❌ Database connectivity check failed"
    echo "Please ensure PostgreSQL is running and DATABASE_URL is correct"
    exit 1
fi

# Run Alembic migrations
echo "🔄 Running database migrations..."
if command -v alembic &> /dev/null; then
    alembic upgrade head
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Alembic not found, installing..."
    pip3 install alembic
    alembic upgrade head
    echo "✅ Migrations completed successfully"
fi

# Initialize database with admin user
echo "👤 Initializing admin user..."
python3 init_db.py

# Verify database setup
echo "🔍 Verifying database setup..."
python3 -c "
import asyncio
from database import SessionLocal
from models import User
from sqlalchemy import select

async def verify_setup():
    async with SessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        print(f'✅ Database setup verified. Found {len(users)} users.')
        for user in users:
            print(f'   - {user.username} ({user.email})')

asyncio.run(verify_setup())
"

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "   ✅ Environment variables validated"
echo "   ✅ Dependencies installed"
echo "   ✅ Database connection verified"
echo "   ✅ Migrations applied"
echo "   ✅ Admin user created"
echo ""
echo "🚀 You can now start the application:"
echo "   Frontend: npm run dev"
echo "   Backend:  uvicorn main:app --reload"
echo ""
echo "🔐 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123!"
echo "   ⚠️  Please change the password after first login!"