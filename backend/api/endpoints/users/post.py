from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

from endpoints.users.user_name.get import get_user

router = APIRouter()


class NewUser(BaseModel):
    user_name: str
    email: str


@router.post("/")
async def handler(new_user: NewUser, db: Session = Depends(get_db)):
    """This method handles the creation of a new user

    Args:
        new_user (NewUser): an entity corresponding to the user to be created
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Integer: ID of the new user
    """
    error, msg = await validate_parameters(db, new_user.user_name)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    new_user_id = await create_new_user(db, new_user.user_name, new_user.email)

    await db.commit()

    return JSONResponse({"results": new_user_id}, status.HTTP_201_CREATED)


async def validate_parameters(db, user_name: str):
    if not isinstance(user_name, str):
        return True, "<user_name> must be a string"

    user_record = await get_user(db, user_name)
    if user_record != []:
        return True, f"User {user_name} already exists."

    return False, None


async def create_new_user(db, user_name: str, email: str):
    sql = """
        insert into "user" (id, username, email) values
        (default, :user_name, :email)

        returning id
    """
    params = {"user_name": user_name, "email": email}

    return (await db.execute(sql, params)).all()[0][0]