import React, { useRef, useEffect, useState } from "react";

function Canvas({ socket, room, username }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Set Large Dimensions (3x to 4x screen size)
  const CANVAS_WIDTH = 4000;
  const CANVAS_HEIGHT = 4000;

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [users, setUsers] = useState([]);
  const [activeLabels, setActiveLabels] = useState([]);
  const [currentStrokeId, setCurrentStrokeId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;

    socket.on("room_data", (data) => {
      if (data.users) setUsers(data.users);
      if (data.history) redrawHistory(data.history);
    });

    socket.on("draw_step", (step) => {
      drawSegment(step);
      showDrawingLabel(step);
    });

    socket.on("history_update", (history) => redrawHistory(history));

    return () => {
      socket.off("room_data");
      socket.off("draw_step");
      socket.off("history_update");
    };
  }, []);

  function showDrawingLabel(step) {
    setActiveLabels((prev) => {
      const exists = prev.find(l => l.strokeId === step.strokeId);
      if (exists) return prev;

      const newLabel = {
        strokeId: step.strokeId,
        username: step.username,
        x: step.x,
        y: step.y
      };

      setTimeout(() => {
        setActiveLabels(current => current.filter(l => l.strokeId !== step.strokeId));
      }, 1000);

      return [...prev, newLabel];
    });
  }

  const drawSegment = (step) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.strokeStyle = step.tool === "eraser" ? "#FFFFFF" : step.color;
    ctx.lineWidth = step.size;
    ctx.beginPath();
    ctx.moveTo(step.prevX, step.prevY);
    ctx.lineTo(step.x, step.y);
    ctx.stroke();
  };

  const redrawHistory = (history) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    // Clear the entire huge area
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    history.forEach(step => drawSegment(step));
  };

  const startDrawing = (e) => {
    const id = Date.now() + Math.random();
    setCurrentStrokeId(id);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    const step = {
      strokeId: currentStrokeId,
      username: username,
      prevX: offsetX - e.nativeEvent.movementX,
      prevY: offsetY - e.nativeEvent.movementY,
      x: offsetX,
      y: offsetY,
      color: color,
      size: size,
      tool: tool
    };

    drawSegment(step);
    socket.emit("draw_step", { roomId: room, step });
  };

return (
  <div className="app-container">
    {/* 1. Add the dynamic class here */}
    <div className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      <h2>Room: {room}</h2>
      <p style={{fontSize: '12px'}}>User: <strong>{username}</strong></p>
      <hr style={{opacity: 0.1, margin: '15px 0'}} />
      <h4>Online Users</h4>
      <div className="user-list-container">
        {users.map((u) => (
          <div key={u.id} className="user-item">{u.username}</div>
        ))}
      </div>
    </div>

    <div className="main-content">
      <div className="toolbar">
        {/* 2. Add the Toggle Button at the start of the toolbar */}
        <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "◀ Hide" : "Users ▶"}
        </button>

        <button className={tool === "brush" ? "active-tool" : ""} onClick={() => setTool("brush")}>Brush</button>
        <button className={tool === "eraser" ? "active-tool" : ""} onClick={() => setTool("eraser")}>Eraser</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} disabled={tool === "eraser"} />
        <input type="range" min="1" max="60" value={size} onChange={(e) => setSize(e.target.value)} />
        <span style={{fontSize: '13px', minWidth: '40px'}}>{size}px</span>
        <button className="undo-btn" onClick={() => socket.emit("undo", room)}>Undo</button>
        <button className="redo-btn" onClick={() => socket.emit("redo", room)}>Redo</button>
        <button className="clear-btn" onClick={() => socket.emit("clear_canvas", room)}>Clear All</button>
      </div>

      <div className="canvas-container">
        {activeLabels.map(label => (
          <div key={label.strokeId} className="drawing-label" style={{ left: label.x, top: label.y - 35 }}>
            {label.username}
          </div>
        ))}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>
    </div>
  </div>
);
}

export default Canvas;