"""
Device Control Abstraction Layer

Provides a unified interface for device operations across different platforms.
This module handles Windows-specific implementations.
"""

import time
import subprocess
from typing import Optional, List, Dict, Any, Tuple
from pathlib import Path
import pyautogui
import pygetwindow as gw
from PIL import Image
import mss
import psutil

# Add src to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)

# Safety settings for pyautogui
pyautogui.PAUSE = 0.5
pyautogui.FAILSAFE = True


class DeviceController:
    """
    Windows device control implementation.
    
    Provides methods to control the device including:
    - Application management
    - Keyboard and mouse control
    - Screen capture and reading
    - File operations
    """
    
    def __init__(self):
        """Initialize the device controller."""
        self.platform = "windows"
        logger.info(f"Device controller initialized for {self.platform}")
    
    def open_application(self, app_name: str) -> Dict[str, Any]:
        """
        Open an application by name.
        
        Args:
            app_name: Name of the application to open
            
        Returns:
            Result dictionary with success status and message
        """
        try:
            logger.info(f"Opening application: {app_name}")
            
            # Check if already running
            for proc in psutil.process_iter(['name']):
                if app_name.lower() in proc.info['name'].lower():
                    logger.info(f"{app_name} is already running, bringing to foreground")
                    self._focus_window(app_name)
                    return {
                        "success": True,
                        "message": f"{app_name} was already running and brought to foreground"
                    }
            
            # Try to launch the application
            subprocess.Popen(app_name, shell=True)
            time.sleep(2)  # Wait for app to start
            
            return {
                "success": True,
                "message": f"Successfully launched {app_name}"
            }
            
        except Exception as e:
            logger.error(f"Error opening application {app_name}: {e}")
            return {
                "success": False,
                "message": f"Failed to open {app_name}: {str(e)}"
            }
    
    def _focus_window(self, window_title_contains: str) -> bool:
        """
        Bring a window to the foreground.
        
        Args:
            window_title_contains: String that window title should contain
            
        Returns:
            True if window was found and focused
        """
        try:
            windows = gw.getWindowsWithTitle(window_title_contains)
            if windows:
                window = windows[0]
                window.activate()
                return True
            return False
        except Exception as e:
            logger.error(f"Error focusing window: {e}")
            return False
    
    def type_text(self, text: str, interval: float = 0.05) -> Dict[str, Any]:
        """
        Type text using keyboard automation.
        
        Args:
            text: Text to type
            interval: Interval between keystrokes in seconds
            
        Returns:
            Result dictionary
        """
        try:
            logger.info(f"Typing text: {text[:50]}...")
            pyautogui.write(text, interval=interval)
            
            return {
                "success": True,
                "message": f"Successfully typed {len(text)} characters"
            }
            
        except Exception as e:
            logger.error(f"Error typing text: {e}")
            return {
                "success": False,
                "message": f"Failed to type text: {str(e)}"
            }
    
    def click(self, x: int, y: int, button: str = "left", clicks: int = 1) -> Dict[str, Any]:
        """
        Click at specific coordinates.
        
        Args:
            x: X coordinate
            y: Y coordinate
            button: Mouse button ('left', 'right', 'middle')
            clicks: Number of clicks
            
        Returns:
            Result dictionary
        """
        try:
            logger.info(f"Clicking at ({x}, {y}) with {button} button")
            pyautogui.click(x, y, clicks=clicks, button=button)
            
            return {
                "success": True,
                "message": f"Clicked at ({x}, {y})"
            }
            
        except Exception as e:
            logger.error(f"Error clicking: {e}")
            return {
                "success": False,
                "message": f"Failed to click: {str(e)}"
            }
    
    def move_mouse(self, x: int, y: int, duration: float = 0.5) -> Dict[str, Any]:
        """
        Move mouse to specific coordinates.
        
        Args:
            x: X coordinate
            y: Y coordinate
            duration: Duration of movement in seconds
            
        Returns:
            Result dictionary
        """
        try:
            pyautogui.moveTo(x, y, duration=duration)
            return {
                "success": True,
                "message": f"Moved mouse to ({x}, {y})"
            }
        except Exception as e:
            logger.error(f"Error moving mouse: {e}")
            return {
                "success": False,
                "message": f"Failed to move mouse: {str(e)}"
            }
    
    def press_key(self, key: str, modifiers: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Press a keyboard key or key combination.
        
        Args:
            key: Key to press (e.g., 'enter', 'a', 'f1')
            modifiers: Optional modifier keys (e.g., ['ctrl', 'shift'])
            
        Returns:
            Result dictionary
        """
        try:
            logger.info(f"Pressing key: {key} with modifiers: {modifiers}")
            
            if modifiers:
                pyautogui.hotkey(*modifiers, key)
            else:
                pyautogui.press(key)
            
            return {
                "success": True,
                "message": f"Pressed key: {key}"
            }
            
        except Exception as e:
            logger.error(f"Error pressing key: {e}")
            return {
                "success": False,
                "message": f"Failed to press key: {str(e)}"
            }
    
    def capture_screen(self, region: Optional[Tuple[int, int, int, int]] = None) -> Dict[str, Any]:
        """
        Capture a screenshot.
        
        Args:
            region: Optional region to capture as (left, top, width, height)
            
        Returns:
            Result dictionary with screenshot data
        """
        try:
            with mss.mss() as sct:
                if region:
                    monitor = {
                        "left": region[0],
                        "top": region[1],
                        "width": region[2],
                        "height": region[3]
                    }
                else:
                    monitor = sct.monitors[1]  # Primary monitor
                
                screenshot = sct.grab(monitor)
                img = Image.frombytes("RGB", screenshot.size, screenshot.rgb)
                
                # Save to temp location
                temp_path = Path(__file__).parent.parent.parent / "logs" / "last_screenshot.png"
                img.save(temp_path)
                
                return {
                    "success": True,
                    "message": "Screenshot captured",
                    "screenshot_path": str(temp_path),
                    "image": img
                }
                
        except Exception as e:
            logger.error(f"Error capturing screen: {e}")
            return {
                "success": False,
                "message": f"Failed to capture screen: {str(e)}"
            }
    
    def get_screen_size(self) -> Tuple[int, int]:
        """
        Get the screen size.
        
        Returns:
            Tuple of (width, height)
        """
        return pyautogui.size()
    
    def get_mouse_position(self) -> Tuple[int, int]:
        """
        Get current mouse position.
        
        Returns:
            Tuple of (x, y)
        """
        return pyautogui.position()
    
    def get_active_window(self) -> Optional[str]:
        """
        Get the title of the active window.
        
        Returns:
            Window title or None
        """
        try:
            window = gw.getActiveWindow()
            return window.title if window else None
        except Exception as e:
            logger.error(f"Error getting active window: {e}")
            return None
    
    def scroll(self, clicks: int, direction: str = "down") -> Dict[str, Any]:
        """
        Scroll the mouse wheel.
        
        Args:
            clicks: Number of clicks to scroll
            direction: 'up' or 'down'
            
        Returns:
            Result dictionary
        """
        try:
            amount = clicks if direction == "up" else -clicks
            pyautogui.scroll(amount)
            
            return {
                "success": True,
                "message": f"Scrolled {clicks} clicks {direction}"
            }
            
        except Exception as e:
            logger.error(f"Error scrolling: {e}")
            return {
                "success": False,
                "message": f"Failed to scroll: {str(e)}"
            }
