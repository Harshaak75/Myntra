import { NextFunction, Request, response, Response } from "express";
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
  attachpicklist,
  // add_product,
  Create_Seller_account,
  createPicklist,
  editProduct,
  editSellerData,
  editSellerShopData,
} from "../Services/seller.services";
import jwt, { JwtPayload } from "jsonwebtoken";

import ExcelJs from "exceljs";
import { categoryTemplate } from "../utils/columnNames";

import supabase from "../utils/supabase.connect";
import multer from "multer";

import { uploadQueue } from "../queue/uploadQueue";

import { Decimal } from "@prisma/client/runtime/library"; // Import Decimal
import { generateCompactPicklistCode } from "../utils/ConvertToSafeBase";
import {
  generateBrandCode,
  generateCustomCode,
  generateNumericPacketCodes,
} from "../utils/GenerateBrandCode";
import { generateBarcode, generatePdf } from "../utils/generatePdf";
import {
  getDirectDownloadUrl,
  uploadImageToBucket,
} from "../utils/UploadImage";
import { randomUUID } from "crypto";

const upload = multer({ storage: multer.memoryStorage() });

const Client = new PrismaClient();

const ACCESS_TOKEN_EXPIRATION = "15m"; // 5 minutes
const REFRESH_TOKEN_EXPIRATION = "30d"; // 1 day

