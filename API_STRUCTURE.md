# Backend API Structure

This document outlines the API endpoints needed for a production-ready backend.

## Authentication Endpoints

### POST /api/auth/send-otp
Send OTP to phone number
```json
Request:
{
  "phoneNumber": "+1234567890"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

### POST /api/auth/verify-otp
Verify OTP and create session
```json
Request:
{
  "phoneNumber": "+1234567890",
  "otp": "123456",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "phoneNumber": "+1234567890",
    "name": "John Doe"
  }
}
```

### POST /api/auth/logout
Logout and invalidate session
```json
Request:
{
  "token": "jwt-token"
}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Location Endpoints

### POST /api/location/update
Update user's current location
```json
Request:
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10,
  "timestamp": 1234567890
}

Response:
{
  "success": true,
  "locationId": "location-id"
}
```

### POST /api/location/share
Start sharing location
```json
Request:
{
  "duration": 60,
  "allowedPhones": ["+1234567890"],
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 10
  }
}

Response:
{
  "success": true,
  "trackingId": "tracking-id",
  "shareLink": "https://app.com/track/tracking-id",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### GET /api/location/track/:trackingId
Get location by tracking ID
```json
Query Parameters:
- phoneNumber (optional): Phone number for verification

Response:
{
  "success": true,
  "location": {
    "id": "tracking-id",
    "userId": "user-id",
    "userName": "John Doe",
    "phoneNumber": "+1234567890",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 10,
    "timestamp": 1234567890,
    "isSharing": true
  },
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### DELETE /api/location/share/:trackingId
Stop sharing location
```json
Response:
{
  "success": true,
  "message": "Location sharing stopped"
}
```

### GET /api/location/history
Get user's location history
```json
Query Parameters:
- from: Start timestamp
- to: End timestamp
- limit: Number of results (default: 50)

Response:
{
  "success": true,
  "locations": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "accuracy": 10,
      "timestamp": 1234567890
    }
  ],
  "total": 100
}
```

## WebSocket Events

For real-time location updates:

### Connection
```javascript
const socket = io('wss://api.example.com', {
  auth: { token: 'jwt-token' }
})
```

### Events

#### location:update (client → server)
```json
{
  "trackingId": "tracking-id",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10,
  "timestamp": 1234567890
}
```

#### location:updated (server → client)
```json
{
  "trackingId": "tracking-id",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 10,
    "timestamp": 1234567890
  }
}
```

#### tracking:subscribe (client → server)
```json
{
  "trackingId": "tracking-id"
}
```

#### tracking:unsubscribe (client → server)
```json
{
  "trackingId": "tracking-id"
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes
- `INVALID_OTP`: OTP is invalid or expired
- `PHONE_NOT_FOUND`: Phone number not registered
- `UNAUTHORIZED`: Invalid or missing authentication
- `TRACKING_EXPIRED`: Tracking link has expired
- `ACCESS_DENIED`: Phone number not in allowed list
- `LOCATION_UNAVAILABLE`: Location data not available
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### OTP Table
```sql
CREATE TABLE otps (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Locations Table
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy FLOAT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Shared Locations Table
```sql
CREATE TABLE shared_locations (
  id UUID PRIMARY KEY,
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy FLOAT,
  duration INTEGER NOT NULL,
  allowed_phones TEXT[],
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on OTP endpoints (max 5 per hour per phone)
2. **OTP Expiration**: OTPs should expire after 5 minutes
3. **JWT Tokens**: Use short-lived JWTs (1 day) with refresh tokens
4. **HTTPS Only**: All endpoints must use HTTPS
5. **CORS**: Configure CORS to only allow your frontend domain
6. **Input Validation**: Validate all inputs, especially phone numbers and coordinates
7. **Data Encryption**: Encrypt sensitive data at rest
8. **Audit Logs**: Log all location sharing activities
9. **Privacy**: Auto-delete location data after 30 days
10. **Geofencing**: Implement optional geofencing for alerts

## Technology Stack Recommendations

- **Backend**: Node.js with Express or NestJS
- **Database**: PostgreSQL with PostGIS extension for geospatial queries
- **Real-time**: Socket.io or WebSocket
- **Authentication**: JWT with Redis for session storage
- **SMS Service**: Twilio, AWS SNS, or similar for OTP delivery
- **Caching**: Redis for frequently accessed data
- **File Storage**: AWS S3 or similar for static assets
- **Monitoring**: Sentry, DataDog, or similar
- **Hosting**: AWS, Google Cloud, or Vercel
