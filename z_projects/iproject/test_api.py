"""
Test script to verify Gemini API key and basic functionality.
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

def main():
    print("Testing Gemini API Connection")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv('GEMINI_API_KEY')
    print(f"API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if api_key else 'Not found'}")
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment variables")
        print("Please create a .env file with your API key")
        return
    
    try:
        # Configure the API
        genai.configure(api_key=api_key)
        print("✅ API configured successfully")
        
        # List available models
        print("\nAvailable models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name} (supports generateContent)")
        
        # Test a simple generation with Gemini 2.5 Pro
        print("\nTesting text generation with Gemini 2.5 Pro...")
        model = genai.GenerativeModel('gemini-2.5-pro')
        response = model.generate_content("Say 'Hello, World!' in an interesting way.")
        
        print("\nResponse:")
        print(response.text)
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nPlease check your API key and internet connection.")

if __name__ == "__main__":
    main()
