import cv2
import numpy as np

def find_polygon_from_image(image_path):
    # Load image
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

    # Check if image is loaded properly
    if image is None:
        print("Error loading image")
        return None

    # Extract alpha channel
    alpha_channel = image[:, :, 3]

    # Threshold the alpha channel
    _, thresh = cv2.threshold(alpha_channel, 0, 255, cv2.THRESH_BINARY)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Assume largest contour is the main figure
    main_contour = max(contours, key=cv2.contourArea)

    # Approximate the contour to polygon
    epsilon = 0.005 * cv2.arcLength(main_contour, True)
    polygon = cv2.approxPolyDP(main_contour, epsilon, True)

    # Print or return polygon points
    print("Polygon Points:", polygon[:, 0, :])
    return polygon[:, 0, :]

polygon_points = find_polygon_from_image('image.png')

