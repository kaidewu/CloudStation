from flask import Flask, render_template, send_file
from flask_cors import CORS
from db import crud, models
from db.database import SessionLocal, engine
from errors.error import Error
import traceback
import sys
import os
import platform

models.Base.metadata.create_all(bind=engine)
media_server = Flask(__name__,template_folder='template')
CORS(media_server)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db = next(get_db())


@media_server.route("/", defaults={'req_path': ''})
@media_server.route("/<path:req_path>", methods = ['GET', 'POST'])
def index(req_path):
    
    try:
        if platform.system() == "Windows":
            basepath_csva_name = "BASEPATH-WINDOWS"
        elif platform.system() in ("Linux", "Darwin"):
            basepath_csva_name = "BASEPATH-LINUX"
        else:
            raise SystemError("The Operating System doesn't support!!")
        
        basepath = crud.get_csva_default_values(db, csva_name=basepath_csva_name)

        abs_path = os.path.join(basepath[0], req_path)
        """
            abs_path = os.path.join(basepath[0], req_path)
            if os.path.isdir(abs_path):
                list_content = os.listdir(abs_path)
                directories = []
                files = []
                for content in list_content:
                    if os.path.isdir(content):
                        directories.append(content)
                    else:
                        files.append(content)
                return render_template("index.html", req_path=req_path, directories=directories, files=files)
            elif os.path.isfile(abs_path):
                return send_file(abs_path)
            else:
                raise FileExistsError(f"The path {abs_path} is not avaible")
        """
        return send_file(abs_path)
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.media-server.main -> index()",
            error_traceback=traceback.format_exc()
        ).error()

if __name__ == "__main__":
    media_server.run(host="0.0.0.0", port=8080, debug=True)