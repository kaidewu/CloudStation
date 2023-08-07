from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_
from db import models
from datetime import datetime

'''
    Queries of SELECTS
'''
def get_csva_default_values(db: Session, csva_name: str):
    try:
        results = db.query(models.SystemVariables.csva_default_values).filter(and_(models.SystemVariables.csva_deleted == 0, models.SystemVariables.csva_name == csva_name)).first()
        if results is None:
            raise FileNotFoundError(f"'{csva_name}' not found in the table CONF_SYSTEM_VARIABLES")
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

        if results is None:
            raise FileNotFoundError(f"'{errl_code}' not found in the table ERROR_ERROR_LOGS")
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