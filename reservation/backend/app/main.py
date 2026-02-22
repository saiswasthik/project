from fastapi import APIRouter,FastAPI
from .api.endpoints.table_endpoints import router as table_router
from .api.endpoints.reservation_endpoints import router as  reservation_router
from .api.endpoints.setting_endpoints import router as Setting_router
from .api.endpoints.resturants_endpoints import router as resturant_router
from .db.base import Base
from .db.session import engine
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app=FastAPI()
# router=APIRouter()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],           
)

# app.include_router(router)
app.include_router(table_router,prefix="/api")
app.include_router(reservation_router,prefix="/api")
app.include_router(Setting_router,prefix="/api")
app.include_router(resturant_router,prefix="/api")