import { useState } from "react";
import { logo } from "../../../../ImagesCollection";
import axios from "axios";
import { backend_url } from "../../../../../config";
import { getValidToken } from "../../../../Utiles/ValidateToken";

interface ProductCardProps {
  product: {
    productName: string;
    productSku: string;
    sellerSku: string;
    size: string;
    price: string;
    color: string;
    styleId: string;
    imageUrl: string;
    productQuantity: number;
    sellerPacketId: string;
  };
}

const TextLine = ({ label, value }: { label: string; value: string }) => (
  <p>
    <span className="font-semibold">{label}:</span>{" "}
    <span className="font-semibold text-[1.05rem]">{value}</span>
  </p>
);

export default function ProductCard({
  product,
  picklistCode,
  onScanNext,
}: {
  product: ProductCardProps["product"];
  orderId: any;
  picklistCode: any;
  onScanNext: () => void;
}) {
  const quantity = product.productQuantity;
  console.log(product);

  const [isQCApproved, setIsQCApproved] = useState(false);
  const [checkboxes, setCheckboxes] = useState(Array(quantity - 1).fill(false));
  const [errorMsg, setErrorMsg] = useState("");
  const [isPackButtonEnabled, setPackButtonEnabled] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [scanId, setScanId] = useState("");

  const [nextItem, setNextItem] = useState(false);

  const [loading, setloading] = useState(false);

  const handleCheckboxChange = (index: number) => {
    const updated = [...checkboxes];
    updated[index] = !updated[index];
    setCheckboxes(updated);
    setErrorMsg(""); // clear error if any
  };

  const handlePass = () => {
    if (quantity === 1 || checkboxes.every((checked) => checked)) {
      setIsQCApproved(true);
      setPackButtonEnabled(true);
    } else {
      setErrorMsg("Please select all items before passing QC.");
    }
  };

  const handlePassClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setScanId("");
  };

  const handleCoverId = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        `${backend_url}seller/addCoverId`,
        {
          coverId: scanId,
          productSku: product.productSku,
          picklisitCode: picklistCode,
        },
        {
          headers: {
            authorization: `Bearer ${await getValidToken()}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);
      setNextItem(true);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
      closeModal();
    }
  };

  return (
    <div className="w-full mb-10">
      <div className="w-full">
        <div className="flex items-center gap-[0.1rem]">
          <img src={logo} alt="logo" className="w-[1.3rem]" />
          <span className="text-[0.8rem]">Mynstars</span>
          <div className="ml-6">
            <p className="text-[1.6rem] font-semibold">
              Packet : <span>{quantity}</span> Items
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-[1rem] text-gray-500 mt-2">
            Seller Packet ID: {product.sellerPacketId}
          </p>
          {!nextItem ? (
            <button
              className={`mr-50 w-[9rem] p-[0.3rem] rounded-2xl ${
                isPackButtonEnabled
                  ? "bg-[#0bc1a9] text-white font-semibold cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!isPackButtonEnabled}
              onClick={handlePassClick}
            >
              Pack
            </button>
          ) : (
            <div className="flex items-center gap-15">
              <button
                className={` w-[20rem] p-[0.5rem] text-[0.8rem] font-semibold rounded-2xl bg-white text-blue-600 border border-blue-600 cursor-pointer`}
              >
                REPRINT SHIPPING LABEL AND INVOICE
              </button>
              <button
                onClick={onScanNext}
                className={`mr-[2rem] w-[9rem] p-[0.5rem] text-[0.8rem] font-semibold rounded-2xl bg-blue-600 text-white cursor-pointer`}
              >
                SCAN NEXT
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap h-auto gap-6 mt-8 ml-5">
        {[...Array(quantity)].map((_, index) => (
          <div
            key={index}
            className={`rounded-md shadow-sm p-4 ${
              index === 0 ? "bg-gray-100" : "bg-white"
            } w-[30rem]`}
          >
            <div className="flex items-center gap-2 mb-1">
              {index !== 0 ? (
                <input
                  type="checkbox"
                  checked={checkboxes[index - 1]}
                  onChange={() => handleCheckboxChange(index - 1)}
                />
              ) : null}
              <p className="text-sm text-gray-500 mb-1">
                Item {index + 1} of {quantity}
              </p>
            </div>

            <div className="flex gap-5">
              <img
                src={product.imageUrl}
                alt="product"
                className="w-[15rem] h-[16rem] object-cover rounded border"
              />
              <div className="text-sm space-y-6 text-gray-700">
                <TextLine label="Myntra Sku Id" value={product.productSku} />
                <TextLine label="Seller Sku Id" value={product.sellerSku} />
                <TextLine label="Size" value={product.size} />
                <TextLine label="MRP" value={`₹${product.price}`} />
                <TextLine label="Colour" value={product.color} />
                <TextLine label="Style Id" value={product.styleId} />
              </div>
            </div>

            {index === 0 && (
              <div className="w-full mt-5">
                {isQCApproved || nextItem ? (
                  <div className="text-center font-bold text-[#0bc1a9] text-lg">
                    {isQCApproved == true && !nextItem
                      ? "✅ QC Passed"
                      : "📦 Item Packed"}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-around">
                      <button className="w-[7rem] p-2 cursor-pointer rounded-xl text-[#0bc1a9] bg-white border font-semibold border-[#0bc1a9]">
                        Rescan
                      </button>
                      <button className="w-[7rem] p-2 cursor-pointer rounded-xl text-[#0bc1a9] bg-white border font-semibold border-[#0bc1a9]">
                        Scan Seal
                      </button>
                      <button
                        className="w-[7rem] p-2 cursor-pointer rounded-xl bg-[#0bc1a9] text-white font-semibold"
                        onClick={handlePass}
                      >
                        Pass
                      </button>
                    </div>
                    {errorMsg && (
                      <p className="text-center text-sm text-red-600 mt-2">
                        {errorMsg}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-[24rem] space-y-4">
            <h2 className="text-xl font-bold text-center">Scan Seal ID</h2>
            <input
              type="text"
              placeholder="Scan/Enter ID"
              value={scanId}
              onChange={(e) => setScanId(e.target.value)}
              className="w-full p-2 border border-gray-300 opacity-100 rounded outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                className="bg-white text-[#0bc1a9] border border-[#0bc1a9] px-4 py-1 rounded hover:bg-[#0bc1a917] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCoverId()}
                className="bg-[#0bc1a9] text-white px-4 py-1 rounded hover:bg-[#0bc1a9e3] cursor-pointer"
              >
                Submit
              </button>
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
}
