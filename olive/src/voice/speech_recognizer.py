"""
Speech Recognizer using OpenAI Whisper

Provides local speech-to-text capabilities for voice commands.
"""

import sys
from typing import Dict, Any, Optional
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)

try:
    import whisper
    import sounddevice as sd
    import soundfile as sf
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    logger.warning("Whisper not installed. Voice control unavailable.")


class SpeechRecognizer:
    """
    Speech recognition using OpenAI Whisper.
    
    Supports:
    - Real-time microphone input
    - Multiple languages
    - Various model sizes
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize speech recognizer.
       
        Args:
            config: Configuration dictionary
        """
        if not WHISPER_AVAILABLE:
            raise ImportError("Whisper not installed. Run: pip install openai-whisper sounddevice soundfile")
        
        self.config = config
        model_size = config.get('speech', {}).get('model', 'base')
        self.language = config.get('speech', {}).get('language', 'en')
        
        logger.info(f"Loading Whisper model: {model_size}")
        self.model = whisper.load_model(model_size)
        logger.info("Whisper model loaded")
        
        # Audio settings
        self.sample_rate = 16000  # Whisper expects 16kHz
        self.channels = 1
    
    def listen_and_transcribe(
        self,
        duration: float = 5.0,
        silence_threshold: float = 0.01
    ) -> Dict[str, Any]:
        """
        Listen to microphone and transcribe speech.
        
        Args:
            duration: Maximum seconds to record
            silence_threshold: Amplitude threshold for silence detection
            
        Returns:
            Result dictionary with transcribed text
        """
        try:
            logger.info(f"Listening for {duration} seconds...")
            
            # Record audio
            audio = sd.rec(
                int(duration * self.sample_rate),
                samplerate=self.sample_rate,
                channels=self.channels,
                dtype='float32'
            )
            sd.wait()
            
            # Convert to 1D array
            audio = audio.flatten()
            
            # Check if audio is too quiet (likely silence)
            if np.max(np.abs(audio)) < silence_threshold:
                return {
                    "success": True,
                    "text": "",
                    "is_silence": True
                }
            
            # Transcribe
            result = self.model.transcribe(
                audio,
                language=self.language,
                fp16=False
            )
            
            text = result['text'].strip()
            
            logger.info(f"Transcribed: {text}")
            
            return {
                "success": True,
                "text": text,
                "is_silence": False,
                "language": result.get('language', self.language)
            }
            
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            return {
                "success": False,
                "message": f"Transcription error: {str(e)}"
            }
    
    def transcribe_file(self, audio_path: str) -> Dict[str, Any]:
        """
        Transcribe an audio file.
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Result dictionary with transcribed text
        """
        try:
            result = self.model.transcribe(
                audio_path,
                language=self.language
            )
            
            return {
                "success": True,
                "text": result['text'].strip(),
                "language": result.get('language', self.language)
            }
            
        except Exception as e:
            logger.error(f"Error transcribing file: {e}")
            return {
                "success": False,
                "message": f"Transcription error: {str(e)}"
            }
    
    def continuous_listen(
        self,
        chunk_duration: float = 3.0,
        callback=None
    ):
        """
        Continuously listen and transcribe in chunks.
        
        Args:
            chunk_duration: Seconds per chunk
            callback: Function to call with transcribed text
        """
        logger.info("Starting continuous listening (Ctrl+C to stop)...")
        
        try:
            while True:
                result = self.listen_and_transcribe(duration=chunk_duration)
                
                if result.get('success') and not result.get('is_silence'):
                    text = result['text']
                    if text and callback:
                        callback(text)
                        
        except KeyboardInterrupt:
            logger.info("Stopping continuous listening")
