"""
AI Agent Core

The central intelligence that interprets commands, plans actions,
and executes them through the device control layer.
"""

import json
from typing import Dict, Any, List, Optional
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger
from device_control.controller import DeviceController
from device_control.system_controller import SystemController
from supervisor.supervisor import Supervisor
import anthropic

logger = get_logger(__name__)


class Agent:
    """
    The AI agent that processes commands and controls the device.
    
    Uses an LLM to understand user intent, plan sequences of actions,
    and execute them through the device control layer.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the AI agent.
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.device_controller = DeviceController()
        self.system_controller = SystemController()  # Full system access
        self.provider = config['llm']['provider']
        
        # Initialize LLM based on provider
        if self.provider == 'anthropic':
            self.client = anthropic.Anthropic(api_key=config['llm']['api_key'])
            self.model = config['llm']['model']
            self.use_local_model = False
            logger.info(f"Using Anthropic API with model: {self.model}")
            
        elif self.provider == 'openai':
            import openai
            openai.api_key = config['llm']['api_key']
            self.client = openai
            self.model = config['llm']['model']
            self.use_local_model = False
            logger.info(f"Using OpenAI API with model: {self.model}")
            
        elif self.provider == 'huggingface':
            from agent.local_llm import HuggingFaceLLM
            self.client = HuggingFaceLLM(config)
            self.model = config['llm']['model']
            self.use_local_model = True
            logger.info(f"Using local Hugging Face model: {self.model}")
            
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")
        
        # Conversation history
        self.conversation_history = []
        
        # Initialize vision system (Phase 3)
        if config.get('vision', {}).get('enabled', False):
            from perception.vision_analyzer import VisionAnalyzer
            from perception.layout_parser import LayoutParser
            self.vision_analyzer = VisionAnalyzer(config)
            self.layout_parser = LayoutParser(config)
            logger.info("Vision system initialized")
        else:
            self.vision_analyzer = None
            self.layout_parser = None
        
        # Define available functions
        self.functions = self._define_functions()
        
        logger.info("AI Agent initialized")
    
    def _define_functions(self) -> List[Dict[str, Any]]:
        """
        Define the functions available to the AI agent.
        
        Returns:
            List of function definitions
        """
        return [
            {
                "name": "open_application",
                "description": "Open an application by name. Examples: 'notepad', 'chrome', 'calculator'",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "app_name": {
                            "type": "string",
                            "description": "Name of the application to open"
                        }
                    },
                    "required": ["app_name"]
                }
            },
            {
                "name": "type_text",
                "description": "Type text using keyboard automation",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "The text to type"
                        }
                    },
                    "required": ["text"]
                }
            },
            {
                "name": "click",
                "description": "Click at specific screen coordinates",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "x": {
                            "type": "integer",
                            "description": "X coordinate"
                        },
                        "y": {
                            "type": "integer",
                            "description": "Y coordinate"
                        },
                        "button": {
                            "type": "string",
                            "description": "Mouse button to click",
                            "enum": ["left", "right", "middle"],
                            "default": "left"
                        }
                    },
                    "required": ["x", "y"]
                }
            },
            {
                "name": "press_key",
                "description": "Press a keyboard key or key combination",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "key": {
                            "type": "string",
                            "description": "Key to press (e.g., 'enter', 'a', 'escape')"
                        },
                        "modifiers": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Modifier keys (e.g., ['ctrl', 'shift'])"
                        }
                    },
                    "required": ["key"]
                }
            },
            {
                "name": "capture_screen",
                "description": "Capture a screenshot of the screen",
                "input_schema": {
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            },
            {
                "name": "scroll",
                "description": "Scroll the mouse wheel",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "clicks": {
                            "type": "integer",
                            "description": "Number of clicks to scroll"
                        },
                        "direction": {
                            "type": "string",
                            "description": "Direction to scroll",
                            "enum": ["up", "down"],
                            "default": "down"
                        }
                    },
                    "required": ["clicks"]
                }
            },
            {
                "name": "get_screen_info",
                "description": "Get information about the screen (size, mouse position, active window)",
                "input_schema": {
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            },
            {\
                "name": "analyze_screen",
                "description": "Analyze what's on the screen using computer vision. Ask questions about the current screen state.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string",
                            "description": "Question to ask about the screen (e.g., 'What application is open?', 'Is there a submit button visible?')"
                        }
                    },
                    "required": ["question"]
                }
            },
            {
                "name": "locate_element",
                "description": "Find a UI element on screen by description and get its coordinates for clicking",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "description": {
                            "type": "string",
                            "description": "Description of the element to find (e.g., 'submit button', 'search box', 'close icon')"
                        }
                    },
                    "required": ["description"]
                }
            },
            {
                "name": "verify_state",
                "description": "Verify that the screen shows an expected state or condition",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "expected_state": {
                            "type": "string",
                            "description": "Description of expected state (e.g., 'Notepad is open', 'Login was successful')"
                        }
                    },
                    "required": ["expected_state"]
                }
            },
            {
                "name": "find_text",
                "description": "Find specific text on screen and get its coordinates",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to search for on screen"
                        }
                    },
                    "required": ["text"]
                }
            },
            # FILE MANAGEMENT
            {
                "name": "create_file",
                "description": "Create a new file with optional content",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "file_path": {"type": "string", "description": "Path to create file"},
                        "content": {"type": "string", "description": "File content (optional)"}
                    },
                    "required": ["file_path"]
                }
            },
            {
                "name": "read_file",
                "description": "Read content from a file",
                "input_schema": {
                    "type": "object",
                    "properties": {"file_path": {"type": "string", "description": "Path to file"}},
                    "required": ["file_path"]
                }
            },
            {
                "name": "delete_file",
                "description": "Delete a file",
                "input_schema": {
                    "type": "object",
                    "properties": {"file_path": {"type": "string", "description": "Path to file to delete"}},
                    "required": ["file_path"]
                }
            },
            {
                "name": "copy_file",
                "description": "Copy a file to a new location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "source": {"type": "string", "description": "Source file path"},
                        "destination": {"type": "string", "description": "Destination path"}
                    },
                    "required": ["source", "destination"]
                }
            },
            {
                "name": "move_file",
                "description": "Move or rename a file",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "source": {"type": "string", "description": "Source file path"},
                        "destination": {"type": "string", "description": "Destination path"}
                    },
                    "required": ["source", "destination"]
                }
            },
            {
                "name": "create_folder",
                "description": "Create a new folder/directory",
                "input_schema": {
                    "type": "object",
                    "properties": {"folder_path": {"type": "string", "description": "Path to create"}},
                    "required": ["folder_path"]
                }
            },
            {
                "name": "list_folder",
                "description": "List contents of a folder",
                "input_schema": {
                    "type": "object",
                    "properties": {"folder_path": {"type": "string", "description": "Folder to list"}},
                    "required": ["folder_path"]
                }
            },
            # PROCESS MANAGEMENT
            {
                "name": "list_processes",
                "description": "List running processes",
                "input_schema": {"type": "object", "properties": {}, "required": []}
            },
            {
                "name": "kill_process",
                "description": "Kill/terminate a process",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "process_name": {"type": "string", "description": "Process name to kill"},
                        "pid": {"type": "integer", "description": "Process ID to kill"}
                    }
                }
            },
            {
                "name": "start_program",
                "description": "Start a program with arguments",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "program_path": {"type": "string", "description": "Path to program"},
                        "args": {"type": "array", "items": {"type": "string"}, "description": "Arguments"}
                    },
                    "required": ["program_path"]
                }
            },
            # SYSTEM OPERATIONS
            {
                "name": "run_command",
                "description": "Run a shell/CMD command",
                "input_schema": {
                    "type": "object",
                    "properties": {"command": {"type": "string", "description": "Command to execute"}},
                    "required": ["command"]
                }
            },
            {
                "name": "get_system_info",
                "description": "Get CPU, memory, disk usage",
                "input_schema": {"type": "object", "properties": {}, "required": []}
            },
            {
                "name": "set_environment_variable",
                "description": "Set an environment variable",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "Variable name"},
                        "value": {"type": "string", "description": "Variable value"}
                    },
                    "required": ["name", "value"]
                }
            },
            {
                "name": "get_environment_variable",
                "description": "Get an environment variable value",
                "input_schema": {
                    "type": "object",
                    "properties": {"name": {"type": "string", "description": "Variable name"}},
                    "required": ["name"]
                }
            },
            # REGISTRY OPERATIONS
            {
                "name": "read_registry",
                "description": "Read Windows registry value",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "key_path": {"type": "string", "description": "Registry key path"},
                        "value_name": {"type": "string", "description": "Value name to read"}
                    },
                    "required": ["key_path", "value_name"]
                }
            },
            {
                "name": "write_registry",
                "description": "Write Windows registry value",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "key_path": {"type": "string", "description": "Registry key path"},
                        "value_name": {"type": "string", "description": "Value name"},
                        "value": {"description": "Value to write"}
                    },
                    "required": ["key_path", "value_name", "value"]
                }
            },
            # NETWORK OPERATIONS
            {
                "name": "get_network_info",
                "description": "Get network interfaces and addresses",
                "input_schema": {"type": "object", "properties": {}, "required": []}
            },
            {
                "name": "ping",
                "description": "Ping a host to check connectivity",
                "input_schema": {
                    "type": "object",
                    "properties": {"host": {"type": "string", "description": "Hostname or IP"}},
                    "required": ["host"]
                }
            }
        ]
    
    def _get_system_prompt(self) -> str:
        """
        Get the system prompt for the AI agent.
        
        Returns:
            System prompt string
        """
        return """You are an AI agent with the ability to control a Windows computer on behalf of the user.

