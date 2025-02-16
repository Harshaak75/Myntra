# Backend API Documentation

## /api/auth/send-otp Endpoints

**Description:**  
This endpoint sends a one-time password (OTP) to the user's registered email address to verify their identity.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** OTP sent successfully.
  - **Example:**
    ```json
    {
      "message": "OTP sent successfully",
      "token": "your_jwt_token_here"
    }
    ```