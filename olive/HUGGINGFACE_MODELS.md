# Hugging Face Models Guide

This guide explains how to use local Hugging Face models instead of cloud APIs.

## Benefits of Local Models

- **Privacy**: All processing happens on your machine
- **Cost**: No API fees
- **Offline**: Works without internet connection
- **Control**: Full control over model behavior

## Recommended Models

### Best for Function Calling

1. **Mistral-7B-Instruct-v0.2** (Default)
   - Model: `mistralai/Mistral-7B-Instruct-v0.2`
   - Size: ~7B parameters
   - RAM: ~8GB (with 8-bit quantization)
   - Good balance of performance and size

2. **Zephyr-7B-Beta**
   - Model: `HuggingFaceH4/zephyr-7b-beta`
   - Size: ~7B parameters
   - RAM: ~8GB (with 8-bit quantization)
   - Excellent instruction following

3. **Phi-2**
   - Model: `microsoft/phi-2`
   - Size: ~2.7B parameters
   - RAM: ~4GB (with 8-bit quantization)
   - Smaller, faster, good for limited hardware

### For Better Performance (Requires more RAM/VRAM)

4. **Llama-2-13B-Chat**
   - Model: `meta-llama/Llama-2-13b-chat-hf`
   - Size: ~13B parameters
   - RAM: ~16GB (with 8-bit quantization)
   - Better reasoning, requires HuggingFace account

## Configuration

Edit `config.json`:

```json
{
  "llm": {
    "provider": "huggingface",
    "model": "mistralai/Mistral-7B-Instruct-v0.2",
    "temperature": 0.7,
    "max_tokens": 2048,
    "device": "auto",
    "load_in_8bit": true
  }
}
```

### Configuration Options

- **provider**: Must be `"huggingface"` for local models
- **model**: Hugging Face model ID
- **temperature**: 0.0-1.0 (higher = more creative)
- **max_tokens**: Maximum response length
- **device**: 
  - `"auto"` - Automatically use GPU if available, else CPU
  - `"cuda"` - Force GPU (requires NVIDIA GPU with CUDA)
  - `"cpu"` - Force CPU (slower but works on any machine)
- **load_in_8bit**: 
  - `true` - Use 8-bit quantization (saves ~50% memory)
  - `false` - Use full precision (better quality, more memory)

## Installation

1. **Install dependencies**:
   ```bash
   pip install transformers torch accelerate bitsandbytes sentencepiece
   ```

2. **For GPU support (recommended)**:
   ```bash
   # NVIDIA GPU with CUDA
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

3. **First run** will download the model (~4-7GB):
   - Models are cached in `~/.cache/huggingface/`
   - First load takes 5-10 minutes
   - Subsequent loads are faster

## Hardware Requirements

### Minimum (CPU Only)
- **CPU**: Modern multi-core processor
- **RAM**: 12GB+ for 7B models
- **Speed**: Slow (10-30 seconds per response)

### Recommended (GPU)
- **GPU**: NVIDIA GTX 1660 or better with 6GB+ VRAM
- **RAM**: 16GB system RAM
- **Speed**: Fast (1-5 seconds per response)

### Optimal (High-end GPU)
- **GPU**: NVIDIA RTX 3060/4060 or better with 12GB+ VRAM
- **RAM**: 32GB system RAM
- **Speed**: Very fast (<2 seconds per response)

## Switching Between Cloud and Local

### Use Cloud API (Anthropic)
```json
{
  "llm": {
    "provider": "anthropic",
    "api_key": "your_key_here",
    "model": "claude-3-5-sonnet-20241022"
  }
}
```

### Use Local Model
```json
{
  "llm": {
    "provider": "huggingface",
    "model": "mistralai/Mistral-7B-Instruct-v0.2",
    "device": "auto",
    "load_in_8bit": true
  }
}
```

No code changes needed - just edit the config!

## Performance Tips

1. **Use GPU if available** - 10-20x faster than CPU
2. **Enable 8-bit quantization** - Reduces memory by ~50%
3. **Choose smaller models** - Phi-2 (2.7B) is faster than Mistral (7B)
4. **Lower max_tokens** - Faster generation
5. **Adjust temperature** - Lower values (0.3-0.5) for more focused responses

## Troubleshooting

### "Out of memory" error
- Enable `load_in_8bit: true`
- Use smaller model (Phi-2 instead of Mistral-7B)
- Close other applications
- Use CPU instead of GPU

### Slow responses
- Check if using GPU: Look for "CUDA" in startup logs
- Use smaller model
- Reduce `max_tokens`

### Model download fails
- Check internet connection
- Some models require HuggingFace account
- Clear cache: `~/.cache/huggingface/`

### Poor function calling
- Try different temperature (0.3-0.7)
- Use Mistral or Zephyr models (better at following instructions)
- Simplify commands

## Comparison: Cloud vs Local

| Aspect | Cloud API (Claude) | Local (Hugging Face) |
|--------|-------------------|----------------------|
| **Privacy** | Data sent to server | All data stays local |
| **Cost** | Pay per use ($) | Free after setup |
| **Speed** | Fast (1-3 sec) | Varies (1-30 sec) |
| **Quality** | Excellent | Good to Very Good |
| **Setup** | Just API key | Install & download |
| **Offline** | ❌ No | ✅ Yes |
| **Hardware** | Any | GPU recommended |

## Example Models by Use Case

### Best Overall (Balanced)
```json
"model": "mistralai/Mistral-7B-Instruct-v0.2"
```

### Fastest (Limited Hardware)
```json
"model": "microsoft/phi-2"
```

### Best Quality (High-end Hardware)
```json
"model": "meta-llama/Llama-2-13b-chat-hf"
```

### Most Reliable Function Calling
```json
"model": "HuggingFaceH4/zephyr-7b-beta"
```

## Next Steps

1. Update `config.json` with your chosen model
2. Run `start.bat`
3. On first run, wait for model download
4. Test with simple commands
5. Adjust temperature/max_tokens as needed

For best results, start with Mistral-7B-Instruct-v0.2 with 8-bit quantization!
