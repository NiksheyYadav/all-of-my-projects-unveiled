# Complete AI Framework Implementation Guide

## Table of Contents
1. Core Framework
2. Advanced Architectures
3. Practical Examples
4. Training Utilities
5. Deployment & Optimization
6. Best Practices

---

## 0. RECOMMENDED STARTER DATASET: FASHION-MNIST

**Fashion-MNIST** is the perfect dataset to test your NumPy-only AI framework:

- **What**: 70,000 grayscale images (60k train, 10k test) of clothing items, each $28 \times 28$ pixels, 10 balanced classes
- **Why it fits**:
  - Same shape as classic MNIST ($784$ features flattened, or $1 \times 28 \times 28$ for CNNs)
  - Available as a **single `.npz` file** (pure NumPy loading, no extra libraries)
  - Small enough for fast CPU training (~30 MB), challenging enough to validate regularization/optimizers
  - Tests both **Dense** (MLP) and **Conv2D** (CNN) architectures

### Download & Load (Pure NumPy + Standard Library)

```python
import numpy as np
from pathlib import Path
from urllib.request import urlretrieve

# Download Fashion-MNIST as single .npz file
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
npz_path = DATA_DIR / "fashion-mnist.npz"

if not npz_path.exists():
    print("Downloading Fashion-MNIST (~30 MB)...")
    urlretrieve(
        "https://storage.googleapis.com/tensorflow/tf-keras-datasets/fashion-mnist.npz",
        npz_path,
    )
    print("Download complete!")

# Load with NumPy
with np.load(npz_path) as data:
    X_train = data["x_train"].astype(np.float32) / 255.0  # (60000, 28, 28)
    y_train = data["y_train"]                             # (60000,)
    X_test = data["x_test"].astype(np.float32) / 255.0    # (10000, 28, 28)
    y_test = data["y_test"]                               # (10000,)

# Flatten for Dense layers
X_train_flat = X_train.reshape(len(X_train), -1)  # (60000, 784)
X_test_flat = X_test.reshape(len(X_test), -1)     # (10000, 784)

# One-hot encode labels
def one_hot(labels, num_classes=10):
    encoded = np.zeros((labels.size, num_classes), dtype=np.float32)
    encoded[np.arange(labels.size), labels] = 1.0
    return encoded

y_train_encoded = one_hot(y_train)
y_test_encoded = one_hot(y_test)

print(f"Train: {X_train_flat.shape}, Test: {X_test_flat.shape}")
```

### Example 1: MLP Classification

```python
# Build Dense network
model = Sequential()
model.add(Dense(784, 256, activation=ReLU()))
model.add(Dropout(0.3))
model.add(Dense(256, 64, activation=ReLU()))
model.add(Dense(64, 10, activation=Softmax()))

model.compile(optimizer=Adam(0.001), loss=CrossEntropyLoss())

# Train
history = model.fit(
    X_train_flat,
    y_train_encoded,
    epochs=10,
    batch_size=64,
    validation_data=(X_test_flat[:5000], y_test_encoded[:5000]),
)

# Evaluate
y_pred_test = np.argmax(model.predict(X_test_flat), axis=1)
metrics = MetricsCalculator.classification_metrics(y_test, y_pred_test)
print(f"Fashion-MNIST MLP Accuracy: {metrics['accuracy']:.3f}")
# Expected: ~88-90% accuracy
```

### Example 2: CNN Classification

