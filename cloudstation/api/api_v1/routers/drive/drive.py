from fastapi import APIRouter, Query, Depends
from typing import Annotated
from fastapi import File, UploadFile
import platform
import sys
import traceback
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine
from api.api_v1.routers.drive.save_files import save_files
from api.api_v1.routers.drive.settings import get_settings
from api.api_v1.routers.drive.get_drive import get_drive
from errors.error import Error
from api.api_v1.routers.drive.models import BasepathRequest

models.Base.metadata.create_all(bind=engine, checkfirst=True)

drive_router = APIRouter()

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
            error_body=f"cloudstation.api.api_v1.routers.drive.drive -> {function}()",
            error_traceback=traceback.format_exc()
        ).error()

# Get the OS of the machine
def get_platform():
    if platform.system() == "Windows":
        basepath_csva_name = "BASEPATH-WINDOWS"
    elif platform.system() in ("Linux", "Darwin"):
        basepath_csva_name = "BASEPATH-LINUX"
    else:
        raise SystemError("The Operating System doesn't support!!")
    return basepath_csva_name

@drive_router.get("/drive/{drive_path:path}")
async def drive(
        drive_path: str = "",
        orderby: str = Query(default=None, max_length=4),
        db: Session = Depends(get_db)
):
    try:    
        basepath = crud.get_csva_default_values(db, csva_name=get_platform())

        if basepath["is_error"]:
            raise SystemError(basepath["message"])
        
        if basepath["message"] is None:
            raise SystemError(f"The Path is not defined. Please go to the settings to fill the Path")
        
        return get_drive(drive_path=drive_path, order_by=orderby, basepath=basepath["message"][0])
    except:
        return insert_errorlogs("drive")

@drive_router.post("/drive/{drive_path:path}")
async def upload_drive(
    drive_path: str = "",
    files: Annotated[
        list[UploadFile], File(description="Upload Multiple files")
    ] = [],
    db: Session = Depends(get_db)
):
    try:
        basepath = crud.get_csva_default_values(db, csva_name=get_platform())

        if basepath["is_error"]:
            raise SystemError(basepath["message"])
        
        if basepath["message"] is None:
            raise SystemError(f"The Path is not defined. Please go to the settings to fill the Path")
        
        if files != []:
            return save_files(files, basepath["message"][0], drive_path)
        return {
            "is_error": True,
            "message": "File empty"
            }
    except:
        return insert_errorlogs("upload_drive")

@drive_router.get("/settings/drive")
def settings_drive(
    db: Session = Depends(get_db)
):
    try:    
        basepath = crud.get_csva_default_values(db, csva_name=get_platform())

        if basepath["is_error"]:
            raise SystemError(basepath["message"])
        
        if basepath["message"] is None:
            raise SystemError(f"The Path is not defined. Please go to the settings to fill the Path")
        
        return get_settings(basepath["message"][0])
    except:
        return insert_errorlogs("settings_drive")
    
@drive_router.post("/settings/drive")
def update_settings_drive(
    insert_basepath: BasepathRequest,
    db: Session = Depends(get_db)
):
    try:    
        basepath = crud.get_csva_default_values(db, csva_name=get_platform())

        basepath_request = insert_basepath.basepath

        if basepath["is_error"]:
            raise SystemError(basepath["message"])
        
        if basepath["message"] is None:
            insert_query = crud.insert_csva_default_values(db, basepath_request, get_platform())

            if insert_query["is_error"]:
                raise SystemError(insert_query["message"])
        
        results = crud.update_csva_default_values(db, basepath_request, get_platform())

        if results["is_error"]:
            raise SystemError(results["message"])

        return results
    except:
        return insert_errorlogs("settings_drive")