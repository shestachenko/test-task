# API Request Examples

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. POST /api/auth/register
Register a new user account

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }'
```

**Request Body:**
- `username` (required, unique) - Username for the account
- `password` (required) - Password (will be hashed)
- `first_name` (required) - User's first name
- `last_name` (required) - User's last name
- `email` (required) - User's email address

**Example Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john.doe@example.com"
  }
}
```

**Error Response (Username already exists):**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

---

### 2. POST /api/auth/login
Login with username and password

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

**Request Body:**
- `username` (required) - Username
- `password` (required) - Password

**Example Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john.doe@example.com"
  }
}
```

**Error Response (Invalid credentials):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

### 3. GET /api
Health check endpoint

**Request:**
```bash
curl http://localhost:3000/api
```

**Response:**
```json
{
  "message": "Hello API"
}
```

---

### 4. GET /api/reservations/by-day
Get reservations for a specific amenity on a specific date

**Request:**
```bash
# Using curl
curl "http://localhost:3000/api/reservations/by-day?amenityId=507f1f77bcf86cd799439011&date=2024-01-15"

# Using date in different formats
curl "http://localhost:3000/api/reservations/by-day?amenityId=507f1f77bcf86cd799439011&date=2024-01-15T00:00:00Z"
curl "http://localhost:3000/api/reservations/by-day?amenityId=507f1f77bcf86cd799439011&date=1592611200000"
```

**Query Parameters:**
- `amenityId` (required) - Amenity ID (MongoDB ObjectId string)
- `date` (required) - Date in any parseable format

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "reservationId": "507f1f77bcf86cd799439011",
      "user": {
        "_id": "507f1f77bcf86cd799439001",
        "username": "john_doe",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
      },
      "startTime": "10:00",
      "duration": 300,
      "amenity": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Tennis Court"
      }
    },
    {
      "reservationId": "507f1f77bcf86cd799439012",
      "user": {
        "_id": "507f1f77bcf86cd799439002",
        "username": "jane_smith",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane@example.com"
      },
      "startTime": "14:30",
      "duration": 120,
      "amenity": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Tennis Court"
      }
    }
  ]
}
```

---

### 5. GET /api/reservations/by-user
Get all bookings for a user grouped by day

**Request:**
```bash
# Using curl
curl "http://localhost:3000/api/reservations/by-user?userId=507f1f77bcf86cd799439021"

# Or using PowerShell (Windows)
Invoke-RestMethod -Uri "http://localhost:3000/api/reservations/by-user?userId=507f1f77bcf86cd799439021" -Method Get
```

**Query Parameters:**
- `userId` (required) - User ID (MongoDB ObjectId string)

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "reservations": [
        {
          "reservationId": "507f1f77bcf86cd799439011",
          "startTime": "09:00",
          "duration": 60,
          "amenity": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Tennis Court"
          }
        },
        {
          "reservationId": "507f1f77bcf86cd799439012",
          "startTime": "15:00",
          "duration": 90,
          "amenity": {
            "_id": "507f1f77bcf86cd799439012",
            "name": "Swimming Pool"
          }
        }
      ]
    },
    {
      "date": "2024-01-16",
      "reservations": [
        {
          "reservationId": "507f1f77bcf86cd799439013",
          "startTime": "10:00",
          "duration": 120,
          "amenity": {
            "_id": "507f1f77bcf86cd799439013",
            "name": "Gym"
          }
        }
      ]
    }
  ]
}
```

---

## JavaScript/TypeScript Examples

### Using fetch API
```javascript
// Get reservations by day
async function getReservationsByDay(amenityId, date) {
  const response = await fetch(
    `http://localhost:3000/api/reservations/by-day?amenityId=${amenityId}&date=${date}`
  );
  const data = await response.json();
  return data;
}

// Get user bookings
async function getUserBookings(userId) {
  const response = await fetch(
    `http://localhost:3000/api/reservations/by-user?userId=${userId}`
  );
  const data = await response.json();
  return data;
}

// Usage
getReservationsByDay('507f1f77bcf86cd799439011', '2024-01-15');
getUserBookings('507f1f77bcf86cd799439021');
```

### Using Axios
```javascript
import axios from 'axios';

// Get reservations by day
const getReservationsByDay = async (amenityId, date) => {
  const response = await axios.get('http://localhost:3000/api/reservations/by-day', {
    params: { amenityId, date }
  });
  return response.data;
};

// Get user bookings
const getUserBookings = async (userId) => {
  const response = await axios.get('http://localhost:3000/api/reservations/by-user', {
    params: { userId }
  });
  return response.data;
};

// Register a new user
const registerUser = async (userData) => {
  const response = await axios.post('http://localhost:3000/api/auth/register', userData);
  return response.data;
};

// Login
const login = async (username, password) => {
  const response = await axios.post('http://localhost:3000/api/auth/login', {
    username,
    password
  });
  return response.data;
};

// Usage
registerUser({
  username: 'johndoe',
  password: 'securepassword123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com'
});

login('johndoe', 'securepassword123');
```

---

## Testing with Postman

1. **Register User**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "username": "johndoe",
       "password": "securepassword123",
       "first_name": "John",
       "last_name": "Doe",
       "email": "john.doe@example.com"
     }
     ```

2. **Login**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "username": "johndoe",
       "password": "securepassword123"
     }
     ```

3. **Get Reservations by Day**
   - Method: `GET`
   - URL: `http://localhost:3000/api/reservations/by-day`
   - Params: 
     - `amenityId`: `507f1f77bcf86cd799439011`
     - `date`: `2024-01-15`

4. **Get User Bookings**
   - Method: `GET`
   - URL: `http://localhost:3000/api/reservations/by-user`
  - Params:
    - `userId`: `507f1f77bcf86cd799439021`

---

## Error Responses

### Authentication Errors

**Username already exists:**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

**Invalid credentials:**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

### Other Errors

**Invalid date format:**
```json
{
  "success": false,
  "error": "Invalid date format"
}
```

**No file uploaded:**
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

