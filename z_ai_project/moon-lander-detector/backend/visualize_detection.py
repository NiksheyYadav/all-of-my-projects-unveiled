import matplotlib
matplotlib.use('TkAgg')

import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).resolve().parents[1]
sys.path.append(str(project_root))

import torch
from matplotlib import pyplot as plt
import cv2
import os
from backend.prediction_accuracy_graphs import plot_prediction_accuracy
from backend.image_processing import load_image
from backend.model_loader import load_model
from backend.inference import run_inference

# Load image
img_path = 'dataset/uploads/testmoon4.jpg'
img = load_image(img_path)

# Load model
model_path = 'dataset/best.pt'
model = load_model(model_path)

# Run inference
df = run_inference(model, img)

# Draw bounding boxes
for _, row in df.iterrows():
    x1, y1, x2, y2 = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
    label = row['name']
    confidence = row['confidence']
    
    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(img, f'{label} {confidence:.2f}', (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

# Convert BGR to RGB for matplotlib
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Show the image
# plt.figure(figsize=(10, 10))
# plt.imshow(img_rgb)
# plt.axis('off')
# plt.title('YOLOv5 Detection Output')
# plt.show(block=True)
# Show image using OpenCV window (not matplotlib)
cv2.imshow("Detection Output", img)
cv2.waitKey(0)          # Wait for any key to be pressed
cv2.destroyAllWindows() # Close window after key press
# Save the output image
output_path = 'dataset/outputs/testmoon1_output.webp'
cv2.imwrite(output_path, img)
# Print output path
print(f"Output saved to {output_path}")

# Generate prediction accuracy graph
accuracy_graph_path = 'dataset/outputs/prediction_accuracy_graph.png'
plot_prediction_accuracy(df, accuracy_graph_path)