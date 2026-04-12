import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Remove useNavigate if not used
import httpClient, { getAuthHeaders } from "../../services/httpClient.jsx";

const ProblemTable = () => {
  const [problemsData, setProblemsData] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await httpClient.get("/api/problems", {
          headers: getAuthHeaders(),
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
        problem.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (difficulty) {
      filtered = filtered.filter(
        (problem) => problem.difficulty === difficulty,
      );
    }

    setFilteredProblems(filtered);
  };

  if (loading) return <div>Loading problems...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
          Keep Challenging <span className="text-yellow-500">Yourself!</span>
        </h1>

        {/* Search bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search for problems..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full max-w-md px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-full focus:outline-none focus:border-yellow-500 transition-colors duration-300"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex justify-center items-center mb-8">
          <label htmlFor="difficulty" className="text-white font-semibold mr-4">
            Filter by Difficulty:
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="px-4 py-2 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors duration-300"
          >
            <option value="" className="bg-gray-800 text-white">
              All
            </option>
            <option value="Easy" className="bg-gray-800 text-white">
              Easy
            </option>
            <option value="Medium" className="bg-gray-800 text-white">
              Medium
            </option>
            <option value="Hard" className="bg-gray-800 text-white">
              Hard
            </option>
          </select>
        </div>

        <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-2xl">
          <table className="w-full">
            <thead className="bg-yellow-500">
              <tr>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-black font-bold text-lg">
                  Solved
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, idx) => (
                <tr
                  className={`${idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600 transition-colors duration-200`}
                  key={problem.id}
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {problem.order}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/problem/${problem.id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        problem.difficulty === "Easy"
                          ? "bg-green-600 text-white"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-600 text-black"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {problem.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        problem.solved === "Yes"
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {problem.solved === "Yes" ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProblemTable;
