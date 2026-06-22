import os
import json
import numpy as np
from PIL import Image, ImageDraw
import shutil
from sklearn.model_selection import train_test_split
import random

# Define paths
source_images_base = r"C:\zzz_project\xray\FracAtlas\images"  # Base path for images
source_annotations_path = r"C:\zzz_project\xray\FracAtlas\Annotations\COCO JSON\annotations.json"  # Corrected path
destination_path = r"C:\zzz_project\xray\dataset\segmentation"  # Update to your project structure

# Define split ratios
train_ratio = 0.7
val_ratio = 0.2
test_ratio = 0.1

# Ensure destination folders exist
for subset in ["train", "val", "test"]:
    os.makedirs(os.path.join(destination_path, subset, "images"), exist_ok=True)
    os.makedirs(os.path.join(destination_path, subset, "masks"), exist_ok=True)

# Load COCO annotations
if not os.path.exists(source_annotations_path):
    print(f"Annotation file not found at {source_annotations_path}. Please check the path.")
    exit()
with open(source_annotations_path, 'r') as f:
    data = json.load(f)

# Map image IDs to file paths and masks (only for Fractured images)
images = {}
for img in data['images']:
    img_path = os.path.join(source_images_base, "Fractured" if any(ann['image_id'] == img['id'] for ann in data['annotations']) else "Non_fractured", img['file_name'])
    if os.path.exists(img_path):
        images[img['id']] = img_path
print(f"Found {len(images)} images matching annotations.")

annotations = data['annotations']
img_mask = {}
for ann in annotations:
    img_id = ann['image_id']
    if img_id in images:  # Only process images with annotations
        if img_id not in img_mask:
            img_mask[img_id] = []
        # Extract the first segmentation polygon
        mask = ann['segmentation'][0] if ann['segmentation'] else []
        img_mask[img_id].append(mask)

# Collect image paths (only Fractured with masks)
image_paths = [path for img_id, path in images.items() if img_id in img_mask]
print(f"Images with masks: {len(image_paths)}")

# Shuffle and split images
random.shuffle(image_paths)
total_images = len(image_paths)
if total_images == 0:
    print(f"No images with masks found in {source_images_base}. Skipping...")
    exit()

train_end = int(total_images * train_ratio)
val_end = train_end + int(total_images * val_ratio)

train_images = image_paths[:train_end]
val_images = image_paths[train_end:val_end]
test_images = image_paths[val_end:]

# Function to copy images and generate masks
def process_images(image_list, subset):
    for img_path in image_list:
        category = "Fractured" if "Fractured" in img_path else "Non_fractured"
        # Copy image
        dest_img_folder = os.path.join(destination_path, subset, "images", category.lower())
        os.makedirs(dest_img_folder, exist_ok=True)
        shutil.copy(img_path, dest_img_folder)
        print(f"Copied {os.path.basename(img_path)} to {dest_img_folder}")

        # Get image ID and generate mask
        img_id = next(id for id, path in images.items() if path == img_path)
        if img_id in img_mask and img_mask[img_id]:
            # Convert polygon to binary mask (simplified)
            mask_coords = np.array(img_mask[img_id][0]).reshape(-1, 2)  # First polygon
            print(f"Mask coordinates for {os.path.basename(img_path)}: {mask_coords}")
            if mask_coords.size == 0:
                print(f"Empty mask coordinates for {img_path}. Skipping mask creation.")
                continue
            # Get image size from the actual image
            img = Image.open(img_path).convert('L')
            mask = np.zeros(img.size, dtype=np.uint8)
            # Use PIL to create mask from coordinates
            img_pil = Image.new('L', img.size, 0)
            draw = ImageDraw.Draw(img_pil)
            draw.polygon([tuple(coord) for coord in mask_coords], outline=1, fill=1)
            mask = np.array(img_pil)
            print(f"Mask content (non-zero count): {np.sum(mask > 0)}")

            # Save mask
            mask_filename = os.path.basename(img_path).replace('.png', '_mask.png')
            mask_folder = os.path.join(destination_path, subset, "masks", category.lower())
            os.makedirs(mask_folder, exist_ok=True)
            mask_path = os.path.join(mask_folder, mask_filename)
            Image.fromarray(mask).save(mask_path)
            print(f"Saved mask {mask_filename} to {mask_folder}")
        else:
            print(f"No mask found for image {img_path}. Skipping mask creation.")

# Process each split
process_images(train_images, "train")
process_images(val_images, "val")
process_images(test_images, "test")

print("Segmentation dataset preparation completed successfully!")
print("Train-Validation-Test split ratio:", train_ratio, "-", val_ratio, "-", test_ratio)