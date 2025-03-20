import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { create_the_order, get_user_order_details } from "../Services/user.services";

import moment = require("moment");

dotenv.config();

const Client = new PrismaClient();

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.user_id;
  const userData = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (Object.keys(userData).length == 0) {
    return res.status(200).json({ message: "Ther is no update from user" });
  }

  try {

    const formattedDate = moment(req.body.dateofbirth, ["YYYY-MM-DD", "DD-MM-YYYY", "YYYY/MM/DD"], true);

    if(!formattedDate.isValid()){
      return res.status(400).json({ error: "Invalid date format (YYYY-MM-DD expected)" });
    }

    // new Date(req.body.dateofbirth)

    // console.log(formattedDate.toDate())

    const updatedUser = await Client.userProfile.upsert({
      where: { userId: Number(userId) },
      update: {
        Gender: req.body.Gender,
        dateofbirth: formattedDate.toDate(),
        alternateNumber: req.body.alternateNumber,
        alternateNumberName: req.body.alternateNumberName,
      },
      create: {
        userId: Number(userId),
        Gender: req.body.Gender,
        dateofbirth: formattedDate.toDate(),
        alternateNumber: req.body.alternateNumber,
        alternateNumberName: req.body.alternateNumberName,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

export const editAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.user_id;
  const userData = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (Object.keys(req.body).length == 0) {
    return res.status(200).json({ message: "There is no update from user" });
  }

  try {
    const updateAddress_user = await Client.userAddress.upsert({
      where: { userId: Number(userId) },
      update: {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        Locality: req.body.locality,
        typeOfAddress: req.body.addressType,
      },
      create: {
        userId: Number(userId),
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        Locality: req.body.locality,
        typeOfAddress: req.body.addressType,
      },
    });

    return res
      .status(200)
      .json({ message: "Address updated successfully", updateAddress_user });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
};

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
    const data = req.body;

    const product_id = data.productid;

    const order_created = await create_the_order(userId,data,product_id);

    if(!order_created){
      return res.status(400).json({message: "Error creating order"})
    }

    console.log(order_created)

    return res.status(200).json({message: "Order created successfully", order_created})
  } catch (error) {
    return res.status(500).json({message: "Error creating order"})
  }
};


export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  try {
    const orderId = req.params;

    console.log(orderId);

    const order_details: any = await get_user_order_details(orderId.id);

    if(!order_details.product || !order_details.order){
      return res.status(400).json({message: "Error fetching order details"})
    }

    console.log(order_details.order.quantity)

    return res.status(200).json({message: "Order details fetched successfully", order: {
      quantity: order_details.order.quantity,
      totalPrice: order_details.order.totalPrice,
      status: order_details.order.status,
      orderDate: order_details.order.createdAt,
      product: {
        name: order_details.product.name,
        price: order_details.product.price,
        description: order_details.product.description,
        category: order_details.product.category,
        barnd: order_details.product.brand,
        image: order_details.product.image,
        subCategory: order_details.product.subCategory,
        discount: order_details.product.discount,
        sizeOption: order_details.product.sizeOption,
        colorOption: order_details.product.colorOption,
        created_at: order_details.product.createdAt
      }
    }})
  } catch (error) {
    return res.status(500).json({message: "Error fetching order detail"})
  }
}