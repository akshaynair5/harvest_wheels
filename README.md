# Transportation and Logistics Platform

This project is a comprehensive web application that connects farmers, transportation providers, and anyone in need of logistics services. Built using React.js, Firebase, SCSS, and various APIs for distance calculation, it facilitates seamless communication and transaction processes between users. Below, you'll find a detailed overview of the platform's features, functionalities, and setup instructions.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Pages](#pages)
  - [Home Page](#home-page)
  - [Explore Page](#explore-page)
  - [Notifications Page](#notifications-page)
  - [Profile Page](#profile-page)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
  - [Sign Up/Login](#sign-up-login)
  - [Posting Journeys](#posting-journeys)
  - [Booking Space](#booking-space)
  - [Tracking](#tracking)
  - [Notifications](#notifications)

## Introduction

The Transportation and Logistics Platform aims to streamline the process of finding and booking transportation services for goods. Whether you are a farmer looking to transport produce or a transportation provider seeking to offer your services, this platform connects users with fair pricing based on real-time conditions and ensures smooth and secure transactions.

## Features

- **User Roles**: 
  - Users can register as either transportation providers or customers.
  - Each role has specific functionalities tailored to their needs.

- **Journey Posting**:
  - Transportation providers can create journey posts detailing the start and destination points, date, available space, and other relevant information.
  - Posts are visible to users seeking transportation services.

- **Booking System**:
  - Users can browse available journeys and book space for their goods.
  - The booking system is designed to be flexible, allowing users to book as much space as they need.

- **Fair Pricing**:
  - Pricing is calculated based on distance, traffic conditions, and weather, ensuring transparency and fairness.
  - The platform uses APIs to fetch real-time data for accurate pricing.

- **Proof of Delivery**:
  - Upon reaching the destination, transportation providers are prompted to upload a photo as proof of delivery.
  - Users receive notifications to verify the proof and make payments accordingly.

- **Notifications**:
  - The notification system keeps users informed about journey updates, payment requests, approvals, and friend requests.
  - Ensures users are always up-to-date with important information.

- **Live Location Tracking**:
  - Provides real-time updates on the location of ongoing journeys, updated every two minutes.
  - Users can track the progress of their shipments and stay informed.

## Pages

### Home Page

The Home Page serves as the main dashboard for users. Here, users can see postings from their friends or connections. The page is designed to provide a quick overview of relevant posts and activities.


### Explore Page

The Explore Page allows users to browse and search for journey postings across India. Users can filter results using keywords and find transportation services that match their needs.

![image](https://github.com/user-attachments/assets/2207ef3b-a33d-48bb-8bd9-a8eed610f033)

![image](https://github.com/user-attachments/assets/57ea0aec-0560-49e3-800e-54dd0f7d2d44)


### Notifications Page

The Notifications Page keeps users informed about important updates. This includes friend requests, payment proofs, payment requests, and approvals. The page is organized to ensure users can easily manage and respond to notifications.

_Image placeholder for Notifications Page:_

![Notifications Page](path_to_notifications_page_image)

### Profile Page

The Profile Page displays detailed information about the user’s activities and posts. This includes live location tracking for current journeys, details of posted journeys, and booking information. Users can also create new posts from this page.

_Image placeholder for Profile Page:_

![image](https://github.com/user-attachments/assets/1645e365-7c29-4619-b10a-2512cc10bb88)

## Technologies Used

- **Frontend**: 
  - React.js: For building the user interface.
  - SCSS: For styling the application.

- **Backend**:
  - Firebase: For authentication and Firestore database for real-time data management.

- **APIs**:
  - Various APIs for calculating distance, traffic conditions, and weather to ensure accurate pricing.

## Usage

### Sign Up/Login

Users can sign up or log in using their email. The authentication system is managed by Firebase, ensuring secure and reliable user management.

### Posting Journeys

Transportation providers can create new journey posts. This involves filling out details such as the start and destination points, date, available space, and any additional information relevant to the journey.

### Booking Space

Users seeking transportation services can browse available journeys and book space for their goods. The booking process is straightforward, allowing users to specify the amount of space they need.

### Tracking

The platform provides real-time location updates for ongoing journeys. Users can track the progress of their shipments and stay informed about the journey’s status.

### Notifications

Users receive notifications about important updates, including journey statuses, payment requests, approvals, and friend requests. The notification system ensures users are always aware of any changes or actions required on their part.
