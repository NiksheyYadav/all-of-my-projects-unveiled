import sys
import os
from datetime import datetime

print("Python Environment Test")
print("=" * 50)
print(f"Python Version: {sys.version}")
print(f"Current Directory: {os.getcwd()}")
print(f"Files in directory: {os.listdir('.')}")
print(f"Current time: {datetime.now()}")

# Test basic imports
try:
    import asyncio
    import aiohttp
    from playwright.async_api import async_playwright
    from bs4 import BeautifulSoup
    import chromadb
    import numpy as np
    import google.generativeai as genai
    from dotenv import load_dotenv
    
    print("\n✅ All required imports successful!")
    
    # Test environment variables
    load_dotenv()
    print(f"\nEnvironment Variables:")
    print(f"GEMINI_API_KEY: {'Set' if os.getenv('AIzaSyBXrDbQi5gbAlB2QPecZSa6xkP8tqbxvig') else 'Not Set'}")
    print(f"CHROMA_TELEMETRY_ENABLED: {os.getenv('CHROMA_TELEMETRY_ENABLED', 'Not Set')}")
    
except ImportError as e:
    print(f"\n❌ Import Error: {e}")
    print("Please install the required packages using: pip install -r requirements.txt")
