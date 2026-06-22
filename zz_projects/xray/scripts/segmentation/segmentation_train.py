import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping, ModelCheckpoint

# Define paths
data_dir = os.path.abspath(r"processed_data/segmentation")  # Convert to absolute path
model_save_path = r"models/segmentation_model.h5"

# Image parameters
img_height = 224
img_width = 224
num_channels = 3  # RGB images

def load_npy(file_name):
    file_path = os.path.normpath(os.path.join(data_dir, file_name))  # normalized file path
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Required file {file_path} not found. Check your dataset path.")
    return np.load(file_path)

# Load preprocessed data using load_npy helper
x_train = load_npy('train_X.npy')
y_train = load_npy('train_Y.npy')
x_val   = load_npy('val_X.npy')
y_val   = load_npy('val_Y.npy')
x_test  = load_npy('test_X.npy')
y_test  = load_npy('test_Y.npy')

# Verify data is loaded
if x_train.size == 0 or y_train.size == 0:
    raise ValueError("Training data is empty.")
if x_val.size == 0 or y_val.size == 0:
    raise ValueError("Validation data is empty.")
if x_test.size == 0 or y_test.size == 0:
    raise ValueError("Test data is empty.")

# --- Added analysis code ---
print("=== Dataset Analysis ===")
print(f"Training samples: {x_train.shape[0]}")
print(f"Validation samples: {x_val.shape[0]}")
print(f"Test samples: {x_test.shape[0]}")

# Analyze FracAtlas folder utilities
fracatlas_utilities = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "FracAtlas", "Utilities")
)
print("\n=== FracAtlas Utilities Contents ===")
if os.path.exists(fracatlas_utilities):
    for root, dirs, files in os.walk(fracatlas_utilities):
        print(f"{root}: {files}")
else:
    print("FracAtlas Utilities folder not found.")

# Build a simple U-Net model
def unet_model(input_shape):
    inputs = layers.Input(shape=input_shape)
    # Encoder block 1
    c1 = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(inputs)
    c1 = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(c1)
    p1 = layers.MaxPooling2D((2, 2))(c1)
    
    # Encoder block 2
    c2 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(p1)
    c2 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(c2)
    p2 = layers.MaxPooling2D((2, 2))(c2)
    
    # Bottleneck
    c3 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(p2)
    c3 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c3)
    
    # Decoder block 1
    u2 = layers.UpSampling2D((2, 2))(c3)
    merge2 = layers.Concatenate()([u2, c2])
    c4 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(merge2)
    c4 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(c4)
    
    # Decoder block 2
    u1 = layers.UpSampling2D((2, 2))(c4)
    merge1 = layers.Concatenate()([u1, c1])
    c5 = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(merge1)
    c5 = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(c5)
    
    outputs = layers.Conv2D(1, (1, 1), activation='sigmoid')(c5)
    model = models.Model(inputs, outputs)
    return model

model = unet_model((img_height, img_width, num_channels))
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.summary()

# Define callbacks
callbacks = [
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6, verbose=1),
    EarlyStopping(monitor='val_loss', patience=10, verbose=1, restore_best_weights=True),
    ModelCheckpoint(filepath=model_save_path, monitor='val_accuracy', save_best_only=True, verbose=1)
]

# Train the model
history = model.fit(
    x_train, y_train,
    batch_size=32,
    epochs=150,
    validation_data=(x_val, y_val),
    callbacks=callbacks
)

# Evaluate on test data
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

# Save the trained model
model.save(model_save_path)
print(f"Segmentation model saved at {model_save_path}")
