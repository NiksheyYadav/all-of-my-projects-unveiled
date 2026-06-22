import tensorflow as tf
tf.config.threading.set_intra_op_parallelism_threads(16)
tf.config.threading.set_inter_op_parallelism_threads(16)
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.optimizers import AdamW
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import LearningRateScheduler
from tensorflow.keras import mixed_precision  # For mixed precision training
import os
from PIL import ImageFile
import matplotlib.pyplot as plt
ImageFile.LOAD_TRUNCATED_IMAGES = True  # Allow loading of truncated images

# Optional: Enable mixed precision training (uncomment if supported by your GPU)
mixed_precision.set_global_policy('float32')  # uncommented

# Dataset paths
base_dir = r"C:\z_projects\diagnosis\xray\dataset"
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')

# Image settings
IMG_SIZE = (224, 224)
BATCH_SIZE = 32  # increased from 16

# Data augmentation for training set
datagen_train = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

datagen_val = ImageDataGenerator(rescale=1./255)

# Load datasets with error handling
try:
    train_generator = datagen_train.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    val_generator = datagen_val.flow_from_directory(
        val_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    if train_generator.num_classes == 0 or val_generator.num_classes == 0:
        raise ValueError("No classes found in the dataset directories.")
except Exception as e:
    print(f"Error loading datasets: {e}")
    exit()

# Learning rate scheduler: Reduce by 0.9 every 5 epochs
def scheduler(epoch, lr):
    if epoch > 0 and epoch % 5 == 0:
        return lr * 0.9
    return lr

# Function to create and train a model
def create_and_train_model(model_name, num_classes, is_binary=False):
    # Load ResNet50 model (pretrained on ImageNet)
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Fine-tune: freeze only the first layers, unfreezing last 30 layers instead of 50
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    # Custom classification head with extra layer and adjusted dropout rates:
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.35)(x)  # adjusted dropout
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.25)(x)  # adjusted dropout
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)
    x = Dense(64, activation='relu')(x)  # extra layer added
    x = Dropout(0.2)(x)  # extra dropout layer
    output_layer = Dense(num_classes, activation='softmax')(x)
    loss_function = 'categorical_crossentropy'

    # Create final model
    model = Model(inputs=base_model.input, outputs=output_layer)

    # Compile model with a lower learning rate
    model.compile(
        optimizer=AdamW(learning_rate=0.00005),  # reduced learning rate
        loss=loss_function,
        metrics=['accuracy']
    )
    
    # Callbacks and training with increased epochs
    EPOCHS = 30  # increased epochs
    lr_callback = LearningRateScheduler(scheduler)
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        callbacks=[lr_callback]
    )

    # Save trained model
    model_save_path = r"C:\z_projects\diagnosis\xray\models\{}.keras".format(model_name)
    model.save(model_save_path)
    print(f"Model training complete! Saved as {model_save_path}")

    # Plot training history
    plt.plot(history.history['accuracy'], label='train_accuracy')
    plt.plot(history.history['val_accuracy'], label='val_accuracy')
    plt.title(f'{model_name} Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.show()

# Modify custom model function to use ResNet50 as the base model
def create_and_train_custom_model(model_name, num_classes, is_binary=False):
    # Load ResNet50 as the base model
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False  # Freeze the base model

    # Custom head modifications using ResNet50 as base:
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.4)(x)  # adjusted dropout
    x = Dense(128, activation='relu')(x)   # extra layer added
    x = Dropout(0.3)(x)   # adjusted dropout
    outputs = Dense(num_classes, activation='softmax')(x)
    loss_function = 'categorical_crossentropy'

    # Create final model
    model = Model(inputs=base_model.input, outputs=outputs)

    # Compile model with a lower learning rate
    model.compile(
        optimizer=AdamW(learning_rate=0.00005),  # reduced learning rate
        loss=loss_function,
        metrics=['accuracy']
    )

    # Train model with increased epochs
    lr_callback = LearningRateScheduler(scheduler)
    history = model.fit(
        train_generator,
        epochs=2,
        validation_data=val_generator,
        callbacks=[lr_callback]
    )

    # Save trained model
    model_save_path = r"C:\z_projects\diagnosis\xray\models\custom_{}.keras".format(model_name)
    model.save(model_save_path)
    print(f"Custom model training complete! Saved as {model_save_path}")

    # Plot training history
    plt.plot(history.history['accuracy'], label='train_accuracy')
    plt.plot(history.history['val_accuracy'], label='val_accuracy')
    plt.title(f'{model_name} Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.show()

def create_and_train_scratch_model(model_name, num_classes, is_binary=False):
    # Build a model from scratch
    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same')(inputs)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)

    x = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)

    x = tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)

    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(256, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.5)(x)
    x = tf.keras.layers.Dense(128, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.3)(x)

    if is_binary:
        outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)
        loss_function = 'binary_crossentropy'
    else:
        outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
        loss_function = 'categorical_crossentropy'

    model = tf.keras.Model(inputs, outputs)

    # Compile the model
    model.compile(
        optimizer=AdamW(learning_rate=0.0001),
        loss=loss_function,
        metrics=['accuracy']
    )

    # Train the model
    lr_callback = LearningRateScheduler(scheduler)
    history = model.fit(
        train_generator,
        epochs=30,
        validation_data=val_generator,
        callbacks=[lr_callback]
    )

    # Save the model
    model_save_path = r"C:\z_projects\diagnosis\xray\models\scratch_{}.keras".format(model_name)
    model.save(model_save_path)
    print(f"Scratch model training complete! Saved as {model_save_path}")

    # Plot training history
    plt.plot(history.history['accuracy'], label='train_accuracy')
    plt.plot(history.history['val_accuracy'], label='val_accuracy')
    plt.title(f'{model_name} Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.show()

if __name__ == '__main__':
    # Train fracture classification model (multi-class) using the existing custom head on ResNet50
    create_and_train_model("xray_fracture_classification_model", train_generator.num_classes, is_binary=False)

    # Train X-ray detection model (binary classification) using the existing ResNet50 model
    create_and_train_model("xray_detection_model", 2, is_binary=True)
    
    # Train custom CNN model (multi-class)
    create_and_train_custom_model("custom_xray_classification_model", train_generator.num_classes, is_binary=False)
    
    # Train a model from scratch
    create_and_train_scratch_model("scratch_xray_classification_model", train_generator.num_classes, is_binary=False)