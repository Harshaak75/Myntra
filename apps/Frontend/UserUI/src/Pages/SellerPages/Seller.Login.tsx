import { useState } from "react";
import { backend_url } from "../../../config";
import { background, logo } from "../../ImagesCollection";
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

    setloading(true);

    try {
       // Show loading state

      await axios.post(
        `${backend_url}seller/login`, // Correct API endpoint
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
      )
      .then((response) =>{
        localStorage.setItem("authorization", response.data.sellerToken); // Save token
        alert(
          "Login successful! Thanks for logging in"
        );
        navigate("/seller/dashboard")
      })
      .catch((error) => {

        if(error.response){
          if(error.response.status == 421){
            alert("Invlaid email address, please try again")
          }
          else if(error.response.status == 422){
            alert("Invalid password, please try again")
          }
        }
      });
    } catch (error: any) {
      console.log(error)
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
          Welcome back to Mynstars !
        </h2>
        <p className="text-gray-500 text-[0.8rem] font-medium">
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
            className={`w-full bg-[#FF3F6C] text-white py-2 rounded-lg hover:bg-[#ff3f6cda] transition ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? "Please Wait" : "Login"}
          </button>
          <h1>New user? <a href="/" className="text-[#FF3F6C] font-medium">Signin</a></h1>
        </form>
      </div>
    </div>
  );
}
