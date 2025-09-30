from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Environment check
IS_PRODUCTION = os.getenv("NODE_ENV") == "production"

# Database configuration
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_DB = os.getenv("POSTGRES_DB", "ai_audit")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

# Security check for production
if IS_PRODUCTION and POSTGRES_PASSWORD == "postgres":
    raise ValueError("Default password detected in production! Please set POSTGRES_PASSWORD environment variable.")

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Disable SQL echo in production for security
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, 
    echo=not IS_PRODUCTION,  # Only log SQL in development
    pool_pre_ping=True,  # Verify connections before using
    pool_size=10 if IS_PRODUCTION else 5,  # Larger pool for production
    max_overflow=20 if IS_PRODUCTION else 10
)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
