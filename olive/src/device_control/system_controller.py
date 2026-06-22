"""
Extended Device Controller - Full System Access

Provides comprehensive Windows system control capabilities.
"""

import os
import shutil
import subprocess
import psutil
import winreg
from typing import Dict, Any, List, Optional
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.logger import get_logger

logger = get_logger(__name__)


class SystemController:
    """
    Extended system control capabilities.
    
    Provides full system access including:
    - File and folder management
    - Process management
    - System settings and registry
    - Network operations
    - Service management
    """
    
    def __init__(self):
        """Initialize system controller."""
        logger.info("System controller initialized")
    
    # ==================== FILE OPERATIONS ====================
    
    def create_file(self, file_path: str, content: str = "") -> Dict[str, Any]:
        """
        Create a new file.
        
        Args:
            file_path: Path to file
            content: Optional file content
            
        Returns:
            Result dictionary
        """
        try:
            path = Path(file_path)
            path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            logger.info(f"Created file: {file_path}")
            return {
                "success": True,
                "message": f"File created: {file_path}"
            }
        except Exception as e:
            logger.error(f"Error creating file: {e}")
            return {
                "success": False,
                "message": f"Error creating file: {str(e)}"
            }
    
    def read_file(self, file_path: str) -> Dict[str, Any]:
        """Read file content."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return {
                "success": True,
                "content": content,
                "size": len(content)
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error reading file: {str(e)}"
            }
    
    def delete_file(self, file_path: str) -> Dict[str, Any]:
        """Delete a file."""
        try:
            os.remove(file_path)
            logger.info(f"Deleted file: {file_path}")
            return {
                "success": True,
                "message": f"File deleted: {file_path}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error deleting file: {str(e)}"
            }
    
    def copy_file(self, source: str, destination: str) -> Dict[str, Any]:
        """Copy a file."""
        try:
            shutil.copy2(source, destination)
            logger.info(f"Copied {source} to {destination}")
            return {
                "success": True,
                "message": f"Copied to {destination}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error copying file: {str(e)}"
            }
    
    def move_file(self, source: str, destination: str) -> Dict[str, Any]:
        """Move/rename a file."""
        try:
            shutil.move(source, destination)
            logger.info(f"Moved {source} to {destination}")
            return {
                "success": True,
                "message": f"Moved to {destination}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error moving file: {str(e)}"
            }
    
    def create_folder(self, folder_path: str) -> Dict[str, Any]:
        """Create a folder."""
        try:
            Path(folder_path).mkdir(parents=True, exist_ok=True)
            logger.info(f"Created folder: {folder_path}")
            return {
                "success": True,
                "message": f"Folder created: {folder_path}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error creating folder: {str(e)}"
            }
    
    def list_folder(self, folder_path: str) -> Dict[str, Any]:
        """List folder contents."""
        try:
            path = Path(folder_path)
            items = []
            
            for item in path.iterdir():
                items.append({
                    "name": item.name,
                    "type": "folder" if item.is_dir() else "file",
                    "size": item.stat().st_size if item.is_file() else 0
                })
            
            return {
                "success": True,
                "items": items,
                "count": len(items)
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error listing folder: {str(e)}"
            }
    
    # ==================== PROCESS MANAGEMENT ====================
    
    def list_processes(self) -> Dict[str, Any]:
        """List running processes."""
        try:
            processes = []
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    processes.append(proc.info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            
            return {
                "success": True,
                "processes": processes[:50],  # Limit to top 50
                "total": len(processes)
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error listing processes: {str(e)}"
            }
    
    def kill_process(self, process_name: str = None, pid: int = None) -> Dict[str, Any]:
        """Kill a process by name or PID."""
        try:
            killed = []
            
            if pid:
                proc = psutil.Process(pid)
                proc.terminate()
                killed.append(f"PID {pid}")
            elif process_name:
                for proc in psutil.process_iter(['pid', 'name']):
                    if process_name.lower() in proc.info['name'].lower():
                        proc.terminate()
                        killed.append(proc.info['name'])
            
            logger.info(f"Killed processes: {killed}")
            return {
                "success": True,
                "message": f"Killed: {', '.join(killed)}",
                "killed": killed
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error killing process: {str(e)}"
            }
    
    def start_program(self, program_path: str, args: List[str] = None) -> Dict[str, Any]:
        """Start a program with arguments."""
        try:
            cmd = [program_path]
            if args:
                cmd.extend(args)
            
            process = subprocess.Popen(cmd)
            logger.info(f"Started program: {program_path}, PID: {process.pid}")
            
            return {
                "success": True,
                "message": f"Started {program_path}",
                "pid": process.pid
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error starting program: {str(e)}"
            }
    
    # ==================== SYSTEM OPERATIONS ====================
    
    def run_command(self, command: str) -> Dict[str, Any]:
        """Run a shell command."""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            logger.info(f"Executed command: {command}")
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "return_code": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "message": "Command timed out (30s limit)"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error running command: {str(e)}"
            }
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information."""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                "success": True,
                "cpu_percent": cpu_percent,
                "memory": {
                    "total": memory.total,
                    "available": memory.available,
                    "percent": memory.percent
                },
                "disk": {
                    "total": disk.total,
                    "free": disk.free,
                    "percent": disk.percent
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error getting system info: {str(e)}"
            }
    
    def set_environment_variable(self, name: str, value: str) -> Dict[str, Any]:
        """Set an environment variable."""
        try:
            os.environ[name] = value
            logger.info(f"Set environment variable: {name}")
            return {
                "success": True,
                "message": f"Set {name}={value}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error setting variable: {str(e)}"
            }
    
    def get_environment_variable(self, name: str) -> Dict[str, Any]:
        """Get an environment variable."""
        try:
            value = os.environ.get(name)
            return {
                "success": True,
                "name": name,
                "value": value
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error getting variable: {str(e)}"
            }
    
    # ==================== REGISTRY OPERATIONS ====================
    
    def read_registry(self, key_path: str, value_name: str) -> Dict[str, Any]:
        """Read Windows registry value."""
        try:
            # Parse key path
            parts = key_path.split('\\', 1)
            root_key = getattr(winreg, parts[0])
            sub_key = parts[1] if len(parts) > 1 else ""
            
            key = winreg.OpenKey(root_key, sub_key)
            value, reg_type = winreg.QueryValueEx(key, value_name)
            winreg.CloseKey(key)
            
            return {
                "success": True,
                "value": value,
                "type": reg_type
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error reading registry: {str(e)}"
            }
    
    def write_registry(self, key_path: str, value_name: str, value: Any, reg_type: int = winreg.REG_SZ) -> Dict[str, Any]:
        """Write Windows registry value."""
        try:
            parts = key_path.split('\\', 1)
            root_key = getattr(winreg, parts[0])
            sub_key = parts[1] if len(parts) > 1 else ""
            
            key = winreg.CreateKey(root_key, sub_key)
            winreg.SetValueEx(key, value_name, 0, reg_type, value)
            winreg.CloseKey(key)
            
            logger.info(f"Wrote registry: {key_path}\\{value_name}")
            return {
                "success": True,
                "message": f"Registry value set: {value_name}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error writing registry: {str(e)}"
            }
    
    # ==================== NETWORK OPERATIONS ====================
    
    def get_network_info(self) -> Dict[str, Any]:
        """Get network information."""
        try:
            interfaces = []
            for interface, addrs in psutil.net_if_addrs().items():
                interface_info = {"name": interface, "addresses": []}
                for addr in addrs:
                    interface_info["addresses"].append({
                        "family": str(addr.family),
                        "address": addr.address
                    })
                interfaces.append(interface_info)
            
            return {
                "success": True,
                "interfaces": interfaces
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error getting network info: {str(e)}"
            }
    
    def ping(self, host: str) -> Dict[str, Any]:
        """Ping a host."""
        try:
            result = subprocess.run(
                ["ping", "-n", "4", host],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            success = result.returncode == 0
            return {
                "success": success,
                "host": host,
                "output": result.stdout,
                "reachable": success
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error pinging {host}: {str(e)}"
            }
