import React from 'react';
import ProductCard from './ProductCard';
// import { menProducts } from '@/data/Menproducts';
// import { Filter } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  price: string;
  title: string;
  image?: string; // add any other fields you're using
  attributes:{
    [key:string]: any
  }
};

type Props = {
  products: Product[];
};

const ProductGrid = ({products}: Props) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-[#282c3f]">TRENDING NOW</h2>
        
        {/* <div className="flex items-center mt-4 md:mt-0">
          <div className="flex items-center border rounded-md px-3 py-1.5 text-[#535766] mr-4">
            <span className="mr-2">Sort By:</span>
            <select className="bg-transparent outline-none cursor-pointer">
              <option>Recommended</option>
              <option>What's New</option>
              <option>Popularity</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
              <option>Customer Rating</option>
            </select>
          </div>
          
          <button className="flex items-center bg-white border rounded-md px-3 py-1.5 text-[#535766]">
            <filter className="w-4 h-4 mr-2" />
            <span>Filter</span>
          </button>
        </div> */}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} item={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;