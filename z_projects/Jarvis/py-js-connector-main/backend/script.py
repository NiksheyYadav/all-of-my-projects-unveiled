import sys
import json
import os
import base64
import tempfile
import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
import subprocess

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations for consistent results

def load_and_preprocess_image(image_path, img_size):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Failed to load image: {image_path}")
    img = cv2.resize(img, (img_size, img_size))
    img = img / 255.0
    img = img.reshape(1, img_size, img_size, 1)
    return img

def predict_classification(model, image_path, categories, img_size=224):
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

def load_model_safe(model_path, custom_objects=None):
    try:
        model = keras.models.load_model(model_path, custom_objects=custom_objects)
        # Suppress optimizer state warnings for inference
        model.compile()  # Ensure metrics are built for evaluation
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model from {model_path}: {str(e)}")

# Add logging for TensorFlow and Keras warnings
def log_warning(message):
    print(json.dumps({"warning": message}), flush=True)

# Add logging for debugging
def log_error(message):
    print(json.dumps({"error": message}), flush=True)

CLASSIFICATION_MODEL_PATH = "./models/classification_model.h5"
SEGMENTATION_MODEL_PATH = "./models/segmentation_model.h5"
XRAY_MODEL_PATH = "./models/xray_classification_model.keras"

class_names_mri = {0: "Glioma", 1: "Meninglioma", 2: "No Tumor", 3: "Pituitary Tumor"}
class_names_xray = {0: "Not Fractured", 1: "Fractured"}

def main():
    if len(sys.argv) < 2:
        log_error("Missing name argument")
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
        log_error(f"Failed to decode image: {str(e)}")
        sys.exit(1)

    tmp_fd, tmp_path = tempfile.mkstemp(suffix=".jpg")
    with os.fdopen(tmp_fd, 'wb') as f:
        f.write(img_bytes)

    try:
        if image_type == "xray":
            classification_model = load_model_safe(XRAY_MODEL_PATH)
            predicted_class, confidence, raw_prediction = predict_classification(classification_model, tmp_path, class_names_xray)
            segmentation_image_data = ""
        else:
            classification_model = load_model_safe(CLASSIFICATION_MODEL_PATH)
            predicted_class, confidence, raw_prediction = predict_classification(classification_model, tmp_path, class_names_mri)

            def dice_loss(y_true, y_pred):
                numerator = 2 * tf.reduce_sum(y_true * y_pred)
                denominator = tf.reduce_sum(y_true + y_pred)
                return 1 - numerator / (denominator + tf.keras.backend.epsilon())

            segmentation_model = load_model_safe(SEGMENTATION_MODEL_PATH, custom_objects={'dice_loss': dice_loss})
            original_img, predicted_mask, predicted_mask_binary = predict_segmentation(segmentation_model, tmp_path)
            mask_img = (predicted_mask_binary * 255).astype(np.uint8)
            ret, buf = cv2.imencode(".jpg", mask_img)
            segmentation_b64 = base64.b64encode(buf).decode("utf-8")
            segmentation_image_data = f"data:image/jpeg;base64,{segmentation_b64}"

        response = {
            "message": f"Hello, {name}! [{image_type.upper()}] Classified as: {predicted_class} with confidence {confidence:.2f}%.",
            "segmentationImage": segmentation_image_data
        }
        print(json.dumps(response), flush=True)  # Ensure valid JSON is printed
    except RuntimeError as e:
        log_error(str(e))
        sys.exit(1)
    except Exception as e:
        log_error(f"Unexpected error: {str(e)}")
        sys.exit(1)
    finally:
        os.remove(tmp_path)

if __name__ == "__main__":
    # Log TensorFlow and Keras warnings
    log_warning("TensorFlow oneDNN optimizations are enabled. To disable, set TF_ENABLE_ONEDNN_OPTS=0.")
    log_warning("Keras optimizer state is not loaded. This does not affect inference.")
    main()

app = Flask(__name__)

@app.route('/run-python', methods=['POST'])
def run_python():
    try:
        data = request.json
        name = data.get('name', 'User')
        image_data = data.get('imageData', '')
        image_type = data.get('imageType', 'mri')

        # Call the main script with the provided data
        process = subprocess.Popen(
            ['python', 'script.py', name, image_type],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate(input=image_data.encode())

        if process.returncode != 0:
            return jsonify({"error": stderr.decode()}), 500

        return jsonify(json.loads(stdout.decode()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Add a note about production server usage
    print("WARNING: This is a development server. Use a production WSGI server in production environments.", flush=True)
    app.run(host='0.0.0.0', port=3000)  # Ensure the server listens on all interfaces
