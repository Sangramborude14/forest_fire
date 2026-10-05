"""Database connection and session factory configuration."""

from typing import Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from .config import settings
from .logging import logger

Base = declarative_base()

# Configure engine (pool_pre_ping ensures stale connections are recycled)
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.warning(f"Could not initialize database engine: {e}")
    engine = None
    SessionLocal = None


def get_db() -> Generator[Optional[Session], None, None]:
    """Dependency for yielding database session in API routes."""
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> str:
    """Check connectivity to PostgreSQL database."""
    if engine is None:
        return "not_configured"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return "connected"
    except Exception as e:
        logger.debug(f"Database health check failed: {e}")
        return "unreachable"
