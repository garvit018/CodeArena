import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Remove useNavigate if not used
import axios from "axios";
import "./ProblemTable.css";

const ProblemTable = () => {
  const [problemsData, setProblemsData] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl);  // Should print http://localhost:5000/api

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://codearena-backend-ffqp.onrender.com/api/problems`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProblemsData(response.data.problems);
        setFilteredProblems(response.data.problems);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch problems.");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterProblems(e.target.value, selectedDifficulty);
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    filterProblems(searchQuery, e.target.value);
  };

  // Filter problems
  const filterProblems = (query, difficulty) => {
    let filtered = problemsData;

    if (query.trim() !== "") {
      filtered = filtered.filter((problem) =>
        problem.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (difficulty) {
      filtered = filtered.filter((problem) => problem.difficulty === difficulty);
    }

    setFilteredProblems(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "yellow";
      case "Hard":
        return "red";
      default:
        return "black";
    }
  };

  if (loading) return <div>Loading problems...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-container">
      {/* User Stats */}
      <h1 className="motivating-heading">
        Keep Challenging <span className="yellow">Yourself!</span>
      </h1>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for problems..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Difficulty Filter */}
      <div className="difficulty-filter">
        <label htmlFor="difficulty">Filter by Difficulty:</label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
          className="difficulty-dropdown"
        >
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <table className="problem-table">
        <thead className="table-head-col">
          <tr>
            <th className="table-heading">Rank</th>
            <th className="table-heading">Title</th>
            <th className="table-heading">Difficulty</th>
            <th className="table-heading">Category</th>
            <th className="table-heading">Solved</th> {/* New column for solved status */}
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((problem, idx) => {
            const difficultyColor = getDifficultyColor(problem.difficulty);
            return (
              <tr className={idx % 2 === 1 ? "row-odd" : ""} key={problem.id}>
                <td>{problem.order}</td>
                <td className="title">
                  <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
                </td>
                <td style={{ color: difficultyColor }}>{problem.difficulty}</td>
                <td>{problem.category}</td>
                <td>{problem.solved === "Yes" ? "Yes" : "No"}</td> {/* Display solved status */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemTable;
