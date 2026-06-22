import asyncio
import aiohttp
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import chromadb
from chromadb.utils import embedding_functions
import numpy as np
from typing import List, Dict, Optional, Tuple, Any
import json
import logging
import uuid
import os
from datetime import datetime
import google.generativeai as genai
from tqdm import tqdm
import re

# Disable ChromaDB telemetry
os.environ["CHROMA_TELEMETRY_ENABLED"] = "false"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class RLAgent:
    """Reinforcement Learning Agent for managing the book publication workflow.
    
    The agent uses Q-learning to determine the optimal sequence of actions
    (scrape, spin, review, human_edit) for processing book content.
    """
    
    def __init__(self, learning_rate: float = 0.1, discount_factor: float = 0.9):
        """Initialize the RL agent.
        
        Args:
            learning_rate: Learning rate for Q-value updates
            discount_factor: Discount factor for future rewards
        """
        self.q_table = {}  # State -> action -> Q-value
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.actions = ['scrape', 'spin', 'review', 'human_edit']
        self.required_actions = self.actions.copy()  # All actions must be performed
        self.completed_actions = set()  # Track completed actions in current episode
        self.episode_count = 0  # Track number of episodes for epsilon decay

    def get_action(self, state: str, iteration: int) -> str:
        """Select an action using epsilon-greedy policy with required action prioritization.
        
        Args:
            state: Current state
            iteration: Current iteration number (for epsilon decay)
            
        Returns:
            str: Selected action
        """
        state_key = str(state)
        
        # Initialize Q-values for this state if not exists
        if state_key not in self.q_table:
            self.q_table[state_key] = {action: 0 for action in self.actions}
        
        # Get remaining required actions that haven't been done yet
        remaining_actions = [a for a in self.required_actions if a not in self.completed_actions]
        
        if remaining_actions:
            # If there are required actions left, prioritize them
            action = remaining_actions[0]
            logger.debug(f"Selecting required action: {action}")
        else:
            # If all required actions are done, use epsilon-greedy
            epsilon = self._get_epsilon(iteration)
            if np.random.random() < epsilon:
                action = np.random.choice(self.actions)
                logger.debug(f"Exploring with action: {action} (epsilon={epsilon:.3f})")
            else:
                # Choose action with highest Q-value, breaking ties randomly
                max_q = max(self.q_table[state_key].values())
                best_actions = [a for a, q in self.q_table[state_key].items() if q == max_q]
                action = np.random.choice(best_actions)
                logger.debug(f"Exploiting with action: {action} (Q={max_q:.3f})")
        
        return action
        
    def _get_epsilon(self, iteration: int) -> float:
        """Calculate epsilon value for epsilon-greedy policy with decay.
        
        Args:
            iteration: Current iteration number
            
        Returns:
            float: Epsilon value between [0.1, 0.5]
        """
        # Start with 50% exploration, decay to 10% over time
        return max(0.1, 0.5 * (0.98 ** (self.episode_count + iteration)))

    def update_q_table(self, state: str, action: str, reward: float, next_state: str) -> None:
        """Update Q-table using Q-learning update rule.
        
        Args:
            state: Current state
            action: Action taken
            reward: Reward received
            next_state: Next state
        """
        state_key = str(state)
        next_state_key = str(next_state)
        
        # Initialize Q-values for states if they don't exist
        if state_key not in self.q_table:
            self.q_table[state_key] = {a: 0 for a in self.actions}
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = {a: 0 for a in self.actions}
            
        current_q = self.q_table[state_key][action]
        max_next_q = max(self.q_table[next_state_key].values())
        
        # Q-learning update rule
        new_q = current_q + self.learning_rate * (reward + self.discount_factor * max_next_q - current_q)
        self.q_table[state_key][action] = new_q
        
        # Track completed actions for this episode
        if action in self.required_actions and action not in self.completed_actions:
            self.completed_actions.add(action)
            remaining = [a for a in self.required_actions if a not in self.completed_actions]
            logger.info(f"Completed action: {action}. Remaining: {remaining if remaining else 'None'}")
            
            # If all required actions are done, increment episode counter
            if not remaining:
                self.episode_count += 1
                logger.info(f"Episode {self.episode_count} completed! Resetting completed actions.")
                self.completed_actions = set()
                
    def reset_episode(self) -> None:
        """Reset the agent's state for a new episode."""
        self.completed_actions = set()

