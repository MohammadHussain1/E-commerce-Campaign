# E-commerce Campaign Reporting API

## Overview

This project is an API for reporting on e-commerce campaign performance. It includes features like file upload, JWT-based authentication, and various reporting endpoints.

## Features

1. **Upload CSV File to SQLite**
2. **CRUD Operations for Users**
3. **Login and JWT Token Generation**
4. **Product Reporting APIs with Cross-Filtering**

## API Endpoints

### 1. Upload CSV File

- **POST /upload-csv**: Uploads a CSV file and populates the `products` table.

### 2. User Management

- **POST /users**: Create a new user.
- **GET /users/:id**: Get user details by ID.
- **PUT /users/:id**: Update user details.
- **DELETE /users/:id**: Delete a user.

### 3. Login and JWT Authentication

- **POST /login**: Authenticates the user and generates a JWT token.

### 4. Product Reporting

- **POST /products/report/campaign**: Retrieve product statistics filtered by Campaign Name.
- **POST /products/report/adGroupID**: Retrieve product statistics filtered by Ad Group ID.
- **POST /products/report/fsnID**: Retrieve product statistics filtered by FSN ID.
- **POST /products/report/productName**: Retrieve product statistics filtered by Product Name.

## Setup and Installation

### Prerequisites

- Node.js (>=14.x)
- npm (>=6.x)
- SQLite3

### Steps to Run the Project

1. **Clone the Repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Setup Environment Variables**:
    - Create a `.env` file in the root directory and add:
      ```env
      PORT=3000
      JWT_SECRET=your_jwt_secret
      `````

4. **Start the Server**:
    ```sh
    npm run dev
    ```

5. **Access the API**:
    - The API will be available at `http://localhost:3000`.

## License

This project is licensed under the MIT License.
