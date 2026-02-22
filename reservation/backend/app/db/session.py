from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..core.config import Config

# DATABASE_URL="sqlite:///./reservation.db"
# DATABASE_URL = "postgresql://postgres:Msai1919%40@localhost:5432/restaurant_db"
database_url=Config.DATABASE_URL


engine=create_engine(database_url,
                     connect_args={"sslmode": "require"})
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
        