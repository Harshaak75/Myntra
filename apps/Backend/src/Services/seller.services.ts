import { PrismaClient } from "@prisma/client";
import { generateTokensAdmin, generateTokensSeller } from "../utils/tokenUtils";

const Client = new PrismaClient();

export const Create_Seller_account = async (sellerData: any, hashedPassword: any)=>{
    try {
        const seller_account = await Client.seller.create({
            data: {
                name: sellerData.name,
                email: sellerData.email,
                phone: sellerData.phone,
                password: hashedPassword,
            }
        })

        const seller_token = await generateTokensSeller(seller_account.id)
        // console.log("token in services: ",seller_token)

        return seller_token
    } catch (error: any) {
        throw new Error(`Error registering seller: ${error.message}`);
    }
}

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

export const editProduct = async (edit_product: any, product_id: string)=>{
    try {
        const existingProduct = await Client.product.findUnique({
            where: {id: parseInt(product_id)}
        })

        if(!existingProduct) throw new Error("Product not found")
        
        const hasChanged = Object.keys(edit_product).some((key) => {
            const existingValue = existingProduct[key as keyof typeof existingProduct];
            const newValue = edit_product[key];

            // Convert values to string for accurate comparison
            return JSON.stringify(existingValue) !== JSON.stringify(newValue);
        })

        console.log(hasChanged)

        if(!hasChanged) throw new Error("No changes made")
        
        const updatedProduct = await Client.product.update({
            where: {id: Number(product_id)},
            data: edit_product
        })
        return updatedProduct;
    } catch (error: any) {
        throw new Error(`Error editing product: ${error.message}`);
    }
}