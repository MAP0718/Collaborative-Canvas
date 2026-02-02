# Real-Time Collaborative Whiteboard

A full-stack application that allows multiple users to draw on a shared canvas at the same time. Built with a focus on low-latency synchronization and state management.
Please check the live url for the experience and backend may take time to load
<p>https://collaborative-canvas-mu.vercel.app/</p>

## Features
- Real-time drawing synchronization using WebSockets.
- Massive 4000px scrollable workspace with a persistent grid guide.
- Global Undo and Redo functionality synced across all connected clients.
- Multi-user presence: see exactly who is in the room.
- Dynamic notifications: shows the username of the person currently drawing.
- Adjustable brush sizes and a dedicated eraser tool.

## Technical Implementation
- Backend: Node.js and Express server.
- Communication: Socket.io for bidirectional event-based communication.
- Frontend: React.js with the HTML5 Canvas API.
- Styling: Custom CSS focusing on a dashboard-style user experience.

## Installation
1. Clone the repository.
2. Run 'npm run install-all' in the root directory to install dependencies for both parts.
3. Run 'npm run dev' to start the backend (3001) and frontend (3000) together.