```python
# Reshape for Conv2D: (N, channels, height, width)
X_train_cnn = X_train[:, None, :, :]  # (60000, 1, 28, 28)
X_test_cnn = X_test[:, None, :, :]    # (10000, 1, 28, 28)

# Build CNN
model = Sequential()
model.add(Conv2D(1, 32, kernel_size=3, stride=1, padding=1, activation=ReLU()))
model.add(Conv2D(32, 64, kernel_size=3, stride=2, padding=1, activation=ReLU()))
model.add(Flatten())
model.add(Dense(64 * 14 * 14, 128, activation=ReLU()))
model.add(Dropout(0.3))
model.add(Dense(128, 10, activation=Softmax()))

model.compile(optimizer=Adam(0.001), loss=CrossEntropyLoss())

# Train
history = model.fit(
    X_train_cnn,
    y_train_encoded,
    epochs=10,
    batch_size=32,
    validation_data=(X_test_cnn[:5000], y_test_encoded[:5000]),
)

# Evaluate
y_pred_test = np.argmax(model.predict(X_test_cnn), axis=1)
metrics = MetricsCalculator.classification_metrics(y_test, y_pred_test)
print(f"Fashion-MNIST CNN Accuracy: {metrics['accuracy']:.3f}")
# Expected: ~90-92% accuracy
```

**Class Labels**:
- 0: T-shirt/top
- 1: Trouser
- 2: Pullover
- 3: Dress
- 4: Coat
- 5: Sandal
- 6: Shirt
- 7: Sneaker
- 8: Bag
- 9: Ankle boot

---

## 1. CORE FRAMEWORK

### 1.1 Installation & Setup

```python
import numpy as np
import time

# All code uses only NumPy - no external dependencies!
```

### 1.2 Basic Model Creation

```python
# Create a simple feedforward network
model = Sequential()
model.add(Dense(784, 128, activation=ReLU()))
model.add(Dropout(0.2))
model.add(Dense(128, 64, activation=ReLU()))
model.add(Dense(64, 10, activation=Softmax()))

# Compile
model.compile(optimizer=Adam(0.001), loss=CrossEntropyLoss())

# Train
history = model.fit(X_train, y_train, epochs=50, batch_size=32,
                   validation_data=(X_val, y_val))

# Predict
predictions = model.predict(X_test)
```

---

## 2. ADVANCED ARCHITECTURES

### 2.1 Recurrent Neural Networks (RNN)

For sequence processing and time series:

```python
# Create RNN for sequence processing
rnn = RNN(input_size=10, hidden_size=32, output_size=1, sequence_length=20)

# Forward pass
outputs = rnn.forward(x_sequences)  # Shape: (seq_len, batch_size, output_size)
```

**Use cases:**
- Time series forecasting
- Language modeling
- Speech recognition (basic)

**Limitation:** Vanishing gradient problem with long sequences

### 2.2 Long Short-Term Memory (LSTM)

For long-term dependencies:

```python
# Create LSTM
lstm = LSTM(input_size=128, hidden_size=64, output_size=10, sequence_length=30)

# Forward pass
outputs, h_final, c_final = lstm.forward(x_sequences)
```

**Use cases:**
- Machine translation
- Speech recognition
- Text generation
- Sentiment analysis

**Advantages:**
- Handles long sequences better than RNN
- Better gradient flow with cell state

### 2.3 Convolutional Neural Networks (CNN)

For image processing:

```python
# Create CNN
model = Sequential()
model.add(Conv2D(1, 32, kernel_size=3, stride=1, padding=1, activation=ReLU()))
model.add(Conv2D(32, 64, kernel_size=3, stride=1, padding=1, activation=ReLU()))
model.add(Flatten())
model.add(Dense(128, 64, activation=ReLU()))
model.add(Dense(64, 10, activation=Softmax()))
```

**Use cases:**
- Image classification
- Object detection
- Image segmentation

### 2.4 Autoencoders

For unsupervised learning:

```python
# Create autoencoder
autoencoder = Autoencoder(input_size=784, encoding_dim=32)

# Forward pass (encode + decode)
x_reconstructed, latent = autoencoder.forward(x)

# Backward (training)
loss = autoencoder.backward(x, x_reconstructed, learning_rate=0.01)
```

**Use cases:**
- Dimensionality reduction
- Anomaly detection
- Feature learning
- Data denoising

