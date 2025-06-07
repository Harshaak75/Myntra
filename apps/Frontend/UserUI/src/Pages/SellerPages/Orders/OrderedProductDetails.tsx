import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backend_url } from "../../../../config";
import { getValidToken } from "../../../Utiles/ValidateToken";
import { MoveLeft } from "lucide-react";

export const OrderProductDetails = () => {
  const location = useLocation();
  const { orderCode } = location.state || {};

  const navigate = useNavigate();

  const [orderdetails, setorderdetails] = useState("");
  const [loading, setloading] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imagePlaceholders = ["Image 1", "Image 2", "Image 3", "Image 4"];

  useEffect(() => {
    async function fetchdata() {
      setloading(true);
      if (orderCode) {
        try {
          const response = await axios.post(
            `${backend_url}seller/getOrderDetails`,
            {
              orderCode: orderCode,
            },
            {
              headers: {
                authorization: `Bearer ${await getValidToken()}`,
                "Cache-Control": "no-cache",
              },
              withCredentials: true,
            }
          );
          setorderdetails(response.data.product_data);
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setloading(false);
        }
      }
    }
    fetchdata();
  }, [orderCode]);

  const orderInfo: any = orderdetails[orderCode];

  return (
    <div className={`relative h-screen bg-gray-50  `}>
      {!loading && orderInfo && (
        <div className={`pt-[58px] pl-[48px] min-h-screen`}>
          <div className="to-bar w-full flex p-6 items-center gap-4">
            <div className="text-gray-700">
              <MoveLeft
                className="w-6 h-6 cursor-pointer"
                onClick={() => navigate(-1)}
              />
            </div>
            <div className="order-id">
              <p className="text-[1.7rem] font-bold opacity-70">
                Order Id : {orderCode}
              </p>
            </div>
            <div className="w-[5.7rem] ml-7 bg-[#b4e5b8] rounded-2xl flex items-center justify-center">
              <p className="text-[0.7rem] my-0.5 font-semibold p-1 text-green-700">
                SINGLE ORDER
              </p>
            </div>
          </div>

          <div className="px-12 pb-10 pt-5 flex flex-col gap-5 bg-white">
            {/* Left: Image gallery */}
            <div className="text-[1.5rem] font-semibold">Order Deatils</div>

            <div className="flex gap-5">
              <div className="flex gap-4">
                {/* Thumbnail list */}

                <div className="flex flex-col gap-2">
                  {imagePlaceholders.map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 border-2 cursor-pointer flex items-center justify-center text-sm font-medium ${
                        selectedImageIndex === idx
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      {img}
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="w-[300px] h-[350px] border flex items-center justify-center text-lg font-semibold bg-white shadow-md">
                  {imagePlaceholders[selectedImageIndex]}
                </div>
              </div>

              {/* Right: Order details */}
              <div className="flex flex-col gap-1 text-sm w-full max-w-[650px]">
                <h2 className="text-[1.6rem] font-bold">{orderInfo?.title}</h2>
                <p className="text-gray-800 font-semibold text-[0.9rem] w-[19rem]">
                  {orderInfo?.subTitle?.attributevalue}
                </p>
                <div className="grid grid-cols-2 gap-x-10 mt-1">
                  <p className="flex items-center gap-10 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Seller SKU
                    </strong>{" "}
                    <span className="font-semibold">
                      {orderInfo?.sellerSKU}
                    </span>
                  </p>

                  <p className="flex items-center gap-15 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Quantity
                    </strong>{" "}
                    <span className="font-semibold">{orderInfo?.quntity}</span>
                  </p>
                  <p className="flex items-center gap-7 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Myntra SKU
                    </strong>{" "}
                    <span className="font-semibold">
                      {orderInfo?.productSKU}
                    </span>
                  </p>

                  <p className="flex items-center gap-22 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Store
                    </strong>{" "}
                    <span className="font-semibold">{orderInfo?.store}</span>
                  </p>
                  <p className="flex items-center gap-7 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Article Type
                    </strong>{" "}
                    <span className="font-semibold">
                      {orderInfo?.articleType}
                    </span>
                  </p>

                  <p className="flex items-center gap-9 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Order Status
                    </strong>{" "}
                    <span className="font-semibold">
                      {orderInfo?.orderStatus}
                    </span>
                  </p>
                  <p className="flex items-center gap-22 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Size
                    </strong>{" "}
                    <span className="font-semibold">{orderInfo?.size}</span>
                  </p>
                  <p className="flex items-center gap-5 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      On Hold Order
                    </strong>{" "}
                    <span className="font-semibold">
                      {orderInfo?.onHoldOrder}
                    </span>
                  </p>
                  <p className="flex items-center gap-20 py-2">
                    <strong className="text-gray-500 opacity-60 text-[1rem]">
                      MRP
                    </strong>{" "}
                    <span className="font-semibold">₹{orderInfo?.price}</span>
                  </p>
                  <p className="flex items-center gap-19 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Gender
                    </strong>{" "}
                    <span className="font-semibold">
                      {orderInfo?.Gender?.attributevalue}
                    </span>
                  </p>
                  <p className="flex items-center gap-19 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      Color
                    </strong>{" "}
                    <span className="font-semibold">{orderInfo?.colour}</span>
                  </p>

                  {orderInfo?.patternLink &&  <p className="flex items-center gap-11 py-2">
                    <strong className="text-gray-600 opacity-60 text-[1rem]">
                      PatternLink
                    </strong>{" "}
                    <span className="font-semibold">
                      <a
                        href={orderInfo?.patternLink}
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security best practice for target="_blank"
                        className="text-blue-500 ml-0 hover:text-blue-700 underline transition duration-300 ease-in-out"
                      >
                        Click Here
                      </a>
                    </span>
                  </p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};
