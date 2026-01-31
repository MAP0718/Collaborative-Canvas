# System Architecture

## Real-Time Engine
The app uses a "Centralized State" model. The Node.js server acts as the source of truth. Every time a user draws a line, a data packet (containing coordinates, color, and a unique stroke ID) is sent to the server. The server stores this in a history array and broadcasts it to every other user in that room.

## Handling the Drawing Area
To provide a large workspace, the canvas is set to 4000x4000 pixels. We use 'offsetX' and 'offsetY' properties from the mouse events because they calculate coordinates relative to the canvas itself, not the browser window. This ensures that scrolling doesn't break the drawing accuracy.

## Syncing Undo/Redo
Managing undo in a collaborative environment is tricky. We solve this by tagging every segment of a single mouse movement with a 'strokeId'. When someone clicks undo, the server identifies the most recent 'strokeId' in the history, removes all segments associated with it, and pushes them to a redo stack. The updated history is then pushed to all clients to keep everyone in sync.


# Block Diagram

[ USER A ]  ----(Draws on Canvas)---->  [ LOCAL REACT STATE ]
                                               |
                                               v
                                        (socket.emit 'draw_step')
                                               |
                                               v
[ NODE.JS SERVER ] <------------------ [ SERVER MEMORY (Rooms) ]
       |                                (Stores stroke in History)
       |
(socket.broadcast)
       |
       v
[ USER B / USER C ] ----(Received)----> [ RENDER ON THEIR CANVAS ]

# Undo Workflow

[ CLIENT ]  -------(Clicks Undo)------>  [ SERVER ]
                                            |
                                     (1. Identify last StrokeId)
                                     (2. Move Stroke to Redo Stack)
                                     (3. Update History Array)
                                            |
[ CLIENTS ] <---(socket.emit 'update')--- [ BROADCAST ]
    |
(1. Clear Canvas)
(2. Loop through new History)
(3. Redraw everything)
