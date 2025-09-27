import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

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
          fetch("https://codearena-backend-ffqp.onrender.com/api/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("https://codearena-backend-ffqp.onrender.com/api/user/stats", {
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="welcome-text">
          Welcome, <span className="highlight">{userDetails.name}</span>!
        </h1>
        <p>Here's a quick overview of your profile.</p>
      </div>

      <div className="profile-info">
        <div className="profile-card personal">
          <h3>Personal Info</h3>
          <div className="profile-item">
            <strong>Name:</strong> <span>{userDetails.name}</span>
          </div>
          <div className="profile-item">
            <strong>Email:</strong> <span>{userDetails.email}</span>
          </div>
          <div className="profile-item">
            <strong>Country:</strong> <span>{userDetails.country}</span>
          </div>
        </div>

        <div className="profile-card achievements">
          <h3>Achievements</h3>
          <div className="profile-item">
            <strong>Points:</strong> <span>{userDetails.points}</span>
          </div>
          <div className="profile-item">
            <strong>Problems Solved:</strong> <span>{userDetails.problemsSolved}</span>
          </div>
          <div className="profile-item">
            <strong>Tier:</strong> <span>{userDetails.tier}</span>
          </div>
        </div>

        <div className="profile-card academics">
          <h3>Academic Info</h3>
          <div className="profile-item">
            <strong>Institute:</strong> <span>{userDetails.institute}</span>
          </div>
          <div className="profile-item">
            <strong>Course:</strong> <span>{userDetails.course}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate("/edit-profile")} className="btn-primary">
          Edit Profile
        </button>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;