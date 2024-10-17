# Nest Residency API

This is the API for **Nest Residency**, a booking management platform providing users with room booking, payments, and booking management features. It also offers administrative functionalities for managing room availability and prices. The project is built using the **MERN Stack**.

---

## Technologies

The project uses the following key technologies:

- **Node.js**: JavaScript runtime environment for server-side development.
- **Express.js**: Web application framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.
- **Razorpay**: Payment gateway integration for handling online transactions.
- **Nodemailer**: For sending emails (booking confirmations, cancellations, etc.).
- **React.js**: (Assumed for frontend) JavaScript library for building user interfaces.
- **Redux**: (Assumed for frontend) State management library.
- **react-datepicker**: Date picker component for React.
- **Axios**: Promise-based HTTP client for making API requests.
- **dotenv**: Module to load environment variables from a `.env` file.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **bcryptjs**: Library for hashing passwords.
- **Cookie-parser**: Middleware for parsing cookies.

---

## Features

- **User Authentication**: Users can register, login, and logout securely using JWT authentication.
- **Room Booking**:
  - Check room availability based on room type and dates.
  - Book rooms by specifying room type, check-in, and check-out dates.
  - Automatic assignment of available rooms of the requested type.
- **Admin Panel**:
  - View all bookings with detailed information.
  - Search bookings by name, phone, email, booking ID, or check-in date.
  - Cancel bookings with a specified reason.
  - Add new rooms and update room prices.
  - Book rooms directly from the admin panel.
- **Payment Integration**:
  - Online payments through Razorpay.
  - Secure payment verification.
  - Automatic booking confirmation upon successful payment.
- **Email Notifications**:
  - Send booking confirmation emails to guests.
  - Notify admin via email when a new booking is made.
  - Send booking cancellation emails to guests.
- **Date Handling**:
  - Automatic update of check-out date based on check-in date selection.
  - Date inputs with `react-datepicker` for better user experience.
- **Data Validation**:
  - Validate user inputs on both frontend and backend.
  - Ensure correct date formats and logical date selections (e.g., check-out after check-in).
- **Room Availability**:
  - Check the availability of specific room types.
- **Responsive Design**:
  - Frontend components are responsive and optimized for various screen sizes.

---


## API Endpoints

### Authentication

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| POST   | `/api/auth/register` | Registers a new user               |
| POST   | `/api/auth/login`    | Authenticates and logs in a user   |
| GET    | `/api/auth/user`     | Retrieves the current user         |
| POST   | `/api/auth/logout`   | Logs out the current user          |
| GET    | `/api/auth/refresh`  | Refreshes the JWT token            |

---

### Bookings

| Method | Endpoint                      | Description                                 |
|--------|--------------------------------|---------------------------------------------|
| POST   | `/api/bookings/book-room`      | Books a room                                |
| POST   | `/api/bookings/check-availability` | Checks availability of room types          |
| GET    | `/api/bookings/booking/:id`    | Retrieves booking details by ID             |

---

### Admin

| Method | Endpoint                      | Description                                    |
|--------|--------------------------------|------------------------------------------------|
| GET    | `/api/admin/bookings`          | Retrieves all bookings (Admin Only)            |
| PUT    | `/api/admin/cancel-booking/:id` | Cancels a booking by ID                       |
| POST   | `/api/admin/add-room`          | Adds a new room to the system                  |
| PUT    | `/api/admin/update-price`      | Updates the price of a room                    |

---

### Payments

| Method | Endpoint                    | Description                                    |
|--------|-----------------------------|------------------------------------------------|
| POST   | `/api/payments/create-order` | Creates a new payment order                    |
| POST   | `/api/payments/verify-payment` | Verifies the payment status                   |

---

### Rooms

| Method | Endpoint                    | Description                                    |
|--------|-----------------------------|------------------------------------------------|
| GET    | `/api/rooms/get-rooms`       | Retrieves unique room types                    |

