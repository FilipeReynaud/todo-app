from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


class TempTask(BaseModel):
    new_title: str
    user_name: str
    new_status: bool


@router.patch("/")
async def handler(task_id: int,
                  temp_task: TempTask,
                  db: Session = Depends(get_db)):
    """This method handles the edition of an existing task

    Args:
        task_id (int): the id of the task that is going to be edited
        temp_task (TempTask): _description_
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        Status: HTTP response
    """
    error, msg = await validate_parameters(db, task_id, temp_task.new_title,
                                           temp_task.user_name,
                                           temp_task.new_status)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    await update_task(db, task_id, temp_task.new_title, temp_task.new_status)
    await db.commit()

    return JSONResponse({}, status.HTTP_200_OK)


async def validate_parameters(db, task_id, new_title, user_name, new_status):
    if not isinstance(task_id, int):
        return True, f"{task_id} must be of type int"

    if not isinstance(new_title, str):
        return True, f"{new_title} must be of type string"

    if new_title == "":
        return True, f"{new_title} cannot be empty"

    if not isinstance(user_name, str):
        return True, f"{user_name} must be of type str"

    if not isinstance(new_status, bool):
        return True, f"{new_status} must be of type boolean"

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


async def update_task(db, task_id, new_title, new_status):
    sql = """
        update task set title = :new_title, is_completed = :new_status
        where id = :task_id
    """
    params = {
        "task_id": task_id,
        "new_title": new_title,
        "new_status": new_status
    }

    await db.execute(sql, params)