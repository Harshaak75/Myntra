import { PrismaClient } from "@prisma/client";
import { generateTokensAdmin } from "../utils/tokenUtils";
import bcrypt from "bcrypt";
import { salt_rounds } from "../config";

const Client = new PrismaClient();

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

    const { admin_token }: any = generateTokensAdmin(admin.id);
    return { admin, admin_token };
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

    const { admin_token }: any = generateTokensAdmin(superAdmin.id);
    return { superAdmin, admin_token };
  } catch (error: any) {
    throw new Error(`Error creating super admin: ${error.message}`);
  }
};