### 2.5 Sequence-to-Sequence with Attention

For translation and summarization:

```python
# Create Seq2Seq model
seq2seq = Seq2SeqModel(vocab_size=5000, embedding_dim=128, 
                       hidden_size=64, max_length=20)

# Encode source
encoder_out, h, c = seq2seq.encode(source_seq)

# Decode with attention
decoder_out = seq2seq.decode_with_attention(target_seq, encoder_out, h, c)
```

**Use cases:**
- Machine translation
- Text summarization
- Image captioning
- Question answering

### 2.6 Multi-Task Learning

For learning multiple tasks simultaneously:

```python
# Create multi-task model
multitask = MultiTaskLearner(input_size=100, shared_hidden=64,
                            task1_output=1, task2_output=10)

# Forward pass
task1_pred, task2_pred, shared = multitask.forward(x)

# Loss: L_total = L_task1 + L_task2 + L_shared_regularization
```

**Benefits:**
- Shared representation learning
- Better generalization
- Reduced overfitting

---

## 3. PRACTICAL EXAMPLES

### 3.1 Time Series Forecasting

```python
# Prepare data
X_ts, y_ts = TimeSeriesPreprocessor.create_sequences(data, lookback=10)

# Normalize
X_norm, mean, std = TimeSeriesPreprocessor.normalize_timeseries(X_ts)

# Create and train model
lstm = LSTM(input_size=1, hidden_size=32, output_size=1, sequence_length=10)
predictions, h, c = lstm.forward(X_norm)

# Denormalize predictions
predictions_original = predictions * std + mean
```

### 3.2 Sentiment Analysis

```python
# Create pipeline
sentiment_model = SentimentAnalysisPipeline(
    vocab_size=5000,
    embedding_dim=128,
    hidden_size=64
)

# Forward pass
predictions = sentiment_model.forward(word_indices)  # (batch_size, 1)

# Predictions are probabilities (0-1)
```

### 3.3 Anomaly Detection

```python
# Create detector
detector = AnomalyDetectionPipeline(input_size=100, encoding_dim=20)

# Train on normal data
losses = detector.train(X_normal, epochs=10, learning_rate=0.1)

# Detect anomalies
anomalies, errors = detector.detect_anomalies(X_test)
```

### 3.4 Image Classification

```python
# Create CNN model
model = Sequential()
model.add(Conv2D(1, 32, kernel_size=3, stride=1, padding=1, activation=ReLU()))
model.add(Conv2D(32, 64, kernel_size=3, stride=1, padding=1, activation=ReLU()))
model.add(Flatten())
model.add(Dense(128, 64, activation=ReLU()))
model.add(Dense(64, 10, activation=Softmax()))

model.compile(optimizer=Adam(0.001), loss=CrossEntropyLoss())
model.fit(X_train_images, y_train_encoded, epochs=50, batch_size=32)
```

---

## 4. TRAINING UTILITIES

### 4.1 Learning Rate Scheduling

```python
# Exponential decay
lr = TrainingScheduler.exponential_decay(0.001, epoch, decay_rate=0.96)

# Step decay
lr = TrainingScheduler.step_decay(0.001, epoch, drop=0.5, epochs_drop=10)

# Cosine annealing
lr = TrainingScheduler.cosine_annealing(0.001, epoch, total_epochs=100)

# Warm-up + cosine
lr = TrainingScheduler.warm_up(0.001, epoch, warmup_epochs=10, total_epochs=100)
```

### 4.2 Callbacks

```python
# Early stopping
early_stop = EarlyStoppingCallback(monitor='val_loss', patience=10, min_delta=0.001)

for epoch in range(epochs):
    train_loss = train_step(model)
    val_loss = validate(model)
    
    should_stop, best_epoch = early_stop.step(val_loss, epoch)
    if should_stop:
        print(f"Stopped at epoch {epoch}, best was {best_epoch}")
        break

# Model checkpoint
checkpoint = ModelCheckpoint(monitor='val_loss', mode='min')

for epoch in range(epochs):
    val_loss = validate(model)
    best_weights = checkpoint.step(model, val_loss)
```

