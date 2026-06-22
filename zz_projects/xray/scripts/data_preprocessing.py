# import os
# import numpy as np
# from PIL import Image
# import sys
# sys.stdout.reconfigure(encoding='utf-8')

# # Define paths
# source_base_dir = r"dataset/classification"
# splits = ["train", "val", "test"]
# processed_data_dir = r"processed_data\classification"
# os.makedirs(processed_data_dir, exist_ok=True)

# # Image parameters
# img_height = 224
# img_width = 224

# # Define classes
# classes = ['no_fracture', 'fracture']
# class_to_idx = {cls: idx for idx, cls in enumerate(classes)}

# # Function to preprocess a dataset split
# def preprocess_split(split_name):
#     x_data = []
#     y_data = []
#     truncated_files = []

#     split_dir = os.path.join(source_base_dir, split_name)
#     print(f"Processing split: {split_name}")
#     for cls in classes:
#         class_dir = os.path.join(split_dir, cls)
#         if os.path.exists(class_dir):
#             image_count = 0
#             for img_name in os.listdir(class_dir):
#                 if img_name.endswith(('.jpg', '.png', '.jpeg')):
#                     image_count += 1
#                     img_path = os.path.join(class_dir, img_name)
#                     try:
#                         img = Image.open(img_path).convert('RGB').resize((img_width, img_height))
#                         img_array = np.array(img) / 255.0  # Normalize
#                         x_data.append(img_array)
#                         y_data.append(class_to_idx[cls])
#                     except Exception as e:
#                         print(f"Error processing {img_path}: {e}")
#                         truncated_files.append(img_path)
#             print(f"Class '{cls}' in split '{split_name}' has {image_count} images.")
#         else:
#             print(f"Class directory '{class_dir}' does not exist.")

#     x_data = np.array(x_data)
#     y_data = np.array(y_data)
#     np.save(os.path.join(processed_data_dir, f'X_{split_name}.npy'), x_data)
#     np.save(os.path.join(processed_data_dir, f'y_{split_name}.npy'), y_data)
#     print(f"[{split_name.upper()}] Saved {len(x_data)} samples.")

#     # Log truncated files for future reference
#     truncated_files_log = os.path.join(processed_data_dir, 'truncated_files.log')
#     with open(truncated_files_log, 'w') as log_file:
#         for truncated_file in truncated_files:
#             log_file.write(truncated_file + '\n')
#     print(f"Truncated files logged to {truncated_files_log}")

# # Process all splits
# for split in splits:
#     preprocess_split(split)

# print("Data preprocessing completed!")
# # Verify shapes
# x_train = np.load(os.path.join(processed_data_dir, 'X_train.npy'))
# y_train = np.load(os.path.join(processed_data_dir, 'y_train.npy'))
# x_val = np.load(os.path.join(processed_data_dir, 'X_val.npy'))
# y_val = np.load(os.path.join(processed_data_dir, 'y_val.npy'))
# x_test = np.load(os.path.join(processed_data_dir, 'X_test.npy'))
# y_test = np.load(os.path.join(processed_data_dir, 'y_test.npy'))

# print(f"Training data shape: {x_train.shape}, Labels shape: {y_train.shape}")
# print(f"Validation data shape: {x_val.shape}, Labels shape: {y_val.shape}")
# print(f"Test data shape: {x_test.shape}, Labels shape: {y_test.shape}")








import os
import numpy as np
from PIL import Image
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

# Configuration
source_base_dir = r"dataset/classification"
processed_data_dir = r"processed_data\classification"
splits = ["train", "val", "test"]
img_height, img_width = 224, 224
classes = ['no_fracture', 'fracture']
class_to_idx = {cls: idx for idx, cls in enumerate(classes)}

# Create output directory
os.makedirs(processed_data_dir, exist_ok=True)

def preprocess_split(split_name):
    """Process a dataset split with enhanced error handling and logging"""
    x_data, y_data = [], []
    split_stats = defaultdict(int)
    error_log = []

    split_dir = os.path.join(source_base_dir, split_name)
    print(f"\n{'='*40}\nProcessing {split_name.upper()} split\n{'='*40}")

    for cls in classes:
        class_dir = os.path.join(split_dir, cls)
        if not os.path.exists(class_dir):
            print(f"⚠️ Warning: Missing directory {class_dir}")
            continue

        valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
        image_files = [f for f in os.listdir(class_dir) 
                      if f.lower().endswith(valid_extensions)]

        print(f"Processing {len(image_files)} images for class '{cls}'...")

        for img_name in image_files:
            img_path = os.path.join(class_dir, img_name)
            try:
                # Use context manager for file handling
                with Image.open(img_path) as img:
                    img = img.convert('RGB').resize((img_width, img_height))
                    img_array = np.array(img, dtype=np.float32) / 255.0  # float32 for efficiency
                    
                    x_data.append(img_array)
                    y_data.append(class_to_idx[cls])
                    split_stats[cls] += 1
            except Exception as e:
                error_log.append(f"{img_path}: {str(e)}")

    # Save data with validation
    if x_data:
        x_data = np.array(x_data, dtype=np.float32)
        y_data = np.array(y_data)
        
        np.save(os.path.join(processed_data_dir, f'X_{split_name}.npy'), x_data)
        np.save(os.path.join(processed_data_dir, f'y_{split_name}.npy'), y_data)
        print(f"\n✅ Saved {len(x_data)} samples for {split_name.upper()}")
    else:
        print(f"\n❌ No valid data found for {split_name.upper()}!")

    # Save errors with split-specific logging
    if error_log:
        error_path = os.path.join(processed_data_dir, f'processing_errors_{split_name}.log')
        with open(error_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(error_log))
        print(f"⚠️ Saved {len(error_log)} error(s) to {error_path}")

    # Print class distribution
    print("\nClass Distribution:")
    for cls, count in split_stats.items():
        print(f"{cls}: {count} samples ({count/len(x_data):.1%})")

# Process all splits
for split in splits:
    preprocess_split(split)

print("\nData preprocessing completed!")

# Verification with enhanced checks
def verify_dataset():
    print("\nData Verification:")
    for split in splits:
        try:
            x = np.load(os.path.join(processed_data_dir, f'X_{split}.npy'))
            y = np.load(os.path.join(processed_data_dir, f'y_{split}.npy'))
            print(f"{split.upper():<10} | Features: {x.shape} | Labels: {y.shape} | "
                  f"Mean: {x.mean():.3f} | Range: [{x.min():.3f}, {x.max():.3f}]")
        except FileNotFoundError:
            print(f"{split.upper():<10} | Data not found")

verify_dataset()