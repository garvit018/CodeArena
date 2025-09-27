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
    <div>
    <div className='collab-wrapper'>
        <div className='homeform-wrapper'>
        <div className='logo-wrapper'>
        <img className="collab-logo" src={logo} alt="collab-logo" />
        <h2>CollabArena</h2>
        </div>
            <h4 className='mainLabel'>Paste invitation room id</h4>
            <div className='inputGroup'>
                <input type="text" className='inputBox' placeholder="room-id"
                onChange={(e)=>{
                    setRoomId(e.target.value);
                }} value={roomId}
                onKeyUp={handleInputEnter} />

                <input type="text" className='inputBox' placeholder="username"
                onChange={(e)=>{
                    setUsername(e.target.value)
                }}
                value={username} 
                onKeyUp={handleInputEnter} 
                />
           
                <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                <span className='createInfo'>
                    if you don't have invite create &nbsp;
                    <a onClick={createNewRoom} href="" className='createNewBtn'>new room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4>Built by <a href="https://github.com/khushnam-chauhan/CodeArena.git">CodeArena</a> </h4>
        </footer>
    </div>
    </div>
  )
}

export default Home