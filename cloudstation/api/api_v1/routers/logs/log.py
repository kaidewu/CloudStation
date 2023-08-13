# FastAPI Modules
from fastapi import APIRouter, Query, Depends
from typing import Union

# General Modules
import sys
import traceback
from datetime import datetime

# Database Modules
from sqlalchemy.orm import Session
from db import models
from db.database import SessionLocal, engine
from sqlalchemy import and_
from sqlalchemy import exc
import sqlalchemy

# Application Modules 
from errors.error import Error
from .models import ErrorCodeRequest

# Create the conenction to the BBDD sqlite3
models.Base.metadata.create_all(bind=engine, checkfirst=True)

# Declare the FastAPI()
log_router = APIRouter()

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


# Routes of logs API
@log_router.get("/error/log/")
async def error_log(db: Session = Depends(get_db),
                    ErrorCode: Union[str, None] = Query(default=None, len=19)):
    '''
        Get all errors info if the variable ErrorCode is empty.
        
        If it's not empty returns information of that specific error code 
    '''
    try:
        results = []

        # Check if the ErrorCode is empty. If it's empty returns all errors data
        if (ErrorCode is None) or (ErrorCode == "") or (ErrorCode == "\"\""):
            query_error_log = db.query(models.ErrorLogs).filter(models.ErrorLogs.errl_deleted == 0).all()
        
        # If it's not empty returns the error data of that ErrorCode
        else:
            query_error_log = db.query(models.ErrorLogs).filter(and_(models.ErrorLogs.errl_deleted == 0, models.ErrorLogs.errl_code == errl_code)).all()

        # Build the JSON that returns when it calls this ENDPOINT
        for query in query_error_log:
            results.append({
                "is_error": False,
                "error_id": query.errl_id,
                "error_code": query.errl_code,
                "error_traceback": query.errl_traceback,
                "error_date": query.errl_date,
            })

        return results

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "Exception",
            "error_log", 
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs("error_log")
    
@log_router.put("/error/log/remove")
async def remove_log(
    errors_code: ErrorCodeRequest,
    db: Session = Depends(get_db),
):
    try:
        error_codes_list = errors_code.error_code

        if (error_codes_list is None) or (error_codes_list == []) or (error_codes_list == "\"\""):
            return insert_errorlogs(
                "Exception",
                "remove_log",
                "The Error Code can not be empty"
            )
        
        db.query(models.ErrorLogs).filter(models.ErrorLogs.errl_code.in_(error_codes_list)).update({
            "errl_deleted": 1, 
            "errl_deleted_date": datetime.now()
        })
        db.commit()

        return {
            "is_error": False,
            "message": f"Error code {', '.join(error_code for error_code in error_codes_list)} has been remove successfully"
        }

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "Exception",
            "remove_log", 
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs("remove_log")