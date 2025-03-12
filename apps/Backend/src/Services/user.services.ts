import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();


export const create_the_order = async (userId: any, order_data: any, product_id: any) =>{
    try {
        console.log("i am product admin: ",product_id)
        const product_data = await Client.product.findUnique({where: {id: product_id}})
        if(!product_data) return {message: "Product not found"}

        const order = await Client.order.create({
            data: {
                buyerId: userId,
                productId: product_id,
                sellerId: Number (product_data?.sellerId),
                quantity: order_data.quantity,
                totalPrice: order_data.quantity * Number(product_data?.price ?? 0),
                status: "Pending"
            }
        })
        return order;
    } catch (error) {
        return error;
    }
}

export const get_user_order_details = async (
    orderId: any
) =>{
    try {
        const order = await Client.order.findUnique({where: {id: Number(orderId)}})

        console.log(order)

        if(!order) return {message: "Order not found"}

        const product = await Client.product.findUnique({where: {id: Number(order.productId)}});

        console.log(product)

        if(!product) return {message: "Product not found"}

        return {order, product};
    } catch (error) {
        return error
    }
}