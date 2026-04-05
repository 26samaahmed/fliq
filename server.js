import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pkg from 'uuid';
const { v4 } = pkg;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows any device to connect
    methods: ["GET", "POST"]
  }
})
const rooms = {}
const roomHosts = {}
const MAX_USERS = 2

// FORMER CAMERA VIEW LOGIC USING EJS

// app.set('view engine', 'ejs')
// app.use(express.static('src/lib/backend'))

// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//     res.render('room', { roomID: req.params.room })
// })

import { handler } from './build/handler.js'; //sveltekit
app.use(handler);

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        if (!rooms[roomID]){
            rooms[roomID] = new Set()
            roomHosts[roomID] = socket.id
        }
        
        if (rooms[roomID].size >= MAX_USERS) {
            socket.emit('room-full')
            return
        }

        rooms[roomID].add(socket.id)
        socket.join(roomID)

        if (roomHosts[roomID] === socket.id) {
            socket.emit('is-host')
        }

        socket.to(roomID).emit('user-connected', userID)

        socket.on('disconnect', () => {
            rooms[roomID]?.delete(socket.id)
            if (rooms[roomID]?.size === 0){
                delete rooms[roomID]
                delete roomHosts[roomID]
            } else if (roomHosts[roomID] === socket.id) {
                const nextHost = rooms[roomID].values().next().value
                roomHosts[roomID] = nextHost
                io.to(nextHost).emit('is-host')
            }
            socket.to(roomID).emit('user-disconnected', userID)
        })

        socket.on('take-photo', () => {
            io.to(roomID).emit('take-photo')
        })
    })
})

const PORT = parseInt(process.env.PORT || '3000', 10);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})