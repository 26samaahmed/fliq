<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';

  const ROOM_ID = $page.params.roomID;
  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';

  let videoGrid: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let photosDiv: HTMLDivElement;
  let isHost = false;
  let roomFull = false;

  let socket: any;
  let myPeer: any;
  const peers: Record<string, any> = {};

  onMount(async () => {
    // Dynamically import browser-only libs
    const { io } = await import('socket.io-client');
    const { default: Peer } = await import('peerjs');

    socket = io(SERVER_URL);
    myPeer = new Peer({
        config: {
            iceServers: [
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
            ]
        }
    });

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

    // Add own video
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    addVideoStream(myVideo, stream);

    // Answer incoming calls
    myPeer.on('call', (call: any) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (remoteStream: any) => addVideoStream(video, remoteStream));
      call.on('close', () => video.remove());
    });

    // When a new user joins, call them
    socket.on('user-connected', (userID: any) => {
      setTimeout(() => connectToNewUser(userID, stream), 1000);
    });

    // When a user leaves, close their stream
    socket.on('user-disconnected', (userID: string) => {
      if (peers[userID]) {
        peers[userID].close();
        peers[userID] = undefined;
      }
    });

    // Join room once peer ID is ready
    myPeer.on('open', (id: any) => {
      socket.emit('join-room', ROOM_ID, id);
    });

    // Host-only: show Take Photo button
    socket.on('is-host', () => { isHost = true; });

    // Room full: redirect home
    socket.on('room-full', () => { roomFull = true; });

    // Take photo (triggered by host, received by all)
    socket.on('take-photo', () => {
      const videos = videoGrid.querySelectorAll('video');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      videos.forEach(video => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        photosDiv.appendChild(img);
      });
    });
  });

  function connectToNewUser(userID: string, stream: MediaStream) {
    const call = myPeer.call(userID, stream);
    const video = document.createElement('video');
    call.on('stream', (remoteStream: any) => addVideoStream(video, remoteStream));
    call.on('close', () => video.remove());
    peers[userID] = call;
  }

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
    video.srcObject = stream;
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.muted = true;
    video.addEventListener('loadedmetadata', () => video.play());

    stream.getTracks().forEach(track => {
      track.addEventListener('ended', () => video.remove());
    });

    videoGrid.appendChild(video);
  }

  function takePhoto() {
    socket.emit('take-photo');
  }

  function clearPhotos() {
    photosDiv.innerHTML = '';
  }

  onDestroy(() => {
    socket?.disconnect();
    myPeer?.destroy();
  });
</script>

<main class="bg-[#12192F] min-h-screen flex flex-col p-6">
  <Header />

  {#if roomFull}
    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <p class="font-b612-mono-regular text-white text-lg">This room is full.</p>
      <a href="/" class="font-b612-mono-regular mt-4 bg-[#DCDFF5] text-[#333745] px-4 py-2 rounded-full hover:bg-[#949FF2] transition duration-500">
        ← Go Home
      </a>
    </div>
  {:else}
    <div class="flex-1 flex flex-col items-center gap-6 mt-8">

      <!-- Video grid -->
      <div
        bind:this={videoGrid}
        class="grid gap-3 justify-center"
        style="grid-template-columns: repeat(auto-fill, 300px); grid-auto-rows: 300px;"
      ></div>

      <!-- Controls (Take Photo only shown to host) -->
      <div class="flex gap-3">
        {#if isHost}
          <button
            onclick={takePhoto}
            class="font-b612-mono-regular bg-[#e94560] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-85 transition duration-200">
            Take Photo
          </button>
        {/if}
        <button
          onclick={clearPhotos}
          class="font-b612-mono-regular bg-[#12192F] text-white font-semibold px-6 py-2 rounded-lg border border-[#e94560] hover:opacity-85 transition duration-200">
          Clear
        </button>
      </div>

      <!-- Hidden canvas for capturing frames -->
      <canvas bind:this={canvas} class="hidden"></canvas>

      <!-- Captured photos -->
      <div
        bind:this={photosDiv}
        class="grid gap-3 justify-center w-full max-w-3xl"
        style="grid-template-columns: repeat(auto-fill, 200px); grid-auto-rows: 200px;"
      ></div>
    </div>
  {/if}

  <Footer />
</main>