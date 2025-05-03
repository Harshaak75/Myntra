import React, { useState } from "react";

export default function FloatingInput({ label, type = "text", name, onChange }: any) {
  const [value, setValue] = useState("");

  return (
    <div className="w-full">
    <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
  );
}
