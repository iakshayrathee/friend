# Friend Recommendation App (MERN Stack)

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables users to search for and add friends while managing their friend lists. The application also features a friend recommendation system based on mutual connections.

---

## Features

### User Authentication

- **Sign Up**: Create an account with a unique username and password.
- **Login**: Secure login functionality using JWT.

### Home Page

- Displays a list of users and a search bar for finding friends.
- Shows a user's friends list with options to unfriend.

### Add Friend Feature

- Search for registered users.
- Send, receive, and manage friend requests.

### Friend Recommendation System

- Suggest friends based on mutual connections.
- Uses common interests/hobbies for recommendations.
- Display recommended friends on the user dashboard.

---

## Technical Stack

### Frontend

- React.js
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### State Management

- Context API

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/iakshayrathee/friend.git
   cd friend
   ```

2. **Install dependencies for both backend and frontend:**

   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   # Create a .env file in the backend directory and add the following:
   MONGO_URI=<Your MongoDB connection string>
   JWT_SECRET=<Your JWT secret>
   ```

4. **Run the application:**

   ```bash
   # Start the backend server
   cd backend
   npm run dev

   # Start the frontend
   cd ../frontend
   npm start
   ```

5. **Access the application:**
   ```bash
   # Open your browser and navigate to:
   http://localhost:3000
   ```

### Test Login Credentials

```bash
Username : Akshay Rathee
Password : akshayrathee
```

---

## Video Demonstration

[![Watch the video](https://img.icons8.com/ios-filled/50/000000/play-button-circled.png)](https://drive.google.com/file/d/1EO2pmE2QTlRps6QqfunS6H3_aWKq_5lU/view?usp=sharing)
