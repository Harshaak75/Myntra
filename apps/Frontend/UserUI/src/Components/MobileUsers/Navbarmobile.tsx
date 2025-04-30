import { logo } from "@/ImagesCollection";
import { Heart, Menu, ShoppingBag, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbarmobilt = ({openMenu}: {openMenu?: () => void}) => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between p-4 shadow-sm bg-white">
      <div className="flex gap-4 items-center">
        <Menu className="text-xl" onClick={openMenu} />
        <img src={logo} alt="Logo" className="h-7" onClick={() => navigate("/mobile/home")}/>
      </div>
      <div className="flex items-center gap-4">
        <SquarePlus className="text-xl" />
        <Heart className="text-xl" />
        <ShoppingBag className="text-xl" />
      </div>
    </header>
  );
};
