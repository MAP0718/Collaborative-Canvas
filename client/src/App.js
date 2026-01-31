import React, { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Canvas from "./Canvas";

const socket = io.connect("http://localhost:3001");

function App() {
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (room && username) {
      socket.emit("join_room", { roomId: room, username });
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div className="login-screen">
        <div className="login-card">
          
          <h2> Collaborative Canvas</h2>
          <p className="tagline">Where ideas meet together</p>
          <input placeholder="Username" onChange={(e)=>setUsername(e.target.value)} />
          <input placeholder="Room ID" onChange={(e)=>setRoom(e.target.value)} />
          <button onClick={handleJoin}>Start Drawing</button>
        </div>
      </div>
    );
  }

  return <Canvas socket={socket} room={room} username={username} />;
}

export default App;