from PIL import Image
import numpy as np

def preprocess_image(image_path):
    img = Image.open(image_path)
    if img.mode == 'P':
        img = img.convert('RGBA')
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img
