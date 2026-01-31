const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        history: [],
        redoStack: [],
        users: []
      };
    }
    rooms[roomId].users.push({ id: socket.id, username });

    io.to(roomId).emit("room_data", {
      users: rooms[roomId].users,
      history: rooms[roomId].history
    });
  });

  socket.on("draw_step", ({ roomId, step }) => {
  if (rooms[roomId]) {
    rooms[roomId].history.push(step);
    rooms[roomId].redoStack = [];
    socket.to(roomId).emit("draw_step", step);
  }
});

  socket.on("undo", (roomId) => {
  if (rooms[roomId] && rooms[roomId].history.length > 0) {
    const lastStrokeId = rooms[roomId].history[rooms[roomId].history.length - 1].strokeId;
    
    const strokeToRemove = rooms[roomId].history.filter(step => step.strokeId === lastStrokeId);
    
    rooms[roomId].redoStack.push(strokeToRemove);
    
    rooms[roomId].history = rooms[roomId].history.filter(step => step.strokeId !== lastStrokeId);
    
    io.to(roomId).emit("history_update", rooms[roomId].history);
  }
});


  socket.on("clear_canvas", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].history = []; 
      io.to(roomId).emit("history_update", []); 
    }
  });

  socket.on("redo", (roomId) => {
  if (rooms[roomId] && rooms[roomId].redoStack && rooms[roomId].redoStack.length > 0) {
    const recoveredStroke = rooms[roomId].redoStack.pop();
    rooms[roomId].history.push(...recoveredStroke);
    
    io.to(roomId).emit("history_update", rooms[roomId].history);
  }
});
  

  socket.on("disconnecting", () => {
    socket.rooms.forEach(roomId => {
      if (rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.filter(u => u.id !== socket.id);
        io.to(roomId).emit("room_data", { users: rooms[roomId].users });
      }
    });
  });
});

server.listen(3001, () => console.log("Server running on 3001"));