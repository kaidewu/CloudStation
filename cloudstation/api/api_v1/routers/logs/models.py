from typing import List
from pydantic import BaseModel

class ErrorCodeRequest(BaseModel):
    error_code: List[str]