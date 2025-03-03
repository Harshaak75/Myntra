import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { json } from "stream/consumers";
import { PrismaClient } from "@prisma/client";

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
    const updatedUser = await Client.userProfile.upsert({
      where: { userId: Number(userId) },
      update: {
        Gender: req.body.Gender,
        dateofbirth: new Date(req.body.dateofbirth),
        alternateNumber: req.body.alternateNumber,
        alternateNumberName: req.body.alternateNumberName,
      },
      create: {
        userId: Number(userId),
        Gender: req.body.Gender,
        dateofbirth: new Date(req.body.dateofbirth),
        alternateNumber: req.body.alternateNumber,
        alternateNumberName: req.body.alternateNumberName,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};


export const editAddress = async(  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  const userId = req.user_id;
  const userData = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if(Object.keys(req.body).length == 0){
    return res.status(200).json({message: "There is no update from user"})
  }

  try {
    const updateAddress_user = await Client.userAddress.upsert({
      where: {userId: Number(userId)},
      update: {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        Locality: req.body.locality,
        typeOfAddress: req.body.addressType
      },
      create: {
        userId: Number(userId),
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        Locality: req.body.locality,
        typeOfAddress: req.body.addressType
      }
    })

    return res.status(200).json({message: "Address updated successfully",  updateAddress_user})
  } catch (error) {
    res.status(500).json({message: "Error updating address", error})
  }
}