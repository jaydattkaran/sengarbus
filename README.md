# SengarBus

SengarBus is a web-based bus ticket booking platform designed to streamline the booking process for Sengar Travels. This platform provides features such as seat selection, live bus tracking, and payment integration, enabling users to easily search and book bus tickets online.

## Features

- **User Authentication**:
  - Implemented using Clerk for secure and scalable authentication.
  - Supports Google, Phone and password-based authentication.
- **Seat Selection**:
  - Users can choose seats dynamically from available options.
  - Fixed pricing model implemented for seat selection.
- **Live Bus Tracking**: Users can track the real-time location of buses during their journey.
- **Multi-Vendor Platform**: Different bus operators can list their services, providing a variety of options for users.
- **Payment Integration**: Secure online payment system for hassle-free bookings.
- **Search Functionality**: Users can search for buses based on the source, destination, and travel date.

## Tech Stack

- **Frontend**:
  - Next.js
  - TailwindCSS (for styling)
- **Backend**:
  - Node.js with TypeScript
  - Express.js
  - PostgreSQL (for database management)
  - Session Management: Hybrid approach (session ID stored in cookies, session data stored in Redis)
- **Authentication**: Clerk
- **Deployment**: TBD

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

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at http://localhost:3000.

### Backend Setup

1. Clone the repository:

   ```bash
   cd sengarbus/api

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Make sure you have the following installed:

- Configure Clerk authentication keys.
- Configure PostgreSQL database connection.
- Set up Redis for session management.


4. Start the Backend server:
   ```bash
   npm run dev
   ```
   The backend will be running at http://localhost:5000.

### Environment Variable

Make sure to create a `.env` file in both the frontend and backend projects with the following variables:

**Backend(`.env`)**:

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
├── server/                # Node.js backend
│   ├── routes/             # API routes
│   ├── server.ts/        # Controllers for handling requests
│   └── db/             # Database models
│
└── README.md               # Project documentation
```

### Contributing

Contributions are welcome! If you'd like to improve the project, feel free to submit a pull request.

To contribute, Follow the guidelines outlined below:

1. **Fork the repository:** Click the "Fork" button on the GitHub repository page to create a copy in your account.

2. **Clone your fork:**

```bash
git clone https://github.com/jaydattkaran/sengarbus.git
cd sengarbus

```

3. **Create a new branch:**

   ```bash
   git checkout -b feature-branch-name
   ```

4. **Make Your Changes**

    - Follow best practices and coding guidelines.
    - Ensure the code is clean and properly documented.


5. **Commit your changes:**

 ```bash
git add .
git commit -m "Add brief description of your changes"
```

6. **Push your changes to GitHub:**

   ```bash
   git push origin feature-branch-name
   ```

7. **Submit a Pull Request (PR)** 
    - Open a PR from your branch to the `main` branch of the original repository.
    - Provide a clear title and description of your changes.
    - Wait for review and feedback.


### Contribution Guidelines

- Keep PRs small and focused on a single feature or fix.
- Write meaningful commit messages.
- Ensure compatibility with existing features.
- Follow the project’s coding style and conventions.
- Test your changes before submitting a PR.