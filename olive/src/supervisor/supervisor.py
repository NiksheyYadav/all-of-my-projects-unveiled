"""
Safety Supervisor Process

This is the critical safety component that runs independently of the main agent.
It provides emergency stop functionality, operation monitoring, and confirmation dialogs.
"""

import sys
import time
import json
import mmap
import struct
import threading
import tkinter as tk
from tkinter import messagebox
from pathlib import Path
from typing import Optional, Dict, Any
import keyboard
import psutil

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import setup_logger

logger = setup_logger(__name__, level="INFO")

# Shared memory constants
SHARED_MEMORY_NAME = "ai_agent_supervisor"
SHARED_MEMORY_SIZE = 1024
EMERGENCY_STOP_OFFSET = 0
CONFIRMATION_REQUEST_OFFSET = 4


class Supervisor:
    """
    The supervisor process that monitors and controls the AI agent.
    
    This process runs independently and provides:
    - Emergency stop functionality via keyboard shortcut
    - Confirmation dialogs for dangerous operations
    - Anomaly detection and monitoring
    - Comprehensive logging
    """
    
    def __init__(self, config_path: Path = None):
        """Initialize the supervisor process."""
        self.running = False
        self.emergency_stop_triggered = False
        
        # Load configuration
        if config_path is None:
            config_path = Path(__file__).parent.parent.parent / "config.json"
        
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        self.emergency_key = self.config['safety']['emergency_stop_key']
        
        # Create shared memory for communication with main process
        self.shared_memory = None
        self._init_shared_memory()
        
        # Track child processes
        self.child_processes = []
        
        logger.info("Supervisor process initialized")
    
    def _init_shared_memory(self):
        """Initialize shared memory for inter-process communication."""
        try:
            # Create a memory-mapped file
            self.shared_memory = mmap.mmap(-1, SHARED_MEMORY_SIZE, SHARED_MEMORY_NAME)
            # Initialize emergency stop flag to 0 (not stopped)
            self.shared_memory.seek(EMERGENCY_STOP_OFFSET)
            self.shared_memory.write(struct.pack('I', 0))
            logger.info("Shared memory initialized")
        except Exception as e:
            logger.error(f"Failed to create shared memory: {e}")
            raise
    
    def _emergency_stop_handler(self):
        """Handle emergency stop key press."""
        logger.warning("EMERGENCY STOP TRIGGERED!")
        self.emergency_stop_triggered = True
        
        # Set emergency stop flag in shared memory
        if self.shared_memory:
            self.shared_memory.seek(EMERGENCY_STOP_OFFSET)
            self.shared_memory.write(struct.pack('I', 1))
        
        # Terminate all child processes
        self._terminate_child_processes()
        
        # Show notification
        self._show_notification("Emergency Stop", "All agent operations have been halted!")
    
    def _terminate_child_processes(self):
        """Forcibly terminate all child processes."""
        for proc_id in self.child_processes:
            try:
                proc = psutil.Process(proc_id)
                proc.terminate()
                logger.info(f"Terminated process {proc_id}")
            except psutil.NoSuchProcess:
                pass
            except Exception as e:
                logger.error(f"Error terminating process {proc_id}: {e}")
    
    def _show_notification(self, title: str, message: str):
        """Show a notification dialog."""
        try:
            root = tk.Tk()
            root.withdraw()
            messagebox.showwarning(title, message)
            root.destroy()
        except Exception as e:
            logger.error(f"Error showing notification: {e}")
    
    def request_confirmation(self, operation: str, description: str, risk_level: str) -> bool:
        """
        Request user confirmation for an operation.
        
        Args:
            operation: Name of the operation
            description: Detailed description
            risk_level: Risk level (LOW, MEDIUM, HIGH, CRITICAL)
            
        Returns:
            True if user approves, False otherwise
        """
        logger.info(f"Confirmation requested for {operation} (risk: {risk_level})")
        
        try:
            root = tk.Tk()
            root.withdraw()
            
            message = f"The agent wants to perform:\n\n{operation}\n\n"
            message += f"Description: {description}\n\n"
            message += f"Risk Level: {risk_level}\n\n"
            message += "Do you want to allow this operation?"
            
            result = messagebox.askyesno("Confirmation Required", message)
            root.destroy()
            
            logger.info(f"User {'approved' if result else 'denied'} operation: {operation}")
            return result
            
        except Exception as e:
            logger.error(f"Error showing confirmation dialog: {e}")
            return False
    
    def monitor_loop(self):
        """Main monitoring loop."""
        logger.info("Supervisor monitoring loop started")
        
        while self.running:
            try:
                # Check for anomalies, resource usage, etc.
                # This is a placeholder for future anomaly detection
                time.sleep(1)
                
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
    
    def start(self):
        """Start the supervisor process."""
        self.running = True
        logger.info(f"Starting supervisor with emergency stop key: {self.emergency_key}")
        
        # Register emergency stop hotkey
        try:
            keyboard.add_hotkey(self.emergency_key, self._emergency_stop_handler)
            logger.info(f"Emergency stop registered: {self.emergency_key}")
        except Exception as e:
            logger.error(f"Failed to register emergency stop: {e}")
            raise
        
        # Start monitoring thread
        monitor_thread = threading.Thread(target=self.monitor_loop, daemon=True)
        monitor_thread.start()
        
        print("\n" + "="*60)
        print("   AI Agent Supervisor - RUNNING")
        print("="*60)
        print(f"\nEmergency Stop: {self.emergency_key}")
        print("This process must remain running while using the agent.")
        print("Press Ctrl+C to stop the supervisor.\n")
        
        # Keep the process alive
        try:
            while self.running:
                time.sleep(0.1)
        except KeyboardInterrupt:
            logger.info("Supervisor interrupted by user")
            self.stop()
    
    def stop(self):
        """Stop the supervisor process."""
        logger.info("Stopping supervisor process")
        self.running = False
        
        # Clean up shared memory
        if self.shared_memory:
            self.shared_memory.close()
        
        # Unregister hotkeys
        try:
            keyboard.unhook_all()
        except:
            pass
        
        logger.info("Supervisor stopped")
    
    @staticmethod
    def is_running() -> bool:
        """
        Check if supervisor process is running.
        
        Returns:
            True if supervisor is running, False otherwise
        """
        try:
            # Try to open existing shared memory
            test_mem = mmap.mmap(-1, SHARED_MEMORY_SIZE, SHARED_MEMORY_NAME)
            test_mem.close()
            return True
        except:
            return False
    
    @staticmethod
    def check_emergency_stop() -> bool:
        """
        Check if emergency stop has been triggered.
        
        Returns:
            True if emergency stop is active, False otherwise
        """
        try:
            mem = mmap.mmap(-1, SHARED_MEMORY_SIZE, SHARED_MEMORY_NAME)
            mem.seek(EMERGENCY_STOP_OFFSET)
            value = struct.unpack('I', mem.read(4))[0]
            mem.close()
            return value == 1
        except:
            return False


def main():
    """Main entry point for the supervisor process."""
    try:
        supervisor = Supervisor()
        supervisor.start()
    except KeyboardInterrupt:
        logger.info("Supervisor stopped by user")
    except Exception as e:
        logger.exception(f"Fatal error in supervisor: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