### 4.3 Metrics

```python
# Classification metrics
metrics = MetricsCalculator.classification_metrics(y_true, y_pred)
print(f"Accuracy: {metrics['accuracy']:.4f}")
print(f"F1-Score: {metrics['f1']:.4f}")

# Regression metrics
metrics = MetricsCalculator.regression_metrics(y_true, y_pred)
print(f"R² Score: {metrics['r2']:.4f}")
print(f"RMSE: {metrics['rmse']:.4f}")

# Confusion matrix
cm = MetricsCalculator.confusion_matrix(y_true, y_pred)
```

### 4.4 Data Augmentation

```python
# Gaussian noise
x_augmented = DataAugmentation.gaussian_noise(x, std=0.01)

# Mixup
x_mixed, y_mixed, lam = DataAugmentation.mixup(x1, x2, y1, y2, alpha=0.2)

# Random flip
x_flipped = DataAugmentation.random_flip(x, axis=1)

# Rotation
x_rotated = DataAugmentation.rotation(x, max_angle=30)
```

### 4.5 Ensemble Methods

```python
# Create ensemble
ensemble = EnsembleModel([model1, model2, model3], method='weighted')

# Set weights
ensemble.set_weights([0.5, 0.3, 0.2])

# Predict
predictions = ensemble.predict(X_test)
```

### 4.6 Hyperparameter Search

```python
# Define parameter grid
param_grid = {
    'learning_rate': [0.001, 0.01, 0.1],
    'hidden_size': [32, 64, 128],
    'dropout': [0.1, 0.2, 0.3]
}

# Grid search
search = HypersweepSearch(param_grid, search_type='grid')

def train_fn(params):
    # Create and train model with params
    model = Sequential()
    # ... build model with params['hidden_size'], etc.
    train_loss = model.fit(...)
    val_loss = model.evaluate(...)
    return train_loss, val_loss

best_result = search.grid_search(train_fn, validation_fn)
```

---

## 5. DEPLOYMENT & OPTIMIZATION

### 5.1 Performance Optimization

**Vectorization:**
- Use NumPy operations instead of loops
- ~100-1000x faster

**Mini-batch Training:**
- Typical batch size: 32, 64, 128
- Larger batches = faster but less frequent updates

**Optimizers:**
- Adam: Best for most cases (faster convergence)
- SGD: Simpler, sometimes better generalization
- RMSprop: Good for RNNs

**Mixed Precision:**
```python
# Can use float16 for faster computation (if NumPy supports)
# Implementation requires custom precision handling
```

### 5.2 Model Serialization

```python
# Save model weights
import json

def save_model(model, filepath):
    weights = {}
    for i, layer in enumerate(model.layers):
        if hasattr(layer, 'params'):
            weights[f'layer_{i}'] = {
                k: v.tolist() for k, v in layer.params.items()
            }
    
    with open(filepath, 'w') as f:
        json.dump(weights, f)

# Load model weights
def load_model(model, filepath):
    with open(filepath, 'r') as f:
        weights = json.load(f)
    
    for i, layer in enumerate(model.layers):
        if hasattr(layer, 'params'):
            for k, v in weights[f'layer_{i}'].items():
                layer.params[k] = np.array(v)
```

### 5.3 Inference Optimization

```python
# Remove dropout during inference
class InferenceMode:
    def __init__(self, model):
        self.model = model
        self.training_mode = True
    
    def __enter__(self):
        self.training_mode = True
        return self
    
    def __exit__(self, *args):
        self.training_mode = False
    
    def predict(self, x):
        # Use forward without dropout
        output = x
        for layer in self.model.layers:
            if isinstance(layer, Dropout):
                output = layer.forward(output, training=False)
            else:
                output = layer.forward(output)
        return output
```

