from fastapi import APIRouter

from .post import router as router_post
from .delete import router as router_delete
from .patch import router as router_patch
from .user_name import router as router_user_name

router = APIRouter(prefix='/collections')
router.include_router(router_post)
router.include_router(router_delete)
router.include_router(router_patch)
router.include_router(router_user_name)
