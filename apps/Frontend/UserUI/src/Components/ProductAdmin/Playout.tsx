import { Outlet } from "react-router-dom";
import Sidebar from "../ProductAdmin/Sidebar";

export function Playout(){
    return(
        <div className="">
            <Sidebar/>
            <Outlet/>
        </div>
    )
}