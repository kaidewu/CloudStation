from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_
from db import models
from datetime import datetime
from fastapi import HTTPException

'''
    Queries of SELECTS
'''
def get_csva_default_values(db: Session, csva_name: str):
    try:
        results = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == csva_name)).first()

        return {
            "is_error": False,
            "message": results
        }
    except SQLAlchemyError as e:
        return {
            "is_error": True,
            "message": e
        }


def get_all_error_log(db: Session):
    try:
        results = db.query(models.ErrorLogs).filter(models.ErrorLogs.errl_deleted == 0).all()
        return {
            "is_error": False,
            "message": results
        }
    except SQLAlchemyError as e:
        return {
            "is_error": True,
            "message": e
        }


def get_error_log_by_code(db: Session, errl_code: str):
    try:
        results = db.query(models.ErrorLogs).filter(and_(models.ErrorLogs.errl_deleted == 0, models.ErrorLogs.errl_code == errl_code)).all()

        return {
            "is_error": False,
            "message": results
        }
    except SQLAlchemyError as e:
        return {
            "is_error": True,
            "message": e
        }


'''
    Queries of UPDATES
'''
def remove_error_log_by_code(db: Session, errl_code: list[str]):
    try:
        db.query(models.ErrorLogs).filter(models.ErrorLogs.errl_code.in_(errl_code)).update({
            "errl_deleted": 1, 
            "errl_deleted_date": datetime.now()
        })
        db.commit()
        return {
            "is_error": False,
            "message": f"Error Code {', '.join(err_code for err_code in errl_code)} has been deleted successfully"
        }
    except SQLAlchemyError as e:
        db.rollback()
        return {
            "is_error": True,
            "message": e
        }
    
def update_csva_default_values(
        db: Session,
        csva_default_values: str,
        platform: str
):
    try:
        results = db.query(models.SystemVariables).filter(models.SystemVariables.csva_name==platform).update({
            "csva_default_values": csva_default_values
        })
        db.commit()
        print(results)
        return {
            "is_error": False,
            "message": f"'{csva_default_values}' has been update successfully"
        }
    except SQLAlchemyError as e:
        return {
            "is_error": True,
            "message": e
        }


'''
    Queries of Inserts
'''

def insert_csva_default_values(
        db: Session,
        csva_default_values: str,
        platform: str
    ):
    try:
        if platform == "BASEPATH-WINDOWS":
            add_query = models.SystemVariables(
                csva_name="BASEPATH-WINDOWS",
                csva_default_values = csva_default_values,
                csva_description_es="Ruta en Windows donde se guarda la carpeta personal",
                csva_description_en="Path in Windows where is storage the personal folder",
                csva_deleted=0,
                csva_deleted_date=None
            )
        elif platform == "BASEPATH-LINUX":
            add_query = models.SystemVariables(
                csva_name="BASEPATH-LINUX",
                csva_default_values = csva_default_values,
                csva_description_es="Ruta en Linux donde se guarda la carpeta",
                csva_description_en="Path in Linux where is storage the folder",
                csva_deleted=0,
                csva_deleted_date=None
            )
        else:
            raise SystemError("Operating system not supported")
        
        db.add(add_query)
        db.commit()

        return {
            "is_error": False,
            "message": f"'{csva_default_values}' has been added successfully"
        }
    except SQLAlchemyError as e:
        return {
            "is_error": True,
            "message": e
        }