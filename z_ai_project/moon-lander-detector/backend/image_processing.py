import cv2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_image(img_path):
    """
    Loads an image from the given path.

    Args:
        img_path (str): Path to the image file.

    Returns:
        numpy.ndarray: Loaded image.
    """
    logging.info(f"Attempting to load image from path: {img_path}")
    img = cv2.imread(img_path)
    if img is None:
        logging.error(f"Failed to load image from path: {img_path}")
        raise FileNotFoundError(f"Image not found or cannot be read: {img_path}")
    logging.info(f"Successfully loaded image from path: {img_path}")
    return img
