
# FastAPI Modules
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

# General Module
import platform
import os
import traceback
import sys

# Database Modules
from sqlalchemy.orm import Session
from db import models
from sqlalchemy import and_
from sqlalchemy import exc
from db.database import SessionLocal, engine
import sqlalchemy

# Application Modules 
from errors.error import Error
from api.api_v1.routers.drive.drive import get_platform

models.Base.metadata.create_all(bind=engine, checkfirst=True)

media_route = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Insert errors into ERRROR_ERROR_LOGS and get JSON of errors
def insert_errorlogs(
    error_header: str = None, 
    function: str = "",
    error_body: str = None):
    return Error(
            error_info=sys.exc_info()[0].__name__ if error_header is None else error_header,
            filename=__file__,
            error_body=f"cloudstation.api.api_v1.routers.drive.drive -> {function}()",
            error_traceback=traceback.format_exc() if error_body is None else error_body
        ).error()

@media_route.get("/{relative_path:path}")
async def media_drive(
    relative_path: str = "",
    db: Session = Depends(get_db)
):
    try:
        
        basepath = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == get_platform())).first()

        if basepath is None:
            return insert_errorlogs(
                "FileNotFoundError",
                "media_drive", 
                f"The Path is not defined. Please go to the settings to fill the Path"
                )

        return FileResponse(os.path.join(basepath[0], relative_path))

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "Exception",
            "media_drive", 
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs("media_drive")