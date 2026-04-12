import React, { useState } from "react";
import "../App.css";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import logo from "../assest/logo.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("new room created");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Please enter both room id and username");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl max-w-md w-full border border-slate-700">
        <div className="text-center mb-8">
          <img
            className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-cyan-400"
            src={logo}
            alt="collab-logo"
          />
          <h2 className="text-3xl font-bold text-white mb-2">
            CodeArena Collab
          </h2>
          <p className="text-slate-400">Real-time collaborative coding</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Room ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              placeholder="Enter room ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
          </div>

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={joinRoom}
          >
            Join Room
          </button>

          <div className="text-center">
            <span className="text-slate-400 text-sm">
              Don't have an invite?{" "}
              <button
                onClick={createNewRoom}
                className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-300"
              >
                Create new room
              </button>
            </span>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-gray-500 text-sm">
            Built by{" "}
            <a
              href="https://github.com/garvit018/CodeArena"
              className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              CodeArena
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
