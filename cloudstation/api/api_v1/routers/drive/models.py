from pydantic import BaseModel
from typing import List

class BasepathRequest(BaseModel):
    basepath: str

class CreateDriveRequest(BaseModel):
    newFolders: List[str]