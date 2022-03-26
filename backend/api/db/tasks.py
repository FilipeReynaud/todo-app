import logging

from fastapi import FastAPI
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from session import SessionLocal

logger = logging.getLogger(__name__)

max_tries = 60
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def connect_to_db(app: FastAPI) -> None:
    try:
        async with SessionLocal() as db:
            await db.execute("select 1")
    except Exception as e:
        logger.error(e)
        raise e
