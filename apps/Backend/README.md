# Backend API Documentation

## `/userAuth/send-otp` Endpoints

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

## `/userAuth/verify-otp` Endpoints

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

## `/user/profile` Endpoints

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

## `/user/editProfile` Endpoints

**Description:**  
This endpoint allows the authenticated user to edit their profile information.

**HTTP Method:**  
`POST`

**Headers:**  
- **Authorization:** Bearer token

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "Gender": "Male",
    "dateofbirth": "1990-01-01",
    "alternateNumber": "1234567890",
    "alternateNumberName": "John Doe"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** User profile updated successfully.
  - **Example:**
    ```json
    {
      "id": "user_id",
      "Gender": "Male",
      "dateofbirth": "1990-01-01T00:00:00.000Z",
      "alternateNumber": "1234567890",
      "alternateNumberName": "John Doe"
    }
    ```

- **400 Bad Request**
  - **Description:** The request body is missing required fields or contains invalid data.
  - **Example:**
    ```json
    {
      "message": "There is no update from user"
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

- **500 Internal Server Error**
  - **Description:** An error occurred while updating the profile.
  - **Example:**
    ```json
    {
      "message": "Error updating profile",
      "error": "error details"
    }
    ```