import { Outlet } from "react-router-dom";
import { SidebarAccount } from "./AccountComp/SidebarAccount";

export const SidebarLayout = () => {
  return (
    <div className="">
    <div className="md:mt-20 mt-2 bg-white lg:px-28 flex md:gap-10 gap-0">
      <SidebarAccount />

      <div className="mt-8 lg:w-[60%] w-[100%] bg-white">
        <Outlet />
      </div>
    </div>
    </div>
  );
};
