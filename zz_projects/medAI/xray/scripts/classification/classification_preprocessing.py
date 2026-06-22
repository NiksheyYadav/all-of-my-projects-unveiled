import os
import cv2
import numpy as np
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split

print(cv2.__version__)
print(numpy.__version__)

# Set paths
data_dir = "xray/dataset/classification/train/"
categories = sorted(os.listdir(data_dir))  # Ensure consistent label ordering

# Parameters
IMG_SIZE = 224
num_classes = len(categories)

# Load images
data = []
labels = []
for idx, category in enumerate(categories):
    category_path = os.path.join(data_dir, category)
    for img_name in os.listdir(category_path):
        img_path = os.path.join(category_path, img_name)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is not None:
            img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
            data.append(img)
            labels.append(idx)

print("Total images loaded:", len(data))
print("Total labels loaded:", len(labels))


# Convert to NumPy arrays
data = np.array(data).reshape(-1, IMG_SIZE, IMG_SIZE, 1) / 255.0  # Normalize
labels = to_categorical(labels, num_classes)

# Split dataset into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(data, labels, test_size=0.2, random_state=42)

# Create a processed data directory if not exists
processed_dir = "xray/processed_data/classification"
os.makedirs(processed_dir, exist_ok=True)

# Save preprocessed data
np.save(os.path.join(processed_dir, "X_train.npy"), X_train)
np.save(os.path.join(processed_dir, "y_train.npy"), y_train)
np.save(os.path.join(processed_dir, "X_val.npy"), X_val)
np.save(os.path.join(processed_dir, "y_val.npy"), y_val)

print("Classification data preprocessed and saved successfully!")
# print("Number of training samples:", len(X_train))
# print("Number of validation samples:", len(X_val))
# print("Number of classes:", num_classes)
# print("Image size:", IMG_SIZE)
# print("Data shape:", X_train.shape, y_train.shape)
# print("Validation data shape:", X_val.shape, y_val.shape)
# print("Categories:", categories)
print("Detected categories:", categories)
print("Total classes detected:", num_classes)
print("Training samples shape:", X_train.shape, y_train.shape)
print("Validation samples shape:", X_val.shape, y_val.shape)
print("Shape of labels before categorical:", np.array(labels).shape)
print("Shape after categorical:", labels.shape)
