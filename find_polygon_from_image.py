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


def calculate_edge_properties(polygon):
    edges = []
    N = len(polygon)
    for i in range(N):
        p1 = polygon[i]
        p2 = polygon[(i + 1) % N]  # Wrap-around at the last point
        edge_vector = p2 - p1
        edge_length = np.linalg.norm(edge_vector)
        edge_normal = np.array([-edge_vector[1], edge_vector[0]])  # Perpendicular to the edge
        edge_normal = edge_normal / np.linalg.norm(edge_normal)  # Normalize
        edges.append((edge_length, edge_normal))
    return edges
# Replace 'path_to_image.png' with your image file path
polygon_points = find_polygon_from_image('image.png')

edges = calculate_edge_properties(polygon_points)
# print(edges)