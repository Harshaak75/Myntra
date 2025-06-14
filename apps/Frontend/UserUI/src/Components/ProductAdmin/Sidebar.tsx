import { Home, Settings, LogOut, Box, Package } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { logo } from "@/ImagesCollection";
import { AdminValidToken } from "@/Utiles/ValidateToken";
import { getSupabaseClient } from "@/SupabaseClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../../../config";
import { Getadmintoken } from "@/Utiles/Getadmintoken";

export default function Sidebar() {
  const [loading, setloading] = useState(false);
  const naviage = useNavigate();
  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        setloading(true);
        // const token = await AdminValidToken();
        const token = await Getadmintoken();
        if (!token) {
          console.error("Token missing.");
          return;
        }
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase
          .from("Product")
          .select("id", { count: "exact" }) // Count exact pending products
          .eq("status", "Pending");

        if (error) {
          console.error("Error fetching pending products:", error);
        } else {
          console.log(data.length);
          setPendingProducts(data.length || 0); // Setting how many pending
        }
      } catch (err) {
        console.error("Failed to fetch pending products:", err);
      } finally {
        setloading(false);
      }
    };

    fetchPendingProducts();
  }, []);

  const [pendingProducts, setPendingProducts] = useState(3); // example: 3 pending

  const [email, setemail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const token = await Getadmintoken();

      if (!token) {
        naviage("/productAdmin/login");
        return;
      }

      try {
        const response = await axios.get(
          `${backend_url}ProductAdmin/getEmail`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("email", setemail(response.data.email));
      } catch (error) {}
    };

    fetchEmail();
  }, []);

  const handleLogout = async () => {
    const token = await Getadmintoken();
    if (!token) {
      naviage("/productAdmin/login");
      return;
    }

    try {
      setloading(true);
      await axios
        .get(`${backend_url}ProductAdmin/logoutadmin`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log("The responsive", response);
          localStorage.removeItem("admin_authorization"); // Clear token
          naviage("/productAdmin/login");
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              console.warn("Session expired. Redirecting to login.");
              localStorage.removeItem("admin_authorization"); // Clear token

              naviage("/productAdmin/login");
            }
          }
        });
    } catch (error) {
      console.log("error in the logout", error);
      naviage("/productAdmin/login");
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <aside className="flex flex-col justify-between w-64 h-screen border-r py-6 bg-white fixed">
        {/* Top Nav Links */}
        <div className="space-y-6 relative">
          {/* <h1 className="text-2xl font-bold px-4">Dashboard</h1> */}
          <div className="flex items-center ml-6 gap-2">
            <img src={logo} width={"45rem"} alt="" />
            <p className="text-[2rem] font-semibold">Mynstars</p>
          </div>
          <nav className="space-y-2 flex flex-col">
            <a
              href="/ProductAdmin/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <div className="w-full hover:bg-gray-50 hover:text-black px-4 py-3 flex items-center gap-2">
                <Home className="h-4 w-4" /> Home
              </div>
            </a>

            <a
              href="/productAdmin/manageProduct"
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <div className="w-full hover:bg-gray-50 hover:text-black px-4 py-3 flex items-center gap-2">
                <Package className="h-4 w-4" /> Manage Products
                {pendingProducts > 0 && (
                  <span className="absolute top-35 right-[5rem] w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </div>
            </a>

            <a
              href="/admin/approval"
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <div className="w-full hover:bg-gray-50 hover:text-black px-4 py-3 flex items-center gap-2">
                <Package className="h-4 w-4" /> Seller Approval
                {pendingProducts > 0 && (
                  <span className="absolute top-35 right-[5rem] w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </div>
            </a>

            <a
              href="/settings"
              className="flex items-center gap-2 text-gray-700"
            >
              <div className="w-full hover:bg-gray-50 hover:text-black px-4 py-3 flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </div>
            </a>
          </nav>
        </div>

        {/* Bottom User Section */}
        <div className="pt-6 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-start gap-3 items-center"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium text-left cursor-pointer">
                  <div>Product Admin</div>
                  <div className="text-xs text-muted-foreground">{email}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => alert("Settings Clicked")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      {loading && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-70">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
}
