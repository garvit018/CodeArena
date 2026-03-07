import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from './footer/Footer.jsx';
import image1 from '../../assest/p1.jpg';
import image2 from '../../assest/p2.jpg';
import Navbar from "./nav/Navbar.jsx";

const LandingPage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle Join Now button click
  const handleJoinClick = () => {
    const isLoggedIn = localStorage.getItem("token"); // Check if user is logged in
    if (isLoggedIn) {
      navigate("/problemtable");  // Redirect to problems page if logged in
    } else {
      navigate("/login");  // Redirect to login page if not logged in
    }
  };

  return (
    <>
    <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        {/* Hero Section */}
        <div className="bg-black text-white text-center py-24 px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slideInLeft">
              Unleash Your Potential with <span className="text-yellow-500">CODE<span className="text-yellow-400">SPHERE</span></span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-slideInRight font-medium">
              Master coding challenges, collaborate globally, and rank among the best developers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-bounceIn">
              <Link to="/problems" className="bg-white hover:bg-gray-100 text-black font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Start Solving</Link>
              <button onClick={handleJoinClick} className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg">Join Now</button>
            </div>
          </div>
        </div>

        {/* Why Should You Join Us Section */}
        <div className="bg-gray-100 py-24 px-8 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
            Why Developers Thrive with CODESPHERE
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-800"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl animate-slideInLeft border border-gray-200">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">🚀</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Accelerate Your Growth</h3>
              <p className="text-gray-600 leading-relaxed">Dive into adaptive coding challenges that dynamically adjust to your skill level, ensuring continuous learning and improvement.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl animate-slideInUp border border-gray-200">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">🌐</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Global Developer Network</h3>
              <p className="text-gray-600 leading-relaxed">Connect with passionate developers worldwide, engage in collaborative problem-solving, and expand your professional horizons.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl animate-slideInRight border border-gray-200">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">🏆</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Career Advancement</h3>
              <p className="text-gray-600 leading-relaxed">Showcase your coding prowess, earn verifiable skills, and get direct visibility to top tech companies and recruiters.</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white py-24 px-8 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
            Our Premier Services
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-800"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl animate-slideInLeft border border-gray-200">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">💻</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Coding Challenges</h3>
              <p className="text-gray-600 leading-relaxed">Explore thousands of meticulously curated coding problems spanning multiple difficulty levels and technologies.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl animate-slideInUp border border-gray-200">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Collaborative Learning</h3>
              <p className="text-gray-600 leading-relaxed">Engage in pair programming, code reviews, and real-time problem-solving with developers from around the globe.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl animate-slideInRight border border-gray-200">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Performance Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Track your progress, analyze your coding patterns, and receive personalized insights to refine your skills.</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-50 py-24 px-8 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
            Success Stories
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-800"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg animate-slideInLeft border border-gray-200">
              <p className="text-gray-300 italic mb-6 text-lg leading-relaxed">"CODESPHERE transformed my coding journey. The challenging problems and supportive community helped me transition from a novice to a confident software engineer."</p>
              <div className="flex items-center">
                <img
                  src={image1}
                  alt="Krishna Kumar"
                  className="w-20 h-20 rounded-full mr-4 border-4 border-gray-800 shadow-md"
                />
                <div>
                  <h4 className="text-gray-800 font-bold text-lg">Krishna Kumar</h4>
                  <span className="text-gray-600 font-medium">Software Engineer, Google</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg animate-slideInRight border border-gray-200">
              <p className="text-gray-300 italic mb-6 text-lg leading-relaxed">"What sets CODESPHERE apart is its real-world problem-solving approach. I've not just learned coding, but developed a systematic approach to tackling complex challenges."</p>
              <div className="flex items-center">
                <img
                  src={image2}
                  alt="Sumit Kashyup"
                  className="w-20 h-20 rounded-full mr-4 border-4 border-gray-800 shadow-md"
                />
                <div>
                  <h4 className="text-gray-800 font-bold text-lg">Sumit Kashyup</h4>
                  <span className="text-gray-600 font-medium">Lead Developer, Startup X</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-black py-24 px-8 text-center animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready to Elevate Your Coding Skills?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of developers transforming their careers with CODESPHERE.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-bounceIn">
            <Link to="/contact" className="bg-white hover:bg-gray-100 text-black font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Contact Us</Link>
            <a href="mailto:chauhankhushnam@gmail.com" className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg">Email Support</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
