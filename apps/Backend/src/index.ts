import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./Routes/auth.route";

import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.route";

import adminRouter from "./Routes/admin.route";
import SellerRoute from "./Routes/Seller.route";
import productAdmin from "./Routes/ProductAdmin.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser())

// console.log(PORT)

// Middleware
// app.use(cors({
//   // origin: "http://localhost:3000",
//   credentials: true,
// }));

app.use(
  cors({
    // origin: "https://mynstars-opal.vercel.app",
    origin:"http://localhost:5173",
    credentials: true, // ✅ Allows sending cookies & authentication headers
    exposedHeaders: ["x-new-access-token", "Content-Disposition"], // Expose the custom header
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
