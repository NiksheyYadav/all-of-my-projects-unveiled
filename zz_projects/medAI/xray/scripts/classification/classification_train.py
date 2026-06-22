import tensorflow as tf
tf.config.threading.set_intra_op_parallelism_threads(16)
tf.config.threading.set_inter_op_parallelism_threads(16)
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Dense, Dropout, GlobalAveragePooling2D, BatchNormalization
from tensorflow.keras.optimizers import AdamW
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import LearningRateScheduler
from tensorflow.keras import mixed_precision
import os
from PIL import ImageFile
import matplotlib.pyplot as plt
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Enable mixed precision training
mixed_precision.set_global_policy('float32')

# Dataset paths
base_dir = r"C:\zz_projects\medAI\mri\xray-dataset\dataset"
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')

# Image settings
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# Learning rate scheduler: Reduce by 0.9 every 5 epochs
def scheduler(epoch, lr):
    if epoch > 0 and epoch % 5 == 0:
        return lr * 0.9
    return lr

# Function to create and train a custom CNN model
def create_and_train_model(model_name, num_classes, is_binary, train_generator, val_generator):
    # Input layer
    inputs = Input(shape=(224, 224, 3))

    # Custom CNN architecture
    x = Conv2D(32, (3, 3), activation='relu', padding='same')(inputs)
    x = BatchNormalization()(x)
    x = MaxPooling2D((2, 2))(x)  # 112x112

    x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x)
    x = MaxPooling2D((2, 2))(x)  # 56x56

    x = Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x)
    x = MaxPooling2D((2, 2))(x)  # 28x28

    x = Conv2D(256, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x)
    x = MaxPooling2D((2, 2))(x)  # 14x14

    # Global pooling and dense layers
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.4)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)

    # Output layer based on binary or multi-class
    if is_binary:
        outputs = Dense(1, activation='sigmoid')(x)
        loss_function = 'binary_crossentropy'
    else:
        outputs = Dense(num_classes, activation='softmax')(x)
        loss_function = 'categorical_crossentropy'

    # Create model
    model = Model(inputs=inputs, outputs=outputs)

    # Compile model
    model.compile(
        optimizer=AdamW(learning_rate=0.0001),
        loss=loss_function,
        metrics=['accuracy']
    )
    
    # Callbacks
    EPOCHS = 25
    lr_callback = LearningRateScheduler(scheduler)
    val_steps = min(20, val_generator.n // BATCH_SIZE)  # Dynamic validation steps
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        validation_steps=val_steps,
        callbacks=[lr_callback],
        workers=8,
        use_multiprocessing=False  # Changed to False to avoid pickling issues
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

if __name__ == '__main__':
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
            class_mode='categorical' if not train_dir.endswith('binary') else 'binary'
        )
        val_generator = datagen_val.flow_from_directory(
            val_dir,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='categorical' if not val_dir.endswith('binary') else 'binary'
        )
        if train_generator.num_classes == 0 or val_generator.num_classes == 0:
            raise ValueError("No classes found in the dataset directories.")
    except Exception as e:
        print(f"Error loading datasets: {e}")
        exit()

    # Train fracture classification model (multi-class)
    create_and_train_model("xray_fracture_classification_model", train_generator.num_classes, False, train_generator, val_generator)

    # Train X-ray detection model (binary classification)
    create_and_train_model("xray_detection_model", 2, True, train_generator, val_generator)