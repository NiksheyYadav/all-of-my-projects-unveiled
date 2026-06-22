from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api import router as api_router, populate_test_data
from .import_data import import_containers, import_items, import_users, import_orbital_paths
import os

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    # Initialize test data on startup
    await populate_test_data()
    # Import data from CSV files
    import_containers()
    import_items()
    import_users()
    import_orbital_paths()

# Use an environment variable to determine the environment
ENV = os.getenv("ENV", "local")  # Default to "local"

if ENV == "docker":
    frontend_dir = "/app/frontend"
else:
    # Local development
    current_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(current_dir, "../../frontend")
    frontend_dir = os.path.abspath(frontend_dir)

# Check if directory exists (for debugging)
if not os.path.exists(frontend_dir):
    raise RuntimeError(f"Frontend directory not found at: {frontend_dir}")

# Include API routes
app.include_router(api_router)

# Mount the static files after including the API routes
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)