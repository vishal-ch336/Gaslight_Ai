from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers.attack import router as attack_router
from routers.auth import router as auth_router
from seed_presets import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hook."""
    init_db()       # create tables on first run
    seed_if_empty()  # populate attack presets if table is empty
    yield


app = FastAPI(
    title="Security Sandbox Backend",
    description="Backend API for the AI Security Sandbox",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware — allow any localhost port (hackathon dev)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------- Health check ---------------
@app.get("/api/health", tags=["health"])
async def health_check():
    """Simple liveness probe."""
    return {"status": "ok"}


# --------------- Routers ---------------
app.include_router(attack_router)
app.include_router(auth_router)

