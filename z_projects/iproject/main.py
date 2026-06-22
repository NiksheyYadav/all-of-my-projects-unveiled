"""
Automated Book Publication Workflow
---------------------------------
A system to fetch content from web URLs, apply AI-driven transformations,
and facilitate human-in-the-loop iterations for book publication.
"""
import os
import asyncio
from dotenv import load_dotenv
from book import BookPublicationWorkflow
from typing import List, Optional

# Load environment variables
load_dotenv()

async def main():
    """Main entry point for the book publication workflow."""
    print("=== Automated Book Publication Workflow ===\n")
    
    # Initialize workflow
    workflow = BookPublicationWorkflow()
    
    # Example URL - can be parameterized or read from config
    chapter_urls = [
        "https://en.wikisource.org/wiki/The_Gates_of_Morning/Book_1/Chapter_1",
        # Add more chapter URLs as needed
    ]
    
    # Process each chapter
    for url in chapter_urls:
        print(f"\nProcessing chapter: {url}")
        try:
            history = await workflow.process_chapter(url)
            print(f"Successfully processed chapter. History saved to publication_history.json")
        except Exception as e:
            print(f"Error processing chapter: {e}")
            continue
    
    # Example semantic search
    try:
        query = "morning gates"
        print(f"\nPerforming semantic search for: {query}")
        results = workflow.semantic_search(query)
        print(f"Search results: {len(results['documents'][0])} matches found")
    except Exception as e:
        print(f"Error performing semantic search: {e}")

if __name__ == "__main__":
    asyncio.run(main())
