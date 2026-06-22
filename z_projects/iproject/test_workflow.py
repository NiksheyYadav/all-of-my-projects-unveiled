"""
End-to-end test for the Book Publication Workflow.

This script tests the complete workflow including:
1. Scraping content from a URL
2. Spinning content with AI
3. Reviewing content quality
4. Human editing (simulated)
5. Version tracking
6. Semantic search
"""
import asyncio
import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from book import BookPublicationWorkflow
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Test URL
TEST_URL = "https://en.wikisource.org/wiki/The_Gates_of_Morning/Book_1/Chapter_1"

async def run_test():
    """Run the end-to-end test of the book publication workflow."""
    print("🚀 Starting Book Publication Workflow Test")
    print("=" * 50)
    
    # Initialize the workflow
    workflow = BookPublicationWorkflow()
    
    try:
        # 1. Test scraping
        print("\n1. Testing content scraping...")
        scraped = await workflow.scrape_content(TEST_URL)
        print(f"✅ Successfully scraped {len(scraped['content'])} characters")
        print(f"📸 Screenshot saved to: {scraped['metadata']['screenshot']}")
        
        # 2. Test content spinning
        print("\n2. Testing content spinning...")
        spun = await workflow.spin_content(scraped['content'])
        print(f"✅ Successfully spun content")
        print(f"📏 Original length: {len(scraped['content'])} chars")
        print(f"📏 New length: {len(spun['content'])} chars")
        
        # 3. Test content review
        print("\n3. Testing content review...")
        review = await workflow.review_content(spun['content'])
        print(f"✅ Review completed with score: {review['metadata']['quality_score']}/10")
        print(f"💡 Suggestions:", review['review']['specific_suggestions'] if review['review']['specific_suggestions'] else "No suggestions")
        
        # 4. Test human edit (simulated)
        print("\n4. Testing human edit (simulated)...")
        # Simulate human input for testing
        async def simulated_human_edit(content: str) -> str:
            return content + " [Simulated human edit]"
        workflow.human_edit = simulated_human_edit  # Mock for testing
        edited_content = await workflow.human_edit(spun['content'])
        print(f"✅ Edit completed. Content length: {len(edited_content)} chars")
        
        # 5. Test version storage
        print("\n5. Testing version storage...")
        version_id = f"test_{int(datetime.now().timestamp())}"
        workflow.store_version({
            'content': edited_content,
            'url': TEST_URL,
            'timestamp': datetime.now().isoformat()
        }, version_id)
        print(f"✅ Version stored with ID: {version_id}")
        
        # 6. Test semantic search
        print("\n6. Testing semantic search...")
        query = "morning gates"
        results = workflow.semantic_search(query, n_results=2)
        print(f"🔍 Search results for '{query}':")
        for i, doc in enumerate(results['documents'][0], 1):
            print(f"   {i}. {doc[:100]}...")
        
        print("\n🎉 All tests completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(run_test()))
