from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db import models


def get_csva_default_values(db: Session, csva_name: str):
    try:
        results = db.query(models.SystemVariables.csva_default_values).filter(models.SystemVariables.csva_name == csva_name).first()
        if results is None:
            raise FileNotFoundError(f"'{csva_name}' not found in the table CONF_SYSTEM_VARIABLES")
        return results
    except SQLAlchemyError as e:
        return e


def get_all_error_log(db: Session):
    try:
        return db.query(models.ErrorLogs).all()
    except SQLAlchemyError as e:
        return e


def get_error_log_by_code(db: Session, errl_code: str):
    try:
        results = db.query(models.ErrorLogs).filter(models.ErrorLogs.errl_code == errl_code).all()
        if results is None:
            raise FileNotFoundError(f"'{errl_code}' not found in the table ERROR_ERROR_LOGS")
        return results
    except SQLAlchemyError as e:
        return e


