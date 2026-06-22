"""
Vision Analyzer - Advanced Screen Understanding

Uses Claude Vision API to understand screenshots and locate UI elements.
"""

import base64
from typing import Dict, Any, Optional, Tuple
from pathlib import Path
import sys
import time

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger
import anthropic

logger = get_logger(__name__)


class VisionAnalyzer:
    """
    Vision analyzer using Claude's vision capabilities.
    
    Enables the agent to:
    - Understand what's on screen
    - Locate UI elements by description
    - Verify expected screen states
    - Read complex UIs
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize vision analyzer.
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.enabled = config.get('vision', {}).get('enabled', True)
        
        if not self.enabled:
            logger.info("Vision analysis disabled in config")
            return
        
        # Initialize Claude client
        api_key = config['llm'].get('api_key')
        if not api_key:
            logger.warning("No API key configured for vision")
            self.enabled = False
            return
        
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = config['llm'].get('model', 'claude-3-5-sonnet-20241022')
        
        # Screenshot cache to avoid duplicate API calls
        self.cache_enabled = config.get('vision', {}).get('cache_screenshots', True)
        self.cache_duration = config.get('vision', {}).get('cache_duration_seconds', 30)
        self.screenshot_cache = {}
        
        logger.info("Vision analyzer initialized with Claude Vision API")
    
    def _encode_image(self, image_path: str) -> str:
        """
        Encode image to base64.
        
        Args:
            image_path: Path to image file
            
        Returns:
            Base64 encoded image
        """
        with open(image_path, 'rb') as f:
            return base64.standard_b64encode(f.read()).decode('utf-8')
    
    def _get_cached_analysis(self, cache_key: str) -> Optional[str]:
        """Check if we have a recent cached analysis."""
        if not self.cache_enabled:
            return None
        
        if cache_key in self.screenshot_cache:
            cached_result, timestamp = self.screenshot_cache[cache_key]
            if time.time() - timestamp < self.cache_duration:
                logger.debug(f"Using cached analysis for {cache_key}")
                return cached_result
        
        return None
    
    def _cache_analysis(self, cache_key: str, result: str):
        """Cache an analysis result."""
        if self.cache_enabled:
            self.screenshot_cache[cache_key] = (result, time.time())
    
    def analyze_screenshot(
        self,
        screenshot_path: str,
        question: str
    ) -> Dict[str, Any]:
        """
        Ask a question about a screenshot.
        
        Args:
            screenshot_path: Path to screenshot file
            question: Question to ask about the screenshot
            
        Returns:
            Result dictionary with answer
        """
        if not self.enabled:
            return {
                "success": False,
                "message": "Vision analysis is disabled"
            }
        
        try:
            # Check cache
            cache_key = f"{screenshot_path}:{question}"
            cached = self._get_cached_analysis(cache_key)
            if cached:
                return {
                    "success": True,
                    "answer": cached,
                    "cached": True
                }
            
            logger.info(f"Analyzing screenshot with question: {question}")
            
            # Encode image
            image_data = self._encode_image(screenshot_path)
            
            # Call Claude Vision API
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": question
                        }
                    ]
                }]
            )
            
            answer = response.content[0].text
            
            # Cache result
            self._cache_analysis(cache_key, answer)
            
            return {
                "success": True,
                "answer": answer,
                "cached": False
            }
            
        except Exception as e:
            logger.error(f"Error analyzing screenshot: {e}")
            return {
                "success": False,
                "message": f"Vision analysis error: {str(e)}"
            }
    
    def locate_ui_element(
        self,
        screenshot_path: str,
        element_description: str
    ) -> Dict[str, Any]:
        """
        Find a UI element and get its approximate coordinates.
        
        Args:
            screenshot_path: Path to screenshot
            element_description: Description of element to find
            
        Returns:
            Result with coordinates if found
        """
        try:
            question = f"""Look at this screenshot and find the {element_description}.
Provide the approximate center coordinates as a percentage of the screen (0-100% for both x and y).
Respond in this exact format: "X: <percentage>, Y: <percentage>"
For example: "X: 50, Y: 75" for center-right of screen.
If you cannot find the element, respond with "NOT_FOUND"."""
            
            result = self.analyze_screenshot(screenshot_path, question)
            
            if not result['success']:
                return result
            
            answer = result['answer'].strip()
            
            if "NOT_FOUND" in answer:
                return {
                    "success": False,
                    "message": f"Could not locate: {element_description}"
                }
            
            # Parse coordinates
            import re
            match = re.search(r'X:\s*(\d+).*Y:\s*(\d+)', answer)
            if match:
                x_percent = int(match.group(1))
                y_percent = int(match.group(2))
                
                # Get screen size to convert percentage to pixels
                from device_control.controller import DeviceController
                controller = DeviceController()
                screen_width, screen_height = controller.get_screen_size()
                
                x = int((x_percent / 100) * screen_width)
                y = int((y_percent / 100) * screen_height)
                
                return {
                    "success": True,
                    "message": f"Found {element_description}",
                    "x": x,
                    "y": y,
                    "x_percent": x_percent,
                    "y_percent": y_percent
                }
            
            return {
                "success": False,
                "message": f"Could not parse coordinates from: {answer}"
            }
            
        except Exception as e:
            logger.error(f"Error locating element: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
    
    def verify_screen_state(
        self,
        screenshot_path: str,
        expected_state: str
    ) -> Dict[str, Any]:
        """
        Verify that screen shows expected state.
        
        Args:
            screenshot_path: Path to screenshot
            expected_state: Description of expected state
            
        Returns:
            Result with verification status
        """
        try:
            question = f"""Look at this screenshot and answer: {expected_state}
Respond with only "YES" if the condition is met, or "NO" if it is not met.
Then provide a brief explanation in one sentence."""
            
            result = self.analyze_screenshot(screenshot_path, question)
            
            if not result['success']:
                return result
            
            answer = result['answer'].strip()
            verified = answer.upper().startswith('YES')
            
            return {
                "success": True,
                "verified": verified,
                "explanation": answer,
                "message": "Verified" if verified else "Not verified"
            }
            
        except Exception as e:
            logger.error(f"Error verifying state: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
    
    def describe_screen(
        self,
        screenshot_path: str
    ) -> Dict[str, Any]:
        """
        Get a general description of what's on screen.
        
        Args:
            screenshot_path: Path to screenshot
            
        Returns:
            Result with description
        """
        return self.analyze_screenshot(
            screenshot_path,
            "Describe what you see on this screen. Focus on the main window, key UI elements, and what the user appears to be doing."
        )
