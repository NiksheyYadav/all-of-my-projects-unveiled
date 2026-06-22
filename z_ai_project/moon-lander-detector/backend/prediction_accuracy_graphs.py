import matplotlib.pyplot as plt
import pandas as pd

def plot_prediction_accuracy(df, output_path):
    """
    Plots prediction accuracy based on confidence levels.

    Args:
        df (pd.DataFrame): DataFrame containing detection results.
        output_path (str): Path to save the accuracy graph.
    """
    # Extract confidence levels
    confidence_levels = df['confidence']

    # Plot histogram of confidence levels
    plt.figure(figsize=(10, 6))
    plt.hist(confidence_levels, bins=10, color='blue', alpha=0.7)
    plt.title('Prediction Confidence Levels')
    plt.xlabel('Confidence')
    plt.ylabel('Frequency')
    plt.grid(True)

    # Save the plot
    plt.savefig(output_path)
    print(f"Accuracy graph saved to {output_path}")
