"""

Demo script to test the Research Writer system
"""

from research_writer import ResearchWriter
import time

def main():
    print("=" * 80)
    print("🔬 RESEARCH WRITER DEMO")
    print("=" * 80)
    print()
    
    # Initialize the research writer
    writer = ResearchWriter()
    
    # Test topic
    topic = "Artificial Intelligence in Healthcare"
    
    print(f"🎯 Demo Topic: {topic}")
    print(f"📊 This demo will showcase the complete research workflow")
    print()
    
    # Conduct research
    result = writer.conduct_research(topic, depth="comprehensive")
    
    print()
    print("=" * 80)
    print("📈 DEMO RESULTS")
    print("=" * 80)
    print(f"✅ Research ID: {result['research_plan']['research_id']}")
    print(f"✅ Document Path: {result['document_path']}")
    print(f"✅ Sources Collected: {result['sources_collected']}")
    print(f"✅ Sources Used: {result['sources_used']}")
    print(f"✅ Subtopics: {len(result['research_plan']['subtopics'])}")
    print()
    
    print("📄 Preview of generated document:")
    print("-" * 80)
    
    # Read and display the document preview
    with open(result['document_path'], 'r', encoding='utf-8') as f:
        content = f.read()
        # Show first 1000 characters
        preview = content[:1000]
        print(preview)
        print("\n... (truncated)")
    
    print()
    print("=" * 80)
    print("🎉 DEMO COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print()
    print("Next steps:")
    print("1. Run 'python api_server.py' to start the web server")
    print("2. Open http://localhost:5000 in your browser")
    print("3. Enjoy the beautiful Google AI Studio themed interface!")
    print()

if __name__ == "__main__":
    main()
