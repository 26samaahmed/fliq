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
});

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomID: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID)
        socket.to(roomID).emit('user-connected', userID)

        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', userID)
        })
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});