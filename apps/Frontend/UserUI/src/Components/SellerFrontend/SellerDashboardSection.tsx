import React from 'react';
import HeaderSection from './HeaderSection';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import Howitworks from './Howitworks';
import { FAQsection } from './FAQsection';
import Footersection from './Footersection';

export default function SellerDashboardSection(){
  return (
    <div className="min-h-screen bg-white">
      {/* <Toaster position="top-right" /> */}
      <HeaderSection />
      <HeroSection />
      <FeatureSection />
      <Howitworks />
      <FAQsection />
      <Footersection />
      
      {/* Login modal is hidden initially and triggered via Header buttons */}
      {/* <LoginModal /> */}
    </div>
  );
};