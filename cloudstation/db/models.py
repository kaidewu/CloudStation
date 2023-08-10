from sqlalchemy import Integer, String, Column, Null
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SystemVariables(Base):
    __tablename__ = "CONF_SYSTEM_VARIABLES"

    csva_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    csva_name = Column(String, unique=True, index=True)
    csva_default_values = Column(String, unique=True, index=True)
    csva_description_es = Column(String)
    csva_description_en = Column(String)
    csva_deleted = Column(Integer, default=0)
    csva_deleted_date = Column(String, default=Null)


class ErrorLogs(Base):
    __tablename__ = "ERROR_ERROR_LOGS"

    errl_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    errl_code = Column(String, unique=True, index=True)
    errl_traceback = Column(String)
    errl_date = Column(String)
    errl_deleted = Column(Integer, default=0)
    errl_deleted_date = Column(String, default=None)
