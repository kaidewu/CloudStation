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

def create_new_folder(
    basepath: str,
    folders,
    drive_path: str
):
    try:
        if folders == [] or folders is None or folders == [""]:
            return insert_errorlogs(
                "ValueError",
                "create_new_folder",
                "Folder can't be empty"
            )

        abs_path = os.path.join(basepath, drive_path)

        folder_exists = []

        for folder in folders:
            folder_path = os.path.join(abs_path, folder)
            if os.path.exists(folder_path):
                folder_exists.append(folder)
        
        if folder_exists != []:
            return insert_errorlogs(
                "FileAlreadyExists",
                "create_new_folder",
                f"Folder/s '{', '.join(folder for folder in folder_exists)}' name already exists"
            )

        for folder in folders:
            os.mkdir(os.path.join(abs_path, folder))

        return {
            "is_error": False,
            "massage": "Successfull"
        }
    
    except:
        return insert_errorlogs(function="create_new_folder")