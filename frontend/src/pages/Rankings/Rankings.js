import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Rankings.css";

const Rankings = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        // Fetch rankings using the backend URL from .env
        const response = await fetch(`http://localhost:5000/api/rankings`);
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
    return <div className="loading-message">Loading rankings...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1>Rankings</h1>
        <p>See where you stand among other users!</p>
        
        {/* Search bar to filter rankings by username */}
        <input
          type="text"
          className="search-input"
          placeholder="Search by Username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="ranking-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Institute</th>
              <th>Course</th>
              <th>Points</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .sort((a, b) => b.points - a.points) // Sort users by points
              .map((user, index) => {
                let rowClass = ""; 
                if (index === 0) rowClass = "top-rank";
                if (index === 1) rowClass = "second-rank";
                if (index === 2) rowClass = "third-rank";

                return (
                  <tr key={user.username} className={rowClass}>
                    <td>{index + 1}</td>
                    <td>
                      {user.username}
                      {index === 0 && <span className="trophy">🏆</span>}
                      {index === 1 && <span className="trophy">🥈</span>}
                      {index === 2 && <span className="trophy">🥉</span>}
                    </td>
                    <td>{user.institute}</td>
                    <td>{user.course}</td>
                    <td>{user.points}</td>
                    <td>{user.tier}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;