export const register_seller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log("done1");

  try {
    const new_seller_data = req.body;

    console.log(new_seller_data.email);

    const existing_seller = await Client.seller.findFirst({
      where: { email: new_seller_data.email },
    });

    console.log("done2");

    if (existing_seller)
      return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(
      new_seller_data.password,
      Number(salt_rounds)
    );

    console.log("done3");

    const { accessToken, isVerified } = await Create_Seller_account(
      new_seller_data,
      hashedPassword
    );

    console.log("done7");

    res.cookie("sell_access_token", accessToken, {
      httpOnly: true,
      secure: secure_cookie === "Production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: secure_cookie == "Production" ? "none" : "lax",
    });

    console.log("token in controller: ", accessToken);

    res.status(200).json({
      message: "the seller account was created",
      sellerToken: accessToken,
      isVerified,
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

  console.log("done");

  try {
    const seller_data = req.body;

    console.log("done0", seller_data.email);

    let existing_seller;

    try {
      existing_seller = await Client.seller.findFirst({
        where: { email: seller_data.email },
      });
    } catch (error) {
      console.log(error);
    }

    console.log("done1");

    if (!existing_seller) {
      return res.status(421).json({ message: "Seller does not exist" });
    }

    console.log("done2");

    bcrypt.compare(
      seller_data.password,
      existing_seller.password,
      async (err, result) => {
        if (err)
          return res.status(400).json({ message: "Invalid credentials" });

        if (result) {
          // const seller_account = await generateTokensSeller(existing_seller.id);

          const seller = await Client.seller.findUnique({
            where: { id: existing_seller.id },
          });

          const accessToken = jwt.sign(
            {
              id: existing_seller.id,
              currRole: "seller",
              role: "authenticated",
              aud: "authenticated",
              isVerified: seller?.isVerified ?? false,
            },
            seller_serect || "",
            {
              expiresIn: ACCESS_TOKEN_EXPIRATION,
            }
          );

          const refreshToken = jwt.sign(
            { id: existing_seller.id, currRole: "seller" },
            seller_serect || "",
            {
              expiresIn: REFRESH_TOKEN_EXPIRATION,
            }
          );

          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 day

          console.log("done3");

          await Client.refresh_token_seller.upsert({
            where: { sellerId: existing_seller.id },
            update: { token: refreshToken, expiresAt },
            create: {
              sellerId: existing_seller.id,
              token: refreshToken,
              expiresAt,
            },
          });

          // console.log("seller_contoller: ",seller_account)

          res.cookie("sell_access_token", accessToken, {
            httpOnly: true,
            path: "/",
            secure: secure_cookie === "Production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: secure_cookie == "Production" ? "none" : "lax",
          });

          res.status(200).json({
            message: "Seller logged in successfully",
            sellerToken: accessToken,
            isVerified: seller?.isVerified ?? false,
          });
        } else {
          return res.status(422).json({ message: "Invalid credentials" });
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

    console.log("cat", category);

    // Instruction Sheet
    const instructionSheet = workbook.addWorksheet("__Instruction");
    instructionSheet.addRow(["Instructions for using this template:"]);
    instructionSheet.addRow([
      "1. Fill the 'Products' sheet with product details.",
    ]);
    instructionSheet.addRow([
      "2. Provide seller contact details in the 'Sellers' sheet.",
    ]);
    instructionSheet.addRow(["3. Do not modify the headers."]);

    if (categoryTemplate[category]) {
      const categoryColumns = categoryTemplate[category];

      const sheetName = category.charAt(0).toUpperCase() + category.slice(1);
      const categorySheet = workbook.addWorksheet(sheetName);
      categorySheet.columns = categoryColumns;

      // Add dropdown options per column key
      const dropdownOptions: Record<string, string[]> = {
        Gender: ["Men", "Women", "Unisex"],
        season: ["Summer", "Winter", "Autumn", "Spring"],
        fashionType: ["Ethnic", "Western", "Fusion"],
        ageGroup: ["Kids", "Teen", "Adult"],
        size: ["XS", "S", "M", "L", "XL", "XXL"],
        isStandardSize: ["Yes", "No"],
        usage: [
          "Casual",
          "Sportswear",
          "Men Activewear",
          "Women Activewear",
          "Western wear",
          "Lounge wear",
          "Kids wear",
          "Office wear",
          "Men ethnic wear",
          "inclusive styles",
          "Sleep wear",
          "Inner wear",
          "Lingerie",
        ],
        pattern: ["Solid", "Printed", "Striped", "Checked", "Embroidered"],
      };

      const headerRow = categorySheet.getRow(1);
      headerRow.font = { bold: true };

      // Add dropdowns from row 2 to 500
      for (let colIndex = 1; colIndex <= categoryColumns.length; colIndex++) {
        const column = categoryColumns[colIndex - 1];
        const options = dropdownOptions[column.key];

        if (options && options.length > 0) {
          for (let rowIndex = 2; rowIndex <= 500; rowIndex++) {
            categorySheet.getCell(rowIndex, colIndex).dataValidation = {
              type: "list",
              allowBlank: true,
              formulae: [`"${options.join(",")}"`],
              showErrorMessage: true,
              errorStyle: "error",
              errorTitle: "Invalid Choice",
              error: `Please select a valid ${column.header} from dropdown.`,
            };
          }
        }
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${category}-template.xlsx"`
      );

      const buffer = await workbook.xlsx.writeBuffer();
      console.log(`Excel template for ${category} generated successfully!`);
      res.send(Buffer.from(buffer));
    } else {
      return res.status(400).json({ message: "Invalid category selected!" });
    }
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Error generating Excel file", error });
  }
};

// export const Upload_Documats = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   if (!req.file) {
//     return res.status(400).json({ message: "File is required" });
//   }
//   try {
//     const file_name = `excel/${Date.now()}_${req.file.originalname}`;

//     if (!bucket_name) {
//       return res.status(400).json({ message: "Bucket name is required" });
//     }

//     console.log("1111");

//     const { data, error } = await supabase.storage
//       .from(bucket_name)
//       .upload(file_name, req.file.buffer, { contentType: req.file.mimetype });

//     if (error) {
//       return res
//         .status(500)
//         .json({ message: "Error uploading file", error: error });
//     }

//     //Create workbook and store in database

//     const filename = req.file.originalname;
//     const category = filename.split("-")[0].toUpperCase();
//     console.log("category", category);

//     const workbook = new ExcelJs.Workbook();
//     await workbook.xlsx.load(req.file.buffer);

//     const worksheet = workbook.worksheets[1];

//     const headerRowIndex = 1;

//     const header: string[] = [];
//     worksheet.getRow(headerRowIndex).eachCell((cell) => {
//       header.push(String(cell.value).trim());
//     });

//     // console.log(header)

//     const rows: any = [];

//     worksheet.eachRow((row, rowNumber) => {
//       // console.log(row);
//       if (rowNumber == headerRowIndex) return;
//       const product: any = {};
//       row.eachCell((cell, colnumber) => {
//         const key = header[colnumber - 1];
//         if (key) {
//           product[key] = cell.value;
//         }
//       });
//       rows.push(product);
//     });

//     // console.log(rows);

//     // add the name and price to the product table

//     // lot id

//     const randomNumber = Math.floor(1000000 + Math.random() * 9000000);

//     const attributeData: any[] = [];

//     for (const row of rows) {
//       if (!row.MRP || !row.brand) {
//         console.error("Missing required fields:", row);
//         continue;
//       }

//       // product code generation

//       const brandCode: any = await generateBrandCode(row.brand);
//       console.log(brandCode);
//       const CleanedCategory = category.replace(/[^a-zA-Z]/g, "");
//       const categoryCode = CleanedCategory.slice(0, 3).toUpperCase();
//       console.log(categoryCode);
//       const uniqueCode = generateCustomCode();
//       const productSKU = `${brandCode}${categoryCode}${uniqueCode}`;
//       console.log("productSKU", productSKU);

      

//       const pro = await Client.product.create({
//         data: {
//           name: `${row.brand}`,
//           price: new Decimal(row.MRP),
//           sellerId: Number(req.seller_id),
//           productSku: productSKU,
//           sellerSku: row.vendorSkuCode ? row.vendorSkuCode : productSKU,
//           productType: filename.split("-")[0],
//           lotId: randomNumber.toString(),
//         },
//       });

//       for (const [key, value] of Object.entries(row)) {
//         const isImageField = key.toLowerCase().includes("image");
//         const isValidUrl = typeof value === "string" && value.includes("http");
//         const isGoogleDrive = isValidUrl && value.includes("drive.google.com");

//         // Special handling for image upload from Google Drive URLs
//         if (isImageField && isGoogleDrive) {
//           const directDownloadUrl = getDirectDownloadUrl(value);
//           if (directDownloadUrl) {
//             const uploadedImageUrl = await uploadImageToBucket(
//               directDownloadUrl,
//               productSKU
//             );
//             if (uploadedImageUrl) {
//               await Client.productAttribute.create({
//                 data: {
//                   attributename: key,
//                   attributevalue: uploadedImageUrl,
//                   productId: pro.id,
//                 },
//               });
//             } else {
//               console.warn(`Image upload failed for: ${value}`);
//             }
//           } else {
//             console.warn(`Invalid Google Drive link format: ${value}`);
//           }
//         }

//         // All other normal fields (or fallback if image fails)
//         else if (!["MRP", "brand", "styleId"].includes(key)) {
//           // await Client.productAttribute.create({
//           //   data: {
//           //     attributename: key,
//           //     attributevalue: String(value),
//           //     productId: pro.id,
//           //   },
//           // });

//           attributeData.push({
//             attributename: key,
//             attributevalue: String(value),
//             productId: pro.id,
//           })
//         }
//       }
//     }

//     await Client.productAttribute.createMany({
//       data: attributeData,
//     });

//     await Client.sellerDocuments.create({
//       data: {
//         sellerId: Number(req.seller_id),
//         documentUrl: file_name,
//       },
//     });

//     return res.status(200).json({ message: "File uploaded successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Error uploading file", error });
//   }
// };

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
      .upload(file_name, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res
        .status(500)
        .json({ message: "Error uploading file", error: error });
    }

    // Save reference to uploaded file in DB
    await Client.sellerDocuments.create({
      data: {
        sellerId: Number(req.seller_id),
        documentUrl: file_name,
      },
    });

    // Queue the processing job
    const jobId = randomUUID();

    await uploadQueue.add(
      "process-excel-upload",
      {
        fileBuffer: req.file.buffer,
        originalname: req.file.originalname,
        sellerId: req.seller_id,
        file_name,
        bucket_name,
      },
      {
        jobId,
        attempts: 3,
        removeOnComplete: true,
        backoff: { type: "exponential", delay: 1000 },
      }
    );

    return res.status(202).json({
      message: "File uploaded and queued for processing",
      jobId,
    });
  } catch (error) {
    console.error("❌ Upload/Queue error:", error);
    return res.status(500).json({ message: "Error uploading file", error });
  }
};

export const logoutSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const sellers_id = Number(req.seller_id);

  console.log("sellerid", sellers_id);

  try {
    const user_details = await Client.refresh_token_seller.delete({
      where: { sellerId: sellers_id },
    });

    console.log(user_details);

    // const user_refresh_token = user_details?.token;

    const token =
      req.cookies.sell_access_token ||
      req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await Client.blacklist_token.create({
      data: {
        token: token || "",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      },
    });

    console.log("data list", data);

    res.clearCookie("sell_access_token");
    res.clearCookie("refresh_token_seller");

    res.status(200).json({ message: "The user is logged out." });
  } catch (error: any) {
    res.status(400).json({ message: "Error in logout: ", error: error });
  }
};

export const checkSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // const seller_id = req.seller_id;

    const token = req.cookies.sell_access_token;

    if (token)
      return res
        .status(200)
        .json({ message: "seller is authenticated", token: token });
    else
      return res.status(401).json({ message: "seller is not authenticated" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error in checking seller: ", error: error });
  }
};

export const getEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const seller_id = Number(req.seller_id);

    const seller_details = await Client.seller.findUnique({
      where: { id: seller_id },
    });

    return res.status(200).json({ responone: seller_details });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error in getting seller email: ", error: error });
  }
};

