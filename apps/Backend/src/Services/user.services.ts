import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();

const generateNumericCode = (): string => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };
  
  const generateUniqueOrderCode = async (): Promise<string> => {
    let attempt = 0;
    let code: string;
  
    while (attempt < 10) {
      code = generateNumericCode();
      const existing = await Client.order.findUnique({
        where: { orderCode: code },
      });
  
      if (!existing) return code;
  
      attempt++;
    }
  
    throw new Error("Failed to generate unique order code after 10 attempts");
  };

export const create_the_order = async (userId: any, order_data: any, product_id: any) =>{
    try {
        console.log("i am product admin: ",product_id)
        const product_data = await Client.product.findUnique({where: {id: product_id}})
        if(!product_data) return {message: "Product not found"}

        // get the product price

        const product_price: any = await Client.product.findUnique({
            where: {
                id: product_id
            },
            select: {
                price: true,
            }
        })
        console.log("Product price: ", Number(product_price?.price))

        const order = await Client.order.create({
            data: {
                orderCode: await generateUniqueOrderCode(),
                buyerId: userId,
                productId: product_id,
                sellerId: Number (product_data?.sellerId),
                quantity: order_data.quantity,
                totalPrice: Number(product_price?.price) * Number(order_data.quantity),
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