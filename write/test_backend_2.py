from research_writer import ResearchWriter
import json
import os

def test_backend():
    print("🧪 Testing Research Writer 2.0 Backend...")
    
    # Initialize writer
    writer = ResearchWriter()
    
    # Test Configuration
    topic = "The Impact of Quantum Computing on Cryptography"
    settings = {
        "deep_think": True,
        "include_images": True,
        "depth": "comprehensive",
        "citation_style": "IEEE"
    }
    
    print(f"\n📝 Topic: {topic}")
    print(f"⚙️ Settings: {json.dumps(settings, indent=2)}")
    
    try:
        # Run research
        result = writer.conduct_research(topic, settings['depth'], settings)
        
        if result['success']:
            print("\n✅ Research Completed Successfully!")
            print(f"📄 Document Path: {result['document_path']}")
            
            # Verify Structure
            with open(result['document_path'], 'r', encoding='utf-8') as f:
                content = f.read()
                
            required_sections = [
                "## Abstract",
                "## 1. Introduction", 
                "## 2. Literature Review",
                "## 3. Methodology",
                "## 4. Results and Analysis",
                "## 5. Discussion",
                "## 6. Conclusion",
                "## References"
            ]
            
            missing = [sec for sec in required_sections if sec not in content]
            
            if not missing:
                print("✅ Strict Academic Structure Verified")
            else:
                print(f"❌ Missing Sections: {missing}")
                
            # Verify Images
            if "![" in content and "](" in content:
                print("✅ Image/Diagram Placeholders Verified")
            else:
                print("❌ No Images Found")
                
        else:
            print(f"❌ Research Failed: {result.get('error')}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_backend()
