// @ts-nocheck
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer =  new Peer(undefined, {
    config: {
        'iceServers': [
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ]
    }
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userID => {
        setTimeout(() => {
            connectToNewUser(userID, stream)
        }, 1000)
    })
})

socket.on('user-disconnected', userID =>{
    if (peers[userID]) { peers[userID].close() }
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userID, stream) {
    const call = myPeer.call(userID, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userID] = call
}


function addVideoStream(video, stream) {
    video.srcObject = stream
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.muted = true
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

// Photo booth
const canvas = document.getElementById('canvas')
const photosDiv = document.getElementById('photos')

document.getElementById('photo-button').addEventListener('click', () => {
    socket.emit('take-photo')
})

document.getElementById('clear-button').addEventListener('click', () => {
    photosDiv.innerHTML = ''
})

socket.on('take-photo', () => {
    const videos = videoGrid.querySelectorAll('video')
    const ctx = canvas.getContext('2d')
    videos.forEach(video => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        const img = document.createElement('img')
        img.src = canvas.toDataURL('image/png')
        photosDiv.appendChild(img)
    })
})
