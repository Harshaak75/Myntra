import { PrismaClient } from "@prisma/client";
import { JwtPayload, Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const Client = new PrismaClient();

export const authorizeAdmin = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      // Ensure `admin_id` exists before using it
      if (!req.admin_id) {
        return res.status(400).json({ message: "Admin ID is missing" });
      }

      // Convert admin_id to a number
      const adminId = Number(req.admin_id);
      if (isNaN(adminId)) {
        return res.status(400).json({ message: "Invalid admin ID format" });
      }

      // Find admin in database
      const admin = await Client.admin_users.findUnique({
        where: { id: adminId },
      });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      console.log(admin.role)

      if (!roles.includes(admin.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next(); // ✅ Proceed if admin has access
    } catch (error) {
      next(error); // ✅ Pass errors to Express error handler
    }
  };
};
