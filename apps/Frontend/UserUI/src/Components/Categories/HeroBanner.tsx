import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { banners, Womenbanners, Kidsbanners, genzbanners } from '@/data/Menproducts';

const HeroBanner = ({gender}: {gender: string}) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const banner = gender === "women" ? Womenbanners : gender === "kids" ? Kidsbanners : gender === "genz" ? genzbanners : banners;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banner.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banner.length);
  };

  const goToPrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banner.length) % banner.length);
  };

  



  return (
    <div className="relative w-full h-[400px] overflow-hidden mb-8">
      <div 
        className="flex transition-transform duration-500 ease-out h-full" 
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banner.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-8 left-8 bg-white/80 p-4 rounded-md max-w-xs">
              <h3 className="text-xl font-bold text-[#282c3f]">{banner.title}</h3>
              <p className="text-[#535766]">{banner.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white"
        aria-label="Next banner"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banner.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`h-2 rounded-full transition-all ${currentBanner === index ? 'w-8 bg-[#ff3f6c]' : 'w-2 bg-white/70'}`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;