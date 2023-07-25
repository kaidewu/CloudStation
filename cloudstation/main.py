from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
import uvicorn

# Add root project path into the system path
import sys
import os
#sys.path.append(os.path.dirname(__file__))
#print(sys.path)

from api.api_v1.routers.drive.drive import drive_router
from api.api_v1.routers.logs.log import log_router

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8888, reload=True)
