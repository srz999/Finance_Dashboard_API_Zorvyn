# Finance Dashboard Backend

A comprehensive backend API for a finance dashboard system with user management, financial records CRUD, role-based access control, and analytics.

## Features

- **User & Role Management**: Create users with roles (Viewer, Analyst, Admin)
- **Financial Records**: Full CRUD operations for income/expense tracking
- **Dashboard Analytics**: Summary, category breakdown, trends, and recent activity
- **Access Control**: Role-based middleware for secure API access
- **Input Validation**: Request validation with detailed error messages
- **API Documentation**: Swagger UI for interactive API exploration
- **JWT Authentication**: Secure token-based authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **API Docs**: Swagger (OpenAPI 3.0)

## Project Structure

```
src/
├── config/
│   ├── db.js           # MongoDB connection
│   └── swagger.js      # Swagger configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── userController.js      # User management
│   ├── recordController.js    # Financial records
│   └── dashboardController.js # Analytics
├── middleware/
│   ├── auth.js         # JWT authentication
│   ├── rbac.js         # Role-based access control
│   ├── validation.js  # Request validation
│   └── errorHandler.js # Error handling
├── models/
│   ├── User.js         # User schema
│   └── FinancialRecord.js
├── routes/
│   ├── auth.js         # Auth routes
│   ├── users.js        # User routes
│   ├── records.js     # Record routes
│   └── dashboard.js   # Dashboard routes
└── server.js           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
copy .env.example .env
```

4. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_secret_key
```

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health

## User Roles

| Role    | Description                              | Permissions                                    |
|---------|------------------------------------------|------------------------------------------------|
| Viewer  | Read-only access                        | View dashboard data                            |
| Analyst | Read + create records + analytics       | View, create records, access dashboard         |
| Admin   | Full access                             | Full CRUD + user management                   |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Financial Records
- `GET /api/records` - Get all records (with filtering & pagination)
- `GET /api/records/:id` - Get single record
- `POST /api/records` - Create record (Analyst, Admin)
- `PUT /api/records/:id` - Update record (Admin)
- `DELETE /api/records/:id` - Delete record (Admin)

### Dashboard Analytics
- `GET /api/dashboard/summary` - Total income, expenses, net balance
- `GET /api/dashboard/categories` - Category-wise breakdown
- `GET /api/dashboard/recent` - Recent activity
- `GET /api/dashboard/trends` - Monthly trends
- `GET /api/dashboard/weekly` - Weekly breakdown

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "viewer"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Financial Record
```bash
POST /api/records
Authorization: Bearer <token>

{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "description": "Monthly salary",
  "date": "2026-04-01"
}
```

### Get Dashboard Summary
```bash
GET /api/dashboard/summary?startDate=2026-01-01&endDate=2026-04-30
Authorization: Bearer <token>
```

## Validation & Error Handling

The API includes comprehensive input validation:

- All inputs validated using Joi schemas
- Detailed error messages with field-specific feedback
- Proper HTTP status codes (400, 401, 403, 404, 500)
- MongoDB error handling (duplicate keys, validation errors)

## Assumptions Made

1. **Database**: Using MongoDB as per assignment requirements
2. **Authentication**: JWT tokens with 24-hour expiration
3. **Soft Delete**: Financial records and users use soft delete (status field)
4. **Categories**: Predefined set of categories for financial records
5. **Pagination**: Default page size of 10, max 100
6. **Date Format**: ISO 8601 date format (YYYY-MM-DD)

## Optional Enhancements Implemented

- JWT Authentication with token-based sessions
- Pagination for record listing
- Soft delete functionality
- Comprehensive input validation

## License

MIT License