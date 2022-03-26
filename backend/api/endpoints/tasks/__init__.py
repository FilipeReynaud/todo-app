from fastapi import APIRouter

from .post import router as router_post
from .task_id import router as router_task_id

router = APIRouter(prefix='/tasks')
router.include_router(router_post)
router.include_router(router_task_id)
