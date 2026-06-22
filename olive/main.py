"""
AI Device Control Agent - Main Entry Point

This module provides the main interface for the AI device control agent.
It coordinates between the input processing, AI agent, device control,
and safety supervisor components.
"""

import sys
import os
import logging
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from utils.logger import setup_logger
from utils.config import load_config
from supervisor.supervisor import Supervisor
from agent.core import Agent
from input.text_input import TextInputHandler

logger = setup_logger(__name__)


def main():
    """Main entry point for the AI device control agent."""
    try:
        # Load configuration
        config = load_config()
        logger.info("Configuration loaded successfully")
        
        # Check if supervisor is running
        if not Supervisor.is_running():
            logger.error("Supervisor process is not running!")
            logger.error("Please start the supervisor first: python src/supervisor/supervisor.py")
            return 1
        
        logger.info("Supervisor process detected")
        
        # Initialize the AI agent
        agent = Agent(config)
        logger.info("AI Agent initialized")
        
        # Initialize text input handler
        text_handler = TextInputHandler(config, agent)
        logger.info("Text input handler initialized")
        
        # Check if voice is enabled
        voice_enabled = config.get('speech', {}).get('enabled', False)
        
        # Display welcome message
        print("\n" + "="*60)
        print("   AI Device Control Agent")
        print("="*60)
        print("\nAgent is ready to receive commands!")
        print(f"Emergency Stop: {config['safety']['emergency_stop_key']}")
        
        # Choose input mode
        if voice_enabled:
            print("\nInput modes available:")
            print("  1. Text (keyboard input)")
            print("  2. Voice (microphone input)")
            mode = input("\nSelect mode (1 or 2, default=1): ").strip() or "1"
            
            if mode == "2":
                from input.voice_input import VoiceInputHandler
                voice_handler = VoiceInputHandler(config, agent)
                print()
                voice_handler.start()
            else:
                print("\nText mode selected")
                print("Type 'quit' or 'exit' to stop the agent\n")
                text_handler.start()
        else:
            print("Type 'quit' or 'exit' to stop the agent\n")
            text_handler.start()
        
        logger.info("Agent shutting down normally")
        return 0
        
    except KeyboardInterrupt:
        logger.info("Agent interrupted by user")
        return 0
    except Exception as e:
        logger.exception(f"Fatal error in main: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
