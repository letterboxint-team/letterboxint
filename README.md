```
██╗     ███████╗████████╗████████╗███████╗██████╗ ██████╗  ██████╗ ██╗  ██╗██╗██╗███╗   ██╗████████╗
██║     ██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝╚═╝██║████╗  ██║╚══██╔══╝
██║     █████╗     ██║      ██║   █████╗  ██████╔╝██████╔╝██║   ██║ ╚███╔╝    ██║██╔██╗ ██║   ██║   
██║     ██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗██╔══██╗██║   ██║ ██╔██╗    ██║██║╚██╗██║   ██║   
███████╗███████╗   ██║      ██║   ███████╗██║  ██║██████╔╝╚██████╔╝██╔╝ ██╗   ██║██║ ╚████║   ██║   
╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝╚═╝  ╚═══╝   ╚═╝   
```                                                                                             
                                                                                                 
# The Project

Letterbox'INT is a web-based social network dedicated to film enthusiasts, inspired by the popular platform Letterboxd. Developed as a school project, this application allows users to track their film journey, discover new movies, and share their opinions with a community of peers.

Whether you are a casual moviegoer or a hardcore cinephile, Letterbox'INT provides the tools to log what you watch and find out what's trending on campus.

# Features

Log & Rate: Keep a diary of every film you watch and rate them on our innovative 3-mark system.

Reviews: Write in-depth reviews and read what others think.

Watchlist: Save movies you want to see for later.

Social Graph: Follow friends to see their latest reviews.

Discovery: Browse movies by genre, popularity, or rating.

# Architecture

The system is divided into three main layers:

Frontend: A responsive user interface handling user interactions and state management.

Backend API: A RESTful API handling logic and authentication.

Data Layer: Persistent storage for user data and movie metadata.

## Tech stack used

- MySQL
- Python fastapi backend
- React
- Three.js

## Data flow

![Request data flow](assets/data_flow.png "Request data flow")

## Database structure

![Database structure schema](assets/db_schema.png "Database structure schema")

## API Endpoints

### Users & Auth
- `POST /signup`: Register a new user
- `POST /login`: Authenticate a user
- `POST /logout`: Log out
- `GET /users`: List all users
- `GET /users/{user_id}`: Get user details
- `PATCH /users/{user_id}`: Update user details

### Movies
- `GET /movies`: List all movies
- `GET /movies/{movie_id}`: Get movie details
- `GET /movies/search/`: Search movies by title

### Reviews
- `GET /reviews`: List all reviews
- `POST /reviews`: Create a new review
- `GET /reviews/{movie_id}`: Get reviews for a specific movie
- `GET /users/{user_id}/reviews`: Get reviews by a specific user

### Social & Interactions
- `POST /friends`: Add a friend
- `GET /users/{user_id}/friends`: List a user's friends
- `GET /users/{user_id}/watched`: Get user's watched history
- `POST /users/{user_id}/watched`: Mark a movie as watched
- `DELETE /users/{user_id}/watched/{movie_id}`: Remove a movie from watched history
- `GET /users/{user_id}/favorites`: Get user's favorite movies
- `POST /users/{user_id}/favorites`: Add a movie to favorites
- `DELETE /users/{user_id}/favorites/{movie_id}`: Remove a movie from favorites

# Meet the team

- Goessens Louis
- Jacques-Yonyul Aurélien
- Nussbaumer Hector
- Riedel Nicolas
- Schauli Pierre

Made with ❤️ by the Letterbox'INT team