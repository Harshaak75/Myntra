# User UI - Sign In Functionality

## Overview

This section of the User UI handles the Sign In functionality for the Myntra E-commerce Website. It includes the following components and pages:

- **Signin Page:** A form where users can enter their email to receive an OTP.
- **OtpVerification Component:** A form where users can enter the OTP sent to their email to verify their identity.

## Components

### Signin Page

**File:** `src/Pages/Signin.tsx`

**Description:**  
The Signin page allows users to enter their email address to receive an OTP for authentication.

**Key Features:**
- Email input field.
- Submit button to send OTP.
- Displays a loading spinner while the OTP is being sent.
- Redirects to the OTP verification page upon successful OTP sending.

### OtpVerification Component

**File:** `src/Components/OtpVerification.tsx`

**Description:**  
The OtpVerification component allows users to enter the OTP sent to their email to verify their identity.

**Key Features:**
- OTP input fields.
- Timer for OTP expiration.
- Resend OTP button.
- Submit button to verify OTP.
- Displays a loading spinner while the OTP is being verified.

## Usage

1. **Sign In:**
   - Navigate to the Sign In page.
   - Enter your email address.
   - Click the "Continue" button to receive an OTP.

2. **OTP Verification:**
   - Enter the OTP sent to your email in the OTP verification form.
   - Click the "Verify OTP" button to complete the authentication process.

## Dependencies

- **axios:** For making HTTP requests to the backend API.
- **react:** For building the user interface.
- **lucide-react:** For using icons in the Navbar component.

