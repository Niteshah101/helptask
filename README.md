## Overview

The Helpers System is a web-based application designed to connect task owners with volunteers in a simple and efficient way. Authenticated users can create and manage tasks, while volunteers can sign up for tasks without creating an account by using their email address as a unique identifier. The system ensures that all task subscriptions reflect the current state of the database, allowing task owners to manage volunteers dynamically.

## Core Functionality

The application allows users with accounts to create and manage tasks, including viewing volunteers and dismissing them when necessary. Volunteers can browse available tasks, subscribe using their email, and later retrieve their subscribed tasks using the same email. Additionally, the system provides a statistics view that displays the number of volunteers associated with each active task in real time.

## Architecture and Design Patterns

### MVC (Model-View-Controller)

The application follows the MVC architecture to ensure separation of concerns:

* **Model** handles data structure and database interactions.
* **View** is responsible for rendering the user interface using EJS templates.
* **Controller** manages application logic and handles user requests.

### Singleton Pattern

A Singleton pattern is implemented for database access to ensure that only one instance of the database connection exists throughout the application lifecycle. This improves efficiency and prevents redundant connections.

### Observer Pattern

The Observer pattern is used to manage changes in task subscriptions. When a volunteer subscribes to or is removed from a task, the system updates relevant components (such as task statistics and views) to reflect the latest data, ensuring consistency across the application.

## Technologies Used

* **Node.js** – Server-side runtime environment
* **Express.js** – Web application framework
* **MongoDB Atlas** – Cloud-based NoSQL database
* **EJS (Embedded JavaScript Templates)** – Dynamic front-end rendering
* **Express Session & Connect-Mongo** – Session management and storage

## Key Features

* Task creation and management by authenticated users
* Volunteer signup using email (no account required)
* Subscription tracking and lookup by email
* Real-time task statistics for active tasks
* Secure session handling and persistent data storage
* Clean separation of logic using MVC architecture
* Efficient database handling using Singleton pattern
* Dynamic updates using Observer pattern

## Purpose

This project demonstrates the implementation of real-world web application concepts, focusing on system design, architecture patterns, and efficient data handling in a full-stack environment.
