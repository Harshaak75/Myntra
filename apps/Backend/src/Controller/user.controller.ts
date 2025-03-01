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

  if (Object.keys(userData).length == 0) {
    return res.send(200).json({ message: "Ther is no update from user" });
  }

  try {
    const updatedUser = await Client.userProfile.upsert({
        where: { id: Number(userId)},
        update: {
            Gender: req.body.Gender,
            dateofbirth: new Date(req.body.dateofbirth),
            alternateNumber: req.body.alternateNumber,
            alternateNumberName: req.body.alternateNumberName
        },
        create: {
            userId: Number(userId),
            Gender: req.body.Gender,
            dateofbirth: new Date(req.body.dateofbirth),
            alternateNumber: req.body.alternateNumber,
            alternateNumberName: req.body.alternateNumberName
        }
    })

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};
