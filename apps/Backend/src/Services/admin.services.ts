import { PrismaClient } from "@prisma/client";
import { generateTokensAdmin } from "../utils/tokenUtils";
import bcrypt from "bcrypt";
import { admin_serect, salt_rounds } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const Client = new PrismaClient();
const ACCESS_TOKEN_EXPIRATION = "5m"; // 5 minutes
const REFRESH_TOKEN_EXPIRATION = "1d"; // 1 day

export const createAdminService = async (adminData: any) => {
  try {
    const hashedPassword = await bcrypt.hash(
      adminData.password,
      Number(salt_rounds)
    );

    const admin = await Client.admin_users.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      },
    });

    // const { admin_token }: any = generateTokensAdmin(admin.id);
    const accessToken = jwt.sign(
      {
        id: admin.id,
        role: "authenticated",
        aud: "authenticated",
      },
      admin_serect || "",
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }
    );

    const refreshToken = jwt.sign({ id: admin.id }, admin_serect || "", {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    await Client.refresh_token_admin.upsert({
      where: { adminId: admin.id },
      update: { token: refreshToken, expiresAt },
      create: {
        adminId: admin.id,
        token: refreshToken,
        expiresAt,
      },
    });

    return {admin, accessToken };
  } catch (error: any) {
    throw new Error(`Error creating admin: ${error.message}`);
  }
};

export const CreatesuperAdmin = async ({
  name,
  hashedPassword,
  email,
}: any) => {
  try {
    const superAdmin = await Client.admin_users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: "super_admin",
      },
    });

    // const { admin_token }: any = generateTokensAdmin(superAdmin.id);
    const accessToken = jwt.sign(
          {
            id: superAdmin.id,
            role: "authenticated",
            aud: "authenticated",
          },
          admin_serect || "",
          {
            expiresIn: ACCESS_TOKEN_EXPIRATION,
          }
        );
    
        const refreshToken = jwt.sign({ id: superAdmin.id }, admin_serect || "", {
          expiresIn: REFRESH_TOKEN_EXPIRATION,
        });
    
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    
        await Client.refresh_token_admin.upsert({
          where: { adminId: superAdmin.id },
          update: { token: refreshToken, expiresAt },
          create: {
            adminId: superAdmin.id,
            token: refreshToken,
            expiresAt,
          },
        });
    
        return { accessToken };
  } catch (error: any) {
    throw new Error(`Error creating super admin: ${error.message}`);
  }
};
