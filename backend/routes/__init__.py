from fastapi import APIRouter

from routes.todos import router as todos_router

api_router = APIRouter()
api_router.include_router(todos_router)