---

## 6. BEST PRACTICES

### 6.1 Data Preprocessing

```python
# Always normalize/standardize
X_train_norm = (X_train - np.mean(X_train, axis=0)) / np.std(X_train, axis=0)
X_test_norm = (X_test - np.mean(X_train, axis=0)) / np.std(X_train, axis=0)

# Use same statistics for train and test!

# One-hot encode categorical
y_encoded = one_hot_encode(y)
```

### 6.2 Training Best Practices

```python
# 1. Start with simple baseline
# 2. Use validation set for monitoring
# 3. Apply regularization (dropout, L1/L2)
# 4. Use appropriate learning rate
# 5. Monitor training/validation loss
# 6. Use early stopping
# 7. Try data augmentation
# 8. Ensemble multiple models
```

### 6.3 Debugging Tips

| Problem | Solution |
|---------|----------|
| Loss NaN | Reduce learning rate, clip gradients |
| Loss not decreasing | Check data normalization, increase capacity |
| Overfitting | Add dropout, regularization, more data |
| Underfitting | Increase model capacity, reduce regularization |
| Slow training | Use better optimizer (Adam), larger batch size |

### 6.4 Memory Management

```python
# Process in batches for large datasets
def train_epoch(model, X, y, batch_size=32):
    losses = []
    for i in range(0, len(X), batch_size):
        X_batch = X[i:i+batch_size]
        y_batch = y[i:i+batch_size]
        loss = model.train_step(X_batch, y_batch)
        losses.append(loss)
    return np.mean(losses)
```

---

## 7. QUICK REFERENCE

### Activation Functions
- ReLU: Hidden layers
- Sigmoid: Binary classification
- Softmax: Multi-class classification
- Tanh: RNN/LSTM

### Loss Functions
- MSE: Regression
- Cross-Entropy: Classification
- Binary Cross-Entropy: Binary classification

### Optimizers
- Adam: Default choice (fast, reliable)
- SGD: Simple, sometimes better generalization
- RMSprop: RNNs, non-stationary problems

### Architectures
- CNN: Images
- RNN/LSTM: Sequences
- Autoencoder: Unsupervised
- Seq2Seq: Translation/Summarization
- Multi-task: Multiple objectives

---

## 8. ADVANCED TOPICS

### 8.1 Custom Loss Functions

```python
class CustomLoss(Loss):
    def compute(self, y_true, y_pred):
        # Your custom loss computation
        return loss_value
    
    def backward(self, y_true, y_pred):
        # Your custom gradient
        return gradient
```

### 8.2 Custom Layers

```python
class CustomLayer(Layer):
    def forward(self, x):
        # Your forward pass
        return output
    
    def backward(self, grad_output):
        # Your backward pass
        return grad_input
```

### 8.3 Custom Training Loop

```python
def custom_training_loop(model, X, y, epochs, optimizer):
    for epoch in range(epochs):
        y_pred = model.forward(X)
        loss = model.loss_fn.compute(y, y_pred)
        
        grad = model.loss_fn.backward(y, y_pred)
        model.backward(grad)
        
        for layer in model.layers:
            if hasattr(layer, 'params'):
                optimizer.update(layer.params, layer.grads)
        
        print(f"Epoch {epoch}, Loss: {loss:.4f}")
```

---

## CONCLUSION

This framework provides:
- ✓ All fundamental neural network components
- ✓ Advanced architectures (RNN, LSTM, CNN, Attention)
- ✓ Complete training utilities
- ✓ Production-ready code
- ✓ Full control and transparency

Perfect for:
- Learning deep learning fundamentals
- Prototyping new ideas
- Building custom architectures
- Educational purposes
- Medium-scale applications

For extreme performance, consider:
- GPU frameworks (TensorFlow, PyTorch)
- Specialized hardware
- Production deployment systems
