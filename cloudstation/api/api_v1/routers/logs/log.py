from fastapi import APIRouter, Query, Depends, HTTPException, Request
from typing import Union, List
from pydantic import BaseModel
import sys
import traceback
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine

from api.api_v1.routers.drive.get_drive import get_drive
from errors.error import Error

models.Base.metadata.create_all(bind=engine)

log_router  = APIRouter()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ErrorCodeRequest(BaseModel):
    error_code: List[str]


@log_router.get("/error/log/")
async def error_log(db: Session = Depends(get_db),
                    ErrorCode: Union[str, None] = Query(default=None, len=19)):
    try:
        results = []

        print(ErrorCode)

        if (ErrorCode is None) or (ErrorCode == "") or (ErrorCode == "\"\""):
            query_error_log = crud.get_all_error_log(db)
        else:
            query_error_log = crud.get_error_log_by_code(db, errl_code=ErrorCode)

        if query_error_log["is_error"]:
            raise HTTPException(500, query_error_log["message"])

        for query in query_error_log["message"]:
            results.append({
                "is_error": False,
                "error_id": query.errl_id,
                "error_code": query.errl_code,
                "error_traceback": query.errl_traceback,
                "error_date": query.errl_date,
            })

        return results
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.api.api_v1.routers.logs.log -> error_log()",
            error_traceback=traceback.format_exc()
        ).error()
    
@log_router.post("/error/log/")
async def remove_log(
    request_data: ErrorCodeRequest,
    db: Session = Depends(get_db),
):
    try:
        error_codes_list = request_data.error_code

        if (error_codes_list is None) or (error_codes_list == []) or (error_codes_list == "\"\""):
            return {
                "type": "alert",
                "message": "The Error Code can not be empty"
            }
        else:
            remove_error_log = crud.remove_error_log_by_code(db, errl_code=error_codes_list)

        if remove_error_log["is_error"]:
            raise HTTPException(500, remove_error_log["message"])

        return remove_error_log
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.api.api_v1.routers.logs.log -> remove_log()",
            error_traceback=traceback.format_exc()
        ).error()