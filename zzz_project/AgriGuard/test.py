import torch
import torch.nn as nn
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns

# Define the PestCNN model
class PestCNN(nn.Module):
    def __init__(self):
        super(PestCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)  # Input: 3 channels (RGB)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(32 * 32 * 32, 128)  # Adjust based on 128x128 input
        self.fc2 = nn.Linear(128, 2)  # 2 classes: no_pest, pest
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(-1, 32 * 32 * 32)  # Flatten
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x

def test_model(model_path, test_image_paths):
    # Load the trained model
    model = PestCNN()
    model.load_state_dict(torch.load(model_path))
    model.eval()

    predictions = []
    confidences = []
    image_names = []

    # Make predictions for all test images
    with torch.no_grad():
        for img_path in test_image_paths:
            img = np.load(img_path).transpose(2, 0, 1)  # Change to CHW format
            img = torch.FloatTensor(img).unsqueeze(0)  # Add batch dimension
            output = model(img)
            probabilities = torch.softmax(output, dim=1)  # Get confidence scores
            prediction = torch.argmax(output, dim=1).item()
            confidence = probabilities[0, prediction].item()  # Confidence of the predicted class
            
            predictions.append(prediction)
            confidences.append(confidence)
            image_names.append(os.path.basename(img_path))
    
    return image_names, predictions, confidences

def plot_predictions(image_names, predictions, confidences):
    # Set style for better visualization
    sns.set_style("whitegrid")
    
    # Map predictions to labels
    labels = ["No Pest" if pred == 0 else "Pest" for pred in predictions]
    
    # Create a bar plot
    plt.figure(figsize=(12, 6))
    bars = plt.bar(range(len(image_names)), confidences, color=['green' if pred == 0 else 'red' for pred in predictions])
    plt.xticks(range(len(image_names)), image_names, rotation=45, ha="right")
    plt.xlabel("Image File")
    plt.ylabel("Confidence Score")
    plt.title("Pest Detection Predictions with Confidence Scores")
    plt.legend(bars, labels, title="Prediction", loc="upper right")
    
    # Add confidence values on top of bars
    for i, v in enumerate(confidences):
        plt.text(i, v + 0.01, f"{v:.2f}", ha="center", va="bottom")
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    # Define paths
    model_path = r"C:\zzz_project\AgriGuard\models\pest_model.pt"
    data_dir = r"C:\zzz_project\AgriGuard\data\processed_data\pests"
    
    # Collect a sample of test images from both subdirectories
    test_image_paths = []
    for subdir in ["no_pest", "pest"]:
        subdir_path = os.path.join(data_dir, subdir)
        if os.path.exists(subdir_path):
            images = [os.path.join(subdir_path, f) for f in os.listdir(subdir_path) if f.endswith(".npy")]
            test_image_paths.extend(images[:5])  # Take first 5 images from each subdirectory
    
    # Check if files exist
    if not os.path.exists(model_path):
        print(f"Error: Model file {model_path} not found.")
    elif not test_image_paths:
        print(f"Error: No test images found in {data_dir}.")
    else:
        image_names, predictions, confidences = test_model(model_path, test_image_paths)
        plot_predictions(image_names, predictions, confidences)