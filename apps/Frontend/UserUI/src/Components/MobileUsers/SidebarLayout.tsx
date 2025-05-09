import { Outlet } from "react-router-dom";
import { SidebarAccount } from "./AccountComp/SidebarAccount";

export const SidebarLayout = () => {
  return (
    <div className="">
    <div className=" mt-20 bg-white px-4 py-10 md:px-16 lg:px-28 flex gap-10">
      <SidebarAccount />

      <div className="mt-8 w-[70%]">
        <Outlet />
      </div>
    </div>
    </div>
  );
};
