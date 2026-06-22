import torch
import torch.nn as nn
from torchvision import models, transforms
from torch.utils.data import DataLoader, Dataset

class FractureDetectionModel:
    def __init__(self, num_classes=2):
        self.device = torch.device("cpu")  # Force CPU usage
        self.model = models.resnet50(pretrained=True)
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)
        self.model = self.model.to(self.device)

    def train(self, train_loader, val_loader, epochs=10, lr=0.001):
        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=lr)

        for epoch in range(epochs):
            self.model.train()
            for images, labels in train_loader:
                images, labels = images.to(self.device), labels.to(self.device)
                optimizer.zero_grad()
                outputs = self.model(images)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()

            # Validation step
            self.model.eval()
            val_loss, correct = 0, 0
            with torch.no_grad():
                for images, labels in val_loader:
                    images, labels = images.to(self.device), labels.to(self.device)
                    outputs = self.model(images)
                    val_loss += criterion(outputs, labels).item()
                    correct += (outputs.argmax(1) == labels).sum().item()

            print(f"Epoch {epoch+1}/{epochs}, Validation Loss: {val_loss:.4f}, Accuracy: {correct / len(val_loader.dataset):.4f}")

    def save_model(self, path):
        torch.save(self.model.state_dict(), path)

    def load_model(self, path):
        self.model.load_state_dict(torch.load(path))
        self.model.eval()
