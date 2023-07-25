from fastapi import APIRouter, Query, Depends
import platform
import sys
import traceback
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine

from api.api_v1.routers.drive.get_drive import get_drive
from errors.error import Error

models.Base.metadata.create_all(bind=engine)

drive_router = drive = APIRouter()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@drive.get("/drive/{drive_path:path}")
async def drive(
        drive_path: str = "",
        orderby: str = Query(default=None, max_length=4),
        db: Session = Depends(get_db)
):
    try:
        if platform.system() == "Windows":
            basepath_csva_name = "BASEPATH-WINDOWS"
        elif platform.system() in ("Linux", "Darwin"):
            basepath_csva_name = "BASEPATH-LINUX"
        else:
            raise SystemError("The Operating System doesn't support!!")
        
        basepath = crud.get_csva_default_values(db, csva_name=basepath_csva_name)
        return get_drive(drive_path=drive_path, order_by=orderby, basepath=basepath[0])
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.api.api_v1.routers.drive.drive -> drive()",
            error_traceback=traceback.format_exc()
        ).error()
