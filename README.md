# RedDrop – Blood Donation Management System

## Project Description

RedDrop is a full-stack web application designed to manage blood donors, blood requests, donations, blood inventory, and blood issuing in one system.

The system provides separate functionality for:
- Donors
- Recipients
- Administrators

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Main Features

### Donor
- Register and login
- Manage profile
- Set blood availability
- View compatible blood requests
- Accept blood requests
- View donation history

### Recipient
- Register and login
- Create blood requests
- Select blood group and location
- View request status
- Cancel open requests
- View request history

### Admin
- Dashboard
- Manage donors
- Manage users
- Manage blood requests
- Record donations
- Manage blood inventory
- Issue blood
- Update request lifecycle

## Blood Request Lifecycle

Open → Donor Assigned → Donation Recorded → Fulfilled

A request can also be cancelled when applicable.

## Project Structure

```text
RedDrop-Submission/
│
├── reddrop-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
└── reddrop-backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── utils/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    └── .env.example