import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
      <div className="mb-4 text-[#F43397] text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#333333]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function FeatureSection(){
  const features = [
    {
      title: "Zero Commission",
      description: "Keep all your profits with zero commission fees on any of your sales.",
      icon: "💰"
    },
    {
      title: "Pan India Reach",
      description: "Sell your products to customers across 27,000+ pincodes in India.",
      icon: "🇮🇳"
    },
    {
      title: "Easy Catalog Listing",
      description: "Quickly list your products with our simple catalog management tools.",
      icon: "📋"
    },
    {
      title: "Low Return Rate",
      description: "Enjoy peace of mind with our industry-best low return policies.",
      icon: "📦"
    },
    {
      title: "Growth Support",
      description: "Get dedicated support to grow your business on our platform.",
      icon: "📈"
    },
    {
      title: "Secure & Timely Payments",
      description: "Receive your payments securely and on time, every time.",
      icon: "💸"
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Why Sell on Mynstars?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join India's fastest growing e-commerce marketplace and experience the benefits 
            that thousands of suppliers are already enjoying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              title={feature.title} 
              description={feature.description} 
              icon={feature.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
