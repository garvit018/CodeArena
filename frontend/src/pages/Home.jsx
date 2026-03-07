import React, { useState } from 'react'
import "../App.css"
import {v4 as uuidV4} from 'uuid'
import toast from 'react-hot-toast'
import logo from "../assest/logo.png"
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate=useNavigate();
    const[roomId, setRoomId]=useState('');
    const[username, setUsername]=useState('');

    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidV4();
        setRoomId(id);
        toast.success('new room created');
    }

    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error('Please enter both room id and username');
            return;
        }
        navigate(`/editor/${roomId}`,{
            state:{
                username,
            },
        })
    }
    const handleInputEnter=(e)=>{
        if(e.code==='Enter'){
            joinRoom();
        }
    }


  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <img className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-yellow-500" src={logo} alt="collab-logo" />
          <h2 className="text-3xl font-bold text-white mb-2">CollabSphere</h2>
          <p className="text-gray-400">Real-time collaborative coding</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Room ID</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300"
              placeholder="Enter room ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
          </div>

          <button
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={joinRoom}
          >
            Join Room
          </button>

          <div className="text-center">
            <span className="text-gray-400 text-sm">
              Don't have an invite?{' '}
              <button
                onClick={createNewRoom}
                className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors duration-300"
              >
                Create new room
              </button>
            </span>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            Built by{' '}
            <a
              href="https://github.com/garvit018/CodeArena"
              className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              CODESPHERE
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home