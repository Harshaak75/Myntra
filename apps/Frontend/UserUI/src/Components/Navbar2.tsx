import { CircleUser } from "lucide-react"
import { useLocation } from "react-router-dom";

export function Navbar2() {
  const location = useLocation();

  const pathparts = location.pathname.split("/").filter(Boolean);
  const currentPath = pathparts[pathparts.length - 1];
  const currentPath1 = pathparts[pathparts.length - 2];
  return (
    <nav className="w-full bg-white fixed z-10">
      <div className="max-w-9xl p-2 flex items-center justify-between">
        <div className="branding ml-14 leading-5">
          <p className="font-semibold text-gray-500 text-[1.1rem]">Mdirect</p>

          <div className="text-[0.85rem] flex items-center gap-2 font-semibold text-blue-500">
            <span>Home</span>
            <span className="text-gray-400">&gt;</span>
            <span>{currentPath1[0].toUpperCase() + currentPath1.slice(1)}</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-500">{currentPath[0].toUpperCase() + currentPath.slice(1)}</span>
          </div>
        </div>
        <div className="email_id mr-5 flex items-center gap-3">
            <CircleUser className="w-[1.3rem]"/>
            <p>{localStorage.getItem("email")}</p>
        </div>
      </div>
    </nav>
  );
}
