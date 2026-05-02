import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

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


io.on('connection', socket => {
    // Step 5 photo selection sync — lightweight, no PeerJS needed
    socket.on('join-selection-room', (roomID) => {
        socket.join(`select-${roomID}`);
        socket.to(`select-${roomID}`).emit('peer-joined-selection');
    });

    socket.on('broadcast-selection', (roomID, indices) => {
        socket.to(`select-${roomID}`).emit('photos-selected', indices);
    });

    socket.on('selection-update', (roomID, indices, required) => {
        socket.to(`select-${roomID}`).emit('selection-update', indices, required);
    });

    socket.on('request-state', (roomID) => {
        socket.to(`select-${roomID}`).emit('request-state');
    });

    socket.on('join-room', (roomID, userID, isCreator) => {
        if (!rooms[roomID]){
            rooms[roomID] = new Set()
            roomHosts[roomID] = null
        }

        if (isCreator) {
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

        socket.on('start-sequence', () => {
            socket.to(roomID).emit('start-sequence');
        })

        socket.on('countdown', (t) => {
            socket.to(roomID).emit('countdown', t);
        })

        socket.on('take-photo', () => {
            socket.to(roomID).emit('take-photo')
        })

        socket.on('photos-done', () => {
            socket.to(roomID).emit('photos-done');
        });
    })
})

app.use(handler);

const PORT = parseInt(process.env.PORT || '3000', 10);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})