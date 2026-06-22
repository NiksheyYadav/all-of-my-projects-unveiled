import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import os
import numpy as np
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Define the CNN model
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

# Custom Dataset
class PestDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir
        self.transform = transform
        self.image_paths = []
        self.labels = []
        
        for label, subdir in enumerate(["no_pest", "pest"]):
            subdir_path = os.path.join(data_dir, subdir)
            print(f"Checking subdirectory: {subdir_path}")
            if os.path.exists(subdir_path):
                for file in os.listdir(subdir_path):
                    if file.endswith(".npy"):
                        self.image_paths.append(os.path.join(subdir_path, file))
                        self.labels.append(label)
                print(f"Found {len(os.listdir(subdir_path))} .npy files in {subdir}")
            else:
                print(f"Warning: Subdirectory {subdir_path} does not exist.")
        
        print(f"Loaded {len(self.image_paths)} images with labels: {np.unique(self.labels, return_counts=True)}")
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        img = np.load(self.image_paths[idx]).transpose(2, 0, 1)  # Change to CHW format for PyTorch
        img = torch.FloatTensor(img)
        label = torch.LongTensor([self.labels[idx]])
        return img, label

# Training function with tracking
def train_model(model, train_loader, val_loader, criterion, optimizer, num_epochs=50):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    train_losses = []
    val_losses = []
    val_accuracies = []
    
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device).squeeze()
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
        
        # Calculate training loss
        train_loss = running_loss / len(train_loader)
        train_losses.append(train_loss)
        
        # Validation
        model.eval()
        val_loss = 0.0
        correct = 0
        total = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device).squeeze()
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        val_loss = val_loss / len(val_loader)
        val_accuracy = 100 * correct / total
        val_losses.append(val_loss)
        val_accuracies.append(val_accuracy)
        
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {train_loss:.4f}, Val Accuracy: {val_accuracy:.2f}%")
    
    # Plot learning curves
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(range(1, num_epochs + 1), train_losses, label='Training Loss')
    plt.plot(range(1, num_epochs + 1), val_losses, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('Training and Validation Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(range(1, num_epochs + 1), val_accuracies, label='Validation Accuracy', color='green')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy (%)')
    plt.title('Validation Accuracy')
    plt.legend()
    
    plt.tight_layout()
    plt.show()
    
    return model

def main():
    # Define data directory
    data_dir = r"C:\zzz_project\AgriGuard\data\processed_data\pests"
    
    # Load dataset
    dataset = PestDataset(data_dir)
    if len(dataset) == 0:
        print("Error: No images loaded. Check directory and subdirectories.")
        return
    
    # Split dataset
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        dataset.image_paths, dataset.labels, test_size=0.2, stratify=dataset.labels, random_state=42
    )
    
    # Create subsets for training and validation
    class DatasetSubset(Dataset):
        def __init__(self, paths, labels, transform=None):
            self.paths = paths
            self.labels = labels
            self.transform = transform
        
        def __len__(self): return len(self.paths)
        def __getitem__(self, idx): 
            img = np.load(self.paths[idx]).transpose(2, 0, 1)
            img = torch.FloatTensor(img)
            return img, torch.LongTensor([self.labels[idx]]).squeeze()
    
    train_dataset = DatasetSubset(train_paths, train_labels)
    val_dataset = DatasetSubset(val_paths, val_labels)
    
    # DataLoader
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=16)
    
    # Initialize model, criterion, and optimizer
    model = PestCNN()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Train with visualization
    model = train_model(model, train_loader, val_loader, criterion, optimizer)
    
    # Save model
    torch.save(model.state_dict(), r"C:\zzz_project\AgriGuard\models\pest_model.pt")
    print("Model saved to models/pest_model.pt")

if __name__ == "__main__":
    main()