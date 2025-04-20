import { X } from "lucide-react";
import { SellerHeader } from "./Orders.Mdirect";
import { useState } from "react";
import axios from "axios";
import { backend_url } from "../../../../config";
import { getValidToken } from "../../../Utiles/ValidateToken";
import ProductCard from "./SellerComponents/ProductShowcase";

export function PackingItems() {
  const [values, setValues] = useState("");
  const [showBox, setshowBox] = useState(false);
  const [OrderId, setOrderId] = useState([]);
  const [error, seterror] = useState(false);
  const [errormsg, seterrormsg] = useState("");

  // sku

  const [skuInputs, setSkuInputs] = useState([""]); // dynamic input boxes
  const [scannedProducts, setScannedProducts] = useState<any[]>([]); // list of valid scanned SKUs
  // const [skuError, setSkuError] = useState<string | null>(null); // error message
  const [showProdcut, setShowProduct] = useState(false); // show product details

  const [loading, setloading] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    seterror(false);
    setshowBox(false);

    if (e.key == " " || e.key == "spacebar") {
      e.preventDefault(); // Prevent the default action of the space key
      return;
    }

    if (e.key === "Enter") {
      if (values.length === 13) {
        // You can add your backend call here
        setloading(true);
        try {
          const response = await axios.post(
            `${backend_url}seller/getPicklistDetails`,
            {
              picklistId: values,
            },
            {
              headers: {
                authorization: `Bearer ${await getValidToken()}`,
              },
            }
          );

          setOrderId(response.data.OrderIds);
          setshowBox(true);
        } catch (error: any) {
          seterrormsg(error.response.data.message);
          seterror(true);
          console.log(error.response.data.message);
        }
      } else {
        alert("Enter a valid Picklist ID");
      }
    }
    setloading(false);
  };

  const handleSKUEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    
    if (e.key == "Enter") {
      const sku = skuInputs[index].trim();

      // if (!sku || sku.length < 10) {
      //   return;
      // }

      try {
        setloading(true);
        const response = await axios.post(
          `${backend_url}seller/validateSKU`, // Your API endpoint
          {
            sku,
            orderIds: OrderId, // The previously received array of order IDs
            picklistCode: values, // The previously received picklist code
          },
          {
            headers: {
              authorization: `Bearer ${await getValidToken()}`,
            },
          }
        );

        console.log(response.data.productDetails);

        if (response.data.productDetails.length > 0) {
          const product = response.data.productDetails[0];

          // Check if the SKU already exists to avoid duplication
          const alreadyExists = scannedProducts.some(
            (item) => item.productSku === product.productSku
          );

          if (!alreadyExists) {
            setScannedProducts((prev) => [...prev, product]);
          }

          setShowProduct(true);
        } else {
          alert("Not Matching");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    }
  };

  const handlescannext = () => {
    setScannedProducts([]);
    setShowProduct(false);
    setSkuInputs([""]); // Optional: reset input box
  };

  return (
    <div className="relative h-screen bg-white">
      <div className="pt-[55px] pl-[48px]">
        <SellerHeader title={"Pack Orders"} />

        {/* Main Flex Box */}
        <div className="flex gap-12 pt-6">
          {/* Left Column: Picklist + SKU Input */}
          <div className="flex flex-col gap-6 min-w-[14rem]">
            {/* Picklist Input */}
            <div className="ml-5">
              <p className="font-semibold text-[1.4rem]">Packing</p>
              <p className="pt-3 opacity-55">Scan Picklist ID</p>
              <div className="flex items-center relative max-w-48">
                <input
                  type="text"
                  className="border-b border-gray-400 outline-none p-2 w-full"
                  placeholder="Scan/type Picklist ID"
                  value={values}
                  onChange={(e) => setValues(e.target.value.trim())}
                  onKeyDown={handleKeyDown}
                />
                <X className="absolute right-0 top-3 cursor-pointer" />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-400 font-semibold">
                  {errormsg}
                </p>
              )}
            </div>

            {/* SKU Scan Box */}
            {showBox && (
              <div className="flex flex-col gap-3 ml-5">
                <p className="font-semibold">Scan Product ID</p>
                <div className="h-[19rem] p-1 border-2 border-gray-200 w-[12rem] overflow-y-auto">
                  {skuInputs.map((input, index) => (
                    <input
                      key={index}
                      type="text"
                      className="pl-1 outline-none text-[1rem] opacity-80 w-full"
                      placeholder="Scan Mynstars/Seller SKU"
                      value={input}
                      onChange={(e) => {
                        const updated = [...skuInputs];
                        updated[index] = e.target.value;
                        setSkuInputs(updated);
                      }}
                      onKeyDown={(e) => handleSKUEnter(e, index)}
                    />
                  ))}
                </div>
                <p className="text-gray-400 font-semibold cursor-pointer">
                  CLEAR ALL
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Product Display */}
          <div className="flex-1">
            {showProdcut &&
              scannedProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  orderId={OrderId}
                  picklistCode={values}
                  onScanNext={handlescannext}
                />
              ))}
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
