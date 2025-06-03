import React from 'react';
import { dealsBanners } from '@/data/Menproducts';

const DealsSection = () => {
  return (
    <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#282c3f] text-center">DEALS OF THE DAY</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dealsBanners.map((deal) => (
          <div key={deal.id} className="overflow-hidden rounded-md cursor-pointer group">
            <div className="relative">
              <img 
                src={deal.image} 
                alt={deal.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <h3 className="text-white font-medium text-lg">{deal.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsSection;