import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Dataset paths
base_dir = r"C:\z_projects\diagnosis\xray\dataset"
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')
test_dir = os.path.join(base_dir, 'test')

# Image settings
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

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

# Data preprocessing for validation and test sets (rescaling only)
datagen_val_test = ImageDataGenerator(rescale=1./255)

# Load datasets
train_generator = datagen_train.flow_from_directory(
    train_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

val_generator = datagen_val_test.flow_from_directory(
    val_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

test_generator = datagen_val_test.flow_from_directory(
    test_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False  # Keep order for evaluation
)

# Get class labels
class_indices = train_generator.class_indices
print("Class Labels:", class_indices)

# Example usage
if __name__ == "__main__":
    sample_images, sample_labels = next(train_generator)
    print("Sample batch shape:", sample_images.shape)
    print("Sample labels shape:", sample_labels.shape)
