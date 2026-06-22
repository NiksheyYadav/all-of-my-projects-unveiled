import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_path, target_size=(224, 224), mean=None, std=None):
    """
    Preprocess an image for model prediction.

    Args:
        image_path (str): Path to the image file.
        target_size (tuple): Target size for resizing (width, height).
        mean (list or np.array): Mean values for normalization.
        std (list or np.array): Standard deviation values for normalization.

    Returns:
        np.array: Preprocessed image ready for model input.
    """
    try:
        # Load the image using PIL
        img = Image.open(image_path)
        
        # Convert to RGB if not already in RGB mode
        if img.mode == 'P':  # Palette mode
            img = img.convert('RGBA')
        elif img.mode != 'RGB':  # Other modes
            img = img.convert('RGB')
        
        # Resize the image
        img = img.resize(target_size)
        
        # Convert to NumPy array and normalize to [0, 1]
        img = np.array(img).astype('float32') / 255.0
        
        # Apply mean and std normalization if provided
        if mean is not None and std is not None:
            mean = np.array(mean)
            std = np.array(std)
            img = (img - mean) / std
        
        # Expand dimensions to match model input shape
        img = np.expand_dims(img, axis=0)
        return img
    except Exception as e:
        print(f"Error processing image: {e}")
        return None
