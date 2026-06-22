import sys
import json
import os
import base64
import tempfile
import threading
import time
import cv2
import csv
import numpy as np
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
from utils.preprocessing import preprocess_image

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logging

def load_and_preprocess_image(image_path, img_size):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Failed to load image: {image_path}")
    img = cv2.resize(img, (img_size, img_size))
    img = img / 255.0
    img = img.reshape(1, img_size, img_size, 1)
    return img

def predict_classification_xray(model, image_path, categories, img_size=224):
    processed_img = load_and_preprocess_image(image_path, img_size)
    prediction = model.predict(processed_img)
    predicted_class_idx = np.argmax(prediction, axis=1)[0]
    confidence = prediction[0][predicted_class_idx] * 100
    predicted_class = categories[predicted_class_idx]
    return predicted_class, confidence, prediction

def predict_classification_mri(model, image_path, categories, img_size=224):
    processed_img = load_and_preprocess_image(image_path, img_size)
    prediction = model.predict(processed_img)
    predicted_class_idx = np.argmax(prediction, axis=1)[0]
    confidence = prediction[0][predicted_class_idx] * 100
    predicted_class = categories[predicted_class_idx]
    return predicted_class, confidence, prediction

def predict_segmentation(model, image_path, threshold=0.1, img_size=256):
    processed_img = load_and_preprocess_image(image_path, img_size)
    predicted_mask = model.predict(processed_img)
    predicted_mask_binary = (predicted_mask > threshold).astype(np.uint8)
    predicted_mask_binary_2d = np.squeeze(predicted_mask_binary, axis=(0, 3))
    kernel = np.ones((3, 3), np.uint8)
    predicted_mask_binary_2d = cv2.dilate(predicted_mask_binary_2d, kernel, iterations=1)
    predicted_mask_binary_2d = cv2.erode(predicted_mask_binary_2d, kernel, iterations=1)
    predicted_mask_binary = predicted_mask_binary_2d.reshape(1, img_size, img_size, 1)
    return np.squeeze(load_and_preprocess_image(image_path, img_size)), np.squeeze(predicted_mask), np.squeeze(predicted_mask_binary)

# Function to make a prediction
def predict_image(image_path, model, class_names, img_size=224):
    processed_img = load_and_preprocess_image(image_path, img_size)
    image = preprocess_image(processed_img)
    prediction = model.predict(image)[0]  # Get prediction
    predicted_class = np.argmax(prediction)  # Get class index
    confidence = prediction[predicted_class] * 100  # Convert to percentage

    print(f"Prediction: {class_names[predicted_class]} ({confidence:.2f}%)")
    return class_names[predicted_class], confidence

def write_to_csv(response, confidence):
    try:
        csv_file = "record.csv"
        file_exists = os.path.isfile(csv_file)

        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=["user", "message", "confidence", "segmentationImage"])
            if not file_exists:
                writer.writeheader()
            writer.writerow({
                "user": response["user"],
                "message": response["message"],
                "confidence": confidence,
                "segmentationImage": response["segmentationImage"]
            })
    except Exception as e:
        sys.stderr.write(f"Error saving CSV: {e}\n")

MRI_MODEL_PATH = "./models/mri_model.h5"
CLASSIFICATION_MODEL_PATH = "./models/classification_model.h5"
SEGMENTATION_MODEL_PATH = "./models/segmentation_model.h5"
XRAY_MODEL_PATH = "./models/xray_detection_model.keras"
XRAY_CLASSIFICATION_MODEL_PATH = "./models/xray_classification_model.keras"
# XRAY_SEGMENTATION_MODEL_PATH = "./models/xray_segmentation_model.keras"

