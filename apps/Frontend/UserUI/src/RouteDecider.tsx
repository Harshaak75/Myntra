import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RouteDecider = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      navigate("/mobile/home");
    } else {
      navigate("/user/navbar");
    }
  }, [navigate]);

  return null; // or a loading spinner while redirecting
};

export default RouteDecider;
