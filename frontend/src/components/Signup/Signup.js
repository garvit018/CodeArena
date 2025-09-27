import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { ToastContainer, toast } from 'react-toastify'; // Import Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Navbar from '../landingpage/nav/Navbar';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '', // Add the country field
    institute: '', // Add the institute field
    course: '' // Add the course field
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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    try {
      // Sending a POST request to the backend for signup
      const response = await axios.post(
        'http://localhost:5000/auth/signup', // Updated path
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          country: formData.country, // Include country field in request
          institute: formData.institute, // Include institute field in request
          course: formData.course, // Include course field in request
        }
      );
      
      toast.success(response.data.message); // Show success message from backend
      setTimeout(() => {
        navigate('/login'); 
      }, 1500); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Signup failed! Please try again.'); // Show error toast if signup fails
    }
  };

  const toggle = () => {
    // Navigate to the login page when switching forms
    navigate('/login');
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
      <div className='leftside'>
        <img src="https://camo.githubusercontent.com/5046cb083418fd1922b7f5990e594c3bb06f5d87e5516cd8839ae0aa48b3aec4/68747470733a2f2f696d616765732e73717561726573706163652d63646e2e636f6d2f636f6e74656e742f76312f3537363966633430316236333162616231616464623261622f313534313538303631313632342d5445363451474b524a4738535741495553374e532f6b6531375a77644742546f6464493870446d34386b506f73776c7a6a53564d4d2d53784f703743563539425a772d7a505067646e346a557756634a45315a7657515578776b6d794578676c4e714770304976544a5a616d574c49327a76595748384b332d735f3479737a63703272795449304871544f6161556f68724938504936465879386339505774426c7141566c555335697a7064634958445a71445976707252715a32395077306f2f636f64696e672d667265616b2e676966" alt="login" />
      </div>
      <div className="signup-form-container signup-mode">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join CodeArena and level up your skills</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                required
              />
            </div>

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
                placeholder="Create a strong password"
                required
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter your country"
                required
              />
            </div>

            {/* New Fields for Institute and Course */}
            <div className="form-group">
              <label>Institute</label>
              <input
                type="text"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                placeholder="Enter your institute"
                required
              />
            </div>

            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Enter your course"
                required
              />
            </div>

            <button type="submit" className="submit-btn">Sign Up</button>
          </form>

          <div className="toggle-section">
            <p>
              Already have an account? 
              <span onClick={toggle} className="toggle-link">Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
