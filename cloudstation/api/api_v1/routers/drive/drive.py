from fastapi import APIRouter, Query, Depends, HTTPException
from typing import Annotated
from fastapi import File, UploadFile
import platform
import sys
import traceback
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine
from api.api_v1.routers.drive.save_files import save_files

from api.api_v1.routers.drive.get_drive import get_drive
from errors.error import Error

models.Base.metadata.create_all(bind=engine)

drive_router = APIRouter()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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

        print(basepath)

        if basepath["is_error"]:
            raise HTTPException(500, basepath["message"])
        
        return get_drive(drive_path=drive_path, order_by=orderby, basepath=basepath["message"][0])
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.api.api_v1.routers.drive.drive -> drive()",
            error_traceback=traceback.format_exc()
        ).error()

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
            raise HTTPException(500, basepath["message"])
        
        if files != []:
            return save_files(files, basepath["message"][0], drive_path)
        return {"message": "File empty"}
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.api.api_v1.routers.drive.drive -> upload_drive()",
            error_traceback=traceback.format_exc()
        ).error()
    