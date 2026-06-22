import cv2

def run_inference(model, img):
    """
    Runs inference on the given image using the YOLOv5 model.

    Args:
        model (torch.nn.Module): YOLOv5 model.
        img (numpy.ndarray): Image to run inference on.

    Returns:
        pandas.DataFrame: Detection results.
    """
    results = model(img)
    return results.pandas().xyxy[0]
