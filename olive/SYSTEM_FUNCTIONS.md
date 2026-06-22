# System Control Functions Guide

## Overview

The AI Device Control Agent now has comprehensive system control capabilities. This guide documents all available functions organized by category.

## ⚠️ Important Safety Notes

> [!WARNING]
> **Full System Access Enabled**
>
> The agent now has extensive system control capabilities including file management, process control, registry access, and shell command execution. Use with caution!

**Safety Features:**
- Emergency stop: `Ctrl+Shift+Esc`
- All operations are logged
- Supervisor process monitors agent activity
- Critical operations should require confirmation (configurable)

---

##  File Management Functions

### create_file
Create a new file with optional content.

**Usage:**
```
> create a file called test.txt with content "Hello World"
> create an empty file at C:\temp\notes.txt
```

**Parameters:**
- `file_path`: Path where file should be created
- `content`: Optional file content (default: empty)

### read_file
Read content from a file.

**Usage:**
```
> read the file C:\temp\notes.txt
> what's in config.json?
```

### delete_file
Delete a file.

**Usage:**
```
> delete the file C:\temp\test.txt
> remove notes.txt from the desktop
```

### copy_file
Copy a file to a new location.

**Usage:**
```
> copy C:\temp\file.txt to C:\backup\file.txt
> duplicate the config file
```

**Parameters:**
- `source`: Source file path
- `destination`: Destination path

### move_file
Move or rename a file.

**Usage:**
```
> move C:\temp\old.txt to C:\temp\new.txt
> rename file.txt to document.txt
```

### create_folder
Create a new folder/directory.

**Usage:**
```
> create a folder called Projects in Documents
> make a directory C:\temp\backup
```

### list_folder
List contents of a folder.

**Usage:**
```
> list files in C:\Users\username\Documents
> what's in the Downloads folder?
```

---

## 🔧 Process Management Functions

### list_processes
List currently running processes with CPU and memory usage.

**Usage:**
```
> show me running processes
> list all processes
> what processes are using the most memory?
```

**Returns:** Top 50 processes sorted by resource usage

### kill_process
Kill/terminate a process by name or PID.

**Usage:**
```
> kill process notepad
> terminate chrome
> kill process with PID 1234
```

**Parameters:**
- `process_name`: Name of process to kill (e.g., "notepad.exe")
- `pid`: Process ID to kill

### start_program
Start a program with optional arguments.

**Usage:**
```
> start program C:\Program Files\app.exe
> run command prompt with arguments
```

**Parameters:**
- `program_path`: Full path to executable
- `args`: List of command-line arguments

---

##  System Operations Functions

### run_command
Execute a shell/CMD command.

**Usage:**
```
> run command "ipconfig /all"
> execute dir command
> run netstat -an
```

**Parameters:**
- `command`: Command to execute

**Returns:** Command output, errors, and return code

> [!CAUTION]
> Commands have a 30second timeout. Use with care!

### get_system_info
Get current CPU, memory, and disk usage.

**Usage:**
```
> check system resources
> how much memory is available?
> what's the disk usage?
```

**Returns:**
- CPU percentage
- Total/available memory
- Disk space (total/free)

### set_environment_variable
Set an environment variable.

**Usage:**
```
> set environment variable PATH to new value
> set MY_VAR to hello
```

**Note:** Changes affect current process only

### get_environment_variable
Get value of an environment variable.

**Usage:**
```
> get PATH environment variable
> what's the value of TEMP?
```

---

## 📋 Registry Operations Functions

### read_registry
Read a value from Windows registry.

**Usage:**
```
> read registry HKEY_LOCAL_MACHINE\Software\...
```

**Parameters:**
- `key_path`: Full registry key path
- `value_name`: Name of value to read

