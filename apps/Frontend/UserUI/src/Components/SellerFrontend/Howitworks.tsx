import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => {
  return (
    <div className="relative flex flex-col items-center md:items-start">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F43397] text-white font-bold text-lg mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[#333333]">{title}</h3>
      <p className="text-gray-600 text-center md:text-left">{description}</p>
    </div>
  );
};

export default function Howitworks(){
  const steps = [
    {
      number: 1,
      title: "Register as a Supplier",
      description: "Sign up on the Mynstars Supplier Panel with your business details and complete the verification process."
    },
    {
      number: 2,
      title: "List Your Products",
      description: "Upload your catalog with product details, images, pricing, and inventory information."
    },
    {
      number: 3,
      title: "Receive Orders",
      description: "Get notified when customers place orders for your products through the Mynstars app and website."
    },
    {
      number: 4,
      title: "Ship Products",
      description: "Package and ship the ordered products to customers using our logistics partners or your preferred carriers."
    },
    {
      number: 5,
      title: "Get Paid",
      description: "Receive secure payments directly to your bank account on a regular schedule."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting started with selling on Mynstars is simple. Follow these steps to begin 
            your journey to business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              number={step.number} 
              title={step.title} 
              description={step.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};