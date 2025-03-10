# SengarBus

SengarBus is a web-based bus ticket booking platform designed to streamline the booking process for Sengar Travels. This platform provides features such as seat selection, live bus tracking, and payment integration, enabling users to easily search and book bus tickets online.

## Features

- **Seat Selection**: Users can choose available seats based on their preferences.
- **Live Bus Tracking**: Users can track the real-time location of buses during their journey.
- **Multi-Vendor Platform**: Different bus operators can list their services, providing a variety of options for users.
- **Payment Integration**: Seamless payment gateway integration for secure transactions.
- **Search Functionality**: Users can search for buses based on the source, destination, and travel date.

## Tech Stack

- **Frontend**:
  - Next.js with TypeScript
  - React.js
  - CSS (for styling)
- **Backend**:
  - Node.js
  - Express.js
  - PostgreSQL (for database management)
  - Redis (for session management)
- **Deployment**: The application is deployed using Vercel (for frontend) and a custom backend hosted on a separate server.

## Setup and Installation

To run the application locally, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/) for database management
- [Redis](https://redis.io/) for session management

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/jaydattkaran/sengarbus.git
   cd sengarbus

2. Install dependencies:
    ```bash
    npm install

3. Start the Next.js development server:
    ```bash
    npm run dev```
    The frontend will be running at http://localhost:3000.

### Backend Setup

1. Clone the repository:
   ```bash
   cd sengarbus/api

2. Install dependencies:
    ```bash
    npm install

3. Make sure you have the following installed:

- Create the PostgreSQL database and run the migrations.
- Set up Redis for session storage.

4. Start the Backend server:
    ```bash
    npm run dev```
    The backend will be running at http://localhost:5000.

### Environment Variable

Make sure to create a `.env` file in both the frontend and backend projects with the following variables:

**Backend(`.env)**:

```bash
DATABASE_URL=""
DB_PASSWORD=""
PORT=""
DB_USER=""
HOST=""
DB_NAME=""
DB_PORT=""
```

### Folder Structure

The project structure is organized as follows:

```bash
sengarbus/
│
├── frontend/               # Next.js frontend
│   ├── pages/              # React components and pages
│   ├── public/             # Static files like images, icons
│   └── styles/             # Global styles
│
├── backend/                # Node.js backend
│   ├── routes/             # API routes
│   ├── controllers/        # Controllers for handling requests
│   └── models/             # Database models
│
└── README.md               # Project documentation
```

### Contributing

We welcome contributions to improve the SengarBus platform! To contribute, please fork the repository, create new branch, and submit a pull request with your changes. Follow the guidelines outlined below:

1. **Fork the repository:** Click on the "Fork" button at the top-right of this page.

2. **Clone your fork:** 
    ```bash
    git clone https://github.com/jaydattkaran/sengarbus.git
    ```

3. **Create a new branch:** 
    ```bash
    git checkout -b feature/new-feature
    ```

4. **Commit your changes:** 
    ```bash
    git commit -m "Description of your changes"
    ```

5. **Push your changes:** 
    ```bash
    git push origin feature/new-feature
    ```

6. **Open a Pull Request:** Go to the original repository and create a pull request.