When given a command, you should:
1. Understand the user's intent
2. Break down complex tasks into atomic operations
3. Execute operations using the available functions
4. Verify that actions completed successfully
5. Adapt your approach if something fails

Available capabilities:
- Open applications
- Type text
- Click at coordinates
- Press keys and key combinations
- Capture screenshots
- Scroll
- Get screen information

Safety guidelines:
- Always explain what you're about to do before dangerous operations
- If you're unsure, ask for clarification
- Verify actions succeeded before proceeding
- Be careful with file operations, system settings, and sending messages

When you need to perform an action, use the available functions. Execute them step by step,
verifying success before proceeding to the next step.

If an operation fails, analyze why and try an alternative approach or ask the user for help."""
    
    def process_command(self, command: str) -> Dict[str, Any]:
        """
        Process a user command.
        
        Args:
            command: The command from the user
            
        Returns:
            Result dictionary
        """
        try:
            # Check for emergency stop
            if Supervisor.check_emergency_stop():
                return {
                    "success": False,
                    "message": "Emergency stop is active. Cannot process commands."
                }
            
            logger.info(f"Processing command: {command}")
            
            # Add user message to history
            self.conversation_history.append({
                "role": "user",
                "content": command
            })
            
            # Call LLM with function calling
            if self.use_local_model:
                # Local Hugging Face model
                response = self.client.generate(
                    system_prompt=self._get_system_prompt(),
                    messages=self.conversation_history,
                    tools=self.functions
                )
                result = self._handle_local_response(response)
            else:
                # Cloud API (Anthropic/OpenAI)
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=4096,
                    system=self._get_system_prompt(),
                    tools=self.functions,
                    messages=self.conversation_history
                )
                result = self._handle_response(response)
            
            return result
            
        except Exception as e:
            logger.exception(f"Error processing command: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
    
    def _handle_response(self, response) -> Dict[str, Any]:
        """
        Handle the LLM response and execute any function calls.
        
        Args:
            response: Response from the LLM
            
        Returns:
            Result dictionary
        """
        results = []
        
        # Process each content block
        for block in response.content:
            if block.type == "text":
                # Agent is providing explanation
                print(f"\n💭 Agent: {block.text}")
                results.append({
                    "type": "text",
                    "content": block.text
                })
                
            elif block.type == "tool_use":
                # Agent wants to execute a function
                function_name = block.name
                function_args = block.input
                
                print(f"\n🔧 Executing: {function_name}({json.dumps(function_args, indent=2)})")
                
                # Execute the function
                function_result = self._execute_function(function_name, function_args)
                
                # Display result
                if function_result.get('success'):
                    print(f"   ✅ {function_result.get('message')}")
                else:
                    print(f"   ❌ {function_result.get('message')}")
                
                results.append({
                    "type": "function",
                    "name": function_name,
                    "result": function_result
                })
                
                # If this was a multi-step operation, continue the conversation
                if response.stop_reason == "tool_use":
                    # Add assistant response to history
                    self.conversation_history.append({
                        "role": "assistant",
                        "content": response.content
                    })
                    
                    # Add function result to history
                    self.conversation_history.append({
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": block.id,
                                "content": json.dumps(function_result)
                            }
                        ]
                    })
                    
                    # Continue the conversation
                    next_response = self.client.messages.create(
                        model=self.model,
                        max_tokens=4096,
                        system=self._get_system_prompt(),
                        tools=self.functions,
                        messages=self.conversation_history
                    )
                    
                    return self._handle_response(next_response)
        
        # Determine overall success
        function_results = [r for r in results if r['type'] == 'function']
        if function_results:
            all_success = all(r['result'].get('success', False) for r in function_results)
            return {
                "success": all_success,
                "message": "Command completed",
                "results": results
            }
        else:
            return {
                "success": True,
                "message": "Understood",
                "results": results
            }
    
    def _handle_local_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle response from local Hugging Face model.
        
        Args:
            response: Response dictionary from local LLM
            
        Returns:
            Result dictionary
        """
        try:
            if response['type'] == 'error':
                return {
                    "success": False,
                    "message": response['content']
                }
            
            elif response['type'] == 'function_call':
                # Execute the function
                function_name = response['function']
                function_args = response['arguments']
                
                print(f"\n🔧 Executing: {function_name}({json.dumps(function_args, indent=2)})")
                
                function_result = self._execute_function(function_name, function_args)
                
                if function_result.get('success'):
                    print(f"   ✅ {function_result.get('message')}")
                else:
                    print(f"   ❌ {function_result.get('message')}")
                
                return {
                    "success": function_result.get('success', False),
                    "message": function_result.get('message', 'Function executed'),
                    "results": [{
                        "type": "function",
                        "name": function_name,
                        "result": function_result
                    }]
                }
            
            elif response['type'] == 'text':
                # Regular text response
                print(f"\n💭 Agent: {response['content']}")
                return {
                    "success": True,
                    "message": "Understood",
                    "results": [{
                        "type": "text",
                        "content": response['content']
                    }]
                }
            
            else:
                return {
                    "success": False,
                    "message": f"Unknown response type: {response['type']}"
                }
                
        except Exception as e:
            logger.error(f"Error handling local response: {e}")
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }
    
    def _execute_function(self, function_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a function call.
        
        Args:
            function_name: Name of the function
            args: Function arguments
            
        Returns:
            Function execution result
        """
        try:
            # Check for emergency stop before executing
            if Supervisor.check_emergency_stop():
                return {
                    "success": False,
                    "message": "Emergency stop is active"
                }
            
            # Map function names to device controller methods
            if function_name == "open_application":
                return self.device_controller.open_application(args['app_name'])
                
            elif function_name == "type_text":
                return self.device_controller.type_text(args['text'])
                
            elif function_name == "click":
                return self.device_controller.click(
                    args['x'],
                    args['y'],
                    args.get('button', 'left')
                )
                
            elif function_name == "press_key":
                return self.device_controller.press_key(
                    args['key'],
                    args.get('modifiers')
                )
                
            elif function_name == "capture_screen":
                return self.device_controller.capture_screen()
                
            elif function_name == "scroll":
                return self.device_controller.scroll(
                    args['clicks'],
                    args.get('direction', 'down')
                )
                
            elif function_name == "get_screen_info":
                screen_size = self.device_controller.get_screen_size()
                mouse_pos = self.device_controller.get_mouse_position()
                active_window = self.device_controller.get_active_window()
                
                return {
                    "success": True,
                    "message": "Screen info retrieved",
                    "screen_size": screen_size,
                    "mouse_position": mouse_pos,
                    "active_window": active_window
                }
            
            elif function_name == "analyze_screen":
                if not self.vision_analyzer:
                    return {"success": False, "message": "Vision system not enabled"}
                
                # Capture current screen
                screenshot_result = self.device_controller.capture_screen()
                if not screenshot_result.get('success'):
                    return screenshot_result
                
                return self.vision_analyzer.analyze_screenshot(
                    screenshot_result['screenshot_path'],
                    args['question']
                )
            
            elif function_name == "locate_element":
                if not self.vision_analyzer:
                    return {"success": False, "message": "Vision system not enabled"}
                
                screenshot_result = self.device_controller.capture_screen()
                if not screenshot_result.get('success'):
                    return screenshot_result
                
                return self.vision_analyzer.locate_ui_element(
                    screenshot_result['screenshot_path'],
                    args['description']
                )
            
            elif function_name == "verify_state":
                if not self.vision_analyzer:
                    return {"success": False, "message": "Vision system not enabled"}
                
                screenshot_result = self.device_controller.capture_screen()
                if not screenshot_result.get('success'):
                    return screenshot_result
                
                return self.vision_analyzer.verify_screen_state(
                    screenshot_result['screenshot_path'],
                    args['expected_state']
                )
            
            elif function_name == "find_text":
                if not self.layout_parser:
                    return {"success": False, "message": "Layout parser not enabled"}
                
                screenshot_result = self.device_controller.capture_screen()
                if not screenshot_result.get('success'):
                    return screenshot_result
                
                return self.layout_parser.find_text_on_screen(
                    screenshot_result['screenshot_path'],
                    args['text']
                )
            
            # FILE MANAGEMENT IMPLEMENTATIONS
            elif function_name == "create_file":
                return self.system_controller.create_file(
                    args['file_path'],
                    args.get('content', '')
                )
            
            elif function_name == "read_file":
                return self.system_controller.read_file(args['file_path'])
            
            elif function_name == "delete_file":
                return self.system_controller.delete_file(args['file_path'])
            
            elif function_name == "copy_file":
                return self.system_controller.copy_file(
                    args['source'],
                    args['destination']
                )
            
            elif function_name == "move_file":
                return self.system_controller.move_file(
                    args['source'],
                    args['destination']
                )
            
            elif function_name == "create_folder":
                return self.system_controller.create_folder(args['folder_path'])
            
            elif function_name == "list_folder":
                return self.system_controller.list_folder(args['folder_path'])
            
            # PROCESS MANAGEMENT IMPLEMENTATIONS
            elif function_name == "list_processes":
                return self.system_controller.list_processes()
            
            elif function_name == "kill_process":
                return self.system_controller.kill_process(
                    process_name=args.get('process_name'),
                    pid=args.get('pid')
                )
            
            elif function_name == "start_program":
                return self.system_controller.start_program(
                    args['program_path'],
                    args.get('args')
                )
            
            # SYSTEM OPERATIONS IMPLEMENTATIONS
            elif function_name == "run_command":
                return self.system_controller.run_command(args['command'])
            
            elif function_name == "get_system_info":
                return self.system_controller.get_system_info()
            
            elif function_name == "set_environment_variable":
                return self.system_controller.set_environment_variable(
                    args['name'],
                    args['value']
                )
            
            elif function_name == "get_environment_variable":
                return self.system_controller.get_environment_variable(args['name'])
            
            # REGISTRY OPERATIONS IMPLEMENTATIONS
            elif function_name == "read_registry":
                return self.system_controller.read_registry(
                    args['key_path'],
                    args['value_name']
                )
            
            elif function_name == "write_registry":
                return self.system_controller.write_registry(
                    args['key_path'],
                    args['value_name'],
                    args['value']
                )
            
            # NETWORK OPERATIONS IMPLEMENTATIONS
            elif function_name == "get_network_info":
                return self.system_controller.get_network_info()
            
            elif function_name == "ping":
                return self.system_controller.ping(args['host'])
            
            else:
                return {
                    "success": False,
                    "message": f"Unknown function: {function_name}"
                }
                
        except Exception as e:
            logger.exception(f"Error executing function {function_name}: {e}")
            return {
                "success": False,
                "message": f"Error executing {function_name}: {str(e)}"
            }
