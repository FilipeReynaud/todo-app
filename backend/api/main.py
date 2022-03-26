from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import tasks
from api import api_router
from config import settings

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# api routers
app.include_router(api_router, prefix="/api")

# startup and shutdown handles
app.add_event_handler('startup', tasks.create_start_app_handler(app))
app.add_event_handler('shutdown', tasks.create_stop_app_handler(app))


@app.get("/")
async def ping():
    return "OK"