class BookPublicationWorkflow:
    """Manages the automated book publication workflow with RL-based action selection.
    
    The workflow processes book chapters through four main actions:
    1. Scrape: Fetch content from a URL and take a screenshot
    2. Spin: Rewrite content using an LLM
    3. Review: Evaluate content quality using an LLM
    4. Human Edit: Allow manual content editing
    """
    
    def __init__(self):
        """Initialize the workflow with ChromaDB for content storage and RL agent for action selection."""
        # Initialize ChromaDB for content versioning and search
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(
            name="book_content",
            embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction()
        )
        
        # Initialize RL agent for action selection
        self.rl_agent = RLAgent()
        
        # Set up directories
        self.output_dir = "screenshots"
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Track processing state
        self.current_chapter = None
        self.current_url = None

    async def scrape_content(self, url: str) -> Dict:
        """Scrape content from a URL and take a screenshot.
        
        Args:
            url: URL of the content to scrape
            
        Returns:
            Dictionary containing the scraped content and metadata
            
        Raises:
            Exception: If scraping fails
        """
        self.current_url = url
        logger.info(f"Scraping content from: {url}")
        
        try:
            async with async_playwright() as p:
                # Launch browser in headful mode for debugging, headless for production
                browser = await p.chromium.launch(headless=False)
                context = await browser.new_context(viewport={'width': 1280, 'height': 800})
                page = await context.new_page()
                
                # Set a reasonable timeout
                page.set_default_timeout(60000)  # 60 seconds
                
                # Navigate to the URL with progress indicator
                logger.info(f"Navigating to {url}")
                with tqdm(total=100, desc="Loading page", unit="%") as pbar:
                    async def update_progress(progress):
                        pbar.update(progress - pbar.n)
                        
                    page.on("load", lambda: update_progress(50))
                    response = await page.goto(url, wait_until="domcontentloaded")
                    await page.wait_for_load_state("networkidle")
                    update_progress(100)
                
                if not response or not response.ok:
                    raise Exception(f"Failed to load page: {response.status if response else 'No response'}")
                
                # Take screenshot with timestamp and sanitized URL
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                domain = url.split('//')[-1].split('/')[0]
                path = '_'.join(url.split('/')[4:])[:100]  # Limit path length
                safe_path = re.sub(r'[^a-zA-Z0-9]', '_', path)
                screenshot_filename = f"{timestamp}_{domain}_{safe_path}.png"
                screenshot_path = os.path.join(self.output_dir, screenshot_filename)
                
                logger.info(f" Taking screenshot: {screenshot_filename}")
                await page.screenshot(path=screenshot_path, full_page=True, type="png")
                
                # Extract main content (adjust selectors as needed)
                logger.info(" Extracting content...")
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Remove unwanted elements (scripts, styles, etc.)
                for element in soup(['script', 'style', 'nav', 'footer', 'header', 'iframe']):
                    element.decompose()
                
                # Get clean text with paragraph breaks
                text = '\n\n'.join(p.get_text().strip() for p in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']) 
                                 if p.get_text().strip())
                
                if not text.strip():
                    # Fallback to body text if no paragraphs found
                    text = soup.get_text('\n', strip=True)
                
                logger.info(f"Successfully scraped {len(text)} characters")
                
                # Close browser
                await context.close()
                await browser.close()
                
                return {
                    'content': text,
                    'metadata': {
                        'url': url,
                        'screenshot': screenshot_path,
                        'timestamp': datetime.now().isoformat(),
                        'action': 'scrape',
                        'content_length': len(text),
                        'word_count': len(text.split())
                    }
                }
                
        except Exception as e:
            logger.error(f"❌ Error scraping {url}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Failed to scrape {url}: {str(e)}")

    async def spin_content(self, content: str, model: str = "gemini") -> Dict:
        """Rewrite content using an LLM to improve quality and engagement.
        
        Args:
            content: The content to rewrite
            model: The LLM model to use (currently only 'gemini' is supported)
            
        Returns:
            Dictionary containing the rewritten content and metadata
            
        Raises:
            RuntimeError: If content spinning fails
        """
        logger.info("🔄 Spinning content with Gemini 1.5 Pro...")
        start_time = datetime.now()
        
        try:
            # Validate input
            if not content or not isinstance(content, str):
                raise ValueError("Invalid content: Content must be a non-empty string")
                
            logger.debug(f"Original content length: {len(content)} characters")
            
            # Truncate content to avoid token limits (approx 10,000 chars ~ 2,500 tokens)
            max_input_chars = 10000
            if len(content) > max_input_chars:
                logger.warning(f"Content length ({len(content)}) exceeds {max_input_chars} chars, truncating")
                content = content[:max_input_chars]
            
            # Initialize Gemini API
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                raise ValueError("GEMINI_API_KEY environment variable is not set. Please create a .env file with your API key.")
                
            genai.configure(api_key=api_key)
            
            # Create model instance with safety settings
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
            
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
            
            # Initialize the model
            try:
                model = genai.GenerativeModel(
                    model_name='gemini-1.5-pro',  # Updated model name
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
                logger.debug("✅ Successfully initialized Gemini 1.5 Pro model")
            except Exception as e:
                raise RuntimeError(f"Failed to initialize Gemini 1.5 Pro model: {str(e)}")
            
            # Prepare the prompt with clear instructions
            prompt = """
            Please rewrite the following content to be more engaging, clear, and professional 
            while preserving the original meaning and key information. 
            
            Guidelines:
            1. Maintain the original tone and style
            2. Fix any grammar or spelling issues
            3. Improve flow and readability
            4. Keep technical terms and proper nouns accurate
            5. Output only the rewritten content, no additional commentary
            
            Original content:
            {}
            
            Rewritten content:
            """.format(content)
            
            logger.debug("Sending request to Gemini API...")
            
            # Generate response with retry logic
            max_retries = 3
            last_error = None
            
            for attempt in range(max_retries):
                try:
                    logger.debug(f"Attempt {attempt + 1}/{max_retries}")
                    
                    # Make the API call
                    response = await asyncio.to_thread(
                        model.generate_content,
                        prompt,
                        request_options={"timeout": 60}  # 60 second timeout
                    )
                    
                    # Check if we got a valid response
                    if not response or not hasattr(response, 'text') or not response.text.strip():
                        raise ValueError(f"Empty or invalid response from API: {response}")
                    
                    # Log success
                    process_time = (datetime.now() - start_time).total_seconds()
                    logger.info(f"✅ Successfully spun content in {process_time:.2f}s (attempt {attempt + 1}/{max_retries})")
                    
                    # Return the result
                    return {
                        'content': response.text.strip(),
                        'metadata': {
                            'action': 'spin',
                            'model': 'gemini-1.5-pro',
                            'timestamp': datetime.now().isoformat(),
                            'original_length': len(content),
                            'new_length': len(response.text),
                            'processing_time_seconds': round(process_time, 2),
                            'attempts': attempt + 1
                        }
                    }
                    
                except Exception as e:
                    last_error = e
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.warning(f"⚠️ Attempt {attempt + 1}/{max_retries} failed: {str(e)}")
                    logger.debug(f"Waiting {wait_time}s before retry...")
                    await asyncio.sleep(wait_time)
            
            # If we get here, all attempts failed
            error_msg = f"Failed to spin content after {max_retries} attempts"
            if last_error:
                error_msg += f": {str(last_error)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
            
        except Exception as e:
            error_msg = f"Content spinning failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise RuntimeError(error_msg) from e
                    
            if "suggestions:" in response.text.lower():
                suggestions = response.text.lower().split("suggestions:")[1].strip().split("\n")
                result['suggestions'] = [s.strip("- ") for s in suggestions if s.strip()]
                
            return result
            
        except Exception as e:
            logger.error(f"Error in review_content: {str(e)}")
            return {
                'content': content,
            'quality_score': np.random.random(),
            'suggestions': ["Improve clarity", "Add more details"],
                'timestamp': datetime.now().isoformat()
            }

    async def human_edit(self, content: str) -> str:
        """Allow human editing of the content"""
        print("Current content (first 1000 chars):\n", content[:1000] + ("..." if len(content) > 1000 else ""))
        print("\nEnter your edits below (press Enter twice when done, or just press Enter to keep unchanged):")
        
        lines = []
        while True:
            try:
                line = input()
                if not line:
                    if not lines:  # If first Enter, check if they want to keep unchanged
                        keep = input("Keep content unchanged? (y/n): ").strip().lower()
                        if keep == 'y':
                            return content
                        continue
                    break
                lines.append(line)
            except EOFError:
                break
                
        return "\n".join(lines) if lines else content

    async def review_content(self, content: str, model: str = "gemini") -> Dict:
        """Review content for quality, engagement, and professionalism.
        
        Args:
            content: The content to review
            model: The LLM model to use (currently only 'gemini' is supported)
            
        Returns:
            Dictionary containing the review results and metadata
            
        Raises:
            RuntimeError: If content review fails
        """
        logger.info("🔍 Reviewing content with Gemini 2.5 Pro...")
        start_time = datetime.now()
        
        try:
            # Validate input
            if not content or not isinstance(content, str):
                raise ValueError("Invalid content: Content must be a non-empty string")
                
            logger.debug(f"Content length for review: {len(content)} characters")
            
            # Initialize Gemini API
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                raise ValueError("GEMINI_API_KEY environment variable is not set.")
                
            genai.configure(api_key=api_key)
            
            # Create model instance with safety settings
            generation_config = {
                "temperature": 0.3,  # Lower temperature for more focused reviews
                "top_p": 0.8,
                "top_k": 32,
                "max_output_tokens": 1024,
            }
            
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
            
            # Initialize the model
            try:
                model = genai.GenerativeModel(
                    model_name='gemini-2.5-pro',
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
                logger.debug("✅ Successfully initialized Gemini 2.5 Pro model for review")
            except Exception as e:
                raise RuntimeError(f"Failed to initialize Gemini 2.5 Pro model: {str(e)}")
            
            # Prepare the review prompt
            prompt = """
            Please review the following content and provide a detailed analysis. 
            Focus on the following aspects:
            
            1. Overall quality and coherence
            2. Grammar, spelling, and punctuation
            3. Clarity and readability
            4. Engagement and style
            5. Suggestions for improvement
            
            Provide your feedback in the following JSON format:
            {
                "score": 0-10,  # Overall quality score (0-10)
                "summary": "Brief overall assessment",
                "strengths": ["List of strengths"],
                "areas_for_improvement": ["List of areas needing improvement"],
                "specific_suggestions": ["Specific suggestions for improvement"]
            }
            
            Content to review:
            {}
            
            Review (in JSON format):
            """.format(content[:10000])  # Limit content length to avoid token limits
            
            logger.debug("Sending review request to Gemini API...")
            
            # Generate response with retry logic
            max_retries = 3
            last_error = None
            
            for attempt in range(max_retries):
                try:
                    logger.debug(f"Review attempt {attempt + 1}/{max_retries}")
                    
                    # Make the API call
                    response = await asyncio.to_thread(
                        model.generate_content,
                        prompt,
                        request_options={"timeout": 60}  # 60 second timeout
                    )
                    
                    # Check if we got a valid response
                    if not response or not hasattr(response, 'text') or not response.text.strip():
                        raise ValueError("Empty or invalid response from API")
                    
                    # Parse the JSON response
                    try:
                        review_data = json.loads(response.text.strip())
                        
                        # Validate the review data structure
                        required_fields = ['score', 'summary', 'strengths', 
                                        'areas_for_improvement', 'specific_suggestions']
                        if not all(field in review_data for field in required_fields):
                            raise ValueError("Invalid review format: Missing required fields")
                        
                        # Calculate processing time
                        process_time = (datetime.now() - start_time).total_seconds()
                        
                        # Log success
                        logger.info(f"✅ Successfully reviewed content in {process_time:.2f}s "
                                  f"(score: {review_data['score']}/10)")
                        
                        # Return the review with metadata
                        return {
                            'review': review_data,
                            'metadata': {
                                'action': 'review',
                                'model': 'gemini-2.5-pro',
                                'timestamp': datetime.now().isoformat(),
                                'content_length': len(content),
                                'processing_time_seconds': round(process_time, 2),
                                'attempts': attempt + 1,
                                'quality_score': float(review_data.get('score', 0))
                            }
                        }
                        
                    except json.JSONDecodeError as e:
                        raise ValueError(f"Failed to parse review response as JSON: {str(e)}")
                    
                except Exception as e:
                    last_error = e
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.warning(f"⚠️ Review attempt {attempt + 1}/{max_retries} failed: {str(e)}")
                    logger.debug(f"Waiting {wait_time}s before retry...")
                    await asyncio.sleep(wait_time)
            
            # If we get here, all attempts failed
            error_msg = f"Failed to review content after {max_retries} attempts"
            if last_error:
                error_msg += f": {str(last_error)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
            
        except Exception as e:
            error_msg = f"Content review failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise RuntimeError(error_msg) from e

    def store_version(self, content: Dict, version_id: str):
        self.collection.add(
            documents=[content['content']],
            metadatas=[{
                'version_id': version_id,
                'url': content.get('url', ''),
                'timestamp': content.get('timestamp', '')
            }],
            ids=[version_id]
        )

    def semantic_search(self, query: str, n_results: int = 5) -> List[Dict]:
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results

    async def process_chapter(self, url: str, max_iterations: int = 10):
        """Process a chapter through all required actions.
        
        Args:
            url: The URL of the chapter to process
            max_iterations: Maximum number of iterations to run (should be at least 4 for all actions)
        """
        # Reset action history for new chapter
        self.rl_agent.action_history = []
        state = f"initial_{url}"
        version_id = str(uuid.uuid4())
        history = []
        iteration = 0
        
        # Continue until all required actions are done or max iterations reached
        while iteration < max_iterations:
            # Get next action from RL agent
            action = self.rl_agent.get_action(state, iteration)
            logger.info(f"Iteration {iteration + 1}: Selected action - {action}")
            
            try:
                if action == 'scrape':
                    content = await self.scrape_content(url)
                    self.store_version(content, version_id)
                    reward = 0.8  # Base reward for successful scraping
                    next_state = f"scraped_{version_id}"
                    
                elif action == 'spin':
                    content_data = self.collection.get(ids=[version_id])
                    if not content_data['documents']:
                        logger.warning("No content to spin, skipping")
                        continue
                    content = {
                        'content': await self.spin_content(content_data['documents'][0]),
                        'url': url,
                        'timestamp': datetime.now().isoformat()
                    }
                    self.store_version(content, version_id)
                    reward = 0.7  # Base reward for spinning
                    next_state = f"spun_{version_id}"
                    
                elif action == 'review':
                    content_data = self.collection.get(ids=[version_id])
                    if not content_data['documents']:
                        logger.warning("No content to review, skipping")
                        continue
                    review_result = await self.review_content(content_data['documents'][0])
                    content = {
                        'content': review_result['content'],
                        'review': review_result,
                        'url': url,
                        'timestamp': datetime.now().isoformat()
                    }
                    self.store_version(content, version_id)
                    reward = review_result['quality_score']
                    next_state = f"reviewed_{version_id}"
                    
                elif action == 'human_edit':
                    content_data = self.collection.get(ids=[version_id])
                    if not content_data['documents']:
                        logger.warning("No content to edit, skipping")
                        continue
                    content = {
                        'content': await self.human_edit(content_data['documents'][0]),
                        'url': url,
                        'timestamp': datetime.now().isoformat()
                    }
                    self.store_version(content, version_id)
                    reward = 0.9  # Base reward for human edit
                    next_state = f"edited_{version_id}"
                
                # Log the action and update history
                history_entry = {
                    'iteration': iteration + 1,
                    'action': action,
                    'content': content,
                    'reward': reward,
                    'state': state,
                    'next_state': next_state,
                    'version_id': version_id,
                    'timestamp': datetime.now().isoformat()
                }
                history.append(history_entry)
                logger.info(f"Action {action} completed with reward {reward}")
                
                # Update RL agent
                self.rl_agent.update_q_table(state, action, reward, next_state)
                state = next_state
                iteration += 1
                
                # Check if all required actions are done
                if set(self.rl_agent.action_history) == set(self.rl_agent.required_actions):
                    logger.info("All required actions completed!")
                    break
                    
            except Exception as e:
                logger.error(f"Error in process_chapter: {str(e)}")
                # If an error occurs, try next action
                continue

        return history

async def main():
    workflow = BookPublicationWorkflow()
    url = "https://en.wikisource.org/wiki/The_Gates_of_Morning/Book_1/Chapter_1"
    history = await workflow.process_chapter(url)
    
    # Save history to file
    with open('publication_history.json', 'w') as f:
        json.dump(history, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())