**Example key paths:**
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\...
HKEY_LOCAL_MACHINE\System\CurrentControlSet\...
```

### write_registry
Write a value to Windows registry.

**Usage:**
```
> write registry value to HKEY_CURRENT_USER\...
```

**Parameters:**
- `key_path`: Registry key path
- `value_name`: Value name
- `value`: Value to write

> [!WARNING]
> Registry modifications can affect system stability. Use carefully!

---

## 🌐 Network Operations Functions

### get_network_info
Get network interfaces and IP addresses.

**Usage:**
```
> show network interfaces
> what's my IP address?
> list network adapters
```

**Returns:** All network interfaces with IP addresses

### ping
Ping a host to check connectivity.

**Usage:**
```
> ping google.com
> check if 192.168.1.1 is reachable
> test connection to server.com
```

**Parameters:**
- `host`: Hostname or IP address

**Returns:** Ping results including success/failure and output

---

## 👁️ Vision Functions (Phase 3)

### analyze_screen
Ask questions about what's on screen.

**Usage:**
```
> what application is currently open?
> analyze the screen, is there an error message?
> describe what you see
```

### locate_element
Find UI element by description.

**Usage:**
```
> find the submit button
> where is the search box?
> locate the close icon
```

### verify_state
Verify expected screen state.

**Usage:**
```
> verify that notepad is open
> check if login was successful
> is the file saved?
```

### find_text
Find specific text on screen and get its coordinates.

**Usage:**
```
> find the word "Login" on screen
> locate the text "Submit"
```

---

## Example Workflows

### Workflow 1: File Organization

```
> create folder C:\WorkFiles
✅ Created folder

> copy all txt files from Desktop to C:\WorkFiles
🔧 Executing: list_folder (Desktop)
🔧 Executing: copy_file (for each .txt)
✅ Copied 5 files

> list files in C:\WorkFiles
✅ Files: document.txt, notes.txt, readme.txt...
```

### Workflow 2: System Maintenance

```
> check system resources
✅ CPU: 35%, Memory: 60%, Disk: 45%

> list processes
✅ Showing 50 processes

> kill process chrome if it's using too much memory
💭 Checking process list...
🔧 Executing: kill_process("chrome.exe")
✅ Terminated chrome.exe
```

### Workflow 3: Network Diagnostics

```
> ping google.com
✅ Host is reachable (4 packets, 0% loss)

> get network info
✅ Interfaces: Ethernet (192.168.1.100), WiFi (192.168.1.101)

> run command "ipconfig /all"
✅ [Full network configuration output]
```

### Workflow 4: Automated Setup

```
> create folder C:\Development
✅ Created

> set environment variable DEV_PATH to C:\Development
✅ Set DEV_PATH=C:\Development

> create file C:\Development\readme.md with content "Project Setup"
✅ File created

> start program C:\Program Files\VSCode\Code.exe with args C:\Development
✅ Started VS Code
```

---

## Function Summary Table

| Category | Functions | Count |
|----------|-----------|-------|
| **Basic Control** | open_app, type, click, press_key, scroll, capture_screen, get_screen_info | 7 |
| **Vision** | analyze_screen, locate_element, verify_state, find_text | 4 |
| **File Management** | create_file, read_file, delete_file, copy_file, move_file, create_folder, list_folder | 7 |
| **Process** | list_processes, kill_process, start_program | 3 |
| **System** | run_command, get_system_info, set/get_env_var | 4 |
| **Registry** | read_registry, write_registry | 2 |
| **Network** | get_network_info, ping | 2 |
| **TOTAL** | | **29 functions** |

---

## Safety & Best Practices

### ✅ Safe Operations
- Reading files
- Listing folders/processes 
- Getting system/network info
- Taking screenshots
- Analyzing screen
- Pinging hosts

### ⚠️ Use with Caution
- Creating/modifying files
- Moving/copying files
- Running commands
- Setting environment variables

### 🚨 Require Confirmation
- Deleting files
- Killing processes
- Writing to registry
- Running system commands

### Configuration

Edit `config.json` to set risk levels:

```json
{
  "permissions": {
    "default_capabilities": [
      "read_screen",
      "open_application",
      "type_text",
      "click",
      "create_file",
      "read_file"
    ],
    "require_confirmation": [
      "delete_file",
      "kill_process",
      "run_command",
      "write_registry",
      "modify_system_settings"
    ]
  }
}
```

---

## Troubleshooting

### "Permission Denied" Errors
- Run as Administrator for system-level operations
- Check file/folder permissions
- Verify registry key access rights

### "Function Not Found"
- Restart agent after updates
-Check that all dependencies are installed
- Verify `psutil` is installed for system functions

### Commands Timing Out
- Commands have a 30-second timeout
- Use async operations for long-running tasks
- Break complex operations into smaller steps

---

## What's Next?

With full system access, the agent can now:
- ✅ Automate file organization
- ✅ Manage running processes
- ✅ Configure system settings
- ✅ Perform network diagnostics
- ✅ Execute complex workflows
- ✅ Integrate with other tools

The agent is now a **comprehensive system automation tool** with AI-powered understanding and control!
