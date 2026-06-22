# # this part of the script is for moving pests and healthy images from the source directory to the target directory

# # import os
# # import shutil
# # import random

# # source_dir = r"C:\Users\IQBAL SINGH\Downloads\plantvillage dataset\color"
# # target_dir = r"C:\zzz_project\AgriGuard\data\image_data\pests"
# # os.makedirs(target_dir, exist_ok=True)

# # # Pick categories
# # healthy = [f for f in os.listdir(source_dir) if "Healthy" in f]
# # pest_disease = [f for f in os.listdir(source_dir) if any(keyword in f.lower() for keyword in ["blight", "spot", "rot"])]

# # # Define target subdirs for labeling
# # target_healthy = os.path.join(target_dir, "no_pest")
# # target_pest = os.path.join(target_dir, "pest")
# # os.makedirs(target_healthy, exist_ok=True)
# # os.makedirs(target_pest, exist_ok=True)

# # # Copy 300 from each category (adjustable total ~600)
# # sample_size = 300
# # for category, target in [(healthy, target_healthy), (pest_disease, target_pest)]:
# #     selected_folders = random.sample(category, min(3, len(category)))  # Pick up to 3 folders
# #     for folder in selected_folders:
# #         img_dir = os.path.join(source_dir, folder)
# #         imgs = [f for f in os.listdir(img_dir) if f.endswith((".jpg", ".png"))]
# #         sampled_imgs = random.sample(imgs, min(sample_size, len(imgs)))
# #         for img in sampled_imgs:
# #             src_path = os.path.join(img_dir, img)
# #             dst_path = os.path.join(target, img)
# #             shutil.copy(src_path, dst_path)

# # print(f"Copied {len(os.listdir(target_healthy))} healthy images and {len(os.listdir(target_pest))} pest images.")



# import os
# import shutil
# import random

# # Define source and target directories
# source_dir = r"C:\Users\IQBAL SINGH\Downloads\plantvillage dataset\color"  # Adjust your source path
# target_dir = r"C:\zzz_project\AgriGuard\data\image_data\lai"
# os.makedirs(target_dir, exist_ok=True)

# # Identify subfolders with healthy or leaf-related images
# subfolders = [f for f in os.listdir(source_dir) if "Healthy" in f or "leaf" in f.lower()]  # Adjust keywords as needed

# # Target number of images
# target_count = 300

# # Move images
# moved_count = 0
# for folder in random.sample(subfolders, min(3, len(subfolders))):  # Pick up to 3 folders
#     img_dir = os.path.join(source_dir, folder)
#     if os.path.isdir(img_dir):
#         imgs = [f for f in os.listdir(img_dir) if f.endswith((".jpg", ".png"))]
#         if imgs:
#             sampled_imgs = random.sample(imgs, min(len(imgs), target_count - moved_count))
#             for img in sampled_imgs:
#                 src_path = os.path.join(img_dir, img)
#                 dst_path = os.path.join(target_dir, img)
#                 shutil.move(src_path, dst_path)  # Use move instead of copy to avoid duplicates
#                 moved_count += 1
#                 if moved_count >= target_count:
#                     break
#     if moved_count >= target_count:
#         break

# print(f"Moved {moved_count} images to {target_dir}.")

# # Optional: Calculate proxy LAI values (uncomment to use)
# import cv2
# import numpy as np

# def calculate_green_ratio(img_path):
#     img = cv2.imread(img_path)
#     img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
#     lower_green = np.array([35, 50, 50])
#     upper_green = np.array([85, 255, 255])
#     mask = cv2.inRange(img, lower_green, upper_green)
#     green_pixels = cv2.countNonZero(mask)
#     total_pixels = img.shape[0] * img.shape[1]
#     ratio = (green_pixels / total_pixels) * 4
#     return min(max(ratio, 0.1), 4.0)

# for img_file in os.listdir(target_dir):
#     if img_file.endswith(".jpg"):
#         lai = calculate_green_ratio(os.path.join(target_dir, img_file))
#         print(f"{img_file}: Estimated LAI = {lai:.2f}")





# progression

import os
import shutil
import random

# Define source and target directories
source_dir = r"C:\Users\IQBAL SINGH\Downloads\plantvillage dataset\color"  # Adjust your source path
target_dir = r"C:\zzz_project\AgriGuard\data\image_data\progression"
os.makedirs(target_dir, exist_ok=True)

# Debug: Check if source directory exists
if not os.path.exists(source_dir):
    print(f"Error: Source directory {source_dir} does not exist!")
else:
    print(f"Found source directory with contents: {os.listdir(source_dir)}")

# Identify subfolders with healthy and affected images
healthy_folders = [f for f in os.listdir(source_dir) if "healthy" in f.lower()]  # Case-insensitive
affected_folders = [f for f in os.listdir(source_dir) if any(keyword in f.lower() for keyword in ["blight", "spot", "rot", "scab", "mildew", "rust", "disease"])]

print(f"Healthy folders found: {healthy_folders}")
print(f"Affected folders found: {affected_folders}")

# Target number of base images (e.g., 20 sequences x 1 base image per sequence)
target_base_count = 20

# Move base images
base_count = 0
for folder_type, folders in [("healthy", healthy_folders), ("affected", affected_folders)]:
    if not folders:
        print(f"No {folder_type} folders found with current filter. Skipping this type.")
        continue
    selected_folders = random.sample(folders, min(5, len(folders)))  # Pick up to 5 folders per type for more variety
    print(f"Selected {folder_type} folders: {selected_folders}")
    for folder in selected_folders:
        img_dir = os.path.join(source_dir, folder)
        if os.path.isdir(img_dir):
            imgs = [f for f in os.listdir(img_dir) if f.lower().endswith((".jpg", ".png", ".jpeg"))]  # Flexible extension
            if not imgs:
                print(f"No image files found in {img_dir}. Skipping.")
                continue
            print(f"Found {len(imgs)} images in {img_dir}")
            sampled_imgs = random.sample(imgs, min(1, len(imgs)))  # Take 1 image per folder
            for img in sampled_imgs:
                src_path = os.path.join(img_dir, img)
                dst_path = os.path.join(target_dir, f"seq{base_count + 1}_1.jpg")  # Name as sequence start
                try:
                    shutil.copy(src_path, dst_path)  # Use copy as fallback
                    print(f"Copied {img} to {dst_path}")
                    base_count += 1
                    if base_count >= target_base_count:
                        break
                except Exception as e:
                    print(f"Error copying {img} to {dst_path}: {e}")
        if base_count >= target_base_count:
            break

print(f"Moved {base_count} base images to {target_dir}.")
