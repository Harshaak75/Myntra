"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

const ProductCarousel = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const ITEM_WIDTH = 240; // width of each product
  const ITEMS_PER_SCROLL = 3;

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = ITEM_WIDTH * ITEMS_PER_SCROLL;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll("left")}
        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-opacity bg-gray-200 ${
          canScrollLeft ? "opacity-100" : "opacity-30 pointer-events-none"
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      {/* Scrollable Product List */}
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scroll-smooth px-8 py-4 no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((src, idx) => (
          <Card
            key={idx}
            className="min-w-[240px] p-0 max-w-[240px] h-[320px] flex-shrink-0 overflow-hidden rounded-xl shadow-md transition-transform cursor-pointer hover:shadow-lg"
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              src={src}
              alt={`Product ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </Card>
        ))}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll("right")}
        className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 transition-opacity bg-gray-200 ${
          canScrollRight ? "opacity-100" : "opacity-30 pointer-events-none"
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ProductCarousel;
