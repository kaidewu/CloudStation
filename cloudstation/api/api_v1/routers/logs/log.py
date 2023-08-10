from fastapi import APIRouter, Query, Depends
from typing import Union
import sys
import traceback
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine
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
def insert_errorlogs(function: str):
    return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body=f"cloudstation.api.api_v1.routers.logs.log -> {function}()",
            error_traceback=traceback.format_exc()
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
            query_error_log = crud.get_all_error_log(db)
        
        # If it's not empty returns the error data of that ErrorCode
        else:
            query_error_log = crud.get_error_log_by_code(db, errl_code=ErrorCode)
            
            if query_error_log["message"] is None:
                raise SystemError(f"'{ErrorCode}' not found in the table ERROR_ERROR_LOGS")

        # Comprobation if the returns of the select of the BBDD has error
        if query_error_log["is_error"]:
            raise SystemError(query_error_log["message"])

        # Build the JSON that returns when it calls this ENDPOINT
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
        return insert_errorlogs("error_log")
    
@log_router.post("/error/log/remove")
async def remove_log(
    errors_code: ErrorCodeRequest,
    db: Session = Depends(get_db),
):
    try:
        error_codes_list = errors_code.error_code

        if (error_codes_list is None) or (error_codes_list == []) or (error_codes_list == "\"\""):
            return {
                "is_error": True,
                "type": "alert",
                "message": "The Error Code can not be empty"
            }
        else:
            remove_error_log = crud.remove_error_log_by_code(db, errl_code=error_codes_list)

        if remove_error_log["is_error"]:
            raise SystemError(remove_error_log["message"])

        return remove_error_log
    except:
        return insert_errorlogs("remove_log")