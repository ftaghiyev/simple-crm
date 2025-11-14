from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from .database import Base, engine
from . import models
from .routers import users, leads, activities, dashboard
import os

app = FastAPI(title="Real Estate CRM API")

raw_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = [ origin.strip() for origin in raw_origins.split(',') if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,         
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/", tags=["Health"])
def root():
    return {"message": "CRM API is running..."}

@app.get("/health", tags=["Health"])
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}



app.include_router(users.router)
app.include_router(leads.router)
app.include_router(activities.router)
app.include_router(dashboard.router)
