"""
Perception Layer - Screen Understanding

Provides screen capture, OCR, and visual understanding capabilities
to help the agent understand what's on screen.
"""

import sys
from typing import Dict, Any, Optional
from pathlib import Path
from PIL import Image
import pytesseract

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger
from device_control.controller import DeviceController

logger = get_logger(__name__)

# Configure tesseract path for Windows (update as needed)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


class PerceptionSystem:
    """
    Perception system for understanding screen content.
    
    Provides OCR, image analysis, and screen understanding capabilities.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the perception system.
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.device_controller = DeviceController()
        self.last_screenshot = None
        logger.info("Perception system initialized")
    
    def extract_text_from_screen(self, region: Optional[tuple] = None) -> Dict[str, Any]:
        """
        Extract text from the screen using OCR.
        
        Args:
            region: Optional region to capture (left, top, width, height)
            
        Returns:
            Result dictionary with extracted text
        """
        try:
            # Capture screenshot
            screenshot_result = self.device_controller.capture_screen(region)
            
            if not screenshot_result.get('success'):
                return screenshot_result
            
            # Get the image
            image = screenshot_result['image']
            self.last_screenshot = image
            
            # Perform OCR
            try:
                text = pytesseract.image_to_string(image)
                
                return {
                    "success": True,
                    "message": "Text extracted successfully",
                    "text": text,
                    "screenshot_path": screenshot_result.get('screenshot_path')
                }
            except Exception as ocr_error:
                logger.warning(f"OCR failed (Tesseract not installed?): {ocr_error}")
                return {
                    "success": False,
                    "message": f"OCR not available. Please install Tesseract: {ocr_error}",
                    "screenshot_path": screenshot_result.get('screenshot_path')
                }
                
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
    
    def analyze_screen(self) -> Dict[str, Any]:
        """
        Analyze the current screen state.
        
        Returns:
            Result dictionary with screen analysis
        """
        try:
            # Get screen info
            screen_size = self.device_controller.get_screen_size()
            active_window = self.device_controller.get_active_window()
            
            # Capture screenshot
            screenshot_result = self.device_controller.capture_screen()
            
            return {
                "success": True,
                "message": "Screen analyzed",
                "screen_size": screen_size,
                "active_window": active_window,
                "screenshot_path": screenshot_result.get('screenshot_path')
            }
            
        except Exception as e:
            logger.error(f"Error analyzing screen: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
