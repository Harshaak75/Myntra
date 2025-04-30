import { Outlet } from "react-router-dom";
import Sidebar from "../ProductAdmin/Sidebar";
import { Navbarmobilt } from "./Navbarmobile";
import { Sidebarmobile } from "./Sidebarmobile";
import { SidebarProvider } from "@/Hooks/SidebarContsxt";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu, openMenu } from "@/store/SidebarSlice";

export function MobileUserLayout() {
  // const [isOpen, setOpen] = useState(false);

  // const openMenu = () => {
  //   setOpen(true);
  // };

  // const closeMenu = () => {
  //   setOpen(false);
  // };

  useEffect(() =>{
    dispatch(closeMenu());
  },[])

  const isOpen = useSelector((state: any) => state.sidebar.isOpen);

  const dispatch = useDispatch();
  return (
    <div className="">
      <div className="fixed top-0 left-0 w-full bg-white z-20 shadow">
      <Navbarmobilt openMenu={() => dispatch(openMenu())}/>
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
      >
        <Sidebarmobile closeMenu={() => dispatch(closeMenu())} />
      </div>
      <Outlet />
    </div>
  );
}
