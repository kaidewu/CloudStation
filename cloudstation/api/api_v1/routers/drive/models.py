from pydantic import BaseModel

class BasepathRequest(BaseModel):
    basepath: str