from fastapi import APIRouter

from .patch import router as router_patch
from .delete import router as router_delete

router = APIRouter(prefix='/{task_id}')
router.include_router(router_patch)
router.include_router(router_delete)
