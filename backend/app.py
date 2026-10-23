from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import router


app = FastAPI(
    title="Personalized Networking Assistant API",
    version="0.1.0",
    description="Backend API for the Personalized Networking Assistant",
)


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=(
    r"https?://(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}):\d+"
),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)