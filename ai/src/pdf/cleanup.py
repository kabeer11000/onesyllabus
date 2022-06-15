import cv2
import numpy as np


def pil_to_opencv(pil_image):
    # Convert RGB to BGR
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)


def clean_up_image(image):
    kernel = np.ones((1, 1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    image = cv2.erode(image, kernel, iterations=1)

    threshold = cv2.threshold(image, 120, 255, cv2.THRESH_BINARY)[1]
    threshold = cv2.threshold(threshold, 120, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C)[1]

    return threshold
