from fastapi import APIRouter

from .users import router as router_users
from .collections import router as router_collections
from .tasks import router as router_tasks


router = APIRouter()
router.include_router(router_users)
router.include_router(router_collections)
router.include_router(router_tasks)
