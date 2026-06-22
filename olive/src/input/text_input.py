"""
Text Input Handler

Handles text command input from the user and passes commands to the AI agent.
"""

import sys
from typing import Dict, Any
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger
from supervisor.supervisor import Supervisor

logger = get_logger(__name__)


class TextInputHandler:
    """
    Handles text input from the user.
    
    Provides a simple command-line interface for entering commands
    that are then processed by the AI agent.
    """
    
    def __init__(self, config: Dict[str, Any], agent):
        """
        Initialize the text input handler.
        
        Args:
            config: Configuration dictionary
            agent: Agent instance to send commands to
        """
        self.config = config
        self.agent = agent
        self.running = False
        logger.info("Text input handler initialized")
    
    def start(self):
        """Start the text input loop."""
        self.running = True
        logger.info("Text input handler started")
        
        while self.running:
            try:
                # Check for emergency stop
                if Supervisor.check_emergency_stop():
                    print("\n⚠️  EMERGENCY STOP ACTIVATED - Agent halted!")
                    self.running = False
                    break
                
                # Get input from user
                user_input = input("\n> ").strip()
                
                if not user_input:
                    continue
                
                # Check for quit commands
                if user_input.lower() in ['quit', 'exit', 'stop']:
                    print("Shutting down agent...")
                    self.running = False
                    break
                
                # Process the command
                self._process_command(user_input)
                
            except KeyboardInterrupt:
                print("\nInterrupted by user")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Error in input loop: {e}")
                print(f"Error: {e}")
    
    def _process_command(self, command: str):
        """
        Process a user command.
        
        Args:
            command: The command text from the user
        """
        try:
            logger.info(f"Processing command: {command}")
            print(f"\n🤖 Processing: {command}")
            
            # Send to agent for processing
            result = self.agent.process_command(command)
            
            # Display result
            if result.get('success'):
                print(f"✅ {result.get('message', 'Command completed successfully')}")
            else:
                print(f"❌ {result.get('message', 'Command failed')}")
                
        except Exception as e:
            logger.error(f"Error processing command: {e}")
            print(f"❌ Error: {e}")
    
    def stop(self):
        """Stop the input handler."""
        self.running = False
        logger.info("Text input handler stopped")
