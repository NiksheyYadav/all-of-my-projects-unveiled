from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import image, resume, text, video
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase-admin-key.json")  # Service account key
firebase_admin.initialize_app(cred)

app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase auth dependency
def verify_token(token: str):
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

# Routers
app.include_router(image.router, prefix="/api/image", tags=["Image Generator"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume Analyzer"])
app.include_router(text.router, prefix="/api/text", tags=["Text Generator"])
app.include_router(video.router, prefix="/api/video", tags=["Text-to-Video"])

@app.get("/")
def root():
    return {"msg": "AI SaaS Backend is running 🚀"}
