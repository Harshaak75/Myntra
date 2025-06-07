import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { backend_url } from "../../../config";
import { Gettoken } from "@/Utiles/Gettoken";

const mockOrders = [
  {
    orderCode: "ORD123456",
    status: "Shipped",
    createdAt: "2025-06-01",
    items: [
      {
        name: "Cotton Fabric Roll",
        quantity: 60,
        size: "L",
        color: "Blue",
        price: 1200,
        patternLink: "https://example.com/pattern.pdf",
        image: "https://via.placeholder.com/150",
      },
    ],
    totalPrice: 72000,
    gst: "18%",
    repaymentTerms: "Net 30",
  },
  {
    orderCode: "ORD987654",
    status: "Processing",
    createdAt: "2025-06-05",
    items: [
      {
        name: "Polyester Bundle",
        quantity: 45,
        size: "M",
        color: "Black",
        price: 950,
        patternLink: null,
        image: "https://via.placeholder.com/150",
      },
    ],
    totalPrice: 42750,
    gst: "18%",
    repaymentTerms: "Net 15",
  },
  {
    orderCode: "ORD987654",
    status: "Processing",
    createdAt: "2025-06-05",
    items: [
      {
        name: "Polyester Bundle",
        quantity: 45,
        size: "M",
        color: "Black",
        price: 950,
        patternLink: null,
        image: "https://via.placeholder.com/150",
      },
    ],
    totalPrice: 42750,
    gst: "18%",
    repaymentTerms: "Net 15",
  },
  {
    orderCode: "ORD987654",
    status: "Processing",
    createdAt: "2025-06-05",
    items: [
      {
        name: "Polyester Bundle",
        quantity: 45,
        size: "M",
        color: "Black",
        price: 950,
        patternLink: null,
        image: "https://via.placeholder.com/150",
      },
    ],
    totalPrice: 42750,
    gst: "18%",
    repaymentTerms: "Net 15",
  },
];

// interface orderType {
//     orderCode: Number;

// }

const statusIcons = {
  Created: <Package className="text-yellow-500" />,
  "Item Packed": <Truck className="text-blue-500" />,
  Delivered: <CheckCircle className="text-green-600" />,
};

export default function OrderPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [order, setorder] = useState([]);

  const [loading, setloading] = useState(false)

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const getOrders = async () => {
        setloading(true)
      try {
        const response = await axios.get(`${backend_url}user/orderDetails`, {
          headers: {
            authorization: `bearer ${await Gettoken()}`,
          },
          withCredentials: true,
        });

        console.log(response);
        setorder(response.data.orders);
      } catch (error) {
        console.log(error);
      }
      finally{
        setloading(false)
      }
    };
    getOrders();
  }, []);

  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Track Your Orders</h1>
      {order.length > 0 ? <div className="space-y-4">
        {order.map((order: any, index) => (
          <Card
            key={index}
            className="shadow-lg rounded-2xl border border-gray-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Order #{order.orderCode}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    {statusIcons[order.status as keyof typeof statusIcons]}
                    <span className="text-gray-700">{order.status}</span>
                  </div>
                </div>
                <Button variant="ghost" className="cursor-pointer" onClick={() => toggleOpen(index)}>
                  {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>

              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden mt-5 text-sm text-gray-700 space-y-4"
                >
                  {[order.product].map((item: any, idx: any) => (
                    <div
                      key={idx}
                      className="flex gap-4 border p-4 rounded-xl bg-gray-50 items-start"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-contain rounded-xl"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-base">{item.title}</p>
                        <p>
                          Size: {item.sizeOption} | Color: {item.colorOption}
                        </p>
                        <p>
                          Qty: {item.quantity} | Unit Price: ₹{item.price}
                        </p>
                        {item.PatternLink && (
                          <a
                            href={item.PatternLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Pattern PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">
                        Total Price:
                      </span>{" "}
                      ₹{order.totalPrice}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">GST:</span>{" "}
                      {order.gst}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Repayment Terms:
                      </span>{" "}
                      {order.repaymentTerms}
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div> : <div className="mt-[8rem]">
        <div className="text-center">
            <h1 className="text-[1.5rem] font-semibold text-gray-600">You haven't placed any order yet!</h1>
            <p>Order section is empty. After placing order, You can track them from here!</p>
        </div>
        </div>}

      {loading && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/60">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl p-1">
        <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )}
    </div>
  );
}
