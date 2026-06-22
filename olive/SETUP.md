# Quick Setup Guide

## 1. Install Python Dependencies

```bash
cd c:\olive
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Configure API Key

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key from: https://console.anthropic.com/

## 3. Optional: Install Tesseract OCR

For text extraction from screens:

1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location
3. Add to PATH or update path in `src/perception/screen_reader.py`

## 4. Run the Agent

Simply double-click `start.bat` or run:

```bash
start.bat
```

This will:
1. Start the safety supervisor process
2. Start the main AI agent
3. Open the command interface

## 5. Try Some Commands

```
> open notepad
> type Hello, World!
> take a screenshot
> open chrome
```

## Emergency Stop

Press **Ctrl+Shift+Esc** at any time to halt all operations.

## Troubleshooting

**"Supervisor is not running"**
- The supervisor must start first
- Wait 3-5 seconds after starting supervisor before starting agent
- Use `start.bat` to handle this automatically

**"API key not configured"**
- Create `.env` file with your Anthropic API key
- Or set `ANTHROPIC_API_KEY` environment variable

**"Tesseract not found"**
- OCR is optional - other features will still work
- Install Tesseract or update path in `screen_reader.py`

**Mouse/keyboard not working**
- Run as administrator if needed
- Check antivirus isn't blocking pyautogui
- Ensure no other automation tools are interfering

## What's Included

✅ AI command interpretation via Claude
✅ Basic device control (open apps, type, click, screenshot)
✅ Safety supervisor with emergency stop
✅ Comprehensive logging
✅ Text input interface

## What's Not Included (Yet)

⏳ Voice control
⏳ Advanced vision/OCR integration
⏳ File operations
⏳ Undo system
⏳ Long-term memory

See `implementation_plan.md` for the full roadmap.
