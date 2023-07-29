import os
import json
import random
import string
from datetime import datetime
from db.database import engine
from db import models
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
session = Session()


def generate_unique_code(length=8, segments=4, segment_length=6, delimiter='-'):
    code = []
    for _ in range(segments):
        segment = ''.join(random.choices(string.ascii_letters + string.digits, k=segment_length))
        code.append(segment)
    return delimiter.join(code)


class Error:
    def __init__(
            self, 
            error_info, 
            filename: str, 
            error_body: str, 
            error_traceback: str,
            error_return: bool = True
        ):
        self.error_title = error_info[0].__name__
        self.error_message = str(error_info[1])
        self.error_code = generate_unique_code()
        self.filename = filename
        self.error_body = error_body
        self.error_traceback = error_traceback.replace("'", "\"")
        self.error_return = error_return

    def error(self):
        error_log_insert = models.ErrorLogs(
            errl_code=self.error_code,
            errl_traceback=f"{self.error_body} File: {self.filename}\n{self.error_traceback}",
            errl_date=str(datetime.now().strftime("%d/%m/%Y %H:%M:%S.%f")),
            errl_deleted=0,
            errl_deleted_date=None
        )
        session.add(error_log_insert)
        session.commit()
        session.refresh(error_log_insert)

        if self.error_return:
            return {
                "is_error": True,
                "error_code": self.error_code,
                "status_code": self.get_status_code(),
                "error_message": self.error_message,
            }

    def get_status_code(self):
        with open(f"{os.path.dirname(__file__)}/error_types.json", "r") as errors:
            error_data = json.load(errors)
            code = error_data[self.error_title]['code']
        return code

    def get_error_name(self):
        with open(f"{os.path.dirname(__file__)}/error_types.json", "r") as errors:
            error_data = json.load(errors)
            title = error_data[self.error_title]['name']
        return title
