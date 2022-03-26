from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/")
async def handler(user_name: str, db: Session = Depends(get_db)):
    """This method handles the request for a user

    Args:
        user_name (str): name of the user
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        User: the user that has the name <user_name>
    """
    records = await get_user(db, user_name)

    return JSONResponse({"results": records}, status.HTTP_200_OK)


async def get_user(db, user_name):
    sql = """select * from "user" where username = :user_name"""
    params = {"user_name": user_name}
    return [{
        "id": row[0],
        "name": row[1],
        "email": row[2]
    } for row in (await db.execute(sql, params)).all()]
