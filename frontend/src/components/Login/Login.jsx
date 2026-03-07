import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../landingpage/nav/Navbar.jsx';

const Login = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        // "http://localhost:5000/auth/login", // API endpoint
        "https://codearena-653z.onrender.com/auth/login", // API endpoint

        {
          email: formData.email,  // Ensure the data is being sent correctly
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure this header is set
          },
        }
      );


      // Store the token in localStorage
      localStorage.setItem("token", response.data.data);

      // Show success toast notification
      toast.success("Logged in successfully");

      setTimeout(() => {
        navigate('/problemtable'); // Redirect to /problems after 3 seconds
      }, 1500);

    } catch (error) {
      // Show error toast notification on failure
      toast.error("Invalid Email or Password");
      console.log(error);
    }
  };


  const toggle = () => {
    // Navigate to the signup page when switching forms
    navigate('/signup');
  };

  return (
    <>
    <Navbar />
      <div className="flex justify-end items-center mt-0 min-h-[80vh] px-2 py-10 bg-black">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="hidden lg:block mt-12 w-[98%] object-cover rounded-lg mr-5">
        <img
          src="https://camo.githubusercontent.com/5046cb083418fd1922b7f5990e594c3bb06f5d87e5516cd8839ae0aa48b3aec4/68747470733a2f2f696d616765732e73717561726573706163652d63646e2e636f6d2f636f6e74656e742f76312f3537363966633430316236333162616231616464623261622f313534313538303631313632342d5445363451474b524a4738535741495553374e532f6b6531375a77644742546f6464493870446d34386b506f73776c7a6a53564d4d2d53784f703743563539425a772d7a505067646e346a557756634a45315a7657515578776b6d794578676c4e714770304976544a5a616d574c49327a76595748384b332d735f3479737a63703272795449304871544f6161556f68724938504936465879386339505774426c7141566c555335697a7064634958445a71445976707252715a32395077306f2f636f64696e672d667265616b2e676966"
          alt="login"
        />
      </div>
      <div className="w-full mt-8 max-w-lg bg-white rounded-xl p-4 overflow-y-auto transition-all duration-300">
        <div className="w-full bg-white">
          <div className="text-center mb-5">
            <h2 className="text-black text-xl font-bold mb-2">Welcome Back</h2>
            <p className="text-black text-base font-semibold">Log in to continue your coding journey</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs mb-2 text-black font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-xs transition-all duration-300 focus:outline-none focus:border-yellow-500 focus:shadow-[4px_4px_0px_#f8d210]"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs mb-2 text-black font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength="8"
                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-xs transition-all duration-300 focus:outline-none focus:border-yellow-500 focus:shadow-[4px_4px_0px_#f8d210]"
              />
            </div>

            <div className="mb-5 text-right">
              <button type="button" className="text-yellow-500 hover:underline text-sm">Forgot Password?</button>
            </div>

            <button type="submit" className="w-full py-2 bg-black text-yellow-500 border border-black rounded-lg text-sm cursor-pointer transition-all duration-300 font-semibold hover:bg-yellow-500 hover:text-black hover:shadow-[4px_4px_0px_#000000]">Login</button>
          </form>

          <div className="text-center mt-5 text-black">
            <p>
              Don't have an account?
              <span onClick={toggle} className="text-yellow-500 cursor-pointer font-semibold ml-1 hover:underline">Sign Up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
