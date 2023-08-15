# FastAPI Modules
from fastapi import APIRouter, Query, Depends
from typing import Annotated
from fastapi import File, UploadFile

# General Module
import platform
import sys
import traceback
import os

# Database Modules
import sqlalchemy
from sqlalchemy.orm import Session
from db import models
from db.database import SessionLocal, engine
from sqlalchemy import and_
from sqlalchemy import exc

# Application Modules 
from api.api_v1.routers.drive.save_files import save_files
from api.api_v1.routers.drive.create_drive import create_new_folder
from api.api_v1.routers.drive.settings import get_settings
from api.api_v1.routers.drive.get_drive import get_drive
from errors.error import Error
from api.api_v1.routers.drive.models import BasepathRequest, CreateDriveRequest

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

# Get the OS of the machine
def get_platform():
    if platform.system() == "Windows":
        basepath_csva_name = "BASEPATH-WINDOWS"
    elif platform.system() in ("Linux", "Darwin"):
        basepath_csva_name = "BASEPATH-LINUX"
    return basepath_csva_name

@drive_router.get("/drive/{drive_path:path}")
async def drive(
        drive_path: str = "",
        orderby: str = Query(default=None, max_length=4),
        db: Session = Depends(get_db)
):
    try:    
        basepath = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == get_platform())).first()

        if basepath is None:
            return insert_errorlogs(
                "SQLError",
                "drive", 
                f"The Path is not defined. Please go to the settings to fill the Path"
                )
        
        return get_drive(drive_path=drive_path, order_by=orderby, basepath=basepath[0])
    
    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs("drive", f"SQL Error: {sql_error}")
    except:
        return insert_errorlogs(function="drive")

@drive_router.post("/drive/upload/{drive_path:path}")
async def upload_drive(
    drive_path: str,
    files: Annotated[
        list[UploadFile], File(description="Upload Multiple files")
    ] = [],
    db: Session = Depends(get_db)
):
    try:
        basepath = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == get_platform())).first()

        if basepath is None:
            return insert_errorlogs(
                "SQLError",
                "upload_drive", 
                f"The Path is not defined. Please go to the settings to fill the Path"
                )
        
        if files == []:
            return insert_errorlogs(
                "ValueError",
                "upload_drive",
                "Files can't be empty"
                )
            
        return save_files(basepath[0], files, drive_path if drive_path is not None else "")

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "SQLError",
            "upload_drive", 
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs(function="upload_drive")

@drive_router.post("/drive/create/{drive_path:path}")
async def create_drive(
    drive_path: str,
    newFolders: CreateDriveRequest,
    db: Session = Depends(get_db)
):
    try:
        basepath = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == get_platform())).first()
        folders = newFolders.newFolders

        if basepath is None:
            return insert_errorlogs(
                "SQLError",
                "create_drive", 
                f"The Path is not defined. Please go to the settings to fill the Path"
                )
        
        if folders == [] or folders is None or folders == [""]:
            return insert_errorlogs(
                "ValueError",
                "create_drive",
                "Folders can't be empty"
            )

        return create_new_folder(basepath[0], folders, drive_path if not drive_path else "")

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "SQLError",
            "create_drive", 
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs(function="create_drive")

@drive_router.get("/settings/drive")
def settings_drive(
    db: Session = Depends(get_db)
):
    try:    
        basepath = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == get_platform())).first()

        if basepath is None:
            return insert_errorlogs(
                "SQLError",
                "upload_drive", 
                f"The Path is not defined. Please go to the settings to fill the Path"
                )
        
        return get_settings(basepath[0])

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "SQLError",
            "settings_drive",
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs(function="settings_drive")
    
@drive_router.put("/settings/drive")
def update_settings_drive(
    insert_basepath: BasepathRequest,
    db: Session = Depends(get_db)
):
    try:

        basepath_request = insert_basepath.basepath

        if (basepath_request == "") or (basepath_request is None):
            return insert_errorlogs(
                "ValueError",
                "update_settings_drive",
                "The Path can't be empty"
            )

        basepath = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == get_platform())).first()

        if basepath is None:

            db.add(models.SystemVariables(
                csva_name=get_platform(),
                csva_default_values = basepath_request,
                csva_description_es="Ruta donde se guarda la carpeta personal",
                csva_description_en="Path where is storage the personal folder",
                csva_deleted=0,
                csva_deleted_date=sqlalchemy.sql.null()
            ))
            db.commit()

        elif basepath is not None:
            if not os.path.exists(basepath_request):
                return insert_errorlogs(
                    "FileNotFoundError",
                    "update_settings_drive", 
                    f"The path {basepath_request} not exists in your device. Please check if the path existing"
                    )
            else:
                db.query(models.SystemVariables).filter(models.SystemVariables.csva_name==get_platform()).update({
                    "csva_default_values": basepath_request
                })
                db.commit()

        else:
            return insert_errorlogs(
                "SQLError",
                "update_settings_drive", 
                f"Something happend in the table CONF_SYSTEM_VARIABLES"
                )

        return {
            "is_error": False,
            "message": f"The path {basepath_request} has been changed successfully"
        }

    except exc.SQLAlchemyError as sql_error:
        return insert_errorlogs(
            "SQLError",
            "update_settings_drive", 
            f"SQL Error: {sql_error}"
            )
    except:
        return insert_errorlogs(function="update_settings_drive")