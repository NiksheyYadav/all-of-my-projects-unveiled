import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping, ModelCheckpoint

# Define the data directory (absolute path) and model save path
data_dir = os.path.abspath(r"processed_data/segmentation")
model_save_path = r"models/yolo_segmentation_model.h5"

# Image parameters
img_height = 256  # to match preprocessing
img_width = 256
num_channels = 3

def load_npy(file_name):
    file_path = os.path.normpath(os.path.join(data_dir, file_name))
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Required file {file_path} not found.")
    return np.load(file_path)

# Load preprocessed data
x_train = load_npy('train_X.npy')
y_train = load_npy('train_Y.npy')
x_val   = load_npy('val_X.npy')
y_val   = load_npy('val_Y.npy')
x_test  = load_npy('test_X.npy')
y_test  = load_npy('test_Y.npy')

# Simple check on dataset sizes
print(f"Train samples: {x_train.shape[0]}, Validation: {x_val.shape[0]}, Test: {x_test.shape[0]}")

# Define a YOLO-inspired segmentation model
def yolo_segmentation_model(input_shape):
    inputs = layers.Input(shape=input_shape)
    
    # Backbone: several YOLO-like conv blocks
    # Block 1
    x = layers.Conv2D(32, (3,3), strides=1, padding='same', activation='relu')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2,2))(x)
    
    # Block 2
    x = layers.Conv2D(64, (3,3), strides=1, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2,2))(x)
    
    # Block 3
    x = layers.Conv2D(128, (3,3), strides=1, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2,2))(x)
    
    # Block 4
    x = layers.Conv2D(256, (3,3), strides=1, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    # No pooling here - retain spatial info
    
    # Decoder: upsample to original resolution
    x = layers.UpSampling2D((2,2))(x)
    x = layers.Conv2D(128, (3,3), padding='same', activation='relu')(x)
    x = layers.UpSampling2D((2,2))(x)
    x = layers.Conv2D(64, (3,3), padding='same', activation='relu')(x)
    x = layers.UpSampling2D((2,2))(x)
    x = layers.Conv2D(32, (3,3), padding='same', activation='relu')(x)
    
    # Final segmentation output
    outputs = layers.Conv2D(1, (1,1), activation='sigmoid')(x)
    
    model = models.Model(inputs, outputs)
    return model

model = yolo_segmentation_model((img_height, img_width, num_channels))
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.summary()

# Callbacks for training
callbacks = [
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6, verbose=1),
    EarlyStopping(monitor='val_loss', patience=10, verbose=1, restore_best_weights=True),
    ModelCheckpoint(filepath=model_save_path, monitor='val_accuracy', save_best_only=True, verbose=1)
]

# Train the model
history = model.fit(
    x_train, y_train,
    batch_size=16,
    epochs=100,
    validation_data=(x_val, y_val),
    callbacks=callbacks
)

# Evaluate the model
test_loss, test_accuracy = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_accuracy:.4f}")

# Plot training results
plt.figure(figsize=(12, 4))
plt.subplot(1,2,1)
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Val Accuracy')
plt.title('Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1,2,2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.show()

# Save the trained model
model.save(model_save_path)
print(f"YOLO segmentation model saved at {model_save_path}")
