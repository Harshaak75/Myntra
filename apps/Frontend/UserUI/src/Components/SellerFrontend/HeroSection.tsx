import React from 'react';
import { Button } from '@/Components/ui/button';
import { seller } from '@/ImagesCollection';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-white to-pink-50 py-16 lg:py-24">
      <div className="p-[2rem] 2xl:max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6 leading-tight">
            Grow Your Business with Mynstars
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of suppliers selling on Mynstars and reach millions of customers across India. No commission, no listing fees - just pure business growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate("/seller/signin")} size="lg" className="bg-[#F43397] text-white cursor-pointer hover:bg-[#F43397]/90 transition">
              Register Now
            </Button>
            <Button size="lg" variant="outline" className="text-[#F43397] border-[#F43397] hover:bg-[#F43397] hover:text-white transition">
              Learn More
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#F43397]">10Cr+</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#F43397]">6 Lakh+</p>
              <p className="text-sm text-gray-600">Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#F43397]">27000+</p>
              <p className="text-sm text-gray-600">Cities</p>
            </div>
          </div>
        </div>
        {/* <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-full max-w-md">
            <h3 className="text-xl font-semibold text-center mb-6">
              Start Selling Today
            </h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F43397]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F43397]"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F43397]"
                />
              </div>
              <div className="text-center pt-2">
                <Button className="w-full bg-[#F43397] text-white hover:bg-[#F43397]/90">
                  Sign Up as Supplier
                </Button>
              </div>
            </form>
            <p className="mt-4 text-sm text-center text-gray-500">
              Already a supplier? <a href="#" className="text-[#F43397] hover:underline">Log in</a>
            </p>
          </div>
        </div> */}
        <div className="">
          <img src={seller} alt="" />
        </div>
      </div>
    </div>
  );
};