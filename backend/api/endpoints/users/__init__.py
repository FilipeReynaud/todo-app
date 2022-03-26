from fastapi import APIRouter

from .post import router as router_post
from .user_name import router as router_user_name

router = APIRouter(prefix='/users')
router.include_router(router_post)
router.include_router(router_user_name)
