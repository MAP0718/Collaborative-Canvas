import React, { useState } from "react";

function JoinRoom({ joinRoom }) {
  const [roomId, setRoomId] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Collaborative Whiteboard</h1>
      <input
        type="text"
        placeholder="Enter Room ID (e.g. 123)"
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: "10px", width: "200px" }}
      />
      <br /><br />
      <button onClick={() => joinRoom(roomId)} style={{ padding: "10px 20px" }}>
        Join / Create Room
      </button>
    </div>
  );
}

export default JoinRoom;