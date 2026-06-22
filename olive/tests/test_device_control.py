"""
Simple tests for device control functions.

These are basic integration tests to verify functionality.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from device_control.controller import DeviceController


def test_screen_capture():
    """Test screenshot capture."""
    print("Testing screen capture...")
    controller = DeviceController()
    result = controller.capture_screen()
    
    assert result['success'], f"Screen capture failed: {result.get('message')}"
    assert result.get('screenshot_path'), "No screenshot path returned"
    print(f"✅ Screenshot saved to: {result['screenshot_path']}")


def test_screen_info():
    """Test getting screen information."""
    print("\nTesting screen info...")
    controller = DeviceController()
    
    screen_size = controller.get_screen_size()
    mouse_pos = controller.get_mouse_position()
    active_window = controller.get_active_window()
    
    print(f"✅ Screen size: {screen_size}")
    print(f"✅ Mouse position: {mouse_pos}")
    print(f"✅ Active window: {active_window}")


def test_open_application():
    """Test opening an application."""
    print("\nTesting application opening...")
    controller = DeviceController()
    
    # Open notepad (should be available on all Windows systems)
    result = controller.open_application("notepad")
    
    assert result['success'], f"Failed to open notepad: {result.get('message')}"
    print(f"✅ {result['message']}")


if __name__ == "__main__":
    print("="*60)
    print("   Device Control Tests")
    print("="*60)
    print()
    
    try:
        test_screen_capture()
        test_screen_info()
        test_open_application()
        
        print("\n" + "="*60)
        print("   All tests passed! ✅")
        print("="*60)
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")
