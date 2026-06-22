import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

# Set paths for the model and a sample input image (update as needed)
model_path = r"models/yolo_segmentation_model.h5"
image_path = r"processed_data/segmentation/sample.jpg"  # update with a valid image file

# Image parameters (should match training settings)
img_height, img_width = 256, 256

def load_and_preprocess_image(image_path):
    # Load image and check if image exists
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Image not found: {image_path}")
    # Resize image
    img = cv2.resize(img, (img_width, img_height))
    # Normalize and convert color from BGR to RGB
    img = img.astype(np.float32) / 255.0
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

def main():
    # Load the trained model
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully.")
    
    # Load and preprocess the input image
    image = load_and_preprocess_image(image_path)
    input_image = np.expand_dims(image, axis=0)  # add batch dimension
    
    # Get model prediction
    pred_mask = model.predict(input_image)[0]
    pred_mask = (pred_mask > 0.5).astype(np.uint8)  # threshold to binary mask
    
    # Display the original image and the predicted segmentation mask
    plt.figure(figsize=(12, 6))
    plt.subplot(1,2,1)
    plt.imshow(image)
    plt.title("Original Image")
    plt.axis("off")
    
    plt.subplot(1,2,2)
    plt.imshow(pred_mask[:,:,0], cmap="gray")
    plt.title("Predicted Segmentation")
    plt.axis("off")
    
    plt.show()

if __name__ == "__main__":
    main()
