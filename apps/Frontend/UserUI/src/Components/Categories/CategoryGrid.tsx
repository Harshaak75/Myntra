import React from 'react';
import { Mencategories, Womencategories, Kidscategories} from '@/data/Menproducts';
import { useNavigate } from 'react-router-dom';

const CategoryGrid = ({gender}: {gender: string}) => {
  const categories = gender === "women" ? Womencategories : gender === "kids" ? Kidscategories : Mencategories;

  const navigate = useNavigate();
  
  return (
    <>
    {gender != "genz" && <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#282c3f] text-center">CATEGORIES TO BAG</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:ml-25 gap-4">
        {categories.map((category) => (
          <div onClick={() => navigate(`/user/Products/${category.name}`, {state: {Gender: category.gender}})} key={category.id} className="overflow-hidden ml-2 rounded-md cursor-pointer group">
            <div className="relative">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105" 
              />
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                <h3 className="text-white font-medium text-center">{category.name}</h3>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
    }
    </>
  );
};

export default CategoryGrid;