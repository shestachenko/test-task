# API Request Examples

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. GET /api
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

### 2. GET /api/reservations/by-day
Get reservations for a specific amenity on a specific date

**Request:**
```bash
# Using curl
curl "http://localhost:3000/api/reservations/by-day?amenityId=1&date=2024-01-15"

# Using date in different formats
curl "http://localhost:3000/api/reservations/by-day?amenityId=1&date=2024-01-15T00:00:00Z"
curl "http://localhost:3000/api/reservations/by-day?amenityId=1&date=1592611200000"
```

**Query Parameters:**
- `amenityId` (required) - Amenity ID (number)
- `date` (required) - Date in any parseable format

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "reservationId": "507f1f77bcf86cd799439011",
      "userId": 97,
      "startTime": "10:00",
      "duration": 300,
      "amenityName": "Tennis Court"
    },
    {
      "reservationId": "507f1f77bcf86cd799439012",
      "userId": 45,
      "startTime": "14:30",
      "duration": 120,
      "amenityName": "Tennis Court"
    }
  ]
}
```

---

### 3. GET /api/reservations/by-user
Get all bookings for a user grouped by day

**Request:**
```bash
# Using curl
curl "http://localhost:3000/api/reservations/by-user?userId=123"

# Or using PowerShell (Windows)
Invoke-RestMethod -Uri "http://localhost:3000/api/reservations/by-user?userId=123" -Method Get
```

**Query Parameters:**
- `userId` (required) - User ID (number)

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
          "amenityName": "Tennis Court"
        },
        {
          "reservationId": "507f1f77bcf86cd799439012",
          "startTime": "15:00",
          "duration": 90,
          "amenityName": "Swimming Pool"
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
          "amenityName": "Gym"
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
getReservationsByDay(1, '2024-01-15');
getUserBookings(123);
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
```

---

## Testing with Postman

1. **Get Reservations by Day**
   - Method: `GET`
   - URL: `http://localhost:3000/api/reservations/by-day`
   - Params: 
     - `amenityId`: `1`
     - `date`: `2024-01-15`

2. **Get User Bookings**
   - Method: `GET`
   - URL: `http://localhost:3000/api/reservations/by-user`
   - Params:
     - `userId`: `123`

---

## Error Responses

```json
{
  "success": false,
  "error": "Invalid date format"
}
```

```json
{
  "success": false,
  "error": "No file uploaded"
}
```

