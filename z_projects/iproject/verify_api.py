"""
Verify the Gemini API key configuration.
"""
import os
import google.generativeai as genai
from dotenv import load_dotenv

def main():
    print("🔍 Verifying Gemini API Key Configuration")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment variables")
        return False
    
    print(f"✅ Found API key: {api_key[:10]}...{api_key[-4:]}")
    
    try:
        # Configure the API
        genai.configure(api_key=api_key)
        
        # List available models as a test
        print("\n🔌 Testing API connection...")
        models = genai.list_models()
        
        # Check if we have access to the Gemini 2.5 Pro model
        gemini_models = [m for m in models if 'gemini' in m.name.lower()]
        
        if not gemini_models:
            print("❌ Error: No Gemini models found. Check your API key permissions.")
            return False
            
        print("\n✅ Successfully connected to Gemini API")
        print("\nAvailable Gemini models:")
        for model in gemini_models:
            print(f"- {model.name}")
            
        return True
        
    except Exception as e:
        print(f"\n❌ Error connecting to Gemini API: {str(e)}")
        print("\nPlease check:")
        print("1. Your internet connection")
        print("2. The API key is correct and has the necessary permissions")
        print("3. Your account has access to the Gemini API")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
