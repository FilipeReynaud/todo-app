from config import settings
from db.client import DBClient

db = DBClient(
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    database=settings.DB_DATABASE,
    user=settings.DB_USER,
    password=settings.DB_PASSWORD,
)