from errors.error import Error
import os
import shutil
import sys
import traceback

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

def save_files(
        basepath: str,
        files: list,
        drive_path: str
):
    try:
        files_exists = [file for file in files if os.path.exists(os.path.join(os.path.join(basepath, drive_path), file.filename))]
        
        if files_exists != []:
            return insert_errorlogs(
                "FileAlreadyExists",
                "save_files",
                f"File/s '{', '.join(file.filename for file in files_exists)}' name already exists"
            )
        
        for file in files:
            file_path = os.path.join(os.path.join(basepath, drive_path), file.filename)
            if not os.path.isdir(os.path.join(basepath, drive_path)):
                os.makedirs(os.path.join(basepath, drive_path))
            with open(file_path, 'wb+') as f:
                shutil.copyfileobj(file.file, f)
        
        return {
            "is_error": False,
            "massage": "Successfull"
        }

    except:
        return insert_errorlogs(function="save_files")