import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/landingpage/nav/Navbar.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    country: '',
    points: 0,
    problemsSolved: 0,
    tier: 'Bronze',
    institute: 'Unknown',
    course: 'Unknown',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Combined fetch for user details and stats
        const [userResponse, statsResponse] = await Promise.all([
          fetch("https://codearena-653z.onrender.com/api/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("https://codearena-653z.onrender.com/api/user/stats", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        ]);

        // Check for errors in responses
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
        }
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch user stats: ${statsResponse.statusText}`);
        }

        const userData = await userResponse.json();
        const statsData = await statsResponse.json();

        // Combine and set user details
        setUserDetails({
          name: userData.username || 'N/A',
          email: userData.email || 'N/A',
          country: userData.country || 'Unknown',
          institute: userData.institute || 'Unknown',
          course: userData.course || 'Unknown',
          points: statsData.points || 0,
          problemsSolved: statsData.problemsSolved || 0,
          tier: statsData.tier || 'Bronze',
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
              Retry
            </button>
            <button onClick={handleLogout} className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome, <span className="text-yellow-500">{userDetails.name}</span>!
          </h1>
          <p className="text-xl text-gray-300">Here's a quick overview of your profile.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-xl p-8 border-l-4 border-yellow-500 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Personal Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <strong className="text-yellow-500">Name:</strong>
                <span className="text-gray-200">{userDetails.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-yellow-500">Email:</strong>
                <span className="text-gray-200">{userDetails.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-yellow-500">Country:</strong>
                <span className="text-gray-200">{userDetails.country}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 border-l-4 border-yellow-400 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Achievements</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <strong className="text-yellow-400">Points:</strong>
                <span className="text-gray-200">{userDetails.points}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-yellow-400">Problems Solved:</strong>
                <span className="text-gray-200">{userDetails.problemsSolved}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-yellow-400">Tier:</strong>
                <span className="text-gray-200">{userDetails.tier}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 border-l-4 border-yellow-300 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Academic Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <strong className="text-yellow-300">Institute:</strong>
                <span className="text-gray-200">{userDetails.institute}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-yellow-300">Course:</strong>
                <span className="text-gray-200">{userDetails.course}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button onClick={() => navigate("/edit-profile")} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;