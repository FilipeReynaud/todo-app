from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


class Entity(BaseModel):
    user_name: str
    collection_id: int


@router.delete("/")
async def handler(entity: Entity, db: Session = Depends(get_db)):
    """This method handles the removal of an existing collection

    Args:
        entity (Entity): the collection to be deleted
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Status: HTTP response
    """

    error, msg = await validate_parameters(db, entity.user_name,
                                           entity.collection_id)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    await remove_collection(db, entity.collection_id)

    await db.commit()

    return JSONResponse({}, status.HTTP_200_OK)


async def validate_parameters(db, user_name, collection_id):
    if not isinstance(user_name, str):
        return True, f"{user_name} must be of type string"

    if user_name == "":
        return True, f"{user_name} cannot be empty"

    if not isinstance(collection_id, int):
        return True, f"{collection_id} must be of type int"

    is_owned_by_user = await is_resource_owned_by_user(db, user_name,
                                                       collection_id)
    if not is_owned_by_user:
        return True, f"Collection with id {collection_id} does not belong to user with username {user_name}"

    return False, None


async def is_resource_owned_by_user(db, user_name, collection_id):
    sql = """
        select 1
        from collection c
        inner join "user" u on u.id = c.user_id
        where u.username = :user_name and c.id = :collection_id
    """
    params = {"collection_id": collection_id, "user_name": user_name}

    return (await db.execute(sql, params)).all() != []


async def remove_collection(db, collection_id):
    await remove_collection_tasks(db, collection_id)

    sql = """
        delete from collection where id = :collection_id
    """
    params = {"collection_id": collection_id}

    (await db.execute(sql, params))


async def remove_collection_tasks(db, collection_id):
    sql = """
        delete from task where collection_id = :collection_id
    """
    params = {"collection_id": collection_id}

    (await db.execute(sql, params))
