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

## `/user/editAddress` Endpoints

**Description:**  
This endpoint allows the authenticated user to edit their address information.

**HTTP Method:**  
`POST`

**Headers:**  
- **Authorization:** Bearer token

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "locality": "Downtown",
    "addressType": "Home"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** User address updated successfully.
  - **Example:**
    ```json
    {
      "message": "Address updated successfully",
      "updateAddress_user": {
        "userId": "user_id",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "pincode": "10001",
        "Locality": "Downtown",
        "typeOfAddress": "Home"
      }
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
  - **Description:** An error occurred while updating the address.
  - **Example:**
    ```json
    {
      "message": "Error updating address",
      "error": "error details"
    }
    ```

## `/admin/login` Endpoints

**Description:**  
This endpoint allows an admin to log in to the system.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Admin logged in successfully.
  - **Example:**
    ```json
    {
      "message": "Logged In Successfully",
      "token": "your_jwt_token_here"
    }
    ```

## `/admin/create` Endpoints

**Description:**  
This endpoint allows the creation of a new admin.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "adminpassword",
    "role": "admin"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Admin created successfully.
  - **Example:**
    ```json
    {
      "message": "Admin Created Successfully",
      "token": "your_jwt_token_here"
    }
    ```

## `/admin/get` Endpoints

**Description:**  
This endpoint retrieves all admins.

**HTTP Method:**  
`GET`

**Response:**

- **200 OK**
  - **Description:** Admins retrieved successfully.
  - **Example:**
    ```json
    {
      "admins": [
        {
          "id": "admin_id",
          "name": "Admin Name",
          "email": "admin@example.com",
          "role": "admin"
        },
        {
          "id": "admin_id",
          "name": "Super Admin Name",
          "email": "superadmin@example.com",
          "role": "super_admin"
        }
      ]
    }
    ```

## `/seller/register` Endpoints

**Description:**  
This endpoint registers a new seller.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "name": "Seller Name",
    "email": "seller@example.com",
    "password": "sellerpassword",
    "phone": "1234567890"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Seller registered successfully.
  - **Example:**
    ```json
    {
      "message": "The seller account was created",
      "sellerToken": "your_jwt_token_here"
    }
    ```

- **400 Bad Request**
  - **Description:** The request body is missing required fields or contains invalid data.
  - **Example:**
    ```json
    {
      "message": "Seller already exists"
    }
    ```

## `/seller/login` Endpoints

**Description:**  
This endpoint logs in a seller.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "email": "seller@example.com",
    "password": "sellerpassword"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Seller logged in successfully.
  - **Example:**
    ```json
    {
      "message": "Seller logged in successfully",
      "sellerToken": "your_jwt_token_here"
    }
    ```

- **400 Bad Request**
  - **Description:** Invalid credentials.
  - **Example:**
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

## `/seller/seller_profile` Endpoints

**Description:**  
This endpoint provides the authenticated seller's profile data. It requires the seller to be authenticated.

**HTTP Method:**  
`GET`

**Headers:**  
- **Authorization:** Bearer token

**Response:**

- **200 OK**
  - **Description:** Seller profile data retrieved successfully.
  - **Example:**
    ```json
    {
      "message": "Seller profile",
      "sellerprofile": {
        "id": "seller_id",
        "name": "Seller Name",
        "email": "seller@example.com",
        "phone": "1234567890"
      }
    }
    ```

## `/seller/add_product` Endpoints

**Description:**  
This endpoint allows the authenticated seller to add a new product.

**HTTP Method:**  
`POST`

**Headers:**  
- **Authorization:** Bearer token

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "brand": "Product Brand",
    "category": "Product Category",
    "subCategory": "Product SubCategory",
    "price": 100.0,
    "discount": 10,
    "stock": 50,
    "sizeOptions": ["S", "M", "L"],
    "colorOptions": ["Red", "Blue"],
    "images": ["image1_url", "image2_url"],
    "rating": 4.5,
    "reviewsCount": 10
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Product added successfully.
  - **Example:**
    ```json
    {
      "message": "The product was added successfully",
      "product": {
        "id": "product_id",
        "name": "Product Name",
        "description": "Product Description",
        "brand": "Product Brand",
        "category": "Product Category",
        "subCategory": "Product SubCategory",
        "price": 100.0,
        "discount": 10,
        "stock": 50,
        "sizeOptions": ["S", "M", "L"],
        "colorOptions": ["Red", "Blue"],
        "images": ["image1_url", "image2_url"],
        "rating": 4.5,
        "reviewsCount": 10,
        "sellerId": "seller_id"
      }
    }
    ```

- **400 Bad Request**
  - **Description:** The request body is missing required fields or contains invalid data.
  - **Example:**
    ```json
    {
      "errors": [
        {
          "msg": "Name must be a string",
          "param": "name",
          "location": "body"
        }
      ]
    }
    ```

## `/seller/product/:id` Endpoints

**Description:**  
This endpoint allows the authenticated seller to update an existing product.

**HTTP Method:**  
`PUT`

**Headers:**  
- **Authorization:** Bearer token

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "name": "Updated Product Name",
    "description": "Updated Product Description",
    "brand": "Updated Product Brand",
    "category": "Updated Product Category",
    "subCategory": "Updated Product SubCategory",
    "price": 120.0,
    "discount": 15,
    "stock": 60,
    "sizeOptions": ["S", "M", "L", "XL"],
    "colorOptions": ["Green", "Yellow"],
    "images": ["updated_image1_url", "updated_image2_url"],
    "rating": 4.8,
    "reviewsCount": 15
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Product updated successfully.
  - **Example:**
    ```json
    {
      "message": "The product was updated successfully",
      "product": {
        "id": "product_id",
        "name": "Updated Product Name",
        "description": "Updated Product Description",
        "brand": "Updated Product Brand",
        "category": "Updated Product Category",
        "subCategory": "Updated Product SubCategory",
        "price": 120.0,
        "discount": 15,
        "stock": 60,
        "sizeOptions": ["S", "M", "L", "XL"],
        "colorOptions": ["Green", "Yellow"],
        "images": ["updated_image1_url", "updated_image2_url"],
        "rating": 4.8,
        "reviewsCount": 15,
        "sellerId": "seller_id"
      }
    }
    ```

- **400 Bad Request**
  - **Description:** The request body is missing required fields or contains invalid data.
  - **Example:**
    ```json
    {
      "errors": [
        {
          "msg": "Name must be a string",
          "param": "name",
          "location": "body"
        }
      ]
    }
    ```

## `/productAdmin/login` Endpoints

**Description:**  
This endpoint allows a product admin to log in to the system.

**HTTP Method:**  
`POST`

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Product admin logged in successfully.
  - **Example:**
    ```json
    {
      "message": "Logged In Successfully",
      "token": "your_jwt_token_here"
    }
    ```

## `/productAdmin/product/edit/:id` Endpoints

**Description:**  
This endpoint allows a product admin to edit a product.

**HTTP Method:**  
`PUT`

**Headers:**  
- **Authorization:** Bearer token

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "name": "Updated Product Name",
    "description": "Updated Product Description",
    "brand": "Updated Product Brand",
    "category": "Updated Product Category",
    "subCategory": "Updated Product SubCategory",
    "price": 120.0,
    "discount": 15,
    "stock": 60,
    "sizeOptions": ["S", "M", "L", "XL"],
    "colorOptions": ["Green", "Yellow"],
    "images": ["updated_image1_url", "updated_image2_url"],
    "rating": 4.8,
    "reviewsCount": 15
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Product updated successfully.
  - **Example:**
    ```json
    {
      "message": "The product was updated successfully",
      "product": {
        "id": "product_id",
        "name": "Updated Product Name",
        "description": "Updated Product Description",
        "brand": "Updated Product Brand",
        "category": "Updated Product Category",
        "subCategory": "Updated Product SubCategory",
        "price": 120.0,
        "discount": 15,
        "stock": 60,
        "sizeOptions": ["S", "M", "L", "XL"],
        "colorOptions": ["Green", "Yellow"],
        "images": ["updated_image1_url", "updated_image2_url"],
        "rating": 4.8,
        "reviewsCount": 15,
        "sellerId": "seller_id"
      }
    }
    ```

## `/productAdmin/product/delete/:id` Endpoints

**Description:**  
This endpoint allows a product admin to delete a product.

**HTTP Method:**  
`DELETE`

**Headers:**  
- **Authorization:** Bearer token

**Response:**

- **200 OK**
  - **Description:** Product deleted successfully.
  - **Example:**
    ```json
    {
      "message": "Product deleted successfully"
    }
    ```

## `/productAdmin/product/getAll` Endpoints

**Description:**  
This endpoint retrieves all seller data.

**HTTP Method:**  
`GET`

**Headers:**  
- **Authorization:** Bearer token

**Response:**

- **200 OK**
  - **Description:** Seller data retrieved successfully.
  - **Example:**
    ```json
    {
      "message": "Seller data",
      "seller_details": [
        {
          "id": "seller_id",
          "name": "Seller Name",
          "email": "seller@example.com",
          "phone": "1234567890"
        }
      ]
    }
    ```

## `/productAdmin/product/:id/approval` Endpoints

**Description:**  
This endpoint allows a product admin to approve or disapprove a product.

**HTTP Method:**  
`PUT`

**Headers:**  
- **Authorization:** Bearer token

**Request Body:**  
- **Format:** JSON
- **Example:**
  ```json
  {
    "approve": true
  }
  ```

**Response:**

- **200 OK**
  - **Description:** Product approval status updated successfully.
  - **Example:**
    ```json
    {
      "message": "Product approved successfully"
    }
    ```