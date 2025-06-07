import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  create_the_order,
  get_user_order_details,
} from "../Services/user.services";

// import moment = require("moment");

import moment from "moment";
import { bucket_name_pattern } from "../config";
import supabase1 from "../utils/Supabase.connect.image";

dotenv.config();

const Client = new PrismaClient();

export const getProfileData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.user_id;

  try {
    const user = await Client.users.findUnique({
      where: { id: Number(userId) },
      select: {
        name: true,
        email: true,
        phoneNumber: {
          select: {
            number: true,
            countryCode: true,
          },
        },
        userProfile: {
          select: {
            Gender: true,
            dateofbirth: true,
            alternateNumber: true,
            alternateNumberName: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber?.number || "",
      countryCode: user.phoneNumber?.countryCode || "+91",
      gender: user.userProfile?.Gender || "",
      dateofbirth: user.userProfile?.dateofbirth || null,
      alternateNumber: user.userProfile?.alternateNumber || "",
      alternateNumberName: user.userProfile?.alternateNumberName || "",
    });
  } catch (error) {
    console.error("Failed to get profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.user_id;
  const {
    name,
    Gender,
    dateofbirth,
    alternateNumber,
    alternateNumberName,
    phoneNumber,
    countryCode = "+91",
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!Gender || !dateofbirth || !phoneNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const formattedDate = moment(
      dateofbirth,
      ["YYYY-MM-DD", "DD-MM-YYYY", "YYYY/MM/DD"],
      true
    );
    if (!formattedDate.isValid()) {
      return res
        .status(400)
        .json({ error: "Invalid date format (YYYY-MM-DD expected)" });
    }

    // Update user name if provided
    if (name) {
      await Client.users.update({
        where: { id: Number(userId) },
        data: { name },
      });
    }

    // Upsert user profile
    await Client.userProfile.upsert({
      where: { userId: Number(userId) },
      update: {
        Gender,
        dateofbirth: formattedDate.toDate(),
        alternateNumber,
        alternateNumberName,
      },
      create: {
        userId: Number(userId),
        Gender,
        dateofbirth: formattedDate.toDate(),
        alternateNumber,
        alternateNumberName,
      },
    });

    // Upsert phone number
    await Client.phoneNumber.upsert({
      where: { userId: Number(userId) },
      update: {
        number: phoneNumber,
        countryCode,
      },
      create: {
        userId: Number(userId),
        number: phoneNumber,
        countryCode,
      },
    });

    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error });
  }
};

// export const editAddress = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   const userId = req.user_id;
//   const userData = req.body;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   if (Object.keys(req.body).length == 0) {
//     return res.status(200).json({ message: "There is no update from user" });
//   }

//   try {
//     const updateAddress_user = await Client.userAddress.upsert({
//       where: { userId: Number(userId) },
//       update: {
//         address: req.body.address,
//         city: req.body.city,
//         state: req.body.state,
//         pincode: req.body.pincode,
//         Locality: req.body.locality,
//         typeOfAddress: req.body.addressType,
//       },
//       create: {
//         userId: Number(userId),
//         address: req.body.address,
//         city: req.body.city,
//         state: req.body.state,
//         pincode: req.body.pincode,
//         Locality: req.body.locality,
//         typeOfAddress: req.body.addressType,
//       },
//     });

//     return res
//       .status(200)
//       .json({ message: "Address updated successfully", updateAddress_user });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating address", error });
//   }
// };

// order

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user_id;
    const { cartitems } = req.body;

    console.log("Received cart items:", cartitems);

    let order_created;

    for (const item of cartitems) {
      const product_id = item.productId;

      console.log(item);

      if (!product_id) {
        console.log("Missing productId for item:", item);
        continue;
      }

      order_created = await create_the_order(userId, item, product_id);
      console.log("Order created:", order_created);
    }

    // const product_id = data.productid;

    // const order_created: any = await create_the_order(userId, data, product_id);

    // if ("message" in order_created) {
    //   return res.status(404).json({ message: order_created.message });
    // }

    // console.log(order_created);

    return res
      .status(200)
      .json({ message: "Order created successfully", order_created });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order" });
  }
};

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orderId = req.params;

    console.log(orderId);

    const userId = req.user_id;

    const order_details: any = await get_user_order_details(userId);

    if (!order_details.orders || order_details.orders.length === 0) {
      return res.status(400).json({ message: "Error fetching order details" });
    }

    return res.status(200).json({
      message: "Order details fetched successfully",
      orders: order_details.orders.map((order: any) => ({
        quantity: order.quantity,
        orderCode: order.orderCode,
        totalPrice: order.totalPrice,
        status: order.status,
        orderDate: order.createdAt,
        product: {
          title: order.product.productAttribute.find(
            (attr: any) => attr.attributename === "Product Title"
          )?.attributevalue,
          price: order.product.price,
          description: order.product.productAttribute.find(
            (attr: any) => attr.attributename === "Product Description"
          )?.attributevalue,
          category: order.product.productAttribute.find(
            (attr: any) => attr.attributename === "Usage"
          )?.attributevalue,
          brand: order.product.name,
          image: order.product.productAttribute.find(
            (attr: any) => attr.attributename === "Front Image"
          )?.attributevalue,
          discount: order.product.discount,
          sizeOption: order.selectedSize,
          colorOption: order.selectedColor,
          created_at: order.createdAt,
          PatternLink: order.buyerPatternLink,
        },
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching order detail" });
  }
};

export const getData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { usage, Gender } = req.body;
  if (!usage) return res.status(400).json({ error: "Usage category required" });

  try {
    const category = usage;
    const categoryType = category.replace(/-/g, "").toUpperCase();

    console.log("Category Type:", categoryType, Gender);

    let products = await Client.product.findMany({
      where: {
        isActive: true,
        approved: true,
        productAttribute: {
          some: {
            attributename: {
              equals: "Gender",
              mode: "insensitive",
            },
            attributevalue: {
              equals: Gender, // gender = "Male" | "Female" | etc.
              mode: "insensitive",
            },
          },
        },
        OR: [
          {
            productType: {
              contains: categoryType,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        productAttribute: {
          where: {
            attributename: {
              in: ["brand", "Front Image", "Back Image", "Product Title"],
              mode: "insensitive",
            },
          },
          select: {
            attributename: true,
            attributevalue: true,
          },
        },
      },
    });

    if (products.length == 0) {
      products = await Client.product.findMany({
        where: {
          isActive: true,
          approved: true,
          productAttribute: {
            some: {
              attributename: {
                equals: "Usage",
                mode: "insensitive",
              },
              attributevalue: {
                equals: usage,
                mode: "insensitive",
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          productAttribute: {
            where: {
              attributename: {
                in: ["brand", "Front Image", "Back Image", "Product Title"],
                mode: "insensitive",
              },
            },
            select: {
              attributename: true,
              attributevalue: true,
            },
          },
        },
      });
    }

    console.log("pro", products);

    const formatted = products.map((p) => {
      const attrs: Record<string, string> = {};
      p.productAttribute.forEach((attr) => {
        attrs[attr.attributename] = attr.attributevalue;
      });

      return {
        id: p.id,
        name: attrs["Product Title"] || "",
        price: p.price,
        brand: p.name || "",
        frontImage: attrs["Front Image"] || "", // match DB key exactly
        backImage: attrs["Back Image"] || "", // match DB key exactly
        offer: "15% OFF",
      };
    });

    console.log(formatted);

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// pattern

export const upload_pattern = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const userId = req.user_id;

  try {
    const file_name = `pattern/${Date.now()}_${req.file.originalname}`;
    const id = req.body.productid;
    const size = req.body.size;

    if (!bucket_name_pattern) {
      return res.status(400).json({ message: "Bucket name is required" });
    }

    const { data, error } = await supabase1.storage
      .from(bucket_name_pattern)
      .upload(file_name, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res
        .status(500)
        .json({ message: "Error uploading file", error: error });
    }

    const { data: publicUrlData } = supabase1.storage
      .from(bucket_name_pattern)
      .getPublicUrl(file_name);

    const publicUrl = publicUrlData?.publicUrl;

    // const response = await Client.productAttribute.create({
    //   data: {
    //     productId: Number(id),
    //     attributename: "patternLink",
    //     attributevalue: publicUrl,
    //   },
    // });

    console.log("Public URL:", typeof publicUrl);

    console.log(typeof size);
    console.log(userId);

    const response = await Client.cartItem.update({
      where: {
        userId_productId_size: {
          userId: Number(userId), // Make sure these are numbers
          productId: Number(id), // Make sure these are numbers
          size: size, // This can be any valid string
        },
      },
      data: {
        customPatternLink: publicUrl,
      },
    });

    console.log("Public URL:", publicUrl);

    console.log("response", response);

    res.status(200).json({ message: "The pattern added" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
