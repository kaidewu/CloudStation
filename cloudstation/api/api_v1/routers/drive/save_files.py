from errors.error import Error
import os
import shutil
import sys
import traceback

# Insert errors into ERRROR_ERROR_LOGS and get JSON of errors
def insert_errorlogs(function: str):
    return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body=f"cloudstation.api.api_v1.routers.drive.save_files -> {function}()",
            error_traceback=traceback.format_exc()
        ).error()

def save_files(
        files: list,
        basepath: str,
        path: str
):
    try:
        files_exists = []
        for file in files:
            file_path = os.path.join(os.path.join(basepath, path), file.filename)
            if os.path.exists(file_path):
                files_exists.append(file)
            if not os.path.isdir(os.path.join(basepath, path)):
                os.makedirs(os.path.join(basepath, path))
            with open(file_path, 'wb+') as f:
                shutil.copyfileobj(file.file, f)
        return {
            "is_error": False,
            "message": f"Files {', '.join(file.filename for file in files_exists)} name already exists in the {path}" if len(files_exists) > 0 else "Successful"
        }
    except:
        return insert_errorlogs("save_files")