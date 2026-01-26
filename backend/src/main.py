from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import API routers
from api.auth import router as auth_router
from api.tasks import router as tasks_router
from core.middleware import add_exception_handlers

app = FastAPI(
    title="Todo API",
    description="API for the Todo application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app = add_exception_handlers(app)

# Include API routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)