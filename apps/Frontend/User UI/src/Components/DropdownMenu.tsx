import { useNavigate } from "react-router-dom";

export default function DropdownMenu({
  isVisible,
  content,
  position,
  onMouseEnter,
  onMouseLeave,
}: any) {
  const navigate = useNavigate();

  const handleroute = (e: any, sub: any) => {
    e.preventDefault();
    console.log(sub);

    if (sub == "Cataloguing") {
      console.log("Cataloguing ");
      navigate("/seller/cataloguing");
    }
  };

  if (!isVisible || !content) return null;

  // top-0 left-[21.3rem]

  return (
    <div
      className="absolute p-5 bg-white flex gap-5 shadow-2xl rounded-b-sm z-30 transition-all duration-500"
      style={{ left: position.left, top: position.top, minWidth: "250px" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content.map((item: any, index: any) => (
        <div key={index} className="">
          <p className="text-gray-800">{item.title}</p>
          <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2"></div>
          {/* <p>{item.sub}</p> */}
          {item.sub.map((sub: any, index: any) => (
            <a
              onClick={(e) => handleroute(e, sub)}
              key={index}
              className="text-gray-500 p-2 flex flex-col hover:text-gray-400 cursor-pointer"
            >
              {sub}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
