from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

from endpoints.collections.delete import is_resource_owned_by_user

router = APIRouter()


class TempCollection(BaseModel):
    collection_id: int
    new_name: str
    user_name: str


@router.patch("/")
async def handler(temp_collection: TempCollection,
                  db: Session = Depends(get_db)):
    """This method handles the edition of an existing collection

    Args:
        temp_collection (TempCollection): the new collection params to edit
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Status: HTTP response
    """

    error, msg = await validate_parameters(db, temp_collection.collection_id,
                                           temp_collection.new_name,
                                           temp_collection.user_name)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    await update_collection(db, temp_collection.collection_id,
                            temp_collection.new_name)
    await db.commit()

    return JSONResponse({}, status.HTTP_200_OK)


async def validate_parameters(db, collection_id, new_name, user_name):
    if not isinstance(collection_id, int):
        return True, f"{collection_id} must be of type int"

    if not isinstance(new_name, str):
        return True, f"{new_name} must be of type string"

    if new_name == "":
        return True, f"{new_name} cannot be empty"

    if not isinstance(user_name, str):
        return True, f"{user_name} must be of type str"

    is_owned_by_user = await is_resource_owned_by_user(db, user_name,
                                                       collection_id)
    if not is_owned_by_user:
        return True, f"Collection with id {collection_id} does not belong to user with username {user_name}"

    return False, None


async def update_collection(db, collection_id, new_name):
    sql = """
        update collection set name = :new_name where id = :collection_id;
    """
    params = {"collection_id": collection_id, "new_name": new_name}

    await db.execute(sql, params)