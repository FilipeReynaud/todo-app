from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


class NewCollection(BaseModel):
    name: str
    user_id: int


@router.post("/")
async def handler(new_collection: NewCollection,
                  db: Session = Depends(get_db)):
    user_info = await get_user(db, new_collection.user_id)
    """This method handles the creation of a new collection

    Args:
        new_collection (NewCollection): the new collection params to edit
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Integer: The ID of the new collection
    """

    if user_info == []:
        return JSONResponse(
            {"error": "You do not have permissions to execute this operation"},
            status.HTTP_401_UNAUTHORIZED)

    collection_id = await create_new_collection(db, new_collection.name,
                                                new_collection.user_id)
    await db.commit()

    return JSONResponse({"results": collection_id}, status.HTTP_201_CREATED)


async def get_user(db, user_id):
    sql = """select * from "user" where id = :user_id """
    params = {"user_id": user_id}
    return [{
        "id": row[0],
        "name": row[1],
        "email": row[2]
    } for row in (await db.execute(sql, params)).all()]


async def create_new_collection(db, collection_name, user_id):
    sql = """
        insert into collection (id, name, user_id) values
        (default, :collection_name, :user_id)

        returning id
    """
    params = {"collection_name": collection_name, "user_id": user_id}

    return (await db.execute(sql, params)).all()[0][0]