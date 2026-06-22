import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_path):
    img = Image.open(image_path)  # Read the image using PIL
    if img.mode == 'P':  # Check if the image is in palette mode
        img = img.convert('RGBA')  # Convert to RGBA
    img = img.resize((224, 224))  # Resize to model input size
    img = np.array(img) / 255.0  # Normalize
    img = np.expand_dims(img, axis=0)  # Expand dimensions for model input
    return img
