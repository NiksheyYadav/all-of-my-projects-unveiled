# AI Device Control Agent

An AI-powered device control agent that allows users to control their devices through natural language commands, whether spoken or typed.

## Overview

This system transforms natural language into device actions using a multi-layered architecture:
- **Input Processing**: Handles voice and text commands
- **AI Agent Core**: Understands intent and plans actions  
- **Device Control**: Executes operations across the OS
- **Perception**: Understands screen state via vision and OCR
- **Safety System**: Ensures safe operation with emergency stops and confirmations

## Features

### 🎯 Full System Control (29 Functions Total!)

**Basic Device Control** ✅
- 🖱️ Mouse & keyboard automation
- 🪟 Application launching  
- 📸 Screen capture
- ⌨️ Text input simulation

**Advanced Perception (Phase 3)** ✅
- 👁️ **Vision Understanding**: Analyze screenshots with Claude Vision API
- 🎯 **UI Element Location**: Find buttons, text fields by description
- ✅ **State Verification**: Confirm actions completed successfully
- 📄 **Enhanced OCR**: Text extraction with layout preservation

**Voice Control (Phase 4)** ✅
- 🎙️ **Speech Recognition**: OpenAI Whisper for local voice commands
- 🔊 **Text-to-Speech**: Audio feedback with pyttsx3
- 🎧 **Continuous Listening**: Hands-free operation mode
- 🔄 **Mode Selection**: Choose text or voice input at startup

**📁 File Management (7 Functions)** ✅ NEW!
- Create, read, delete files
- Copy, move files and folders
- List directory contents
- Full filesystem access

**⚙️ Process & System Control (7 Functions)** ✅ NEW!
- List, kill, start processes
- Run shell commands
- Get system info (CPU, memory, disk)
- Manage environment variables

**🌐 Network & Registry (4 Functions)** ✅ NEW!
- Network interface information
- Ping hosts
- Read/write Windows registry

**🛡️ Safety Features**
- Emergency stop (`Ctrl+Shift+Esc`)
- Independent supervisor process
- Comprehensive audit logging
- Configurable permission system

See [SYSTEM_FUNCTIONS.md](SYSTEM_FUNCTIONS.md) for complete function documentation.

## Installation

1. Clone the repository
2. Install Python 3.10+
3. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Copy `.env.example` to `.env` and add your API keys
6. Configure `config.json` with your preferences

## Quick Start

**Option 1: Use Cloud API (Anthropic Claude)**
1. Get API key from https://console.anthropic.com/
2. Add to `.env` file
3. Keep `provider: "anthropic"` in `config.json`

**Option 2: Use Local Hugging Face Models** (No API key needed!)
1. Set `provider: "huggingface"` in `config.json`
2. First run downloads model (~5GB, one-time)
3. See [HUGGINGFACE_MODELS.md](HUGGINGFACE_MODELS.md) for model selection

**Start the Agent:**

1. Start the supervisor process (safety system):
   ```bash
   python src/supervisor/supervisor.py
   ```

2. In a separate terminal, start the agent:
   ```bash
   python src/main.py
   ```

3. Enter commands via text or enable voice control in config

## Safety

- **Emergency Stop**: Press `Ctrl+Shift+Esc` to immediately halt all operations
- **Confirmations**: High-risk operations require explicit approval
- **Logging**: All actions are logged for audit and undo purposes
- **Sandboxing**: Operates with least-privilege principles

## Architecture

```
src/
├── agent/          # AI agent core and reasoning
├── device_control/ # Platform-specific device operations
├── input/          # Text and voice input processing
├── perception/     # Screen capture, OCR, and vision
├── supervisor/     # Safety and monitoring system
└── utils/          # Shared utilities and helpers
```

## Development Status

Currently in Phase 1: Foundation and Core Infrastructure

See `task.md` for detailed implementation progress.

## License

MIT License - see LICENSE file for details

## Security Notice

This agent has extensive system access. Only use with trusted LLM providers and in secure environments. Review all code before deployment.