export const updateSeller = async (
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

    const seller_id = req.seller_id;

    console.log("seller id", seller_id);

    if (!seller_id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await editSellerData(seller_data, seller_id);
    res
      .status(200)
      .json({ message: "The product was updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const updateSellerShopDetails = async (
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

    const seller_id = req.seller_id;

    console.log("seller id", seller_id);

    if (!seller_id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await editSellerShopData(seller_data, seller_id);
    res
      .status(200)
      .json({ message: "The product was updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// generate picklist

export const GeneratePicklist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // generate unique picklist code

    if (!req.seller_id) {
      return res.status(401).json({ message: "seller id required" });
    }

    const picklist_id = generateCompactPicklistCode(req.seller_id);

    console.log("hi", req.body.OrderIds);

    // add the picklist code to the database
    const picklistCode = await createPicklist(picklist_id, req.seller_id);

    // relate the orders to picklist

    const picklist = await attachpicklist(picklistCode.id, req.body.OrderIds);

    // fetch the orders data

    const orders_data = await Client.order.findMany({
      where: { id: { in: req.body.OrderIds } },
      include: { product: true },
    });

    // picklistitems

    const picklistitems = orders_data.map((order: any) => {
      return {
        productName: order.product.name,
        productSku: order.product.productSku,
        sellerSku: order.product.sellerSku,
        productQuantity: order.quantity,
      };
    });

    console.log(picklistitems);

    const barcode = await generateBarcode(picklistCode.code);

    const picklistPDF = await generatePdf(
      picklistitems,
      picklistCode.code,
      barcode
    );

    // update the order status

    await Client.order.updateMany({
      where: { id: { in: req.body.OrderIds } },
      data: { status: "Pick Initiated" },
    });

    // 3. Send it as downloadable file

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Picklist-${picklistCode.code}.pdf"`
    );
    return res.end(picklistPDF);
  } catch (err: any) {
    console.error("Error generating PDF:", err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};

export const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const order_id = req.body;
    console.log(order_id);

    if (!order_id) {
      return res.status(400).json({ message: "Order id is required" });
    }

    const order_details = await Client.order.findUnique({
      where: { orderCode: order_id.orderCode },
      include: {
        product: {
          include: {
            productAttribute: true,
          },
        },
      },
    });

    // console.log(order_details)
    // console.log(order_details?.product.productSku)
    // console.log(order_details?.product.productAttribute.find(attr => attr.attributename == "size"))

    // important note we are dont have extra order table to store the order detils, For now we will only go for single product, in comming days we will add multiple orders

    if (order_details) {
      const product_data = {
        [order_details.orderCode]: {
          title: order_details.product.name,
          subTitle: order_details.product.productAttribute.find(
            (arr: any) => arr.attributename == "Product Title"
          ),
          sellerSKU: order_details.product.sellerSku,
          productSKU: order_details.product.productSku,
          articleType: order_details.product.productType,
          size: order_details.selectedSize,
          price: order_details.totalPrice,
          colour: order_details.selectedColor,
          Gender: order_details.product.productAttribute.find(
            (arr: any) => arr.attributename == "Gender"
          ),
          quntity: order_details.quantity,
          store: "Mynstars",
          orderStatus: order_details.status,
          onHoldOrder: "No",
        },
      };
      res.status(200).json({ message: "Order details", product_data });
    }

    if (!order_details) {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error });
  }
};

export const getQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const picklistId = req.query.picklistId;

  if (!picklistId) {
    return res.status(500).json({ message: "Picklist not fount" });
  }

  // console.log(picklistId)

  const quantity = await Client.order.findMany({
    where: {
      picklistId: Number(picklistId),
    },
  });

  const totalQuntity = quantity.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0
  );
  // console.log(totalQuntity)
  return res.status(200).json({ message: "dont", quantity: totalQuntity });
};

export const getPicklistDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const picklisitCode = req.body.picklistId;

    if (!picklisitCode) {
      return res.status(400).json({ message: "Picklist ID is required" });
    }

    const picklistDetails = await Client.picklist.findUnique({
      where: { code: picklisitCode },
      include: { orders: { select: { id: true } } },
    });

    if (!picklistDetails) {
      return res.status(404).json({ message: "Picklist not found" });
    }

    const OrderIds = picklistDetails?.orders.map((order: any) => order.id);
    console.log(OrderIds);

    res.status(200).json({ message: "Picklist details", OrderIds });
  } catch (error: any) {
    console.error("Error fetching picklist details:", error);
    res.status(500).json({ message: "Failed to fetch picklist details" });
  }
};

