"""
Text-to-Speech Feedback

Provides audio feedback for agent responses.
"""

import sys
from typing import Dict, Any
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)

try:
    import pyttsx3
    TTS_AVAILABLE = True
except ImportError:
    TTS_AVAILABLE = False
    logger.warning("pyttsx3 not installed. Voice feedback unavailable.")


class VoiceFeedback:
    """
    Text-to-speech feedback system.
    
    Uses pyttsx3 for offline speech synthesis.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize voice feedback.
        
        Args:
            config: Configuration dictionary
        """
        if not TTS_AVAILABLE:
            raise ImportError("pyttsx3 not installed. Run: pip install pyttsx3")
        
        self.config = config
        self.enabled = config.get('tts', {}).get('enabled', False)
        
        if not self.enabled:
            logger.info("Text-to-speech disabled in config")
            return
        
        # Initialize TTS engine
        self.engine = pyttsx3.init()
        
        # Configure voice
        rate = config.get('tts', {}).get('rate', 150)
        volume = config.get('tts', {}).get('volume', 0.9)
        
        self.engine.setProperty('rate', rate)
        self.engine.setProperty('volume', volume)
        
        # Try to set voice
        voice_name = config.get('tts', {}).get('voice', 'default')
        if voice_name != 'default':
            voices = self.engine.getProperty('voices')
            for voice in voices:
                if voice_name.lower() in voice.name.lower():
                    self.engine.setProperty('voice', voice.id)
                    break
        
        logger.info("Text-to-speech initialized")
    
    def speak(self, text: str, async_mode: bool = False) -> Dict[str, Any]:
        """
        Speak text aloud.
        
        Args:
            text: Text to speak
            async_mode: If True, don't wait for speech to complete
            
        Returns:
            Result dictionary
        """
        if not self.enabled:
            return {
                "success": False,
                "message": "TTS is disabled"
            }
        
        try:
            logger.info(f"Speaking: {text[:50]}...")
            
            self.engine.say(text)
            
            if not async_mode:
                self.engine.runAndWait()
            
            return {
                "success": True,
                "message": "Speech completed" if not async_mode else "Speech started"
            }
            
        except Exception as e:
            logger.error(f"Error speaking: {e}")
            return {
                "success": False,
                "message": f"TTS error: {str(e)}"
            }
    
    def stop(self):
        """Stop current speech."""
        if self.enabled:
            try:
                self.engine.stop()
            except:
                pass
