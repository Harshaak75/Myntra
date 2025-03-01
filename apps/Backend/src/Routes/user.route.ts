import express from "express";

import {body} from "express-validator";
import { authenticate_User } from "../Middlewares/authenticate.user";
import { editProfile } from "../Controller/user.controller";
import { getProfile } from "../Controller/auth.controller";

const userRouter = express.Router();

userRouter.get("/profile", authenticate_User, getProfile);

userRouter.post("/editProfile", authenticate_User, editProfile)

export default userRouter;