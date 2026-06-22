"""
Enhanced OCR with Layout Preservation

Provides advanced text extraction with spatial information.
"""

import sys
from typing import Dict, Any, List, Tuple, Optional
from pathlib import Path
from PIL import Image
import pytesseract

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)


class LayoutParser:
    """
    Enhanced OCR with layout and structure preservation.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize layout parser."""
        self.config = config
        logger.info("Layout parser initialized")
    
    def extract_text_with_layout(
        self,
        image_path: str
    ) -> Dict[str, Any]:
        """
        Extract text with position and bounding box information.
        
        Args:
            image_path: Path to image
            
        Returns:
            Dict with text blocks and their positions
        """
        try:
            image = Image.open(image_path)
            
            # Get detailed OCR data with bounding boxes
            ocr_data = pytesseract.image_to_data(
                image,
                output_type=pytesseract.Output.DICT
            )
            
            # Group text by blocks/paragraphs
            text_blocks = []
            current_block = []
            current_block_num = -1
            
            for i in range(len(ocr_data['text'])):
                text = ocr_data['text'][i].strip()
                if not text:
                    continue
                
                block_num = ocr_data['block_num'][i]
                
                # New block started
                if block_num != current_block_num:
                    if current_block:
                        text_blocks.append(current_block)
                    current_block = []
                    current_block_num = block_num
                
                current_block.append({
                    'text': text,
                    'x': ocr_data['left'][i],
                    'y': ocr_data['top'][i],
                    'width': ocr_data['width'][i],
                    'height': ocr_data['height'][i],
                    'confidence': ocr_data['conf'][i]
                })
            
            if current_block:
                text_blocks.append(current_block)
            
            # Combine blocks into structured output
            structured_text = []
            for block in text_blocks:
                block_text = ' '.join([item['text'] for item in block])
                min_x = min([item['x'] for item in block])
                min_y = min([item['y'] for item in block])
                max_x = max([item['x'] + item['width'] for item in block])
                max_y = max([item['y'] + item['height'] for item in block])
                
                structured_text.append({
                    'text': block_text,
                    'bbox': {
                        'x': min_x,
                        'y': min_y,
                        'width': max_x - min_x,
                        'height': max_y - min_y
                    },
                    'words': block
                })
            
            return {
                "success": True,
                "text_blocks": structured_text,
                "full_text": '\n'.join([block['text'] for block in structured_text])
            }
            
        except Exception as e:
            logger.error(f"Error extracting layout: {e}")
            return {
                "success": False,
                "message": f"Layout extraction error: {str(e)}"
            }
    
    def find_text_on_screen(
        self,
        image_path: str,
        search_text: str
    ) -> Dict[str, Any]:
        """
        Find specific text on screen and return its coordinates.
        
        Args:
            image_path: Path to image
            search_text: Text to find
            
        Returns:
            Result with coordinates if found
        """
        try:
            layout_result = self.extract_text_with_layout(image_path)
            
            if not layout_result['success']:
                return layout_result
            
            search_lower = search_text.lower()
            
            # Search in text blocks
            for block in layout_result['text_blocks']:
                if search_lower in block['text'].lower():
                    bbox = block['bbox']
                    center_x = bbox['x'] + bbox['width'] // 2
                    center_y = bbox['y'] + bbox['height'] // 2
                    
                    return {
                        "success": True,
                        "found": True,
                        "text": block['text'],
                        "x": center_x,
                        "y": center_y,
                        "bbox": bbox
                    }
            
            return {
                "success": True,
                "found": False,
                "message": f"Text '{search_text}' not found on screen"
            }
            
        except Exception as e:
            logger.error(f"Error finding text: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
