# Event Registration System

A backend API for managing events and user registrations, built with **Express.js** and **MongoDB (Mongoose)**. Includes JWT-based authentication with two roles — `attendee` and `organizer`.

## Features

- User registration & login with JWT authentication
- Role-based access: attendees vs organizers
- Organizers can create, update, and delete their own events
- Anyone can browse events and view event details
- Logged-in users can register for events, view their own registrations, and cancel/delete them
- Organizers can view the list of attendees registered for their events
- Duplicate registration prevention (one user can't register twice for the same event)
- Event capacity enforcement

## Tech Stack

- **Node.js** + **Express.js** — server & routing
- **MongoDB** + **Mongoose** — database & ODM
- **JWT (jsonwebtoken)** — authentication
- **bcryptjs** — password hashing
- **dotenv** — environment variable management
- **cors** — cross-origin request handling
- **nodemon** — dev auto-reload

## Project Structure

```
event-registration-system/
├── package.json
├── .env
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Registration.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
└── routes/
    ├── authRoutes.js
    ├── eventRoutes.js
    └── registrationRoutes.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/snehashisroy1212/event-registration-system.git
cd event-registration-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

> `.env` is git-ignored and should never be committed. Use your own MongoDB Atlas connection string or a local MongoDB instance.

### 4. Run the server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or whichever `PORT` you set).

## API Endpoints

### Auth

| Method | Endpoint             | Access  | Description                |
|--------|-----------------------|---------|----------------------------|
| POST   | `/api/auth/register`  | Public  | Register a new user        |
| POST   | `/api/auth/login`     | Public  | Log in and get a JWT       |
| GET    | `/api/auth/me`        | Private | Get current logged-in user |

### Events

| Method | Endpoint           | Access              | Description                  |
|--------|---------------------|---------------------|-------------------------------|
| GET    | `/api/events`       | Public              | List all events (supports `search`, `page`, `limit` query params) |
| GET    | `/api/events/:id`   | Public              | Get a single event's details |
| POST   | `/api/events`       | Organizer only      | Create a new event           |
| PUT    | `/api/events/:id`   | Organizer (owner)   | Update an event              |
| DELETE | `/api/events/:id`   | Organizer (owner)   | Delete an event              |

### Registrations

| Method | Endpoint                             | Access              | Description                           |
|--------|----------------------------------------|---------------------|-----------------------------------------|
| POST   | `/api/registrations`                  | Private             | Register for an event                 |
| GET    | `/api/registrations/me`               | Private             | View your own registrations           |
| GET    | `/api/registrations/event/:eventId`   | Organizer (owner)   | View all registrations for your event |
| PUT    | `/api/registrations/:id/cancel`       | Private (owner)     | Cancel your registration              |
| DELETE | `/api/registrations/:id`              | Private (owner)     | Permanently remove your registration  |

## Authentication

Protected routes require a JWT sent in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

You get a token back from `/api/auth/register` or `/api/auth/login`.

## Example: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sneha Roy",
    "email": "sneha@example.com",
    "password": "password123",
    "role": "attendee"
  }'
```

## Example: Create an Event (Organizer only)

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <organizer_token>" \
  -d '{
    "title": "Tech Meetup 2026",
    "description": "A networking event for developers",
    "date": "2026-11-15",
    "location": "Hyderabad",
    "capacity": 100
  }'
```

## License

This project was built as part of an internship assignment.
