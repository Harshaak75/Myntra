import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  bucket_name,
  salt_rounds,
  secure_cookie,
  seller_serect,
} from "../config";
import {
  // add_product,
  Create_Seller_account,
  editProduct,
} from "../Services/seller.services";
import { generateTokensSeller } from "../utils/tokenUtils";
import jwt, { JwtPayload } from "jsonwebtoken";

import ExcelJs from "exceljs";
import { categoryTemplate } from "../utils/columnNames";

import supabase from "../utils/supabase.connect";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const Client = new PrismaClient();

export const register_seller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const new_seller_data = req.body;

    const existing_seller = await Client.seller.findUnique({
      where: { email: new_seller_data.email },
    });

    if (existing_seller)
      return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(
      new_seller_data.password,
      Number(salt_rounds)
    );

    const seller_account = await Create_Seller_account(
      new_seller_data,
      hashedPassword
    );

    res.cookie("sell_access_token", seller_account, {
      httpOnly: true,
      sameSite: "none",
      secure: secure_cookie === "Production",
      maxAge: 5 * 60 * 1000,
    });

    // console.log("token in controller: ",seller_account);

    res.status(200).json({
      message: "the seller account was created",
      sellerToken: seller_account,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering seller", error });
  }
};

export const login_seller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const seller_data = req.body;

    const existing_seller = await Client.seller.findUnique({
      where: { email: seller_data.email },
    });

    if (!existing_seller)
      return res.status(400).json({ message: "Seller does not exist" });

    bcrypt.compare(
      seller_data.password,
      existing_seller.password,
      async (err, result) => {
        if (err)
          return res.status(400).json({ message: "Invalid credentials" });

        if (result) {
          const seller_account = await generateTokensSeller(existing_seller.id);

          // console.log("seller_contoller: ",seller_account)

          res.cookie("sell_access_token", seller_account, {
            httpOnly: true,
            sameSite: "none",
            secure: secure_cookie === "Production",
            maxAge: 5 * 60 * 1000,
          });

          res.status(200).json({
            message: "Seller logged in successfully",
            sellerToken: seller_account,
          });
        } else {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error logging seller in", error });
  }
};

export const SellerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const seller_token =
      req.headers["authorization"]?.split(" ")[1] ||
      req.cookies.sell_access_token;

    // console.log(seller_id)

    if (!seller_token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!seller_serect) {
      throw new Error("JWT secret is missing!"); // Ensure it's defined
    }

    const decoded = jwt.verify(seller_token, seller_serect) as JwtPayload;

    const seller_profile = await Client.seller.findUnique({
      where: { id: decoded.id },
    });

    if (!seller_profile) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const { password, ...sellerprofile } = seller_profile;

    res.status(200).json({ message: "Seller profile", sellerprofile });
  } catch (error: any) {
    res.status(500).json({ message: "The error in seller profile ", error });
  }
};

// export const addProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const product_data = req.body;

//     const seller_Id = req.seller_id;

//     console.log(seller_Id);

//     if (!seller_Id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const product = await add_product(product_data, seller_Id);

//     res
//       .status(200)
//       .json({ message: "The product was added successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding product", error });
//   }
// };

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const edit_product = req.body;

    const product_id = req.params.id;

    // console.log(product_id)

    if (!product_id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await editProduct(edit_product, product_id);
    res
      .status(200)
      .json({ message: "The product was updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const downloadExcel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const workbook = new ExcelJs.Workbook();

    const { category } = req.body;

    // sheet1 instruction

    const instructionSheet = workbook.addWorksheet("__Instruction");
    instructionSheet.addRow(["Instructions for using this template:"]);
    instructionSheet.addRow([
      "1. Fill the 'Products' sheet with product details.",
    ]);
    instructionSheet.addRow([
      "2. Provide seller contact details in the 'Sellers' sheet.",
    ]);
    instructionSheet.addRow(["3. Do not modify the headers."]);

    // sheet2

    if (categoryTemplate[category]) {
      const categoryColumns = categoryTemplate[category];

      const categorySheet = workbook.addWorksheet(
        category.charAt(0).toUpperCase() + category.slice(1)
      );
      categorySheet.columns = categoryColumns;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${category}-template.xlsx"`
      );

      // Write workbook to buffer & send response
      const buffer = await workbook.xlsx.writeBuffer();
      res.send(Buffer.from(buffer));

      console.log(`Excel template for ${category} generated successfully!`);
    } else {
      return res.status(400).json({ message: "Invalid category selected!" });
    }
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Error generating Excel file", error });
  }
};

export const Upload_Documats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }
  try {
    const file_name = `excel/${Date.now()}_${req.file.originalname}`;

    if (!bucket_name) {
      return res.status(400).json({ message: "Bucket name is required" });
    }

    const { data, error } = await supabase.storage
      .from(bucket_name)
      .upload(file_name, req.file.buffer, { contentType: req.file.mimetype });

    if (error)
      return res
        .status(500)
        .json({ message: "Error uploading file", error: error });

    //Create workbook and store in database

    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[1];

    const header: any = [];
    worksheet.getRow(3).eachCell((cell) => header.push(cell.value));

    // console.log(header)

    const rows: any = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1 || rowNumber == 2 || rowNumber == 3) return;
      const product: any = {};
      row.eachCell((cell, colnumber) => {
        product[header[colnumber - 1]] = cell.value;
      });
      rows.push(product);
    });

    console.log(rows);

    // add the name and price to the product table

    const productInfo = await Promise.all(
      rows.map((row: any) => {
        if (!row.MRP || !row.productDisplayName) {
          // ❗ Validate required fields
          console.error("Missing required fields:", row);
          return null; // Skip this row if data is invalid
        }
        const pro = Client.product.create({
          data: {
            name: row.productDisplayName,
            price: Number(row.MRP),
            sellerId: Number(req.seller_id),
          },
        });

        // create productattribute

        Object.entries(row).map(async ([keys, values]) => {
          if (!["productDisplayName", "MRP"].includes(keys)) {
            await Client.productAttribute.create({
              data: {
                attributename: keys,
                attributevalue: String(values),
                productId: (await pro).id,
              },
            });
          }
        });
      })
    );

    await Client.sellerDocuments.create({
      data: {
        sellerId: Number(req.seller_id),
        documentUrl: file_name,
      },
    });

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading file", error });
  }
};
