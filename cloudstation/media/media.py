from errors.error import Error
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from db import crud, models
from db.database import SessionLocal, engine
import platform
import os
import traceback
import sys

models.Base.metadata.create_all(bind=engine)

media_route = media = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@media.get("/{relative_path:path}")
async def media(
    relative_path: str = "",
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

        if basepath["is_error"]:
            raise HTTPException(500, basepath["message"])

        return FileResponse(os.path.join(basepath["message"][0], relative_path))
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.media.media -> media()",
            error_traceback=traceback.format_exc()
        ).error()