# Collaborative Canvas 

A fun, real-time collaborative drawing app where you and your friends can draw together online! Just create a room, invite others, and start creating beautiful art together.

## What's This About?

Tired of drawing alone? With **Collaborative Canvas**, you can:
- Draw together with friends in real-time
- See live updates of what everyone's drawing
- Join rooms by ID (no complicated setup needed)
- Undo strokes if something goes wrong

All your drawings sync instantly across devices using WebSockets - so when your friend draws, you see it immediately!

## Getting Started

### Prerequisites
Make sure you have **Node.js** installed on your computer. [Download it here](https://nodejs.org/)

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start the App (Development Mode)

```bash
npm start
```

Open your browser to [http://localhost:3000](http://localhost:3000) and start drawing!

The app will automatically reload when you make changes to the code.

### Build for Production

Want to deploy your app? Run:

```bash
npm run build
```

This creates an optimized version in the `build/` folder that's ready to ship!

### Testing

Run tests in interactive mode:

```bash
npm test
```

## How It Works

1. **Enter your username** and a **room ID** (any ID works - friends use the same ID to join)
2. **Start drawing** on the canvas
3. **See your friends' strokes** appear instantly
4. **Undo** if you mess up
5. **Share the room ID** with friends so they can join

## Project Structure

```
client/              # React frontend (this folder!)
├── src/
│   ├── App.js       # Main app with room/username login
│   ├── Canvas.js    # Drawing canvas component
│   └── App.css      # Styling
└── package.json
```

The **server** handles all the real-time synchronization using Socket.io.


