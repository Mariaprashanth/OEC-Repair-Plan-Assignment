# OEC Repair Plan Assignment

## Overview

This project is a Repair Plan Management application developed as part of the OEC technical assessment. It allows users to create a repair plan, add procedures, assign users to procedures, and manage user assignments.

## Tech Stack

- **Frontend:** React
- **Backend:** ASP.NET Core Web API (.NET 6)
- **Database:** SQLite
- **ORM:** Entity Framework Core
- **API:** REST API
- **Containerization:** Docker & Docker Compose

## Features

- Start a new Repair Plan
- Add procedures to a Repair Plan
- Assign users to individual procedures
- Assign multiple users to a procedure
- Remove a single user assignment
- Remove all users from a procedure
- Persist user assignments in the database
- Retain assignments after refreshing the page

## Project Structure

```text
OEC-Repair-Plan-Assignment/
├── Interview/
│   ├── RL.Backend/
│   └── RL.Data/
├── interview-frontend/
├── docs/
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Docker Desktop
- Git (optional, for cloning the repository)

## Run the Application

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd OEC-Repair-Plan-Assignment
```

Start the application:

```bash
docker compose up --build
```

## Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend Swagger | http://localhost:10010 |

## Stop the Application

```bash
docker compose down
```

## Assignment Documentation

Screenshot-based documentation and implementation steps are available in the `docs/` folder.

## Implementation

User assignments are stored in the database. The application supports assigning multiple users to procedures, removing individual assignments, and clearing all assignments for a procedure.

## Author

OEC Interview Assessment Submission