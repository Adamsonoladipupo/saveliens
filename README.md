# Seveliens (Full-Stack Web App)

![Java](https://img.shields.io/badge/Java-17%2B-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Database](https://img.shields.io/badge/Database-SQL-lightgrey)
![License](https://img.shields.io/badge/License-Educational-yellow)

Seveliens is a full-stack web application that allows users to save, organize, and manage links under structured topics. It consists of a Spring Boot backend and a React frontend, connected through a secure JWT-based authentication system.

---

## Features

### Backend (Spring Boot)
- Secure authentication using JWT (register and login)
- Create and manage topics (folders for links)
- Save links under topics
- User-isolated data access
- Dashboard summary (topics + link counts)
- Ownership validation for all resources
- RESTful API with nested structure

### Frontend (React)
- User authentication (login/register UI)
- Dashboard view of topics and links
- Create, view, and delete topics
- Save and organize links
- Responsive UI for web and mobile
- JWT token-based API communication

---

## Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA / Hibernate
- PostgreSQL / MySQL
- Maven
- Lombok

### Frontend (Planned)
- React.js
- Axios (API communication)
- React Router
- Context API (auth state)
- Tailwind CSS / CSS Modules

---

## Project Structure

Backend:
com.saveliens.saveliens  
├── controllers  
├── services  
├── data  
│   ├── models  
│   └── repositories  
├── dtos  
├── security  
├── exceptions  
└── utils  

Frontend:
frontend/  
├── src  
│   ├── components  
│   ├── pages  
│   ├── services (API calls)  
│   ├── context (Auth)  
│   └── routes  

---

## Authentication Flow

1. User registers or logs in from React frontend  
2. Backend returns JWT token  
3. Token is stored in frontend (localStorage or memory)  
4. Token is sent in Authorization header for all requests  
5. Backend validates token and extracts user identity  

---

## Core Entities

User:
- id
- email
- password
- topics

Topic:
- id
- title
- description
- user (owner)
- links

Link:
- id
- url
- topic
- createdAt

---

## API Endpoints

Authentication:
POST /auth/register  
POST /auth/login  

Topics:
POST /api/topic  
GET /api/topic/me  
GET /api/topic/{topicId}  
DELETE /api/topic/{topicId}  

Links:
POST /api/topic/{topicId}/links  
GET /api/topic/{topicId}/links  
DELETE /api/topic/{topicId}/links/{linkId}  

Dashboard:
GET /api/dashboard/me  

---

## Key Design Decisions

- JWT-based stateless authentication
- SecurityContext used for user identity
- No userId passed from frontend
- Strict ownership validation in backend
- Nested resource structure (Topic → Links)
- Separation of backend and frontend concerns

---

## Security Rules

- Users can only access their own data
- All endpoints require JWT except auth endpoints
- Ownership validation enforced in backend services
- No direct manipulation of user identity from frontend

---

## Setup & Run

### Backend
git clone https://github.com/your-username/seveliens.git  
cd backend  
mvn spring-boot:run  

Configure:
spring.datasource.url=jdbc:postgresql://localhost:5432/seveliens  
spring.datasource.username=your_username  
spring.datasource.password=your_password  
jwt.secret=your_secret_key  

---

### Frontend (Coming Soon)
cd frontend  
npm install  
npm run dev  

---

## Future Improvements

- Full React frontend implementation
- Pagination for links and topics
- Search functionality for saved links
- Tagging system
- OAuth login (Google/GitHub)
- Link preview metadata scraping
- Dark mode UI

---

## Author

Built by Adamson  
Full-stack project focused on mastering Spring Boot, JWT authentication, React frontend development, and real-world system design.

---

## License

This project is for educational purposes only.

