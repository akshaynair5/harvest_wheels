# Transportation and Logistics Platform

This project is a comprehensive web application that connects farmers, transportation providers, and anyone in need of logistics services. Built using React.js, Firebase, SCSS, and various APIs for distance calculation, it facilitates seamless communication and transaction processes between users. Below, you'll find a detailed overview of the platform's features, functionalities, and setup instructions.

## Table of Contents
- [Features](#features)
- [Pages](#pages)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)

## Features

- **User Roles**: Users can sign up as either transportation providers or customers looking for transport services.
- **Journey Posting**: Transportation providers can post journey details including start and destination points, date, space available, etc.
- **Booking System**: Users can book space in a vehicle for their goods based on the journey postings.
- **Fair Pricing**: Pricing is determined by distance, traffic conditions, and weather, ensuring fairness.
- **Proof of Delivery**: Transportation providers upload photos as proof upon reaching the destination.
- **Notifications**: Users receive notifications about journey updates, payment requests, and approvals.
- **Live Location Tracking**: Real-time location updates for ongoing journeys.

## Pages

### Home Page
- Displays postings from user connections or friends.
- Image placeholder:
  ![Home Page](path_to_home_page_image)

### Explore Page
- Users can browse and search for journey postings across India.
- Search functionality using keywords.
- Image placeholder:
  ![Explore Page](path_to_explore_page_image)

### Notifications Page
- Shows details about friend requests, payment proofs, payment requests, and payment approvals.
- Image placeholder:
  ![Notifications Page](path_to_notifications_page_image)

### Profile Page
- Displays live location of current journeys (updated every 2 minutes).
- Shows details of user’s posts, including who has booked spaces in their vehicle.
- Allows users to create new posts.
- Image placeholder:
  ![Profile Page](path_to_profile_page_image)

## Technologies Used

- **Frontend**: React.js, SCSS
- **Backend**: Firebase (Authentication, Firestore)
- **APIs**: Various APIs for distance, traffic, and weather calculations

## Usage

- **Sign Up/Login**: Users can sign up or log in using their email.
- **Posting Journeys**: Transportation providers can create new journey posts.
- **Booking Space**: Users can book space in available journeys.
- **Tracking**: View live location updates of current journeys.
- **Notifications**: Check notifications for updates on journeys and payments.
