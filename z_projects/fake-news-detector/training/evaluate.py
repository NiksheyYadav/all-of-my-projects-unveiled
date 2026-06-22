import pandas as pd
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from sklearn.metrics import accuracy_score, f1_score
from datasets import Dataset

# Load test data
def load_test_data():
    return pd.read_csv('training/data/test.csv')

# Evaluate model
def evaluate_model():
    # Load model and tokenizer
    tokenizer = DistilBertTokenizer.from_pretrained('backend/models/distilbert_model')
    model = DistilBertForSequenceClassification.from_pretrained('backend/models/distilbert_model')
    
    # Load test data
    test_data = load_test_data()
    
    # Tokenize test data
    encodings = tokenizer(test_data['text'].tolist(), padding=True, truncation=True, max_length=512, return_tensors='pt')
    
    # Predict
    model.eval()
    with torch.no_grad():
        outputs = model(**{k: v for k, v in encodings.items()})
        predictions = torch.argmax(outputs.logits, dim=1).numpy()
    
    # Compute metrics
    accuracy = accuracy_score(test_data['label'], predictions)
    f1 = f1_score(test_data['label'], predictions)
    
    print(f'Accuracy: {accuracy:.4f}')
    print(f'F1 Score: {f1:.4f}')
    
    return accuracy, f1

if __name__ == '__main__':
    evaluate_model()