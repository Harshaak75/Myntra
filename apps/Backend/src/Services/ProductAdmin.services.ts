import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokensAdmin } from "../utils/tokenUtils";

const Client = new PrismaClient();


export const login_productAdmin = async (
    data: any
) =>{
    try {
        const productAdmin = await Client.admin_users.findUnique({where: {email: data.email}});

        if(!productAdmin) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(data.password, productAdmin.password);

        if(!isPasswordValid) {
            throw new Error("Invalid password, Try again");
        }

        const productAdmin_token = await generateTokensAdmin(productAdmin.id);

        return {productAdmin_token};
    } catch (error: any) {
        throw new Error(`Error logging in product admin: ${error.message}`);
    }
}

export const delete_product = async (
    id: any
) =>{
    try {
        const deletedProduct = await Client.product.delete({where: {id: parseInt(id)}});
        console.log(deletedProduct);

        return deletedProduct;
    } catch (error: any) {
        throw new Error(`Error deleting product: ${error.message}`);
    }
}

export const getSellerdata = async () =>{
    try {
        const sellerdata = await Client.seller.findMany();
        return sellerdata;
    } catch (error : any) {
        throw new Error(`Error getting seller data: ${error.message}`);
    }
}

export const approve_product = async (
    product_id : string,
    approve: boolean
) => {
    try {
        const updateApproveal = await Client.product.update({
            where: {id: parseInt(product_id)},
            data: {approved: approve}
        })

        return updateApproveal;
    } catch (error: any) {
        throw new Error(`Error approving product: ${error.message}`);
    }
}