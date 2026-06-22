# Benchmarking Script for PyTorch CNN MRI Classification Model
# Compatible with Kaggle and Colab

import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
import time
import sys
# --- Optional: For model summary output, install if not present ---
# try:
#     from torchinfo import summary
# except ImportError:
#     pip install torchinfo > /dev/null
#     from torchinfo import summary

# --- Optional: For advanced GPU memory info (Colab/Kaggle), install pynvml ---
# try:
#     import pynvml
# except ImportError:
#     pip install pynvml > /dev/null
#     import pynvml
try:
    from torchinfo import summary
except ImportError:
    print("Warning: `torchinfo` not found. Model summary will be skipped. `pip install torchinfo`")
    summary = None

model_path = "best_ternary_model.pth"


# -----------------------------
# Parameter Counting Functions
# -----------------------------

def count_parameters(model):
    """
    Returns total and trainable parameter counts.
    """
    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total_params, trainable_params

# -----------------------------
# Inference Timing Function
# -----------------------------

def benchmark_inference(model, test_loader, device='cuda', num_batches=50, include_loader=True):
    """
    Measures images/sec throughput for the model over test_loader or on synthetic data.
    If include_loader is False, uses only a single batch from the loader.
    If include_loader is True, traverses num_batches (or all batches if smaller) of test_loader.
    """
    model.eval()
    model.to(device)
    
    torch.set_grad_enabled(False)
    total_images = 0
    total_time = 0.0
    
    # Warming up for accurate timing (important for CUDA).
    warmup_iters = 5
    iterator = iter(test_loader)
    for _ in range(warmup_iters):
        try:
            batch = next(iterator)
        except StopIteration:
            iterator = iter(test_loader)
            batch = next(iterator)
        if isinstance(batch, (list, tuple)):
            data = batch[0].to(device, non_blocking=True)
        else:
            data = batch.to(device, non_blocking=True)
        model(data)
    
    # Main timing loop
    batch_counter = 0
    torch.cuda.empty_cache()
    if device == 'cuda':
        torch.cuda.synchronize()
    start_time = time.time()

    if include_loader:
        # Entire DataLoader (end-to-end, including data fetch and transfer)
        for batch in test_loader:
            if isinstance(batch, (list, tuple)):
                data = batch[0].to(device, non_blocking=True)
            else:
                data = batch.to(device, non_blocking=True)
            if device == 'cuda':
                torch.cuda.synchronize()
                tic = time.time()
                model(data)
                torch.cuda.synchronize()
                toc = time.time()
            else:
                tic = time.time()
                model(data)
                toc = time.time()
            batch_time = toc - tic
            total_time += batch_time
            total_images += data.size(0)
            batch_counter += 1
            if batch_counter >= num_batches: # Limit for faster benchmarking
                break
    else:
        # Only model forward (no DataLoader overhead)
        batch = next(iter(test_loader))
        if isinstance(batch, (list, tuple)):
            data = batch[0].to(device, non_blocking=True)
        else:
            data = batch.to(device, non_blocking=True)
        num_rep = num_batches
        for _ in range(num_rep):
            if device == 'cuda':
                torch.cuda.synchronize()
                tic = time.time()
                model(data)
                torch.cuda.synchronize()
                toc = time.time()
            else:
                tic = time.time()
                model(data)
                toc = time.time()
            batch_time = toc - tic
            total_time += batch_time
            total_images += data.size(0)
    
    elapsed = total_time
    images_per_sec = total_images / elapsed if elapsed > 0 else float('nan')
    
    torch.set_grad_enabled(True)
    return images_per_sec, elapsed, total_images

# -----------------------------
# GPU Memory Usage Profiling
# -----------------------------

def get_gpu_memory(device_index=0):
    """
    Returns (total, free, used) memory (in MiB) for the GPU using pynvml.
    """
    pynvml.nvmlInit()
    handle = pynvml.nvmlDeviceGetHandleByIndex(device_index)
    info = pynvml.nvmlDeviceGetMemoryInfo(handle)
    total = info.total // 1024 // 1024
    free = info.free // 1024 // 1024
    used = info.used // 1024 // 1024
    pynvml.nvmlShutdown()
    return total, free, used

def get_torch_cuda_memory(device='cuda:0'):
    """
    Returns (mem_allocated, mem_reserved, max_mem_allocated, max_mem_reserved) in MiB.
    """
    mem_allocated = torch.cuda.memory_allocated(device) // 1024 // 1024
    mem_reserved = torch.cuda.memory_reserved(device) // 1024 // 1024
    max_mem_allocated = torch.cuda.max_memory_allocated(device) // 1024 // 1024
    max_mem_reserved = torch.cuda.max_memory_reserved(device) // 1024 // 1024
    return mem_allocated, mem_reserved, max_mem_allocated, max_mem_reserved

