// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-green-500 text-white font-semibold rounded-lg transition-all hover:bg-green-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
