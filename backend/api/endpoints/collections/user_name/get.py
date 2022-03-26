from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from pydantic import BaseModel
from session import get_db
from sqlalchemy.orm import Session

from endpoints.users.user_name.get import get_user

router = APIRouter()


@router.get("/")
async def handler(user_name: str, db: Session = Depends(get_db)):
    """This function is responsible for fetching the collections owned by
    a user in the database.

    Args:
        user_name (str): username of the user in the database
        db (Session, optional): database client instance. Defaults to Depends(get_db).

    Returns:
        object: {
            <collection_id>: {
                name: <collection_name>,
                tasks: {
                    active: [<task1>, ..., <taskN>],
                    completed: [<task1>, ..., <taskM>]
                }
            }
        }
    """
    error, msg = await validate_parameters(db, user_name)
    if error:
        return JSONResponse({"error": msg}, status.HTTP_400_BAD_REQUEST)

    non_empty = await get_non_empty_collections(db, user_name)
    empty = await get_empty_collections(db, user_name)
    records = [non_empty, empty]

    collections = {}
    for record in records:
        for row in record:
            collection_id = list(row[0].keys())[0]
            tasks = list(row[0][collection_id].keys())[1]
            keys = list(row[0][collection_id][tasks].keys())

            # Initialize deeper structure
            if collection_id not in collections.keys():
                collections[collection_id] = {
                    'name': row[0][collection_id]['name'],
                    'tasks': {
                        'active': [],
                        'completed': []
                    }
                }

            for key in keys:
                task_status = 'active' if key == "false" else "completed"
                collections[collection_id]['tasks'][task_status] = row[0][
                    collection_id]['tasks'][key]

    return JSONResponse({"results": collections}, status.HTTP_200_OK)


async def validate_parameters(db, user_name: str):
    if not isinstance(user_name, str):
        return True, "<user_name> must be a string"

    user_record = await get_user(db, user_name)
    if user_record == []:
        return True, f"User {user_name} does not exist."

    return False, None


async def get_non_empty_collections(db, user_name):
    sql = """
        select
            json_build_object(
                c.id , json_build_object(
                    'name', c."name",
                    'tasks', json_build_object(
                        t.is_completed , json_agg(
                            json_build_object(
                                'id', t.id,
                                'title', t.title,
                                'task_type', t.task_type,
                                'collection_id', t.collection_id
                            )
                        )
                    )
                )
            )
        from
            task t
        inner join collection c on
            c.id = t.collection_id
        inner join "user" u on
            u.id = c.user_id
        where
            u.username = :user_name
        group by
            c.id,
            t.is_completed
        order by
            c.id
    """
    params = {"user_name": user_name}
    results = (await db.execute(sql, params)).all()

    return [row for row in results]


async def get_empty_collections(db, user_name):
    sql = """
        select
            json_build_object(
                c.id , json_build_object(
                    'name', c."name",
                    'tasks', json_build_object(
                        'false' , array[]::integer[],
                        'true' , array[]::integer[]
                    )
                )
            )
        from
            collection c
        inner join "user" u on
            u.id = c.user_id
        where
            c.id not in (
            select
                distinct collection_id
            from
                task
        )
            and u.username = :user_name
        group by
            c.id
        order by
            c.id
    """
    params = {"user_name": user_name}
    results = (await db.execute(sql, params)).all()

    return [row for row in results]
