<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  $: roomID = $page.params.roomID || sessionStorage.getItem('roomID');

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';
  const TOTAL_PHOTOS = 8;
  const DELAY_MS = 800;

  let videoGrid: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  //let photosDiv: HTMLDivElement;
  let isHost = false;
  let roomFull = false;
  let isTwoUsers = false;
  let isCapturing = false;
  let photosTaken = 0;

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
      socket.on('take-photo', () => startCapture());
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

    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.borderRadius = '8px';

    video.addEventListener('loadedmetadata', () => video.play());

    stream.getTracks().forEach(track => {
      track.addEventListener('ended', () => video.remove());
    });

    videoGrid.appendChild(video);
  }

  function captureFrame(): string[] {
    const videos = videoGrid.querySelectorAll('video');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    const frames: string[] = [];
    videos.forEach(video => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      frames.push(canvas.toDataURL('image/png'));
    });
    return frames;
  }

  async function startCapture() {
    if (isCapturing) return;
    isCapturing = true;
    photosTaken = 0;
    const allPhotos: string[] = [];

    for (let i = 0; i < TOTAL_PHOTOS; i++) {
      allPhotos.push(...captureFrame());
      photosTaken = i + 1;
      if (i < TOTAL_PHOTOS - 1) await new Promise(r => setTimeout(r, 800));
    }

    sessionStorage.setItem('capturedPhotos', JSON.stringify(allPhotos));
    goto('/step5');
  }

  function handleTakePhoto() {
    if (isTwoUsers) {
      socket.emit('take-photo');
      startCapture();
    } else {
      startCapture();
    }
  }

  // function clearPhotos() {
  //   photosDiv.innerHTML = '';
  // }

  onDestroy(() => {
    socket?.disconnect();
    myPeer?.destroy();
  });
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Step 4: Take Your Photos
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <!-- 👇 Description under progress bar -->
    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      {#if isCapturing}
        Taking photo {photosTaken} of {TOTAL_PHOTOS}...
      {:else}
        Get ready! We'll take {TOTAL_PHOTOS} photos. Hit the button when you're ready.
      {/if}
    </p>
  </div>

  <!-- Main content -->
  {#if roomFull}
    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <p class="text-white text-lg">This room is full.</p>
      <a href="/" class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-4 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300">
        ← Go Home
      </a>
    </div>
  {:else}
    <div class="flex-1 flex flex-col items-center gap-6 mt-8">

      <!-- Video grid -->
      <div
        bind:this={videoGrid}
        class="grid gap-3 mx-auto {isTwoUsers ? 'w-full max-w-2xl grid-cols-2' : 'grid-cols-1'}"
        style="grid-auto-rows: 300px; grid-template-columns: {isTwoUsers ? '' : '300px'};"
      ></div>

      <!-- Controls -->
      {#if isCapturing}
        <div class="flex gap-2">
          {#each Array(TOTAL_PHOTOS) as _, i}
            <div class="w-3 h-3 rounded-full border-2 border-white transition-all duration-300
              {i < photosTaken ? 'bg-[#D38A8A]' : 'bg-transparent'}">
            </div>
          {/each}
        </div>
      {/if}

      {#if !isCapturing && (!isTwoUsers || isHost)}
        <button
          onclick={handleTakePhoto}
          class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300">
          Take Photos
        </button>
      {/if}

      {#if !isCapturing && isTwoUsers && !isHost}
        <p class="text-white/60 text-sm">Waiting for host to start...</p>
      {/if}

      <canvas bind:this={canvas} class="hidden"></canvas>

      <!-- Captured photos -->
      <!-- <div
        bind:this={photosDiv}
        class="grid gap-3 justify-center w-full max-w-3xl"
        style="grid-template-columns: repeat(auto-fill, 200px); grid-auto-rows: 200px;"
      ></div> -->

    </div>
  {/if}

  <Footer />
</main>