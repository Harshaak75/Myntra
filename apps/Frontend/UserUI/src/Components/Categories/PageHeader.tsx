import React from 'react';
import { Grid2X2, List} from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="bg-white sticky top-0 z-10 py-3 border-b mb-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#282c3f]">Men's Fashion</h1>
            <p className="text-[#535766]">Showing 16 of 92532 products</p>
          </div>
          
          <div className="flex items-center mt-3 md:mt-0 space-x-4">
            <div className="flex space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Grid2X2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;