class_names_mri = {0: "Not MRI", 1: "MRI"}
class_names_mri_type = {0: "Glioma", 1: "Meninglioma", 2: "No Tumor", 3: "Pituitary Tumor"}
class_names_xray = {0: "Not XRAY", 1: "XRAY"}
class_names_xray_type = {0: "Not Fractured", 1: "Not Fractured", 2: "Fractured", 3: "Fractured"}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing name argument"}))
        sys.exit(1)

    name = sys.argv[1]
    image_type = sys.argv[2].lower() if len(sys.argv) >= 3 else "mri"

    # Read image data from stdin
    image_b64 = sys.stdin.read().strip()

    if image_b64.startswith("data:"):
        image_b64 = image_b64.split(",")[1]
    try:
        img_bytes = base64.b64decode(image_b64)
    except Exception as e:
        print(json.dumps({"error": f"Failed to decode image: {str(e)}"}))
        sys.exit(1)

    tmp_fd, tmp_path = tempfile.mkstemp(suffix=".jpg")
    with os.fdopen(tmp_fd, 'wb') as f:
        f.write(img_bytes)

    try:
        if image_type == "xray":

            # classification_isxray_model = tf.keras.models.load_model(XRAY_MODEL_PATH)
            # predicted_class, confidence = predict_image(tmp_path, classification_isxray_model, class_names_xray)
            
            # if predicted_class == "X-ray":
                # If it is an X-ray, predict fracture
            classification_model = keras.models.load_model(CLASSIFICATION_MODEL_PATH)
            predicted_class, confidence, raw_prediction = predict_classification_mri(classification_model, tmp_path, class_names_xray_type)

            # else:
            #     print("The provided image is not an X-ray.")

            segmentation_image_data = f"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/wAALCAEAAQABAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/AP5/6KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK/9k="
        else:
            classification_model = keras.models.load_model(CLASSIFICATION_MODEL_PATH)
            predicted_class, confidence, raw_prediction = predict_classification_mri(classification_model, tmp_path, class_names_mri_type)

            def dice_loss(y_true, y_pred):
                numerator = 2 * tf.reduce_sum(y_true * y_pred)
                denominator = tf.reduce_sum(y_true + y_pred)
                return 1 - numerator / (denominator + tf.keras.backend.epsilon())

            if(predicted_class == "No Tumor"):
                segmentation_image_data = f"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/wAALCAEAAQABAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/AP5/6KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK/9k="
            else:
                segmentation_model = keras.models.load_model(SEGMENTATION_MODEL_PATH, custom_objects={'dice_loss': dice_loss})
                original_img, predicted_mask, predicted_mask_binary = predict_segmentation(segmentation_model, tmp_path)
                mask_img = (predicted_mask_binary * 255).astype(np.uint8)
                ret, buf = cv2.imencode(".jpg", mask_img)
                segmentation_b64 = base64.b64encode(buf).decode("utf-8")
                segmentation_image_data = f"data:image/jpeg;base64,{segmentation_b64}"

            # # Define the memory location and file name
            # file_path = r"C:\Users\VINIT\Desktop\py-js-connector-main\backend\seg.txt"
            # # Write the variable to the file
            # with open(file_path, "w") as file:
            #     file.write(segmentation_b64)

            # print(f"{file_path}")

        response = {
            "user": f"{name}",
            "message": f"Hello, {name}! [{image_type.upper()}] Classified as: {predicted_class} with confidence {confidence:.2f}%.",
            "segmentationImage": segmentation_image_data
        }
        print(json.dumps(response), flush=True)  # Ensure valid JSON is printed

        # Save to CSV file
        # try:
            
        #     csv_file = "record.csv"
        #     file_exists = os.path.isfile(csv_file)

        #     with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
        #         writer = csv.DictWriter(file, fieldnames=["user", "message", "confidence", "segmentationImage"])
        #         if not file_exists:
        #             writer.writeheader()
        #         writer.writerow({
        #             "user": response["user"],
        #             "message": response["message"],
        #             "confidence": confidence,
        #             "segmentationImage": response["segmentationImage"]
        #         })
        # except Exception as e:
        #     # Log the error if needed, but continue to return the response
        #     sys.stderr.write(f"Error saving CSV: {e}\n")

    except Exception as e:
        print(json.dumps({"error": f"Error during processing: {str(e)}"}), flush=True)
    finally:
        os.remove(tmp_path)

if __name__ == "__main__":
    main()
