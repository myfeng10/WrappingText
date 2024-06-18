# Introduction

The overall plan for this project is laid out, but this repository only provides the key service: using the demo picture to reach the desired format. Currently, the image is hard-coded, but with slight modifications, it could be applied to different images. That's future work. Below is an overview of the project requirements and the development plan.

The goal of this project is to code out the image as the way we want, this is the demo and this is how it actually turns out:

![Example Image](./images/goal.png)
![Example Image](./images/polygon3.png)


# Technical Projection Requirements


## Overall


- **Frontend**: Next.js with TypeScript
- **Backend**: Next.js API routes
- **Database**: MongoDB for User info, Firebase for image
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Third Party APIs**: 
  - remove.bg (background removal)
  - OpenAI (generate text)
  - Google Cloud Vision API (face detection)
  - PixiJS (for additional font)

## Key Features

### Image Upload

#### Key Functions
- **File Upload and Crop Interface**
  - Image Upload with Preview
  - Image Upload and Crop

- **File Validation**
  - Ensure the Existence of Human Figures
  - Google Cloud Vision API (Face Detection)

#### Services Needed
- **Cloud Storage**: Store the processed images in a cloud service
  - Google Cloud Service (Firebase)

- **Database**: Store and manage user-related data and image metadata
  - MongoDB

### Background Removal

#### Key Functions + Services Needed
- **API Service**: Remove the background
  - remove.bg

### Text Wrapping

#### Key Functions
- **Deciding the Style**
  - Default Style: Same style as the example below
  - Customize Style: Choose font style, font color, font size

- **Deciding the Text**
  - AI-Generated: Prompt the user to enter a topic, then generate text based on that topic (OpenAI's GPT-3/Hugging Face)
  - User Input: Allow the user to input their own text.

#### Services Needed
- **Use OpenCV**: Generate a polygon of the human figure
  - [OpenCV Python Demo](https://github.com/myfeng10/WrappingText/blob/main/find_polygon_from_image.py)
  - Implement in Next.js using `opencv4nodejs` to avoid setting up a Python backend

- **SVG**: Create a visual display that includes a path shaped based on the polygon, place the image at the center, and add text that follows the path of the polygon.
  
![Example Image](./images/svg1.png)
![Example Image](./images/svg2.png)

- **Partition the Space**: Outside the polygon, add lines between them
![Example Image](./images/polygon1.png)
- **Add Text**: Along each line
![Example Image](./images/polygon2.png)
- **Add the Label**: Change font design
 ![Example Image](./images/polygon3.png)

## Development Plan

### Estimated Time to Develop: 13 days

#### Phase 1: Project Set Up and User Authentication

- **Day 1**: Project setup (React + Next.js) + Implement the Database (MongoDB)
  - Initialize a new React + Next.js project and GitHub repository
  - Set up a local MongoDB server and define the following schema for the user document
    ```json
    {
      "userName": "String",
      "userId": "ObjectId",
      "imageURLs": ["Array of Strings"]
    }
    ```

- **Day 2**: User Authentication
  - **Frontend**: Create the user component for authentication using React
    - Login and Registration components 
    - Maintain User’s status once they are logged in
  - **Backend (NextAuth)**: Set up API routes to handle user authentication
    - `/API/auth/register`: Add user entry to MongoDB
    - `/API/auth/login`: Verify the credentials

#### Phase 2: Develop Key Functionality

- **Day 3**: File Upload
  - **Frontend**
    - Integrate an image editing library or tool (react-easy-crop) to enable cropping and rotating images within the UI.
    - Implement a preview functionality to display the edited image before it is uploaded.
  - **Backend**
    - Storing Image to Firebase Storage
    - Implement an API endpoint in Next.js (`/api/upload`) to handle image uploads.
    - Retrieve and return the URL of the uploaded image from Firebase Storage.
    - Update the corresponding user's document in MongoDB to append the new image URL to the `imageURLs` array.

- **Day 4**: Implement Face Detection + Minor Frontend Adjustments
  - **Face Detection**
    - Set up Google Cloud Vision API
    - Modify the `/api/upload` endpoint to call the Google Vision API for face detection immediately after the image is uploaded but before returning the URL.
    - Analyze the response from Google Vision to determine if a human face is detected in the image.
  - **Frontend Adjustments**
    - Modify the file upload component to restrict users to uploading only one picture at a time. Provide clear user feedback if an attempt is made to upload more than one image.
    - Based on the response from the face detection process, implement a notification or alert system.

- **Day 5**: Background Removal
  - **Frontend**
    - Display a processing status message to inform the user after they have uploaded the image.
    - After the image is processed and returned by the backend, display the processed image.
    - Add a button to confirm the acceptance of the processed image.
  - **Backend**
    - Register for remove.bg and get API credentials.
    - Set up a route in Next.js API to handle image uploads and interact with remove.bg.

- **Days 6-9**: Wrapping Text
  - **Frontend**
    - Ask user to input text
    - Experiment with different layout combinations to ensure they display well on the frontend.
  - **Backend**
    - PixiJS API: Implement the PixiJS API to enhance font selection capabilities.
    - OpenAI API: Integrate the OpenAI API for generating text automatically.

#### Phase 3: Prevention + Testing

- **Day 10**: Prevention
  - Rate Limiting: Set up rate limiting for the remove.bg API and other APIs to manage the request load and prevent abuse.
  - Cybersecurity Protections: Implement cybersecurity measures to prevent CSRF (Cross-Site Request Forgery) and SQL injection attacks.

- **Days 11-14**: Testing
  - **Authentication**: Ensure users have access only to their own images after they have logged in.
  - **File Upload**: Allow users to upload one image at a time, and require that the image contains a human figure.
  - **Background Removal**: Test the functionality with images of varying resolutions and with human figures of different sizes to ensure robustness.
  - **Wrapping Text**: Investigate whether using different browsers affects performance.
