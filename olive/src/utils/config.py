"""
Configuration management for the AI Device Control Agent.

Handles loading and validating configuration from config.json and environment variables.
"""

import json
import os
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DEFAULT_CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"


def load_config(config_path: Path = DEFAULT_CONFIG_PATH) -> Dict[str, Any]:
    """
    Load configuration from file and merge with environment variables.
    
    Args:
        config_path: Path to config.json file
        
    Returns:
        Dictionary containing configuration
        
    Raises:
        FileNotFoundError: If config file doesn't exist
        json.JSONDecodeError: If config file is invalid JSON
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Override with environment variables if present
    if os.getenv('ANTHROPIC_API_KEY'):
        config['llm']['api_key'] = os.getenv('ANTHROPIC_API_KEY')
    elif os.getenv('OPENAI_API_KEY') and config['llm']['provider'] == 'openai':
        config['llm']['api_key'] = os.getenv('OPENAI_API_KEY')
    
    # Validate configuration
    validate_config(config)
    
    return config


def validate_config(config: Dict[str, Any]) -> None:
    """
    Validate configuration structure and required fields.
    
    Args:
        config: Configuration dictionary to validate
        
    Raises:
        ValueError: If configuration is invalid
    """
    required_sections = ['llm', 'safety', 'permissions']
    for section in required_sections:
        if section not in config:
            raise ValueError(f"Missing required config section: {section}")
    
    # Validate LLM config
    llm_provider = config['llm']['provider']
    
    if llm_provider not in ['anthropic', 'openai', 'huggingface']:
        raise ValueError(f"Unsupported LLM provider: {llm_provider}")
    
    # API key only required for cloud providers
    if llm_provider in ['anthropic', 'openai']:
        if not config['llm'].get('api_key'):
            raise ValueError(f"API key required for {llm_provider}. Set it in config.json or .env file.")


def get_config_value(config: Dict[str, Any], *keys: str, default: Any = None) -> Any:
    """
    Safely get a nested configuration value.
    
    Args:
        config: Configuration dictionary
        *keys: Nested keys to traverse
        default: Default value if key not found
        
    Returns:
        Configuration value or default
    """
    current = config
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return default
    return current
