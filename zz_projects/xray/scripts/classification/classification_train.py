import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt
import os

# Define paths
processed_data_dir = r"C:\zzz_project\xray\processed_data\classification"
model_save_path = r"models/fracture_classifier_custom.h5"

# Image parameters
img_height = 224
img_width = 224
num_channels = 3  # RGB images
batch_size = 32

# Load preprocessed data
x_train = np.load(os.path.join(processed_data_dir, 'X_train.npy'))
y_train = np.load(os.path.join(processed_data_dir, 'y_train.npy'))
x_val = np.load(os.path.join(processed_data_dir, 'X_val.npy'))
y_val = np.load(os.path.join(processed_data_dir, 'y_val.npy'))
x_test = np.load(os.path.join(processed_data_dir, 'X_test.npy'))
y_test = np.load(os.path.join(processed_data_dir, 'y_test.npy'))

# Verify that the loaded data is not empty
if x_train.size == 0 or y_train.size == 0:
    raise ValueError("Training data is empty. Please check the preprocessing step.")
if x_val.size == 0 or y_val.size == 0:
    raise ValueError("Validation data is empty. Please check the preprocessing step.")
if x_test.size == 0 or y_test.size == 0:
    raise ValueError("Test data is empty. Please check the preprocessing step.")

# Shuffle training data
shuffle_indices = np.random.permutation(len(x_train))
x_train = x_train[shuffle_indices]
y_train = y_train[shuffle_indices]

# Verify shapes
print(f"Training data shape: {x_train.shape}, Labels shape: {y_train.shape}")
print(f"Validation data shape: {x_val.shape}, Labels shape: {y_val.shape}")
print(f"Test data shape: {x_test.shape}, Labels shape: {y_test.shape}")

# Build a custom CNN from scratch
model = models.Sequential([
    # First Convolutional Block
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(img_height, img_width, num_channels), padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    
    # Second Convolutional Block
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    
    # Third Convolutional Block
    layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    
    # Flatten and Dense Layers
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')  # Binary output
])

# Compile the model
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Model summary
model.summary()

# Train the model
history = model.fit(
    x_train,
    y_train,
    batch_size=batch_size,
    epochs=150,  # Increased epochs for a custom model
    validation_data=(x_val, y_val)
)

# Evaluate on test set
test_loss, test_accuracy = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_accuracy:.4f}")

# Plot training results
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.show()

# Save the model
model.save(model_save_path)
print(f"Model saved successfully at {model_save_path}")