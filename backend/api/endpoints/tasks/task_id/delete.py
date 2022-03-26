from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


class Entity(BaseModel):
    user_name: str


@router.delete("/")
async def handler(task_id: int, entity: Entity, db: Session = Depends(get_db)):
    """This method handles the deletion of an existing task

    Args:
        task_id (int): id of the task to delete
        entity (Entity): entity with the name of the user that has the task
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Status: HTTP response
    """
    error, msg = await validate_parameters(db, entity.user_name, task_id)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    await remove_task(db, task_id)

    await db.commit()

    return JSONResponse({}, status.HTTP_200_OK)


async def validate_parameters(db, user_name, task_id):
    if not isinstance(user_name, str):
        return True, f"{user_name} must be of type string"

    if user_name == "":
        return True, f"{user_name} cannot be empty"

    if not isinstance(task_id, int):
        return True, f"{task_id} must be of type int"

    is_owned_by_user = await is_resource_owned_by_user(db, user_name, task_id)
    if not is_owned_by_user:
        return True, f"Task with id {task_id} does not belong to user with username {user_name}"

    return False, None


async def is_resource_owned_by_user(db, user_name, task_id):
    sql = """
        select 1
        from task t
        inner join collection c on c.id = t.collection_id
        inner join "user" u on u.id = c.user_id
        where u.username = :user_name and t.id = :task_id
    """
    params = {"task_id": task_id, "user_name": user_name}

    return (await db.execute(sql, params)).all() != []


async def remove_task(db, task_id):
    sql = """
        delete from task where id = :task_id
    """
    params = {"task_id": task_id}

    (await db.execute(sql, params))