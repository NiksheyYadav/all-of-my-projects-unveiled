import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import json
import os

# Load training logs
def load_logs():
    log_files = [f for f in os.listdir('training/logs') if f.endswith('.log')]
    logs = []
    for log_file in log_files:
        with open(f'training/logs/{log_file}', 'r') as f:
            for line in f:
                logs.append(json.loads(line))
    return pd.DataFrame(logs)

# Plot metrics
def plot_metrics():
    logs = load_logs()
    
    # Plot loss
    plt.figure(figsize=(10, 5))
    sns.lineplot(data=logs, x='epoch', y='loss', label='Training Loss')
    sns.lineplot(data=logs, x='epoch', y='eval_loss', label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.savefig('training/loss_plot.png')
    plt.close()
    
    # Plot accuracy (if available)
    if 'eval_accuracy' in logs.columns:
        plt.figure(figsize=(10, 5))
        sns.lineplot(data=logs, x='epoch', y='eval_accuracy', label='Validation Accuracy')
        plt.title('Validation Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        plt.savefig('training/accuracy_plot.png')
        plt.close()

if __name__ == '__main__':
    plot_metrics()