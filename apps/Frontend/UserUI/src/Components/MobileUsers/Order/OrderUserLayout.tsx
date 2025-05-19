import { Outlet } from "react-router-dom"
import { NavbarSB } from "../NavbarSB"

export const OrderUserLayout = () =>{
    return (
        <div className="bg-white p-4 mb:p-10">
            <NavbarSB/>
            <Outlet/>
        </div>
    )
}