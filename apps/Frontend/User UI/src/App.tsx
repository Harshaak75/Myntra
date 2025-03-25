import axios from "axios";
import "./App.css";
import Navbar from "./Components/Navbar";
import Signin from "./Pages/Signin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  Banknote,
  FileCog,
  LayoutDashboard,
  UserSearch,
  Tickets,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import myntralogo from "./ImagesCollection";
import Icon from "./Components/Icon";

import GridSellerDashboard from "./Components/GridSellerDashboard";
import SellerCatalog from "./Pages/Seller.Cataloguing";

const topbar = ["MEN", "WOMEN", "KIDS", "LIVING", "BEAUTY"];
const partner_topbar = [
  "Home",
  "Buying & Inventory",
  "Catalog",
  "Orders & Refunds",
  "Growth",
  "Pricing, Promo & Ads",
  "Payment",
  "Buiness Health",
  "Reports",
  "Support",
];
const icons: Record<string, LucideIcon> = {
  User,
  Heart,
  ShoppingBag,
  Menu,
};

const seller_icons: Record<string, LucideIcon> = {
  Search,
  User,
};

const seller_icons_sizes: Record<string, number> = {
  Search: 18,
  User: 18,
};

// Define icon sizes
const iconSizes: Record<string, number> = {
  User: 24,
  Heart: 20,
  ShoppingBag: 22,
  Menu: 18,
};

// const icon_size = [20, 20, 20, 24]

function downloadExcel(category: string) {
  axios
    .post(
      "http://localhost:3000/seller/download_excel",
      { category: category }, // Request body
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob", // Important: This tells Axios to return a Blob
      }
    )
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${category}-template.xlsx`; // Downloaded file name
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading Excel:", error));
}

const uploadfile = async (file: any) => {
  if (!file) {
    console.error("File not found");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post(
      "http://localhost:3000/seller/upload_documents",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImlhdCI6MTc0MjA1NzU2OCwiZXhwIjoxNzQyMDU3ODY4fQ.4_cgVbMm21IU4ivQtYwKV77eyt29_vwR3WqnpatZwmw",
        },
      }
    );
    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

function App() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedfile, setSelectedfile] = useState<File | null>(null);

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedfile(file);
  };

  return (
    <div className="h-screen bg-gray-100">
      {/* <Signin/> */}
      {/* <div className="p-5">
        <h1 className='text-xl mb-5'>To download the excel based on category: </h1>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="saree">Saree</option>
        <option value="tShirt">tShirt</option>
        <option value="jeans">Jeans</option>
        <option value="kurti">kurti</option>
        <option value="other">Other</option>
      </select>
      <button className='pl-5 cursor-pointer hover:text-red-400'  onClick={() => downloadExcel(selectedOption)}>Click to download Excel sheet</button>
      </div>

      <div className="p-5">
        <h1 className='text-xl mb-5'>To Upload the excel file by seller</h1>
        <input className='hover:text-red-400 cursor-pointer' type="file" name="excel"  id="ex1" onChange={handleFileChange} />
        <div className="flex items-center justify-center mt-3">
        <button className='hover:text-red-400 cursor-pointer' onClick={() => uploadfile(selectedfile)}>Upload the file</button>
        </div>
      </div> */}

      <Router>
      <Navbar
        menus={partner_topbar}
        showSearchBar={false}
        IconName={seller_icons}
        IconSizes={seller_icons_sizes}
        Iconslabel={false}
        path={myntralogo}
      />

      <Routes>
        <Route path="/" element={<GridSellerDashboard/>} />
        <Route path="/seller/cataloguing" element={<SellerCatalog />} />
      </Routes>

      </Router>



      


      {/* <button onClick={() => downloadExcel(selectedOption)}>Click to download Excel sheet</button> */}
    </div>
  );
}

export default App;
