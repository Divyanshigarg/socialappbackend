Social App/Web Backend
Overview
This repository contains the backend for Social, a social media application designed for users to create posts, follow other users, and engage in discussions.

Prerequisites
Before running the application, ensure you have the following installed:

Node.js (version >= 12.0.0)
npm (Node Package Manager) or yarn
MongoDB (running locally or accessible via URI)
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
cd backend
Install dependencies:

bash
Copy code
npm install
# or
yarn install
Configuration
Create a .env file:
Create a .env file in the root directory based on .env.example.
Update the variables as necessary.
Example .env file:
dotenv
Copy code
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=mysecretkey
Running the Application
To start the backend server, run:

bash
Copy code
npm start
# or
yarn start
The server should start at http://localhost:3000 by default.

API Documentation
Explore and test the API endpoints using the provided Postman collection.

Postman Collection
Import the provided Postman collection (backend.postman_collection.json) to interact with the API endpoints. How to import a collection in Postman.

Contributors
Divyanshi Garg
Email: email@example.com
License
This project is licensed under the MIT License. See the LICENSE file for details.

