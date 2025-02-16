# Backend API Documentation

## `/api/auth/send-otp` Endpoints

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
    }
    ```

## `/api/auth/verify-otp` Endpoints

**Description:**  
This endpoint verifies the OTP sent to the user's email address. It is used to confirm the user's identity by checking the OTP provided by the user.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** OTP verified successfully.
  - **Example:**
    ```json
    {
      "message": "OTP verified successfully",
      "token": "your_jwt_token_here"
    }
    ```