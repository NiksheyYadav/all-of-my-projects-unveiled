import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import os

# Load the trained model
model_path = r"C:\z_projects\diagnosis\xray\models\xray_fracture_classification_model.keras"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found: {model_path}")
model = tf.keras.models.load_model(model_path)

# Dataset path
test_dir = r"C:\z_projects\diagnosis\xray\dataset\test"
# if not os.path.exists(test_dir):
#     raise FileNotFoundError(f"Test dataset directory not found: {test_dir}")

# Image settings
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# Data preprocessing (rescaling only, no augmentation)
datagen_test = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

# Load the test dataset
test_generator = datagen_test.flow_from_directory(
    test_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False  # Keep order for evaluation
)

# Get class labels
CLASS_NAMES = list(test_generator.class_indices.keys())

# Evaluate model
test_loss, test_accuracy = model.evaluate(test_generator)
print(f"\nTest Accuracy: {test_accuracy * 100:.2f}%")
print(f"Test Loss: {test_loss:.4f}")

# Predict on test set
y_pred_probs = model.predict(test_generator)
y_pred = np.argmax(y_pred_probs, axis=1)  # Convert probabilities to class indices
y_true = test_generator.classes  # True class labels

# Generate classification report
print("\nClassification Report:")
print(classification_report(y_true, y_pred, target_names=CLASS_NAMES))

# Confusion Matrix
conf_matrix = confusion_matrix(y_true, y_pred)

# Plot Confusion Matrix
plt.figure(figsize=(8, 6))
sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues",
            xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES)
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix")
plt.show()
