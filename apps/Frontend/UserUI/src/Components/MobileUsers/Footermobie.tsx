import { logo } from "@/ImagesCollection";
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



export const Footermobile = () => {
  const navigate = useNavigate();

  const email = useSelector((state: any) => state.auth.email);

  const handleUser = () =>{
    
    if(email){
      navigate("/user/account")
    } 
    else{
      navigate("/users/login")
    }
    
  }
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t-[0.04rem] flex justify-around items-center py-2 text-sm z-20 lg:hidden ">
      <div className="flex flex-col items-center text-pink-600">
        <img src={logo} className="h-5 mb-1" alt="home" />
        Home
      </div>
      <div className="flex flex-col items-center text-gray-600">
        <strong>fwd</strong>
        Under ₹999
      </div>
      <div className="flex flex-col items-center text-gray-600">
        <strong>©️</strong>
        Beauty
      </div>
      <div className="flex flex-col items-center text-gray-600" onClick={handleUser}>
        <User />
        Profile
      </div>
    </nav>
  );
};
