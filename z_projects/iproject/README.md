# Automated Book Publication Workflow

An intelligent system for processing book chapters through AI-powered content enhancement and human review.

## Features

- **Web Scraping**: Extract content from any URL with automatic screenshot capture
- **AI-Powered Rewriting**: Enhance content using Google's Gemini AI
- **Quality Review**: Get detailed feedback and scoring on content quality
- **Human-in-the-Loop**: Seamlessly integrate human editing into the workflow
- **Version Control**: Track all content versions with ChromaDB
- **Semantic Search**: Find relevant content across all processed chapters

## Prerequisites

- Python 3.9+
- Playwright browsers
- Google Gemini API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd book-publication-workflow
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   playwright install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API key and preferences
   ```

## Usage

1. Run the workflow:
   ```bash
   python main.py
   ```

2. The system will guide you through:
   - Scraping content from a URL
   - AI-powered content enhancement
   - Quality review and scoring
   - Human editing (if needed)
   - Version tracking and storage

## Configuration

Edit `.env` to customize:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `SCREENSHOT_DIR`: Directory to save screenshots
- `LOG_LEVEL`: Logging verbosity
- RL Agent parameters (learning rate, discount factor, etc.)

## Project Structure

- `main.py`: Entry point for the application
- `book.py`: Core workflow and RL agent implementation
- `llm.py`: LLM integration (Gemini AI)
- `requirements.txt`: Python dependencies
- `.env.example`: Template for environment variables
- `screenshots/`: Directory for captured screenshots

## License

This project is for evaluation purposes only. All rights reserved.

## Submission

- **Deadline**: August 5, 2025
- **Requirements**:
  - Working code
  - Demo video
  - GitHub repository link
