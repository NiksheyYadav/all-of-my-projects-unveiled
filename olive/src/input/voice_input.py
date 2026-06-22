"""
Voice Input Handler

Handles voice command input and integrates with the AI agent.
"""

import sys
from typing import Dict, Any
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)


class VoiceInputHandler:
    """
    Handles voice input from the user.
    
    Provides voice command interface using speech recognition.
    """
    
    def __init__(self, config: Dict[str, Any], agent):
        """
        Initialize voice input handler.
        
        Args:
            config: Configuration dictionary
            agent: Agent instance to send commands to
        """
        self.config = config
        self.agent = agent
        self.running = False
        
        # Initialize speech recognizer
        try:
            from voice.speech_recognizer import SpeechRecognizer
            self.speech_recognizer = SpeechRecognizer(config)
            self.enabled = True
            logger.info("Voice input handler initialized")
        except ImportError as e:
            logger.warning(f"Voice recognition not available: {e}")
            self.enabled = False
    
    def start(self):
        """Start the voice input loop."""
        if not self.enabled:
            print("❌ Voice recognition is not available. Install dependencies:")
            print("   pip install openai-whisper sounddevice soundfile")
            return
        
        self.running = True
        logger.info("Voice input handler started")
        
        print("\n🎤 Voice control activated!")
        print("Speak your commands (silence for 3 seconds to stop listening)")
        print("Say 'stop listening' to exit voice mode\n")
        
        while self.running:
            try:
                print("🎧 Listening...", end=" ", flush=True)
                
                # Listen for command
                result = self.speech_recognizer.listen_and_transcribe(duration=5.0)
                
                if not result.get('success'):
                    print(f"\n❌ Error: {result.get('message')}")
                    continue
                
                if result.get('is_silence'):
                    print("(silence)")
                    continue
                
                command = result.get('text', '').strip()
                
                if not command:
                    print("(no speech detected)")
                    continue
                
                print(f"\n📝 Heard: \"{command}\"")
                
                # Check for exit command
                if any(phrase in command.lower() for phrase in ['stop listening', 'exit voice', 'quit voice']):
                    print("👋 Exiting voice mode")
                    self.running = False
                    break
                
                # Process command through agent
                self._process_command(command)
                print()  # New line for next iteration
                
            except KeyboardInterrupt:
                print("\n👋 Voice mode interrupted")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Error in voice input loop: {e}")
                print(f"\n❌ Error: {e}\n")
    
    def _process_command(self, command: str):
        """
        Process a voice command.
        
        Args:
            command: The command text from speech recognition
        """
        try:
            logger.info(f"Processing voice command: {command}")
            print(f"🤖 Processing: {command}")
            
            # Send to agent
            result = self.agent.process_command(command)
            
            # Display result
            if result.get('success'):
                print(f"✅ {result.get('message', 'Command completed')}")
            else:
                print(f"❌ {result.get('message', 'Command failed')}")
                
        except Exception as e:
            logger.error(f"Error processing voice command: {e}")
            print(f"❌ Error: {e}")
    
    def stop(self):
        """Stop the voice input handler."""
        self.running = False
        logger.info("Voice input handler stopped")
