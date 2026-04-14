<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import { page } from '$app/stores';

  $: roomID = $page.params.roomID || sessionStorage.getItem('roomID');

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';

  let videoGrid: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let photosDiv: HTMLDivElement;
  let isHost = false;
  let roomFull = false;
  let isTwoUsers = false;

  let socket: any;
  let myPeer: any;
  const peers: Record<string, any> = {};
  
  onMount(async () => {
    isTwoUsers = sessionStorage.getItem('userCount') === '2' || !!$page.params.roomID;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    addVideoStream(myVideo, stream);

    if (isTwoUsers) {
      const { io } = await import('socket.io-client');
      const { default: Peer } = await import('peerjs');

      socket = io(SERVER_URL);
      myPeer = new Peer({ config: { iceServers: [
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]}});

      myPeer.on('call', (call: any) => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (remoteStream: any) => addVideoStream(video, remoteStream));
        call.on('close', () => video.remove());
      });

      socket.on('user-connected', (userID: string) => {
        setTimeout(() => connectToNewUser(userID, stream), 1000);
      });

      socket.on('user-disconnected', (userID: string) => {
        if (peers[userID]) { peers[userID].close(); peers[userID] = undefined; }
      });

      myPeer.on('open', (id: string) => {
        socket.emit('join-room', roomID, id);
      });

      socket.on('is-host', () => { isHost = true; });
      socket.on('room-full', () => { roomFull = true; });
      socket.on('take-photo', () => capturePhotos());
    }
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

  function capturePhotos() {
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
  }

  function takePhoto() {
    if (isTwoUsers) {
      socket.emit('take-photo');
    } else {
      capturePhotos();
    }
  }

  function clearPhotos() {
    photosDiv.innerHTML = '';
  }

  onDestroy(() => {
    socket?.disconnect();
    myPeer?.destroy();
  });
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 4: Take Your Photos
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <!-- 👇 Description under progress bar -->
    <p class="text-center font-aldrich text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Get ready! We’ll take 8 photos. Hit the button when you’re ready.
    </p>
  </div>

  <!-- Main content -->
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

      <!-- Controls -->
      <div class="flex gap-3">
        <!-- 2-user: only host can take photo -->
        <!-- 1-user: always show button -->
        {#if !isTwoUsers || isHost}
          <button
            onclick={takePhoto}
            class="font-b612-mono-regular bg-[#e94560] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-85 transition duration-200">
            Take Photo
          </button>
        {/if}
        <button
          onclick={clearPhotos}
          class="font-b612-mono-regular bg-[#333745] text-white font-semibold px-6 py-2 rounded-lg border border-[#e94560] hover:opacity-85 transition duration-200">
          Clear
        </button>
      </div>

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