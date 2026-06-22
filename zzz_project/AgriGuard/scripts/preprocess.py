import cv2
import os
import numpy as np

def preprocess_image(img_path, size=(128, 128)):
    """
    Read an image, resize it to the specified size, and normalize to [0, 1].
    
    Args:
        img_path (str): Path to the input image
        size (tuple): Target size (default: (128, 128))
    
    Returns:
        numpy.ndarray: Preprocessed image array
    """
    # Read image
    img = cv2.imread(img_path)
    if img is None:
        print(f"Error: Could not load image {img_path}")
        return None
    
    # Resize
    img = cv2.resize(img, size)
    
    # Normalize to [0, 1]
    img = img / 255.0
    
    return img

def preprocess_dataset(in_dir, out_dir, size=(128, 128)):
    """
    Preprocess all images in the input directory and its subdirectories, saving as .npy files.
    
    Args:
        in_dir (str): Input directory with raw images
        out_dir (str): Output directory for processed .npy files
        size (tuple): Target size (default: (128, 128))
    """
    # Create output directory if it doesn't exist
    os.makedirs(out_dir, exist_ok=True)
    
    # Walk through directory and subdirectories
    for root, dirs, files in os.walk(in_dir):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg", ".png")):
                img_path = os.path.join(root, file)
                processed_img = preprocess_image(img_path, size)
                if processed_img is not None:
                    # Preserve subdirectory structure in output
                    relative_path = os.path.relpath(root, in_dir)
                    out_subdir = os.path.join(out_dir, relative_path)
                    os.makedirs(out_subdir, exist_ok=True)
                    output_path = os.path.join(out_subdir, file.replace(".jpg", ".npy").replace(".jpeg", ".npy").replace(".png", ".npy"))
                    np.save(output_path, processed_img)
                    print(f"Preprocessed and saved: {output_path}")

def main():
    # Define base directories
    base_dir = r"C:\zzz_project\AgriGuard\data"
    image_data_dir = os.path.join(base_dir, "image_data")
    processed_data_dir = os.path.join(base_dir, "processed_data")
    
    # List of subdirectories to process
    subdirs = ["pests", "lai", "progression"]
    
    # Preprocess each dataset
    for subdir in subdirs:
        in_dir = os.path.join(image_data_dir, subdir)
        out_dir = os.path.join(processed_data_dir, subdir)
        
        if not os.path.exists(in_dir):
            print(f"Warning: Input directory {in_dir} does not exist. Skipping.")
            continue
        
        print(f"Processing {subdir} dataset...")
        preprocess_dataset(in_dir, out_dir)
        print(f"Completed processing {subdir} dataset with {sum(len(files) for _, _, files in os.walk(out_dir))} files.\n")

if __name__ == "__main__":
    main()