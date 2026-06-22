import pandas as pd
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
from datasets import Dataset
import os

# Load and preprocess dataset
def load_dataset():
    # Assuming Fake.csv and True.csv are downloaded from Kaggle
    fake = pd.read_csv('training/data/Fake.csv')
    true = pd.read_csv('training/data/True.csv')
    
    fake['label'] = 0
    true['label'] = 1
    data = pd.concat([fake, true], ignore_index=True)
    
    # Combine title and text
    data['text'] = data['title'] + ' ' + data['text']
    
    # Split into train and test
    train_data, test_data = train_test_split(data[['text', 'label']], test_size=0.2, random_state=42)
    train_data.to_csv('training/data/train.csv', index=False)
    test_data.to_csv('training/data/test.csv', index=False)
    
    return train_data, test_data

# Tokenize data
def tokenize_data(texts, tokenizer, max_length=512):
    return tokenizer(texts, padding=True, truncation=True, max_length=max_length, return_tensors='pt')

# Custom Dataset class
class NewsDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

# Main training function
def train_model():
    # Load data
    train_data, test_data = load_dataset()
    
    # Initialize tokenizer and model
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=2)
    
    # Tokenize datasets
    train_encodings = tokenize_data(train_data['text'].tolist(), tokenizer)
    test_encodings = tokenize_data(test_data['text'].tolist(), tokenizer)
    
    # Create datasets
    train_dataset = NewsDataset(train_encodings, train_data['label'].tolist())
    test_dataset = NewsDataset(test_encodings, test_data['label'].tolist())
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir='./training/results',
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./training/logs',
        logging_steps=10,
        eval_strategy='epoch',
        save_strategy='epoch',
        load_best_model_at_end=True,
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
    )
    
    # Train model
    trainer.train()
    
    # Save model
    model.save_pretrained('backend/models/distilbert_model')
    tokenizer.save_pretrained('backend/models/distilbert_model')
    
    return trainer

if __name__ == '__main__':
    train_model()