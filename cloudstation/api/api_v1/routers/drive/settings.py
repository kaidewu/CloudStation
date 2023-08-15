from errors.error import Error
import sys
import traceback

# Insert errors into ERRROR_ERROR_LOGS and get JSON of errors
def insert_errorlogs(function: str):
    return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body=f"cloudstation.api.api_v1.routers.drive.settings -> {function}()",
            error_traceback=traceback.format_exc()
        ).error()

def get_settings(
        basepath: str
    ):
    try:
        return {
            "is_error": False,
            "basepath": basepath,
        }
    except:
        insert_errorlogs(function="get_settings")