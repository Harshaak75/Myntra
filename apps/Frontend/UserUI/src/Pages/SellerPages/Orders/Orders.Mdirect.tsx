import { useEffect, useState } from "react";
import { Navbar2 } from "../../../Components/Navbar2";
import { SellerSidebar } from "./SellerComponents/SellerSidebar";
import { SellerHomepage } from "./SellerData/Sellerdata";
import { getSupabaseClient } from "../../../SupabaseClient"; // Import the dynamic client
import { getValidToken } from "../../../Utiles/ValidateToken";
import axios from "axios";
import { backend_url } from "../../../../config";
import { saveAs } from "file-saver";
import "../../../App.css";
import { useNavigate } from "react-router-dom";

type OrderType = {
  id: string;
  createdAt: string;
  on_hold: string;
  quantity: number;
  process_start: string;
  store: string;
  orderCode: string;
};

type PicklistType = {
  id: string;
  createdAt: string;
  status: string;
  sellerId: Number;
  quantity: number;
  type: string;
  code: string;
};

export function OrdersMdirect() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectAll, setSelectAll] = useState(false);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orderLen, setorderLen] = useState(0);

  const [refresh, setrefresh] = useState(false);

  const navigate = useNavigate();
  const [picklist, setPicklist] = useState<PicklistType[]>([]);

  const [activeTab, setActiveTab] = useState<
    "open" | "priority" | "picking" | "transit"
  >("open");

  useEffect(() => {
    const fetchOrders = async () => {
      // const token = localStorage.getItem("authorization");
      // console.log(localStorage.getItem("authorization"));
      setLoading(true);
      const {token} = await getValidToken();

      if (!token) {
        setError("Token not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseClient(token);

        if (activeTab == "open") {
          try {
            const { data, error } = await supabase.from("Order").select("*");

            if (error) {
              setError(error.message);
            } else {
              setorderLen(data.length);
              console.log(data);
              setOrders(data as OrderType[]);
            }
          } catch (error) {
            setError("Something went wrong fetching orders.");
          }
        } else if (activeTab == "picking") {
          try {
            const { data, error } = await supabase.from("Picklist").select("*");

            if (error) {
              setError(error.message);
            } else if (!data || data.length === 0) {
              setError("No Picklists found. Please create a Picklist first.");
              setPicklist([]); // clear existing picklist
            } else {
              // console.log(data)
              

              const updatedData = await Promise.all(
                data.map(async (item) => {
                  const response = await axios.get(
                    `${backend_url}seller/getQuantity?picklistId=${item.id}`,
                    {
                      headers: {
                        authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  return {
                    ...item,
                    quantity: response.data.quantity,
                  };
                })
              );

              setPicklist(updatedData as PicklistType[]);

              console.log(picklist)
            }
          } catch (error) {
            setError("Refresh the page");
          }
        }
      } catch (err) {
        setError("Something went wrong fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refresh, activeTab]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      const allOrderIds = orders.map((order) => order.id);
      setSelectedOrders(allOrderIds);
    }
    console.log(selectedOrders);
    setSelectAll(!selectAll);
  };

  const handleSelect = (orderId: string) => {
    const isSelected = selectedOrders.includes(orderId);

    if (isSelected) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const GeneratePicklist = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to generate a picklist.");
      return;
    }

    const token = await getValidToken();

    console.log("tt", token);

    try {
      setLoading(true);
      const response = await axios.post(
        `${backend_url}seller/generatePicklist`,
        {
          OrderIds: selectedOrders,
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      console.log(contentDisposition?.split("filename=")[1]?.replace(/"/g, ""));
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        "Picklist.pdf";

      saveAs(response.data, filename);
      console.log("Picklist generated successfully:", response.data);
    } catch (error: any) {
      console.log("error in generating picklist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderCode: any) => {
    navigate("/Orders/Open/Details", {
      state: { orderCode },
    });
  };

  const handleTabClick = (tab: typeof activeTab) => {
    if (activeTab === tab) {
      setrefresh((prev) => !prev);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="h-screen relative bg-gray-100">
      <SellerSidebar />
      <Navbar2 />
      <div className="relative h-screen">
        <div className="pt-[55px] pl-[48px] min-h-screen">
          {/* <div className="w-full flex justify-end p-2">
            <p className="text-black ">
              SK APPARELS BENGALURU KARNATAKA{" "}
              <a className="text-blue-700 ml-2">change</a>
            </p>
          </div>

          <div className="w-full bg-[#F9F9F9] p-3">
            <h1 className="text-3xl font-semibold">Order Management</h1>
          </div> */}

          <SellerHeader title = {"Order Management"}/>

          <div className="relative w-full bg-white flex gap-5 text-[1.3rem] pl-4">
            {SellerHomepage.map((value, key) => (
              <div key={key} className="relative p-3 cursor-pointer group">
                <p className="font-semibold">{value}</p>
                <span className="absolute left-0 bottom-0 w-0 h-[2.5px] shadow transition-all duration-200 group-hover:w-full bg-blue-900"></span>
              </div>
            ))}
          </div>

          <div className="w-full p-6 h-full flex items-center justify-between bg-[#F9F9F9]">
            <div className="flex gap-5">
              <button
                onClick={() => handleTabClick("open")}
                disabled={loading}
                className={`w-[10rem] h-full p-[0.9rem] font-semibold rounded border 
                  ${activeTab === "open" ? "bg-[#0bc1a9e2] text-white border-[#0bc1a9b8]" : "bg-white text-[#0bc1a9e2] border-[#0bc1a9b8]"}
                  ${loading ? "cursor-not-allowed" : "cursor-pointer"}
                  hover:bg-[#0bc1a99c] hover:text-white`}
              >
                Open Orders ({orderLen})
              </button>
              <button className="w-[10rem] cursor-pointer h-full p-[0.9rem] bg-white text-orange-400 border border-orange-400 rounded font-semibold">
                Priority Order
              </button>
              <button
                onClick={() => handleTabClick("picking")}
                className={`w-[10rem] h-full p-[0.9rem] font-semibold rounded border 
                  ${activeTab === "picking" ? "bg-[#0bc1a9e2] text-white" : "bg-white text-[#0bc1a9e2]"}
                  ${loading ? "cursor-not-allowed" : "cursor-pointer"}
                  hover:bg-[#0bc1a99c] hover:text-white`}
              >
                In Picking
              </button>
              <button className="w-[10rem] cursor-pointer h-full p-[0.9rem] bg-white rounded font-semibold">
                In Transit
              </button>
            </div>
            <div className="flex items-center gap-5">
              <input
                type="text"
                className="border-b border-gray-400 outline-none p-2"
                placeholder="Search by Order ID"
              />
              <button className="w-[5rem] h-[2rem] cursor-pointer bg-[#0bc1a9] rounded-2xl shadow text-white flex items-center justify-center font-semibold text-[0.85rem] border-[#0bc1a9]">
                SEARCH
              </button>
              <button className="w-[5rem] h-[2rem] cursor-pointer bg-white border-1 shadow border-[#0bc1a9] rounded-2xl text-[#0bc1a9] flex items-center justify-center font-semibold text-[0.85rem]">
                CLEAR
              </button>
            </div>
          </div>

          {activeTab == "open" && (
            <div className="w-full bg-[#eeeeee6d]">
              {/* Filter Bar */}
              <div className="w-full bg-white flex items-center justify-between p-6">
                <div className="flex gap-20 items-center pl-5">
                  <div>
                    <p className="text-[0.9rem] font-semibold text-gray-500">
                      Search by
                    </p>
                    <select className="border-b border-gray-400 outline-none text-sm w-[10rem]">
                      <option>Select Store...</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-semibold text-gray-500">
                      Search by
                    </p>
                    <select className="border-b border-gray-400 outline-none text-sm w-[10rem]">
                      <option>Select Store...</option>
                    </select>
                  </div>
                </div>
                <div className="flex">
                  <button className="w-[10rem] h-[2rem] cursor-pointer text-[#0bc1a9] flex items-center justify-center font-semibold text-[1rem]">
                    Download All
                  </button>
                  <button
                    onClick={GeneratePicklist}
                    className={`w-[10rem] h-[2rem] ${loading ? "cursor-not-allowed" : "cursor-pointer"} bg-[#0bc1a9] rounded-2xl shadow text-white flex items-center justify-center font-semibold text-[0.85rem] border-[#0bc1a9]`}
                    disabled={loading}
                  >
                    Generate Picklist
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-[500px] bg-gray-50 rounded">
                {loading ? (
                  <p className="p-4 text-black">Loading orders...</p>
                ) : error ? (
                  <p className="p-4 text-red-600">{error}</p>
                ) : (
                  <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-[#F9F9F9] sticky top-0 z-10">
                      <tr className="text-black ">
                        <th className="py-3 px-4 text-center border-b">
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="py-3 px-4 text-left font-semibold border-b">
                          Order ID
                        </th>
                        <th className="py-3 px-4 text-left font-semibold border-b">
                          Ordered On
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          On Hold Items
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Quantity
                        </th>
                        <th className="py-3 px-4 text-left font-semibold border-b">
                          Process Start Time
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Store
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {orders.map((order, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 align-middle cursor-pointer"
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleSelect(order.id)}
                            />
                          </td>
                          <td
                            onClick={() => handleOrderClick(order.orderCode)}
                            className="py-3 px-4 text-blue-600 font-medium cursor-pointer text-left hover:underline"
                          >
                            {order.orderCode}
                          </td>
                          <td className="py-3 px-4 text-left">
                            {new Date(order.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="py-3 px-4 text-center">-</td>
                          <td className="py-3 px-4 text-center">
                            {order.quantity}
                          </td>
                          <td className="py-3 px-4 text-left">
                            {new Date(order.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="py-3 px-4 text-center">Mynstars</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab == "picking" && (
            <div className="w-full bg-[#eeeeee6d]">
              {/* Filter Bar */}
              <div className="w-full bg-white flex items-center justify-between p-6">
                <div className="flex gap-20 items-center pl-5">
                  <div className="flex gap-2">
                    <input type="checkbox" name="" id="" />
                    <p className="text-[0.9rem] text-gray-600 font-semibold">
                      VIEW PRIORITY PICKLIST
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => navigate("/PackOrders/Operations")}
                    className={`w-[10rem] h-[2rem] ${loading ? "cursor-not-allowed" : "cursor-pointer"} bg-[#0bc1a9] rounded-2xl shadow text-white flex items-center justify-center font-semibold text-[0.85rem] border-[#0bc1a9]`}
                    disabled={loading}
                  >
                    Pack Order
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-[500px] bg-gray-50 rounded">
                {loading ? (
                  <p className="p-4 text-black">Loading Picklist...</p>
                ) : error ? (
                  <p className="p-4 text-red-600">{error}</p>
                ) : (
                  <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-[#F9F9F9] sticky top-0 z-10">
                      <tr className="text-black">
                        <th className="py-3 px-4 text-left font-semibold border-b">
                          Picklist ID
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Status
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Created On
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Type
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Quantities To Be Packed
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Quantity
                        </th>
                        <th className="py-3 px-4 text-center font-semibold border-b">
                          Download Picklist
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {picklist.map((items, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 align-middle cursor-pointer"
                        >
                          <td className="py-3 px-4 text-blue-600 font-medium text-left hover:underline">
                            {items.code}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {items.status}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {new Date(items.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            Single+Multi
                          </td>
                          <td className="py-3 px-4 text-center">
                            {items.quantity}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {items.quantity}
                          </td>
                          <td className="py-3 px-4 text-center">PDF CSV</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
        {loading && (
          <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export const SellerHeader = ({title}: any) => {
  return (
    <>
      <div className="w-full flex justify-end p-2">
        <p className="text-black ">
          SK APPARELS BENGALURU KARNATAKA{" "}
          <a className="text-blue-700 ml-2">change</a>
        </p>
      </div>

      <div className="w-full bg-[#F9F9F9] p-3">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {/* <h1 className="text-3xl font-semibold">Order Management</h1> */}
      </div>
    </>
  );
};
