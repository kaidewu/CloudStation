from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

if os.path.exists(f"{os.path.abspath(os.path.dirname(__file__))}/cloudy.db") == False:
    with open(f"{os.path.abspath(os.path.dirname(__file__))}/cloudy.db", "x"):
        pass
    
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.abspath(os.path.dirname(__file__))}/cloudy.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
