import os
import sys
import cv2
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

# Define model path and default image path
model_path = r"models/fracture_classifier_custom.h5"
default_image_path = input("Enter image path: ")

# Image parameters (should match training)
img_height = 224
img_width = 224
num_channels = 3

def load_and_preprocess_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Image not found: {image_path}")
    img = cv2.resize(img, (img_width, img_height))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype(np.float32) / 255.0
    return img

def main():
    # Use user defined image path if provided
    image_path = sys.argv[1] if len(sys.argv) > 1 else default_image_path
    
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully.")
    
    image = load_and_preprocess_image(image_path)
    input_image = np.expand_dims(image, axis=0)
    
    # Make prediction
    prediction = model.predict(input_image)[0][0]
    pred_class = "Fracture Detected" if prediction > 0.5 else "No Fracture"
    print(f"Predicted class: {pred_class} (Probability: {prediction:.4f})")
    
    # Display image and prediction result
    plt.imshow(image)
    plt.title(f"Predicted Class: {pred_class} (Prob: {prediction:.4f})")
    plt.axis("off")
    plt.show()

if __name__ == "__main__":
    main()