from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints_upload import router as upload_router
from endpoints_contracts import router as contracts_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(contracts_router) 