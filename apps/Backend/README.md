# Backend API Documentation

## `/users/send-otp` Endpoints

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

## `/users/verify-otp` Endpoints

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

## `/users/profile` Endpoints

**Description:**  
This endpoint provides the authenticated user's profile data. It requires the user to be authenticated.

**HTTP Method:**  
`GET`

**Headers:**  
- **Authorization:** Bearer token

**Response:**

- **200 OK**
  - **Description:** User profile data retrieved successfully.
  - **Example:**
    ```json
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name"
    }
    ```

- **401 Unauthorized**
  - **Description:** The user is not authenticated.
  - **Example:**
    ```json
    {
      "message": "Unauthorized"
    }
    ```