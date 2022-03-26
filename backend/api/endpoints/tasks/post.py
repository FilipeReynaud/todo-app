from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

from endpoints.collections.delete import is_resource_owned_by_user

router = APIRouter()


class NewTask(BaseModel):
    title: str
    task_type: int
    collection_id: int
    user_name: str


@router.post("/")
async def handler(new_task: NewTask, db: Session = Depends(get_db)):
    """This method handles the creation of a new task

    Args:
        entity (Entity): params for a new task
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Integer: The ID of the new task
    """

    error, msg = await validate_parameters(db, new_task.title,
                                           new_task.task_type,
                                           new_task.collection_id,
                                           new_task.user_name)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    task_id = await create_task(db, new_task.title, new_task.task_type,
                                new_task.collection_id)
    await db.commit()

    return JSONResponse({"results": task_id}, status.HTTP_201_CREATED)


async def validate_parameters(db, title, task_type, collection_id, user_name):
    if not isinstance(task_type, int):
        return True, f"{task_type} must be of type int"

    if not isinstance(title, str):
        return True, f"{title} must be of type string"

    if title == "":
        return True, f"{title} cannot be empty"

    if not isinstance(user_name, str):
        return True, f"{user_name} must be of type str"

    if not isinstance(collection_id, int):
        return True, f"{collection_id} must be of type int"

    is_owned_by_user = await is_resource_owned_by_user(db, user_name,
                                                       collection_id)
    if not is_owned_by_user:
        return True, f"Collection with id {collection_id} does not belong to user with username {user_name}"

    return False, None


async def create_task(db, title, task_type, collection_id):
    sql = """
        insert into task (id, title, is_completed, task_type, collection_id) values
        (default, :title, false, :task_type, :collection_id)

        returning id
    """
    params = {
        "title": title,
        "task_type": task_type,
        "collection_id": collection_id,
    }

    return (await db.execute(sql, params)).all()[0][0]