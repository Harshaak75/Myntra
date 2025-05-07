import { Worker, Job } from "bullmq";
import ExcelJs from "exceljs";
import { PrismaClient } from "@prisma/client";
import { generateBrandCode, generateCustomCode } from "./GenerateBrandCode";
import { getDirectDownloadUrl, uploadImageToBucket } from "./UploadImage";
import { Decimal } from "@prisma/client/runtime/library";

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});

const Client = new PrismaClient();

export const uploadWorker = new Worker(
  "upload-queue",
  async (job: Job) => {
    const { fileBuffer, originalname, sellerId, file_name } = job.data;

    const category = originalname.split("-")[0].toUpperCase();
    
    const workbook = new ExcelJs.Workbook();
    
    const buffer = Buffer.from(fileBuffer.data);
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[1];
    const headerRowIndex = 1;

    const header: string[] = [];
    worksheet.getRow(headerRowIndex).eachCell((cell) => {
      header.push(String(cell.value).trim());
    });


    const rows: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === headerRowIndex) return;
      const product: any = {};
      row.eachCell((cell, colnumber) => {
        const key = header[colnumber - 1];
        if (key) {
          product[key] = cell.value;
        }
      });
      rows.push(product);
    });


    const lotId = Math.floor(1000000 + Math.random() * 9000000).toString();

    const attributeData: any[] = [];

    for (const row of rows) {
      if (!row.MRP || !row.brand) {
        console.warn("Skipping row due to missing MRP/brand", row);
        continue;
      }

      const brandCode: string = await generateBrandCode(row.brand);
      const cleanedCategory = category.replace(/[^a-zA-Z]/g, "");
      const categoryCode = cleanedCategory.slice(0, 3).toUpperCase();
      const uniqueCode = generateCustomCode();
      const productSKU = `${brandCode}${categoryCode}${uniqueCode}`;


      const product = await Client.product.create({
        data: {
          name: `${row.brand}`,
          price: new Decimal(row.MRP),
          sellerId: Number(sellerId),
          productSku: productSKU,
          sellerSku: row.vendorSkuCode || productSKU,
          productType: category,
          lotId,
        },
      });


      for (const [key, value] of Object.entries(row)) {
        const isImageField = key.toLowerCase().includes("image");
        const isValidUrl = typeof value === "string" && value.includes("http");
        const isGoogleDrive = isValidUrl && value.includes("drive.google.com");

        if (isImageField && isGoogleDrive) {
          const directDownloadUrl = getDirectDownloadUrl(value);
          if (directDownloadUrl) {
            const uploadedImageUrl = await uploadImageToBucket(
              directDownloadUrl,
              productSKU
            );
            if (uploadedImageUrl) {
              await Client.productAttribute.create({
                data: {
                  attributename: key,
                  attributevalue: uploadedImageUrl,
                  productId: product.id,
                },
              });
            } else {
              console.warn("Image upload failed", value);
            }
          } else {
            console.warn("Invalid Google Drive format", value);
          }
        } else if (!["MRP", "brand", "styleId"].includes(key)) {

          attributeData.push({
            attributename: key,
            attributevalue: String(value),
            productId: product.id,
          });
        }
      }
    }

    await Client.productAttribute.createMany({
      data: attributeData,
    });

    console.log(`✅ Successfully processed upload for seller ${sellerId}`);
  },
  { connection: redis }
);
