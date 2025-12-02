from fastapi import APIRouter
from scrapper.browser_scrapper import main_workflow


router = APIRouter()


@router.get("/")
def read_root():
    main_workflow()
    