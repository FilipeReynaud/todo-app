from typing import Callable

from fastapi import FastAPI

from db.tasks import connect_to_db


def create_start_app_handler(app: FastAPI) -> Callable:

    async def start_app() -> None:
        await connect_to_db(app)

    return start_app


def create_stop_app_handler(app: FastAPI) -> Callable:

    def stop_app() -> None:
        pass

    return stop_app
