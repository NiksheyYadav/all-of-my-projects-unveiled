"""
Local LLM Provider using Hugging Face Models

Provides local inference using Hugging Face transformers as an alternative
to cloud-based APIs for privacy and offline capability.
"""

import json
import torch
from typing import Dict, Any, List, Optional
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)

try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not installed. Install with: pip install transformers torch")


class HuggingFaceLLM:
    """
    Local LLM provider using Hugging Face models.
    
    Supports models like:
    - mistralai/Mistral-7B-Instruct-v0.2
    - meta-llama/Llama-2-7b-chat-hf
    - microsoft/phi-2
    - HuggingFaceH4/zephyr-7b-beta
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the Hugging Face LLM.
        
        Args:
            config: Configuration dictionary
        """
        if not TRANSFORMERS_AVAILABLE:
            raise ImportError("Transformers not installed. Run: pip install transformers torch accelerate")
        
        self.config = config
        self.model_name = config['llm']['model']
        self.device = config['llm'].get('device', 'auto')
        self.load_in_8bit = config['llm'].get('load_in_8bit', True)
        self.max_tokens = config['llm'].get('max_tokens', 2048)
        self.temperature = config['llm'].get('temperature', 0.7)
        
        logger.info(f"Loading model: {self.model_name}")
        
        # Initialize tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        
        # Configure quantization for lower memory usage
        if self.load_in_8bit:
            quantization_config = BitsAndBytesConfig(
                load_in_8bit=True,
                llm_int8_threshold=6.0,
                llm_int8_enable_fp32_cpu_offload=True  # Allow CPU offloading
            )
            logger.info("Using 8-bit quantization with CPU offloading support")
        else:
            quantization_config = None
        
        # Load model with better device mapping
        try:
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                quantization_config=quantization_config,
                device_map="auto",  # Automatically handle device placement
                torch_dtype=torch.float16 if not self.load_in_8bit else None,
                low_cpu_mem_usage=True,
                offload_folder="./offload",  # Folder for offloading
                offload_state_dict=True
            )
            logger.info(f"Model loaded successfully on device: {self.model.device}")
        except Exception as e:
            logger.warning(f"Failed to load with quantization: {e}")
            logger.info("Falling back to CPU-only mode...")
            
            # Fallback to CPU without quantization
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                device_map="cpu",
                torch_dtype=torch.float32,
                low_cpu_mem_usage=True
            )
            logger.info("Model loaded on CPU (slower but works on any hardware)")
    
    def create_function_calling_prompt(
        self,
        system_prompt: str,
        messages: List[Dict[str, Any]],
        tools: List[Dict[str, Any]]
    ) -> str:
        """
        Create a prompt that enables function calling with the local model.
        
        Args:
            system_prompt: System instructions
            messages: Conversation history
            tools: Available functions
            
        Returns:
            Formatted prompt string
        """
        # Format available functions
        functions_str = "Available Functions:\n"
        for tool in tools:
            func_name = tool['name']
            func_desc = tool['description']
            params = tool['input_schema']['properties']
            functions_str += f"\n- {func_name}: {func_desc}\n"
            functions_str += f"  Parameters: {list(params.keys())}\n"
        
        # Build conversation
        conversation = f"{system_prompt}\n\n{functions_str}\n\n"
        conversation += "To call a function, respond with JSON in this format:\n"
        conversation += '{"function": "function_name", "arguments": {"arg1": "value1"}}\n\n'
        conversation += "Conversation:\n"
        
        for msg in messages:
            role = msg['role']
            content = msg['content']
            
            if isinstance(content, str):
                conversation += f"{role.upper()}: {content}\n"
            elif isinstance(content, list):
                # Handle tool results
                for item in content:
                    if isinstance(item, dict) and item.get('type') == 'tool_result':
                        conversation += f"FUNCTION RESULT: {item['content']}\n"
        
        conversation += "ASSISTANT: "
        return conversation
    
    def generate(
        self,
        system_prompt: str,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generate a response from the model.
        
        Args:
            system_prompt: System instructions
            messages: Conversation history
            tools: Optional list of available functions
            
        Returns:
            Response dictionary
        """
        try:
            # Create prompt
            if tools:
                prompt = self.create_function_calling_prompt(system_prompt, messages, tools)
            else:
                prompt = f"{system_prompt}\n\n"
                for msg in messages:
                    role = msg['role']
                    content = msg['content'] if isinstance(msg['content'], str) else str(msg['content'])
                    prompt += f"{role.upper()}: {content}\n"
                prompt += "ASSISTANT: "
            
            # Tokenize
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
            
            # Generate
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=self.max_tokens,
                    temperature=self.temperature,
                    do_sample=True,
                    top_p=0.9,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            # Decode
            response_text = self.tokenizer.decode(
                outputs[0][inputs['input_ids'].shape[1]:],
                skip_special_tokens=True
            )
            
            # Parse response
            response_text = response_text.strip()
            
            # Check if response is a function call
            if tools and response_text.startswith('{') and '"function"' in response_text:
                try:
                    func_call = json.loads(response_text.split('\n')[0])
                    return {
                        "type": "function_call",
                        "function": func_call.get("function"),
                        "arguments": func_call.get("arguments", {}),
                        "raw_response": response_text
                    }
                except json.JSONDecodeError:
                    pass
            
            # Regular text response
            return {
                "type": "text",
                "content": response_text,
                "raw_response": response_text
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {
                "type": "error",
                "content": f"Generation error: {str(e)}"
            }
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None
    ) -> str:
        """
        Simple chat interface without function calling.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Optional temperature override
            
        Returns:
            Response text
        """
        temp = temperature if temperature is not None else self.temperature
        
        # Format chat prompt
        prompt = ""
        for msg in messages:
            role = msg['role']
            content = msg['content']
            prompt += f"{role.upper()}: {content}\n"
        prompt += "ASSISTANT: "
        
        # Tokenize and generate
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=self.max_tokens,
                temperature=temp,
                do_sample=True,
                top_p=0.9,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        response = self.tokenizer.decode(
            outputs[0][inputs['input_ids'].shape[1]:],
            skip_special_tokens=True
        )
        
        return response.strip()
