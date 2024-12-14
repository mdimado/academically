# Academically - MERN Stack App

This application is a MERN (MongoDB, Express.js, React.js, Node.js) stack project designed for course management. The frontend is built using Next.js, and the backend is powered by Express.js. It provides user authentication, course management, and enrollment functionalities.

---

## Features

### User Roles:
- **Admin**: Can manage courses (add, update, delete) and view all users.
- **User**: Can view courses and enroll in them.

### Functionalities:
- User registration and login with JWT-based authentication.
- Admin routes to manage courses.
- User routes to enroll in courses and view enrolled courses.

---

## Installation

### Prerequisites
- Node.js
- MongoDB

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/mdimado/academically.git
   cd academically
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the `backend` folder:
   ```
   ADMIN_SECRET_KEY=academically
   JWT_SECRET=academically
   MONGO_URI=mongodb+srv://mdimad005:3NdO97CXatpGJsWk@cluster0.xwdau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Run the backend server:
   ```bash
   cd backend
   npm start
   ```

5. Run the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

6. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

---

## Folder Structure

```plaintext
.
├── backend/    # Backend server code (Express.js)
├── frontend/   # Frontend application (Next.js)
└── README.md   # Project documentation
```

---

## Backend API Endpoints

### Authentication
- **POST** `/auth/register`: Register a new user.
- **POST** `/auth/login`: User login.

### Courses
- **GET** `/courses`: Retrieve all courses.
- **POST** `/admin/courses`: Add a new course (Admin only).
- **PUT** `/admin/courses/:id`: Update a course (Admin only).
- **DELETE** `/admin/courses/:id`: Delete a course (Admin only).

### Enrollments
- **POST** `/users/enroll/:courseId`: Enroll in a course.
- **GET** `/users/enrolled-courses`: Get all enrolled courses for a user.

---

## Environment Variables

The backend requires the following environment variables:

| Variable         | Description                |
|------------------|----------------------------|
| `ADMIN_SECRET_KEY` | Secret key for admin registration |
| `JWT_SECRET`      | Secret key for JWT authentication |
| `MONGO_URI`       | MongoDB connection string |

---

## Technologies Used

### Frontend
- Next.js
- React.js
- Tailwind

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication

### Other Libraries
- bcryptjs (password hashing)
- cors (Cross-Origin Resource Sharing)

---

## Future Improvements
- Add detailed user profile management.
- Implement pagination and search functionality for courses.
- Enhance frontend UI/UX.
- Integrate payment gateway for paid courses.



