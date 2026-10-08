# Cloud Community Chat

A cloud-based community chat application built to provide users with a simple platform for real-time communication. The project includes a frontend interface, a Node.js backend, user/data handling, and a local SQLite database.

## Features

- **Community Chat** - Provides a shared space for users to communicate.
- **User Authentication** - Supports user-oriented application access and workflows.
- **Backend API** - Node.js-based backend for handling application requests and data.
- **SQLite Database** - Uses a local SQLite database for storing application data.
- **Responsive Frontend** - HTML and CSS interface with JavaScript-based application logic.
- **Database Seeding** - Includes a seed script for populating initial database data.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js
- **Database:** SQLite
- **Package Management:** npm
- **Version Control:** Git / GitHub

## Project Structure

```text
Cloud-Community-Chat/
│
├── backend/
│   ├── campus.db
│   ├── db.js
│   ├── package-lock.json
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── src/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── .gitignore
└── README.md
```

## Folder & File Overview

### `backend/`

Contains the server-side application and database-related files.

| File | Purpose |
|---|---|
| `server.js` | Main backend server and request-handling logic |
| `db.js` | Database connection and database-related operations |
| `seed.js` | Script for inserting initial/seed data into the database |
| `campus.db` | SQLite database containing the application's stored data |
| `package.json` | Backend project configuration and dependencies |
| `package-lock.json` | Locks the installed npm dependency versions |

### `src/`

Contains the client-side application.

| File | Purpose |
|---|---|
| `index.html` | Main frontend page and application structure |
| `app.js` | Frontend JavaScript and application interaction logic |
| `style.css` | Styling and layout for the application |

### Root Files

| File | Purpose |
|---|---|
| `.gitignore` | Specifies files and folders that Git should ignore |
| `README.md` | Project documentation |

## How the Application Works

The project follows a frontend-backend-database structure:

```text
User
  │
  ▼
Frontend (HTML + CSS + JavaScript)
  │
  ▼
Node.js Backend
  │
  ▼
SQLite Database
```

1. The user interacts with the chat application through the frontend.
2. Frontend JavaScript handles user interactions and communicates with the backend.
3. The Node.js server processes application requests.
4. Database operations are handled through the backend database layer.
5. Application data is stored in the SQLite `campus.db` database.

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Seed the database

If the project requires initial data, run:

```bash
node seed.js
```

### 4. Start the backend

```bash
node server.js
```

The server will start using the configuration defined in the backend code.

### 5. Open the frontend

Open:

```text
src/index.html
```

through the project's configured frontend/server setup.

## Development

The main development areas are:

- `src/app.js` for frontend application logic
- `src/index.html` for the interface structure
- `src/style.css` for UI styling
- `backend/server.js` for backend/server logic
- `backend/db.js` for database operations
- `backend/seed.js` for initial database data

## Project Goals

The project was developed to:

- Build a practical community communication platform.
- Connect a frontend application with a Node.js backend.
- Work with persistent data using SQLite.
- Implement user-oriented workflows and authentication.
- Understand the structure of a full-stack web application.

## Future Improvements

Potential improvements include:

- Private one-to-one messaging
- Group/community channels
- Message search
- File and image sharing
- Notifications
- User profiles
- Message reactions
- Improved moderation and administration features
- Migration to a hosted cloud database for production deployment

## Learning Outcomes

This project provided hands-on experience with:

- Frontend web development
- Node.js backend development
- REST-style client-server communication
- SQLite database integration
- Database seeding
- User authentication workflows
- Git and GitHub
- Full-stack application structure

## Author

**Jeevasuryaa Perumalsamy**

B.Tech Computer Science & Business Systems  
VIT Vellore

GitHub: [Jeevasuryaa](https://github.com/Jeevasuryaa)
