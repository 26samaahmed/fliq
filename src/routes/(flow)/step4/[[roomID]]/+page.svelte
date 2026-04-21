<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import { page } from '$app/stores';

  $: roomID = $page.params.roomID || (typeof window !== 'undefined' ? sessionStorage.getItem('roomID') : null);

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';
  const TOTAL_PHOTOS = 8;

  let videoGrid: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let photosDiv: HTMLDivElement;
  let isHost = false;
  let roomFull = false;
  let isTwoUsers = false;
  let photoCount = 0;
  let countdown: number | null = null;
  let isCapturing = false;

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

      // Non-host captures when host triggers each shot
      socket.on('take-photo', () => {
        if (!isHost) captureSinglePhoto();
      });
    }
  });

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function captureSinglePhoto() {
    const videos = videoGrid.querySelectorAll('video');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const existing: string[] = JSON.parse(sessionStorage.getItem('capturedPhotos') ?? '[]');
    videos.forEach(video => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      existing.push(dataUrl);
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      photosDiv.appendChild(img);
    });
    sessionStorage.setItem('capturedPhotos', JSON.stringify(existing));
    photoCount++;
  }

  async function startPhotoSequence() {
    if (isCapturing) return;
    isCapturing = true;
    sessionStorage.removeItem('capturedPhotos');
    photoCount = 0;
    photosDiv.innerHTML = '';

    for (let i = 0; i < TOTAL_PHOTOS; i++) {
      for (let t = 3; t >= 1; t--) {
        countdown = t;
        await sleep(1000);
      }
      countdown = null;
      captureSinglePhoto();
      if (isTwoUsers && isHost) {
        socket.emit('take-photo');
      }
      await sleep(800);
    }

    isCapturing = false;
    goto('/step5');
  }

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

  function clearPhotos() {
    photosDiv.innerHTML = '';
    photoCount = 0;
    sessionStorage.removeItem('capturedPhotos');
  }

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

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Get ready! We'll take {TOTAL_PHOTOS} photos. Hit Start when you're ready.
    </p>
  </div>

  {#if roomFull}
    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <p class="text-white text-lg">This room is full.</p>
      <a href="/" class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-4 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300">
        ← Go Home
      </a>
    </div>
  {:else}
    <div class="flex-1 flex flex-col items-center gap-6 mt-8">

      <!-- Photo count -->
      <p class="text-white/80 text-base">
        Photos taken: <span class="text-white font-bold">{photoCount} / {TOTAL_PHOTOS}</span>
      </p>

      <!-- Video grid with countdown overlay -->
      <div class="relative">
        <div
          bind:this={videoGrid}
          class="grid gap-3 mx-auto {isTwoUsers ? 'w-full max-w-2xl grid-cols-2' : 'grid-cols-1'}"
          style="grid-auto-rows: 300px; grid-template-columns: {isTwoUsers ? '' : '300px'};"
        ></div>

        {#if countdown !== null}
          <div class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg pointer-events-none">
            <span class="text-white font-bold" style="font-size: 8rem; line-height: 1;">{countdown}</span>
          </div>
        {/if}
      </div>

      <!-- Controls -->
      <div class="flex gap-3">
        {#if !isTwoUsers || isHost}
          <button
            onclick={startPhotoSequence}
            disabled={isCapturing}
            class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {isCapturing ? 'Capturing...' : 'Start'}
          </button>
        {/if}
        <button
          onclick={clearPhotos}
          disabled={isCapturing}
          class="bg-[#333745] text-white font-semibold px-6 py-2 rounded-lg border border-[#D38A8A] hover:opacity-85 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Clear
        </button>
      </div>

      <canvas bind:this={canvas} class="hidden"></canvas>

      <!-- Captured photos -->
      <div
        bind:this={photosDiv}
        class="grid gap-3 justify-center w-full max-w-3xl"
        style="grid-template-columns: repeat(auto-fill, 150px); grid-auto-rows: 150px;"
      ></div>

    </div>
  {/if}

  <Footer />
</main>
