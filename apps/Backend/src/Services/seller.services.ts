import { PrismaClient } from "@prisma/client";
import { generateTokensAdmin, generateTokensSeller } from "../utils/tokenUtils";
import jwt from "jsonwebtoken";
import { seller_serect } from "../config";

const Client = new PrismaClient();

const ACCESS_TOKEN_EXPIRATION = "5m"; // 5 minutes
const REFRESH_TOKEN_EXPIRATION = "1d"; // 1 day

export const Create_Seller_account = async (
  sellerData: any,
  hashedPassword: any
) => {
  try {
    console.log("name: ", sellerData.name)
    const seller_account = await Client.seller.create({
      data: {
        firstname: sellerData.name,
        email: sellerData.email,
        phone: sellerData.phone,
        password: hashedPassword,
      },
    });
    console.log("done4")

    const accessToken = jwt.sign(
      { id: seller_account.id,currRole:"seller", role: "authenticated" , aud: "authenticated" },
      seller_serect || "",
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }
    );

    const refreshToken = jwt.sign(
      { id: seller_account.id, currRole:"seller" },
      seller_serect || "",
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      }
    );

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    await Client.refresh_token_seller.upsert({
      where: { sellerId: seller_account.id },
      update: { token: refreshToken, expiresAt },
      create: { sellerId: seller_account.id, token: refreshToken, expiresAt },
    });

    console.log("done5")

    // const seller_token = await generateTokensSeller(seller_account.id);
    // console.log("token in services: ",seller_token)

    return accessToken;
  } catch (error: any) {
    throw new Error(`Error registering seller: ${error.message}`);
  }
};

// export const add_product = async (productData: any, sellerId: String)=>{
//     try {
//         const product = await Client.product.create({
//             data: {
//                 name: productData.name,
//                 description: productData.description,
//                 brand: productData.brand,
//                 category: productData.category,
//                 subCategory: productData.subCategory,
//                 price: productData.price,
//                 discount: productData.discount,
//                 stock: productData.stock,
//                 sizeOptions: productData.sizeOptions,
//                 colorOptions: productData.colorOptions,
//                 images: productData.images,
//                 rating: productData.rating,
//                 reviewsCount: productData.reviewsCount,
//                 sellerId: Number(sellerId),
//             }
//         })
//         return product;
//     } catch (error: any) {
//         throw new Error(`Error adding product: ${error.message}`);
//     }
// }

export const editProduct = async (edit_product: any, product_id: string) => {
  try {
    const existingProduct = await Client.product.findUnique({
      where: { id: parseInt(product_id) },
    });

    if (!existingProduct) throw new Error("Product not found");

    const hasChanged = Object.keys(edit_product).some((key) => {
      const existingValue =
        existingProduct[key as keyof typeof existingProduct];
      const newValue = edit_product[key];

      // Convert values to string for accurate comparison
      return JSON.stringify(existingValue) !== JSON.stringify(newValue);
    });

    console.log(hasChanged);

    if (!hasChanged) throw new Error("No changes made");

    const updatedProduct = await Client.product.update({
      where: { id: Number(product_id) },
      data: edit_product,
    });
    return updatedProduct;
  } catch (error: any) {
    throw new Error(`Error editing product: ${error.message}`);
  }
};

export const editSellerData = async (sellerdata: any, sellerid: string) => {
  try {
    const existingSeller = await Client.seller.findUnique({
      where: { id: parseInt(sellerid) },
    });

    console.log("seller data", sellerdata);

    if (!existingSeller) throw new Error("Seller not found");

    console.log("done1");

    const hasChanged = Object.keys(sellerdata).some((key) => {
      const existingValue =
        existingSeller[key as keyof typeof existingSeller] ?? "";
      const newValue = sellerdata[key] ?? "";

      return JSON.stringify(existingValue) !== JSON.stringify(newValue);
    });

    console.log("done2");

    console.log("i am ", hasChanged);

    if (!hasChanged) throw new Error("No changes made");

    const updatedProduct = await Client.seller.update({
      where: { id: Number(sellerid) },
      data: sellerdata,
    });
    console.log("done 4");
    return updatedProduct;
  } catch (error: any) {
    throw new Error(`Error editing seller data: ${error.message}`);
  }
};

export const editSellerShopData = async (sellerdata: any, sellerid: string) => {
  try {
    const existingSeller = await Client.seller.findUnique({
      where: { id: parseInt(sellerid) },
    });

    console.log("seller data", sellerdata);

    if (!existingSeller) throw new Error("Seller not found");

    const existingSellershopdata = await Client.sellerShopDetails.findFirst({
      where: { sellerId: parseInt(sellerid) },
    });

    console.log("done1");

    console.log(sellerdata.categories);

    if (!existingSellershopdata) {
      const createddata = await Client.sellerShopDetails.create({
        data: {
          sellerId: Number(sellerid),
          shopName: sellerdata.shopName,
          address1: sellerdata.address1,
          address2: sellerdata.address2,
          pincode: sellerdata.pincode,
          city: sellerdata.city,
          category: Array.isArray(sellerdata.categories) ? sellerdata.categories : [sellerdata.categories],  // Ensure this is an array,
          gstnumber: sellerdata.gstnumber,
          pannumber: sellerdata.pannumber,
        },
      });
      return createddata;
    }

    const hasChanged = Object.keys(sellerdata).some((key) => {
      const existingValue =
        existingSellershopdata?.[key as keyof typeof existingSellershopdata] ??
        "";
      const newValue = sellerdata[key] ?? "";

      return JSON.stringify(existingValue) !== JSON.stringify(newValue);
    });

    console.log("done2");

    console.log("i am ", hasChanged);

    if (!hasChanged) throw new Error("No changes made");

    const updatedProduct = await Client.sellerShopDetails.update({
      where: { id: existingSellershopdata?.id },
      data: {
        // Ensure sellerdata matches the fields defined in Prisma schema
        shopName: sellerdata.shopName,
        address1: sellerdata.address1,
        address2: sellerdata.address2,
        pincode: sellerdata.pincode,
        city: sellerdata.city,
        category: sellerdata.category,
        gstnumber: sellerdata.gstnumber,
        pannumber: sellerdata.pannumber,
        // Add any other fields from sellerdata that you want to update
      },
    });
    console.log("done 4");
    return updatedProduct;
  } catch (error: any) {
    throw new Error(`Error editing seller data: ${error.message}`);
  }
};


export const createPicklist = async (picklistCode: any, sellerId: any) =>{
  try {
    const picklist = await Client.picklist.create({
      data: {
        code: picklistCode,
        sellerId: sellerId,
      },
    });
    return picklist;
  } catch (error: any) {
    throw new Error(`Error creating picklist: ${error.message}`);
  }
}

export const attachpicklist = async (picklistId: any, productId: number[]) =>{
  try {
    const updated_picklist = await Client.order.updateMany({
      where: { id: {
        in: productId,
      },
    },
      data: {
        picklistId: Number(picklistId),
      },
    })
    
    return updated_picklist;
  } catch (error: any) {
    throw new Error(`Error attaching picklist: ${error.message}`);
  }
}