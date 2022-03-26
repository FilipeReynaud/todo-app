from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from config import settings

engine = create_async_engine(settings.DATABASE_URI,
                             echo=True,
                             pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine,
                            autocommit=False,
                            autoflush=False,
                            class_=AsyncSession)


async def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        await db.close()
