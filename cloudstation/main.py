from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import sys
import traceback

from api.api_v1.routers.drive.drive import drive_router
from api.api_v1.routers.logs.log import log_router
from media.media import media_route
from errors.error import Error

try:

    app = FastAPI()

    # Configure CORS
    # Replace with your React app's URL
    origins = [
        "http://192.168.1.47:3000",
        "http://localhost:3000"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )


    @app.get("/favicon.ico")
    async def get_favicon():
        return FileResponse(os.path.join(os.path.dirname(__file__),"public/favicon.ico"))


    app.include_router(
        drive_router,
        prefix="/api/v1",
        tags=["drive"],
    )

    app.include_router(
        log_router,
        prefix="/api/v1",
        tags=["log"],
    )

    app.include_router(
        media_route,
        prefix="/media/v1",
        tags=["media"],
    )
except:
    Error(
        error_info=sys.exc_info(),
        filename=__file__,
        error_body="cloudstation.main.startup",
        error_traceback=traceback.format_exc(),
        error_return=False
        ).error()

if __name__ == "__main__":
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=8888, reload=True)
    except:
        Error(
        error_info=sys.exc_info(),
        filename=__file__,
        error_body="cloudstation.main.app_startup -> if __name__ == '__main__'",
        error_traceback=traceback.format_exc(),
        error_return=False
        ).error()
