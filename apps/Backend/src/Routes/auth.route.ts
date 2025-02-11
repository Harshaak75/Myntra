import express from 'express';
import  { body } from "express-validator"
import { auth_the_user, verify_the_otp } from '../Controller/auth.controller';

const router = express.Router();

router.post("/send-otp", [
    body("email").notEmpty().withMessage("Enter your email address").isEmail().withMessage("Enter proper email address.")
],
auth_the_user
)

router.post("/verify-otp", [
    body("email").notEmpty().withMessage("Enter your email address").isEmail().withMessage("Enter proper email address."),
    body('otp').notEmpty().withMessage("Enter the OTP. ")
],
verify_the_otp
)

export default router;