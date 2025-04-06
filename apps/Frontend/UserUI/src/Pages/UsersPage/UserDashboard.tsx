import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarUser } from "../../UserComponents/NavbarUser";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = ["image1", "image2", "image3", "image4"];

export function UserDashboard() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // +1 or -1 to animate direction

  const slideTo = (newIndex: any) => {
    const total = carouselItems.length;

    const wrappedIndex = (newIndex + total) % total; // Wraps around if too high or too low

    setDirection(
      wrappedIndex > index || (index === total - 1 && wrappedIndex === 0)
        ? 1
        : -1
    );
    setIndex(wrappedIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      slideTo(index + 1);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [index]);

  return (
    <div className="bg-white h-full">
      <NavbarUser />
      <div className="w-full flex items-center justify-center pt-6 relative">
        {/* Red Container */}
        <div className="bg-red-400 h-[33rem] w-[96%] rounded-2xl p-5 relative overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="absolute w-full h-full flex items-center justify-center text-white text-3xl font-bold"
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {carouselItems[index]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left Button */}
        <div
          onClick={() => slideTo(index - 1)}
          className="btnl absolute bg-gray-500 opacity-50 top-1/2 -translate-y-1/2 left-12 p-2 px-1 py-1 rounded-full text-white cursor-pointer hover:scale-110 transition"
        >
          <ChevronLeft width={"3rem"} height={"3rem"} />
        </div>

        {/* Right Button */}
        <div
          onClick={() => slideTo(index + 1)}
          className="btnr absolute bg-gray-500 opacity-60 top-1/2 -translate-y-1/2 right-12 p-2 px-1 py-1 rounded-full text-white cursor-pointer hover:scale-110 transition"
        >
          <ChevronRight width={"3rem"} height={"3rem"} />
        </div>
      </div>
    </div>
  );
}
