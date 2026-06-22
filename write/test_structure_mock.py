from research_writer import ResearchWriter
import json
from unittest.mock import MagicMock

def test_structure_mock():
    print("🧪 Testing Document Structure (Mocked)...")
    
    writer = ResearchWriter()
    
    # Mock data
    research_plan = {
        "topic": "Mock Topic",
        "research_id": "test_mock",
        "subtopics": ["Subtopic 1", "Subtopic 2"],
        "research_questions": ["Q1?"],
        "keywords": ["mock"]
    }
    
    synthesis = {
        "topic": "Mock Topic",
        "sources_used": 5,
        "sections": {
            "Subtopic 1": {
                "content": ["Content for subtopic 1."],
                "sources": ["http://example.com/1"]
            },
            "Subtopic 2": {
                "content": ["Content for subtopic 2."],
                "sources": ["http://example.com/2"]
            }
        },
        "key_findings": ["Finding 1"]
    }
    
    sources = [
        {"title": "Source 1", "url": "http://example.com/1", "date": "2024", "source": "Example"},
        {"title": "Source 2", "url": "http://example.com/2", "date": "2024", "source": "Example"}
    ]
    
    # Configure settings
    writer.config['research_settings']['depth_level'] = 'comprehensive'
    writer.config['research_settings']['include_images'] = True
    writer.config['output_settings']['citation_style'] = 'IEEE'
    
    # Generate document
    doc_path = writer.write_research_document(research_plan, synthesis, sources)
    
    print(f"📄 Generated: {doc_path}")
    
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    print("\n🔍 Verifying Sections:")
    required = [
        "## Abstract",
        "## 1. Introduction",
        "## 2. Literature Review",
        "## 3. Methodology",
        "## 4. Results and Analysis",
        "## 5. Discussion",
        "## 6. Conclusion",
        "## References"
    ]
    
    all_present = True
    for req in required:
        if req in content:
            print(f"  ✅ Found: {req}")
        else:
            print(f"  ❌ MISSING: {req}")
            all_present = False
            
    if "![" in content:
        print("  ✅ Found Image Placeholder")
    else:
        print("  ❌ MISSING Image Placeholder")
        
    if all_present:
        print("\n✅ STRICT STRUCTURE VERIFIED")
    else:
        print("\n❌ STRUCTURE VERIFICATION FAILED")

if __name__ == "__main__":
    test_structure_mock()
