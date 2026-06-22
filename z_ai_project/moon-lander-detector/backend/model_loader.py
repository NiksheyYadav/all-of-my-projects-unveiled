import torch

def load_model(model_path):
    """
    Loads a YOLOv5 model from the given path.

    Args:
        model_path (str): Path to the model file.

    Returns:
        torch.nn.Module: Loaded YOLOv5 model.
    """
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=True)
    return model
