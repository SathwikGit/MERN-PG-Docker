# MERN-PG-Docker

A full-stack web application utilizing the MERN stack (MongoDB, Express.js, React.js, Node.js) with PostgreSQL integration, containerized using Docker.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project is a comprehensive web application that combines the MERN stack with PostgreSQL. The backend consists of two separate services:
1. **backend**: Uses MongoDB, which runs on a local installation.
2. **backend-dashboard**: Uses PostgreSQL, which is containerized using Docker.

The frontend is developed using React.js with Material-UI for styling. Docker is employed to containerize the PostgreSQL service, ensuring consistent environments across different setups.

## Features

- **User Authentication**: Secure login and registration system.
- **Data Management**: Efficient handling of data using MongoDB and PostgreSQL.
- **Responsive Design**: User-friendly interface optimized for various devices.
- **Containerization**: PostgreSQL is managed within a Docker container.

## Technologies Used

### Frontend
- React.js
- Material-UI

### Backend
- Node.js
- Express.js
- MongoDB (Local Installation)
- PostgreSQL (Docker Container)

### Containerization
- Docker (Used for PostgreSQL, `docker-compose.yml` is located in `backend-dashboard`)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/)
- Local MongoDB installation

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/SathwikGit/MERN-PG-Docker.git
cd MERN-PG-Docker
```

### 2. Set Up Environment Variables
- Create a `.env` file in both `backend` and `backend-dashboard` directories.
- Add the following variables:
```env
# backend (MongoDB)
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# backend-dashboard (PostgreSQL)
NODE_ENV=development
PORT=5002
POSTGRES_URI=your_postgresql_uri
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies
If the `node_modules` directory is already present in each service (`backend`, `backend-dashboard`, and `frontend`), running `npm install` is **not strictly required**. However, it ensures that all dependencies are correctly installed according to `package.json`. If you face issues, consider reinstalling dependencies by running:

#### Backend (MongoDB)
```bash
cd backend
npm install
```
#### Backend-Dashboard (PostgreSQL)
```bash
cd ../backend-dashboard
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

## Usage

### Running with Docker (PostgreSQL Backend)

1. **Navigate to `backend-dashboard`** (where `docker-compose.yml` is located):
   ```bash
   cd backend-dashboard
   ```
2. **Build and Start Containers**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - MongoDB Backend API: `http://localhost:5000/api`
   - PostgreSQL Backend API: `http://localhost:5002/api`

### Running Locally (Without Docker)

1. **Start the MongoDB Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the PostgreSQL Backend**
   ```bash
   cd ../backend-dashboard
   npm run dev
   ```

3. **Start the Frontend**
   ```bash
   cd ../frontend
   npm start
   ```

## Project Structure

```
MERN-PG-Docker/
├── backend/ (MongoDB Backend)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── server.js
│   └── ...
├── backend-dashboard/ (PostgreSQL Backend, includes Docker setup)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── server.js
│   ├── docker-compose.yml
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── .env
└── README.md
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

