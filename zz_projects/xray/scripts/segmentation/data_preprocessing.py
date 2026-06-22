import os
import numpy as np
import cv2
from tensorflow.keras.utils import to_categorical

# Define paths
raw_data_dir = r"c:\zzz_project\xray\dataset\segmentation"  # Changed to absolute path
processed_data_dir = r"processed_data/segmentation"

# Image parameters
img_height = 256
img_width = 256
num_channels = 3  # RGB images

def load_and_preprocess_images(image_dir, mask_dir):
    image_dir = os.path.normpath(image_dir)  # Normalize path
    mask_dir = os.path.normpath(mask_dir)    # Normalize path
    # Check if directories exist
    if not os.path.exists(image_dir):
        raise FileNotFoundError(f"Directory not found: {image_dir}")
    if not os.path.exists(mask_dir):
        raise FileNotFoundError(f"Directory not found: {mask_dir}")
    
    images = []
    masks = []
    
    for filename in os.listdir(image_dir):
        # Load image
        img_path = os.path.join(image_dir, filename)
        img = cv2.imread(img_path)
        if img is None:
            print(f"Warning: Unable to load image: {img_path}")
            continue
        img = cv2.resize(img, (img_width, img_height))
        images.append(img)

        # Load corresponding mask
        mask_path = os.path.join(mask_dir, filename)
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
        if mask is None:
            print(f"Warning: Unable to load mask: {mask_path}")
            continue
        mask = cv2.resize(mask, (img_width, img_height))
        # Ensure mask values are binary
        mask = np.where(mask > 0, 1, 0)
        masks.append(mask)
    
    if len(images) != len(masks):
        print(f"Warning: Number of images ({len(images)}) and masks ({len(masks)}) do not match.")
    
    # Convert to numpy arrays
    images = np.array(images, dtype=np.float32) / 255.0  # Normalize images
    masks = np.array(masks, dtype=np.int32)
    masks = to_categorical(masks, num_classes=2)  # Assuming binary segmentation
    
    return images, masks

def save_preprocessed_data(x, y, prefix):
    np.save(os.path.join(processed_data_dir, f"{prefix}_X.npy"), x)
    np.save(os.path.join(processed_data_dir, f"{prefix}_Y.npy"), y)

# Create processed data directory if it doesn't exist
os.makedirs(processed_data_dir, exist_ok=True)

# Load and preprocess training data
x_train, y_train = load_and_preprocess_images(
    os.path.join(raw_data_dir, "train/images"),
    os.path.join(raw_data_dir, "train/masks")
)
save_preprocessed_data(x_train, y_train, "train")

# Load and preprocess validation data
x_val, y_val = load_and_preprocess_images(
    os.path.join(raw_data_dir, "val/images"),
    os.path.join(raw_data_dir, "val/masks")
)
save_preprocessed_data(x_val, y_val, "val")

# Load and preprocess test data
x_test, y_test = load_and_preprocess_images(
    os.path.join(raw_data_dir, "test/images"),
    os.path.join(raw_data_dir, "test/masks")
)
save_preprocessed_data(x_test, y_test, "test")

print("Data preprocessing for segmentation completed successfully.")
