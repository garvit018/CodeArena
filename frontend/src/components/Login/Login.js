import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../landingpage/nav/Navbar';

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
        "http://localhost:5000/auth/login", // API endpoint
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
      <div className="login-signup-container">
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
      <div>
        <img
          src="https://camo.githubusercontent.com/5046cb083418fd1922b7f5990e594c3bb06f5d87e5516cd8839ae0aa48b3aec4/68747470733a2f2f696d616765732e73717561726573706163652d63646e2e636f6d2f636f6e74656e742f76312f3537363966633430316236333162616231616464623261622f313534313538303631313632342d5445363451474b524a4738535741495553374e532f6b6531375a77644742546f6464493870446d34386b506f73776c7a6a53564d4d2d53784f703743563539425a772d7a505067646e346a557756634a45315a7657515578776b6d794578676c4e714770304976544a5a616d574c49327a76595748384b332d735f3479737a63703272795449304871544f6161556f68724938504936465879386339505774426c7141566c555335697a7064634958445a71445976707252715a32395077306f2f636f64696e672d667265616b2e676966"
          alt="login"
        />
      </div>
      <div className="login-form-container login-mode">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Log in to continue your coding journey</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength="8"
              />
            </div>

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit"  className="submit-btn">Login</button>
          </form>

          <div className="toggle-section">
            <p>
              Don't have an account? 
              <span onClick={toggle} className="toggle-link">Sign Up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
