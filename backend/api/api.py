from fastapi import APIRouter
from endpoints import router as router_endpoints

api_router = APIRouter()

api_router.include_router(router_endpoints)
