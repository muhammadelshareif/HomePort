# Airbnb Clone - React Project Assessment

This is the front-end for an Airbnb clone built as part of the React Project Assessment. The goal of this project is to create a full-stack application by implementing a compelling front-end for a completed back-end project, fulfilling the assessment's requirements to demonstrate proficiency in React.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

This project is a clone of the **Airbnb** platform. It focuses on key features like creating and managing spots, viewing spot details, and adding reviews. The front-end interacts with a back-end that supports CRUD operations for spots and reviews.

### Key Features:

- **Spot Management (CRUD)**: Users can create, read, update, and delete spots (Airbnb listings).
- **Reviews (Create, Read, Delete)**: Users can add, view, and delete reviews for spots.
- **Authentication**: User authentication is implemented, ensuring users can only interact with their own spots and reviews.

This project is part of a solo assessment to showcase your React skills and create a fully functional front-end using **React** and **CSS**.

## Installation

### Prerequisites

Make sure you have the following installed before setting up the project:

- [Node.js](https://nodejs.org/) (Ensure version is 14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/airbnb-clone.git
   cd airbnb-clone
   ```

### Install the dependencies: npm install

### Start Developmental Server: npm start, Open your browser and visit http://localhost:3000 to view the application.

### Usage

The application allows users to perform various actions on spots and reviews.

### Features:

Spots: Users can view a list of spots, see spot details, and interact with spot information.
Reviews: Users can add reviews to spots, view the average star rating, and delete their reviews.
Endpoints:
This front-end interacts with the following backend endpoints (from the API):

GET /api/spots: Retrieve a list of spots.

POST /api/spots: Create a new spot.

PUT /api/spots/:spotId: Update a spot's information.

DELETE /api/spots/:spotId: Delete a spot.

GET /api/spots/:spotId/reviews: View reviews for a spot.

POST /api/spots/:spotId/reviews: Add a review to a spot.

DELETE /api/spots/:spotId/reviews/:reviewId: Delete a review from a spot.

### Features

### 1. Spots Management (CRUD):

Create: Users can add new spots (Airbnb listings) with details like location, description, price, etc.
Read: Users can view a list of all available spots, as well as detailed information about individual spots.
Update: Users can edit details of their own spots.
Delete: Users can delete spots they have created.

### 2. Reviews (Create, Read, Delete):

Create: Users can add reviews to spots, rating them with stars and providing comments.
Read: The average rating for each spot is displayed, and users can view individual reviews.
Delete: Users can delete their own reviews.

### 3. Authentication:

Users must authenticate to interact with spots and reviews.
Implemented using JWT tokens and secured routes.

### 4. Technologies Used

React: Front-end framework used to build the application.
Redux: State management for handling global state (e.g., user authentication, spot data).
CSS: Custom styling using plain CSS (no CSS frameworks or libraries).
Axios: For making API requests.
React Router: For handling navigation and routing.
JWT Authentication: For secure user login and session management.

### Contributing

This project is a personal assessment. However, if you'd like to contribute or improve the application, feel free to fork the repository and submit pull requests with your changes.

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.

### Acknowledgments

Inspiration from Airbnb for the design and functionality.
Resources used in learning React and Redux.
