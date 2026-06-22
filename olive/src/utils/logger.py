"""
Logging configuration for the AI Device Control Agent.

Provides structured logging with file and console output.
"""

import logging
import sys
from pathlib import Path
from datetime import datetime
from typing import Optional
import colorama

# Initialize colorama for Windows color support
colorama.init(autoreset=True)

# Create logs directory if it doesn't exist
LOG_DIR = Path(__file__).parent.parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)


class ColoredFormatter(logging.Formatter):
    """Custom formatter with color support for console output."""
    
    COLORS = {
        'DEBUG': colorama.Fore.CYAN,
        'INFO': colorama.Fore.GREEN,
        'WARNING': colorama.Fore.YELLOW,
        'ERROR': colorama.Fore.RED,
        'CRITICAL': colorama.Fore.RED + colorama.Style.BRIGHT,
    }
    
    def format(self, record):
        if record.levelname in self.COLORS:
            record.levelname = f"{self.COLORS[record.levelname]}{record.levelname}{colorama.Style.RESET_ALL}"
        return super().format(record)


def setup_logger(
    name: str,
    level: str = "INFO",
    log_to_file: bool = True
) -> logging.Logger:
    """
    Setup a logger with both file and console handlers.
    
    Args:
        name: Logger name (typically __name__)
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_to_file: Whether to log to file
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Console handler with colors
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_formatter = ColoredFormatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%H:%M:%S'
    )
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    # File handler
    if log_to_file:
        log_file = LOG_DIR / f"agent_{datetime.now():%Y%m%d}.log"
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
    
    return logger


def get_logger(name: str) -> logging.Logger:
    """
    Get an existing logger or create a new one.
    
    Args:
        name: Logger name
        
    Returns:
        Logger instance
    """
    return logging.getLogger(name)
