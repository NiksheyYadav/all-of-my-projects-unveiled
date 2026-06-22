# AgriGuard Day 1 Progress Report - April 10, 2025

## Overview
Day 1 focused on setting up the project environment, collecting and organizing raw data, and preprocessing it for the AgriGuard hackathon project. The goal was to prepare datasets for pest detection, LAI estimation, and progression tracking.

## Tasks Completed

### 1. Directory Structure Setup
- Created the main project directory structure under `C:\zzz_project\AgriGuard\`.
- Established key directories:
  - `data/image_data/` (with subdirectories: `lai/`, `pests/`, `progression/`)
  - `data/processed_data/` (with subdirectories: `lai/`, `pests/`, `progression/`)
  - `models/`, `output/`, `scripts/`, and root files (`main.py`, `dashboard.py`, `README`, `requirements.txt`).
- Adjusted `pests/` to include `no_pest/` and `pest/` subdirectories for binary classification.

### 2. Data Collection and Population
- **Pests Dataset:**
  - Populated `data/image_data/pests/pest/` with ~300 images from the PlantVillage dataset (e.g., blight, spot, rot categories).
  - Initially, `data/image_data/pests/no_pest/` was empty; later planned to add ~300 healthy images.
- **LAI Dataset:**
  - Moved ~300 leaf images to `data/image_data/lai/` from PlantVillage (healthy categories).
  - Calculated proxy LAI values using `green_pixel_ratio.py` (pending full label generation).
- **Progression Dataset:**
  - Moved ~20 base images to `data/image_data/progression/` (e.g., `seq1_1.jpg` to `seq20_1.jpg`).
  - Planned to create ~40-80 additional images for sequences (e.g., `seqX_2.jpg`, `seqX_3.jpg`), but this is incomplete (pending manual or synthetic editing).

### 3. Preprocessing
- Developed and ran `preprocess.py` to process all datasets.
- Converted raw images to 128x128, normalized to [0, 1], and saved as `.npy` files in `data/processed_data/`:
  - `pests/pest/`: ~300 `.npy` files.
  - `pests/no_pest/`: 0 `.npy` files (empty subdirectory noted).
  - `lai/`: ~300 `.npy` files.
  - `progression/`: ~20 `.npy` files (base images only).
- Handled subdirectory structure for `pests/` (`no_pest/`, `pest/`) in `processed_data/`.

### 4. Additional Tools
- Created `green_pixel_ratio.py` to estimate LAI via green pixel analysis, though labels are not yet saved to a file.
- Developed supporting scripts (`move_files.py`, etc.) for data organization.

## Outstanding Tasks
- Populate `data/image_data/pests/no_pest/` with ~300 healthy images (e.g., using `move_no_pests_images.py` or `copy_lai_to_no_pests.py`).
- Complete progression sequences by editing base images into 2-3 stages (e.g., using GIMP/Photopea or synthetic script).
- Generate and save LAI labels to `data/lai_labels.csv` using `green_pixel_ratio.py`.

## Notes
- Preprocessing confirmed successful for available data.
- Next steps: Train pest detection model (Day 2) and address outstanding data tasks.

## Total Time Spent
- ~7 hours (estimated based on outlined timeline).