# -----------------------------
# Model Summary Printer (per-layer breakdown)
# -----------------------------

def print_model_summary(model, input_size, device='cuda'):
    """
    Prints per-layer shape and parameter statistics using torchinfo.
    """
    print("="*70)
    print("Model Summary (torchinfo):")
    summary(model, input_size=input_size, device=device)
    print("="*70)

# -----------------------------
# Run All Benchmark Metrics
# -----------------------------

def run_benchmarks(model, test_loader):
    # Detect device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"\n🔎 Device detected: {device}\n")

    # --- Parameter counting ---
    total_params, trainable_params = count_parameters(model)
    print(f"🧮 Total parameters:      {total_params:,}")
    print(f"🧮 Trainable parameters: {trainable_params:,}\n")

    # --- Model summary (optional, only if size known) ---
    batch = next(iter(test_loader))
    if isinstance(batch, (list, tuple)):
        data = batch[0]
    else:
        data = batch
    input_size = tuple(data.shape)
    try:
        if summary:
            print_model_summary(model, input_size, device=device)
    except Exception as e:
        print(f"Could not print model summary. Error: {e}")

    # --- Inference speed: pure model throughput ---
    print("⏳ Measuring model forward throughput (no DataLoader overhead)...")
    images_per_sec, time_taken, total_images = benchmark_inference(model, test_loader, device=device, num_batches=30, include_loader=False)
    print(f"⚡ Pure model throughput: {images_per_sec:.2f} images/sec (batch size: {input_size[0]}) [Total {total_images} images in {time_taken:.3f} sec]\n")

    # --- Inference speed: end-to-end with DataLoader ---
    print("⏳ Measuring end-to-end throughput (DataLoader + model)...")
    images_per_sec_dl, time_taken_dl, total_images_dl = benchmark_inference(model, test_loader, device=device, num_batches=30, include_loader=True)
    print(f"⚡ End-to-end throughput: {images_per_sec_dl:.2f} images/sec [Total {total_images_dl} images in {time_taken_dl:.3f} sec]\n")

    # --- GPU memory usage (optional) ---
    if device == 'cuda':
        try:
            import pynvml
        except ImportError:
            print("Warning: `pynvml` not found. GPU memory stats from `pynvml` will be skipped. `pip install pynvml`")
            print("PyTorch's memory stats will still be shown.")
            pynvml = None
        print("🔍 GPU memory usage analysis:")
        total, free, used = get_gpu_memory(device_index=0)
        mem_alloc, mem_res, max_alloc, max_res = get_torch_cuda_memory(device='cuda:0')
        print(f"  Device total RAM      : {total} MiB")
        print(f"  Device free  RAM      : {free} MiB")
        print(f"  Device used  RAM      : {used} MiB")
        print(f"  PyTorch allocated     : {mem_alloc} MiB")
        print(f"  PyTorch reserved      : {mem_res} MiB")
        print(f"  PyTorch max allocated : {max_alloc} MiB")
        print(f"  PyTorch max reserved  : {max_res} MiB")
        print("-"*70)
    else:
        print("🔍 Memory usage metrics for CPU can be profiled with `psutil` if required.\n")

    print("Benchmarking complete. ✅\n")

# ============================
# To use: simply call
# run_benchmarks(model, test_loader)
# in your notebook after defining your model and DataLoader.
# Example usage when script is run directly.
# In a notebook, you would import `run_benchmarks` and call it
# with your actual model and DataLoader.
# ============================
if __name__ == '__main__':
    print("="*70)
    print("Running benchmark script in standalone mode with a dummy model.")
    print("="*70)

    # 1. Define a dummy model (replace with your actual model definition)
    class SimpleCNN(nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = nn.Conv2d(3, 16, 3, 1, 1)
            self.relu = nn.ReLU()
            self.pool = nn.MaxPool2d(2)
            self.fc1 = nn.Linear(16 * 112 * 112, 3) # Assuming 224x224 input

        def forward(self, x):
            x = self.pool(self.relu(self.conv1(x)))
            x = x.view(x.size(0), -1)
            x = self.fc1(x)
            return x

    # 2. Create a dummy DataLoader
    # Using synthetic data that resembles MRI images (e.g., 3x224x224)
    batch_size = 64
    dummy_images = torch.randn(batch_size * 5, 3, 224, 224)
    dummy_labels = torch.randint(0, 3, (batch_size * 5,))
    dummy_dataset = TensorDataset(dummy_images, dummy_labels)
    test_loader = DataLoader(dummy_dataset, batch_size=batch_size)

    # 3. Instantiate the model
    model = SimpleCNN()

    # 4. Run benchmarks
    run_benchmarks(model, test_loader)
