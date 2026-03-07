import React, { useState, useEffect } from "react";
import Navbar from "../../components/landingpage/nav/Navbar.jsx";

const Rankings = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        // Fetch rankings using the backend URL from .env
        const response = await fetch(`https://codearena-653z.onrender.com/api/rankings`);
        if (!response.ok) {
          throw new Error("Failed to fetch ranking data");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    setFilteredUsers(
      users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading rankings...</p>
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
          <p className="text-gray-300 mb-8">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Rankings</h1>
          <p className="text-xl text-gray-300">See where you stand among other users!</p>

          {/* Search bar to filter rankings by username */}
          <input
            type="text"
            className="w-full max-w-md mt-8 px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-full focus:outline-none focus:border-yellow-500 transition-colors duration-300"
            placeholder="Search by Username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-2xl">
          <table className="w-full">
            <thead className="bg-yellow-500">
              <tr>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">Rank</th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">Username</th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">Institute</th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">Course</th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">Points</th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">Tier</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers
                .sort((a, b) => b.points - a.points) // Sort users by points
                .map((user, index) => {
                  let rowBg = "";
                  if (index === 0) rowBg = "bg-gradient-to-r from-orange-400 via-yellow-400 to-transparent";
                  else if (index === 1) rowBg = "bg-gradient-to-r from-gray-400 via-gray-300 to-transparent";
                  else if (index === 2) rowBg = "bg-gradient-to-r from-amber-600 via-amber-500 to-transparent";
                  else rowBg = index % 2 === 0 ? "bg-gray-800" : "bg-gray-700";

                  return (
                    <tr key={user.username} className={`${rowBg} hover:bg-gray-600 transition-colors duration-200`}>
                      <td className="px-6 py-4 text-white font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-white font-medium flex items-center">
                        {user.username}
                        {index === 0 && <span className="ml-2 text-2xl">🏆</span>}
                        {index === 1 && <span className="ml-2 text-2xl">🥈</span>}
                        {index === 2 && <span className="ml-2 text-2xl">🥉</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.institute}</td>
                      <td className="px-6 py-4 text-gray-300">{user.course}</td>
                      <td className="px-6 py-4 text-white font-semibold">{user.points}</td>
                      <td className="px-6 py-4 text-white font-semibold">{user.tier}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
