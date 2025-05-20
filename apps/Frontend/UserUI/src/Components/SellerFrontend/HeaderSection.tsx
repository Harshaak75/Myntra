import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeaderSection (){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#F43397]">
            <Link to="/">Mynstars Supplier</Link>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-[#333333] hover:text-[#F43397] transition">How it Works</a>
          <a href="#features" className="text-[#333333] hover:text-[#F43397] transition">Features</a>
          <a href="#faq" className="text-[#333333] hover:text-[#F43397] transition">FAQ</a>
          <Button variant="outline" className="text-[#F43397] border-[#F43397] hover:bg-[#F43397] hover:text-white transition">Log In</Button>
          <Button className="bg-[#F43397] text-white hover:bg-[#F43397]/90 transition">Register</Button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <a href="#how-it-works" className="text-[#333333] hover:text-[#F43397] transition py-2">How it Works</a>
            <a href="#features" className="text-[#333333] hover:text-[#F43397] transition py-2">Features</a>
            <a href="#faq" className="text-[#333333] hover:text-[#F43397] transition py-2">FAQ</a>
            <Button variant="outline" className="text-[#F43397] border-[#F43397] hover:bg-[#F43397] hover:text-white transition w-full">Log In</Button>
            <Button className="bg-[#F43397] text-white hover:bg-[#F43397]/90 transition w-full">Register</Button>
          </div>
        </div>
      )}
    </header>
  );
};