export const validateSKU = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { sku, orderIds, picklistCode } = req.body;

    if (!sku && !orderIds && !picklistCode) {
      return res.status(401).json({ message: "SKU or Orderid not found" });
    }

    const existing = await Client.sellerPacket.findFirst({
      where: { picklistCode: picklistCode },
      select: { code: true },
    });

    let sellerPacketCode;

    if (existing) {
      sellerPacketCode = existing.code;
    } else {
      // create a seller packet ID if it is not present Otherwise take the generated sellectPacketId

      sellerPacketCode = generateNumericPacketCodes();

      // first get the id of picklist

      const Picklistid = await Client.picklist.findUnique({
        where: { code: picklistCode },
        select: { id: true },
      });
      // create a sellectPacketId table

      const sellectPacket = await Client.sellerPacket.create({
        data: {
          code: String(sellerPacketCode),
          picklistCode: picklistCode,
          picklistId: Number(Picklistid?.id),
        },
      });

      // now add orders linked to it

      const createData = orderIds.map((orderId: number) => ({
        sellerPacketId: sellectPacket?.id,
        orderId: Number(orderId),
        sku: sku,
      }));

      const response = await Client.sellerPacketOrder.createMany({
        data: createData,
      });
    }

    console.log("sellerPacketCode", sellerPacketCode);

    const response = await Client.order.findFirst({
      where: {
        id: { in: orderIds },
        product: {
          OR: [{ productSku: sku }, { sellerSku: sku }],
        },
      },
      include: {
        product: {
          include: {
            productAttribute: true,
          },
        },
      },
    });
    console.log(response);

    const productDetails = [];

    if (response) {
      const product = {
        productName: response.product.name,
        productSku: response.product.productSku,
        sellerSku: response.product.sellerSku,
        productQuantity: response.quantity,
        size: response.selectedSize,
        color: response.selectedColor,
        price: response.totalPrice,
        styleId: response.product.productAttribute.find(
          (attr: any) => attr.attributename === "styleGroupId"
        )?.attributevalue,
        sellerPacketId: sellerPacketCode,
      };
      productDetails.push(product);
    }

    console.log("productDetails", productDetails);

    res
      .status(200)
      .json({ message: "SKU validated successfully", productDetails });
  } catch (error) {
    console.error("Error validating SKU:", error);
    res.status(500).json({ message: "Failed to validate SKU" });
  }
};

export const addCoverId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { coverId, productSku, picklisitCode } = req.body;

    if (!coverId || !productSku || !picklisitCode) {
      return res
        .status(400)
        .json({ message: "Cover ID and Product SKU are required" });
    }

    // get the theorder id from the order table

    const ProductData = await Client.product.findUnique({
      where: { productSku: productSku },
      select: { id: true },
    });

    if (!ProductData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // get picklist code

    const picklistData = await Client.picklist.findUnique({
      where: { code: picklisitCode },
      select: { id: true },
    });

    if (!picklistData) {
      return res.status(404).json({ message: "Picklist data not found" });
    }

    const orderData = await Client.order.findFirst({
      where: {
        productId: ProductData.id,
        picklistId: picklistData.id,
        coverId: null,
      },
    });

    if (!orderData) {
      return res.status(404).json({ message: "Order data not found" });
    }

    await Client.order.update({
      where: { id: orderData.id },
      data: {
        coverId: coverId,
        status: "Item Packed",
      },
    });

    return res.status(200).json({ message: "Cover id added succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while adding the cover Id", error: error });
  }
};


