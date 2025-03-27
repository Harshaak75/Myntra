import { useState } from "react";
import { backend_url } from "../../config";
import { background, logo } from "../ImagesCollection";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SellerLogin() {
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent page reload

    // Frontend validation
    if (
      !formData.email ||
      !formData.password
    ) {
      alert("All fields are required! Please fill out the entire form.");
      return;
    }

    // Password validation (optional, but good to have)
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      setloading(true); // Show loading state

      const response = await axios.post(
        `${backend_url}/login`, // Correct API endpoint
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert(
          "Registration successful! Please check your email for verification."
        );
        navigate("/seller/dashboard")
      } else {
        alert("Failed to register. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Show validation errors if backend returns them
        alert(error.response.data.errors.map((err: any) => err.msg).join("\n"));
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setloading(false); // Hide loading state
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }} // Replace with your image path
    >
      {/* Card Container */}
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center -mt-12">
          <div className="flex items-center justify-center w-24 h-24">
            <img src={logo} alt="Logo" className="w-18 pt-8" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mt-4">
          Welcome back to Myntra !
        </h2>
        <p className="text-gray-500 text-sm">
          Let’s create your Partner Account to start your journey with us.
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
