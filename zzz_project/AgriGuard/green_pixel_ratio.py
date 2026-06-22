# green pixel ratio

import cv2
import numpy as np
import os

def calculate_green_ratio(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower_green = np.array([35, 50, 50])
    upper_green = np.array([85, 255, 255])
    mask = cv2.inRange(img, lower_green, upper_green)
    green_pixels = cv2.countNonZero(mask)
    total_pixels = img.shape[0] * img.shape[1]
    ratio = (green_pixels / total_pixels) * 4
    return min(max(ratio, 0.1), 4.0)

lai_dir = r"C:\zzz_project\AgriGuard\data\image_data\lai"
for img_file in os.listdir(lai_dir):
    if img_file.endswith(".jpg"):
        lai = calculate_green_ratio(os.path.join(lai_dir, img_file))
        print(f"{img_file}: LAI = {lai:.2f}")