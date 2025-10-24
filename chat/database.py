from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

# Prefer APP_DATABASE_URL, fall back to DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "No database URL configured. Set APP_DATABASE_URL or DATABASE_URL in your environment."
    )

# Use conservative pool settings and disable asyncpg statement cache to avoid
# prepared-statement issues when behind pgbouncer or Supabase pooler.
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=0,
    connect_args={
        "statement_cache_size": 0,  # disable asyncpg statement cache
    },
)

SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def get_db():
    # Standard pattern: use context manager to ensure session is closed
    async with SessionLocal() as session:
        yield session
