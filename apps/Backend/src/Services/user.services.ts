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

export const create_the_order = async (
  userId: any,
  order_data: any,
  product_id: any
) => {
  try {
    console.log("Creating order for product_id:", product_id);

    const product_data = await Client.product.findUnique({
      where: { id: product_id },
      include: { productAttribute: true },
    });

    if (!product_data) return { message: "Product not found" };

    const product_price = await Client.product.findUnique({
      where: { id: product_id },
      select: { price: true },
    });

    const quantity = order_data.quantity ?? 1;

    const selectedColorAttr = product_data.productAttribute.find(
      (item) => item.attributename === "Color"
    );

    const selectedColor = selectedColorAttr?.attributevalue ?? "Unknown";

    const order = await Client.order.create({
      data: {
        orderCode: await generateUniqueOrderCode(),
        buyerId: userId,
        productId: product_id,
        sellerId: Number(product_data?.sellerId),
        quantity,
        selectedSize: order_data.size,
        selectedColor: selectedColor,
        totalPrice: Number(product_price?.price) * quantity,
        status: "Created",
        buyerPatternLink: order_data.customPatternLink
      },
    });

    return order;
  } catch (error) {
    console.error("Order creation error:", error);
    return error;
  }
};

export const get_user_order_details = async (userId: any) => {
  try {
    const orders = await Client.order.findMany({
      where: { buyerId: Number(userId) },
      include: {
        product: {
          include: {
            productAttribute: true,
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      return { message: "No orders found" };
    }

    return { orders }; // Return all orders with related product info
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { message: "Something went wrong", error };
  }
};

