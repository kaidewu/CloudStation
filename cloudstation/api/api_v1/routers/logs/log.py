from fastapi import APIRouter, Query, Depends
from typing import Union
import sys
import traceback
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine

from api.api_v1.routers.drive.get_drive import get_drive
from errors.error import Error

models.Base.metadata.create_all(bind=engine)

log_router = log = APIRouter()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@log.get("/error/log/")
async def error_log(db: Session = Depends(get_db),
                    ErrorCode: Union[str, None] = Query(default=None, len=19)):
    try:
        results = []
        if ErrorCode is None:
            query_error_log = crud.get_all_error_log(db)
        else:
            query_error_log = crud.get_error_log_by_code(db, errl_code=ErrorCode)

        for query in query_error_log:
            if query.errl_deleted != 1:
                results.append({
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