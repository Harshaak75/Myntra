import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, ReceiptText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function Collapsible({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon:ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b py-4 ">
      <button
        className="flex justify-between cursor-pointer items-center w-full text-left text-gray-800 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 cursor-pointer">
            {icon}
          <div className="flex flex-col gap-1">
            <span className="text-[1.2rem] font-semibold">{title}</span>
            <span className="text-[0.8rem] text-gray-500">{subtitle}</span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Collapsible;
