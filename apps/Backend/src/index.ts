import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./Routes/auth.route";

import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.route";

import adminRouter from "./Routes/admin.route";
import SellerRoute from "./Routes/Seller.route";
import productAdmin from "./Routes/ProductAdmin.route";

import "./jobs/uploadQueue"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser())

// app.use(
//   cors({
//     // origin: "https://mynstars-opal.vercel.app",
//     origin:"http://localhost:5173",
//     credentials: true, // ✅ Allows sending cookies & authentication headers
//     exposedHeaders: ["x-new-access-token", "Content-Disposition"], // Expose the custom header
//   })
// );

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.105:5173/",
  "https://mynstars-opal.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    exposedHeaders: ["x-new-access-token", "Content-Disposition"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from Express Backend!");
});

// hitting the server to avoid cold start

app.get("/ping", (req,res) =>{
  res.status(200).json({message:"Pong"})
})

app.use("/userAuth", auth);
app.use("/user",userRouter);

// Admin Routes
app.use("/admin", adminRouter);

// seller route
app.use("/seller",SellerRoute);

// Product Admin
app.use("/ProductAdmin", productAdmin);

// Start Server
export default app;
