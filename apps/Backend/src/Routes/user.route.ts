import express from "express";
import { PrismaClient } from "@prisma/client";

import { body } from "express-validator";
import { authenticate_User } from "../Middlewares/authenticate.user";
import {
  CreateOrder,
  // editAddress,
  editProfile,
  getData,
  getOrderDetails,
  getProfileData,
} from "../Controller/user.controller";
import { getProfile } from "../Controller/auth.controller";

const userRouter = express.Router();

const Client = new PrismaClient();

userRouter.get("/profile", authenticate_User, getProfileData);

userRouter.post(
  "/editProfile",
  [
    body("name").optional().isString().withMessage("Invalid name"),
    body("Gender")
      .optional()
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender"),
    body("dateofbirth")
      .optional()
      .notEmpty()
      .withMessage("Date of birth is required"),
    body("alternateNumber")
      .optional()
      .isMobilePhone("any")
      .withMessage("Invalid alternate number"),
    body("alternateNumberName")
      .optional()
      .isString()
      .withMessage("Alternate number name must be a string"),
    body("phoneNumber")
      .notEmpty()
      .isMobilePhone("any")
      .withMessage("Invalid primary phone number"),
    body("countryCode")
      .optional()
      .isString()
      .withMessage("Invalid country code"),
  ],
  authenticate_User,
  editProfile
);

// userRouter.post(
//   "/editAddress",
//   [
//     body("address").isString().withMessage("Address must be a string"),
//     body("city").isString().withMessage("City must be a string"),
//     body("state").isString().withMessage("State must be a string"),
//     body("pincode").isPostalCode("any").withMessage("Invalid pincode"),
//     body("locality")
//       .optional()
//       .isString()
//       .withMessage("Landmark must be a string"),
//     body("addressType")
//       .isIn(["Home", "Work", "Other"])
//       .withMessage("Invalid address type"),
//   ],
//   authenticate_User,
//   editAddress
// );

userRouter.post("/updateEmail", authenticate_User, async (req, res) => {
  const userId = req.user_id;
  const { email } = req.body;

  console.log(email);
  console.log(userId);

  try {
    await Client.users.update({
      where: { id: Number(userId) },
      data: { email: email },
    });

    res.status(200).json({ message: "Email is updated" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// order route

userRouter.post("/order", authenticate_User, CreateOrder);

userRouter.get("/order/:id", authenticate_User, getOrderDetails);

userRouter.post("/wishlist/toggle", authenticate_User, async (req, res) => {
  const userId = req.user_id;
  const { productId } = req.body;

  try {
    const existing = await Client.wishlist.findFirst({
      where: { userId: Number(userId), productId },
    });

    if (existing) {
      // Remove from wishlist
      await Client.wishlist.delete({
        where: { id: existing.id },
      });
      res.json({ isWishlisted: false });
    } else {
      // Add to wishlist
      await Client.wishlist.create({
        data: { userId: Number(userId), productId },
      });
      res.json({ isWishlisted: true });
    }
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// toggle

userRouter.get("/wishlist/check", authenticate_User, async (req, res) => {
  const userId = Number(req.user_id);
  const productId = Number(req.query.productId);

  try {
    const exists = await Client.wishlist.findFirst({
      where: { userId, productId },
    });

    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ error: "Failed to check wishlist" });
  }
});

// Get all wishlist products

userRouter.get("/wishlist", authenticate_User, async (req, res) => {
  const userId = req.user_id;

  try {
    const wishlist = await Client.wishlist.findMany({
      where: { userId: Number(userId) },
      include: {
        product: true, // We'll manually attach productAttribute below
      },
    });

    // Manually attach product attributes (front and back images)
    const wishlistWithAttributes = await Promise.all(
      wishlist.map(async (item) => {
        const attributes = await Client.productAttribute.findMany({
          where: {
            productId: item.product.id,
            attributename: {
              in: ["Front Image", "Product Description"], // only fetch image attributes
            },
          },
        });

        return {
          ...item,
          product: {
            ...item.product,
            productAttribute: attributes, // append manually
          },
        };
      })
    );

    console.log(wishlistWithAttributes);

    res.status(200).json(wishlistWithAttributes);
  } catch (err) {
    console.error("Wishlist fetch error:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

userRouter.post("/by-category", getData);

// Example: Express/Next.js handler
userRouter.post("/cart/add", authenticate_User, async (req, res) => {
  const { productId, size } = req.body;
  const userId = Number(req.user_id);

  if (!productId || !size) {
    res.status(400).json({ error: "Missing fields" });
  }

  const newCartItem = await Client.cartItem.create({
    data: {
      userId,
      productId,
      size,
    },
  });

  res.status(200).json(newCartItem);
});

userRouter.get("/cart", authenticate_User, async (req, res) => {
  const userId = Number(req.user_id);

  try {
    const response = await Client.cartItem.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: {
            productAttribute: true, // includes image URLs or any other attributes
          },
        },
      },
    });
    res.status(200).json({ response });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ error: "Failed to fetch cartItems" });
  }
});

userRouter.get("/cart/check/:id", authenticate_User, async (req, res) => {
  const userId = Number(req.user_id);

  const id = Number(req.params.id);

  console.log(userId, id);

  try {
    const response = await Client.cartItem.findMany({
      where: {
        AND: [{ productId: id }, { userId: userId }],
      },
    });

    res
      .status(200)
      .json({ inCart: response.length > 0, size: response[0].size });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ error: "Failed to fetch cartItems" });
  }
});

// update address

userRouter.post("/editAddress", authenticate_User, async (req, res) => {
  const {
    name,
    mobile,
    pincode,
    state,
    address,
    locality,
    city,
    typeOfAddress,
    isDefault,
  } = req.body.data;

  const userId = Number(req.user_id);
  console.log(userId);

  console.log(req.body.data);
  console.log(
    name,
    mobile,
    pincode,
    state,
    address,
    locality,
    city,
    typeOfAddress,
    isDefault
  );

  try {
    if (isDefault) {
      await Client.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await Client.userAddress.create({
      data: {
        userId,
        name,
        mobile,
        pincode,
        state,
        address,
        locality,
        city,
        typeOfAddress,
        isDefault: isDefault || false,
      },
    });

    res.status(200).json({ newAddress });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

userRouter.get("/getAddresses", authenticate_User, async (req, res) => {
  const userId = Number(req.user_id);

  try {
    const response = await Client.userAddress.findMany({
      where: { userId },
    });
    res.status(200).json({ addresses: response });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

userRouter.delete("/address/:id", authenticate_User, async (req, res) => {
  const addressId = parseInt(req.params.id);

  try {
    // Assuming you have the user's ID from authenticate_User middleware
    const userId = Number(req.user_id);

    await Client.userAddress.deleteMany({
      where: {
        id: addressId,
        userId, // Make sure address belongs to the authenticated user
      },
    });

    res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    console.error("Delete address error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while deleting the address." });
  }
});

userRouter.get("/cart/:id", authenticate_User, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const ProductData = await Client.product.findMany({
      where: { id: id },
      include: {
        productAttribute: true,
      },
    });
    console.log(ProductData);
    res.status(200).json({ ProductData });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

userRouter.delete("/delete/cartItem/:id", authenticate_User, async (req, res) => {
  const id = req.params.id;
  const userId = Number(req.user_id);

  console.log(id,userId)
  try {
    const response = await Client.cartItem.delete({
      where:{
        id: Number(id), userId: userId
      }
    })
    console.log("hi",response)

    res.status(200).json({message: "The cart is deleted"})
  } catch (error) {
    res.status(500).json({error: error})
  }
});

export default userRouter;
