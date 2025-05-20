import React from 'react';
import { Button } from "@/Components/ui/button";

export default function Sellerform () {
  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold">Sell Online to 14 Cr+ Customers at 0% Commission</h1>
        <p className="mt-4 text-lg">Join the fastest-growing supplier platform in India</p>
        <Button className="mt-6 bg-white text-pink-600 font-semibold hover:bg-gray-100">Start Selling</Button>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            ['11 Lakh+', 'Suppliers'],
            ['14 Crore+', 'Customers'],
            ['19,000+', 'Pincodes'],
            ['700+', 'Categories'],
          ].map(([value, label]) => (
            <div key={label} className="bg-white p-6 shadow-md rounded-md">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Suppliers Love Us */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Suppliers Love Us</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {[
            ['0% Commission Fee', 'Keep 100% of your profit with no commissions.'],
            ['No Penalty Charges', 'No charges for late dispatch or order cancellations.'],
            ['Easy Listing', 'Upload your products easily with our intuitive tools.'],
            ['Lowest Shipping Cost', 'Deliver across India at the most affordable rates.'],
          ].map(([title, description]) => (
            <div key={title} className="p-4 border rounded-lg">
              <h3 className="font-semibold text-xl">{title}</h3>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Sellers Say</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Amit & Rajat Jain',
              company: 'Smartees, Tiruppur',
              feedback:
                'Our business has grown beyond our imagination. We now receive up to 10,000 orders during sales.',
            },
            {
              name: 'Suman',
              company: 'Keshav Fashion, Hisar',
              feedback:
                'Started with 4 orders on day one, now hitting over 1,000 daily orders. Thanks to this platform!',
            },
            {
              name: 'Mohit Rathi',
              company: 'Meira Jewellery, Ahmedabad',
              feedback:
                'Lockdown was tough, but this platform gave us a nationwide presence overnight.',
            },
          ].map(({ name, company, feedback }) => (
            <div key={name} className="bg-white p-6 rounded-md shadow-md">
              <div className="font-semibold text-lg">{name}</div>
              <div className="text-sm text-gray-500">{company}</div>
              <p className="text-gray-700 mt-4 text-sm">{feedback}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-pink-600 text-white py-16 text-center px-4">
        <h2 className="text-3xl font-bold">Ready to Grow Your Business?</h2>
        <p className="mt-4 text-lg">Join now and reach millions of customers at zero commission cost.</p>
        <Button className="mt-6 bg-white text-pink-600 hover:bg-gray-100 font-semibold">Start Selling</Button>
      </section>
    </div>
  );
};

