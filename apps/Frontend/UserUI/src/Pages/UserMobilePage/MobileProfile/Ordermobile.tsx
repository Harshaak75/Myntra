import { order } from "@/ImagesCollection";
import { closeMenu } from "@/store/SidebarSlice";
import { useDispatch, useSelector } from "react-redux";

export const Ordermobile = () => {
  const isOpen = useSelector((state: any) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col h-screen bg-white">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-25"
          onClick={() => dispatch(closeMenu())}
        />
      )}
      <div className="h-full flex flex-col items-center justify-center">
        <div className="images w-[12rem]">
          <img src={order} alt="" />
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="mt-[-2rem] text-center px-8 space-y-1.5">
            <p className="text-[1.4rem] font-semibold">
              You haven't placed any order yet!
            </p>
            <p className="text-[0.9rem] font-semibold text-gray-500">
              Order Section is empty. After placing order, your can track them
              from here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
