<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';
  const TOTAL_PHOTOS = 8;
  const COUNTDOWN_SECS = 3;
  const PAUSE_MS = 800;

  let roomID = $derived(
    page.params.roomID ||
    (typeof window !== 'undefined' ? sessionStorage.getItem('roomID') : null)
  );

  let videoGrid = $state<HTMLDivElement | undefined>();
  let canvas = $state<HTMLCanvasElement | undefined>();
  let myVideo: HTMLVideoElement;
  let localStream: MediaStream | null = null;

  let isHost        = $state(false);
  let roomFull      = $state(false);
  let isTwoUsers    = $state(false);
  let guestJoined   = $state(false);
  let photoCount    = $state(0);
  let countdown     = $state<number | null>(null);
  let isCapturing   = $state(false);

  let socket: any;
  let myPeer: any;
  const peers: Record<string, any> = {};
  let remoteVideo: HTMLVideoElement | null = null;
  let countdownTimer: ReturnType<typeof setInterval> | null = null;

  onMount(async () => {
    const isCreator = !page.params.roomID;

    isTwoUsers = sessionStorage.getItem('userCount') === '2' || !!page.params.roomID;
    if (page.params.roomID) {
      sessionStorage.setItem('roomID', page.params.roomID);
      sessionStorage.setItem('userCount', '2');
    }
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

    myVideo = document.createElement('video');
    myVideo.muted = true;
    addVideoStream(myVideo, localStream);

    if (isTwoUsers) {
      const { io } = await import('socket.io-client');
      const { default: Peer } = await import('peerjs');

      socket = io(SERVER_URL);
      myPeer = new Peer({ config: { iceServers: [
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]}});

      myPeer.on('call', (call: any) => {
        call.answer(localStream);
        const video = document.createElement('video');
        let added = false;
        call.on('stream', (remoteStream: any) => {
          if (!added) { added = true; remoteVideo = video; addVideoStream(video, remoteStream); }
          else { video.srcObject = remoteStream; }
        });
        call.on('close', () => { remoteVideo = null; video.remove(); });
      });

      socket.on('user-connected', (userID: string) => {
        guestJoined = true;
        setTimeout(() => connectToNewUser(userID, localStream!), 1000);
      });

      socket.on('user-disconnected', (userID: string) => {
        guestJoined = false;
        remoteVideo = null;
        if (peers[userID]) { peers[userID].close(); delete peers[userID]; }
      });

      myPeer.on('open', (id: string) => {
        socket.emit('join-room', roomID, id, isCreator);
      });

      socket.on('is-host', () => { isHost = true; });
      socket.on('room-full', () => { roomFull = true; });

      socket.on('start-sequence', () => {
        sessionStorage.removeItem('capturedPhotos');
        photoCount = 0;
      });

      socket.on('countdown', (t: number) => {
        countdown = t;
        console.log('Guest countdown:', t)
        // Start a local interval so ticks are smooth between server events
        if (!isHost && t === COUNTDOWN_SECS) {
          if (countdownTimer) clearInterval(countdownTimer);
          let val = t;
          countdownTimer = setInterval(() => {
            val--;
            if (val > 0) { countdown = val; }
            else { clearInterval(countdownTimer!); countdownTimer = null; }
          }, 1000);
        }
      });

      socket.on('take-photo', () => {
        if (isHost) return;
        if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
        countdown = null;
        if (photoCount === 0) sessionStorage.removeItem('capturedPhotos');
        captureSinglePhoto();
        // Fallback: navigate after all photos taken without waiting for photos-done
        if (photoCount >= TOTAL_PHOTOS) {
          sessionStorage.setItem('isHost', '0');
          goto('/step5');
        }
      });

      socket.on('photos-done', () => {
        if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
        sessionStorage.setItem('isHost', '0');
        goto('/step5');
      });
    }
  });

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function captureSinglePhoto() {
    if (!canvas || !myVideo) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const existing: string[] = JSON.parse(sessionStorage.getItem('capturedPhotos') ?? '[]');

    const lw = myVideo.videoWidth || 640;
    const lh = myVideo.videoHeight || 480;
    canvas.width = lw;
    canvas.height = lh;
    ctx.drawImage(myVideo, 0, 0, lw, lh);
    existing.push(canvas.toDataURL('image/jpeg', 0.8));

    if (isTwoUsers) {
      const rw = remoteVideo?.videoWidth || 640;
      const rh = remoteVideo?.videoHeight || 480;
      canvas.width = rw;
      canvas.height = rh;
      ctx.clearRect(0, 0, rw, rh);
      if (remoteVideo) ctx.drawImage(remoteVideo, 0, 0, rw, rh);
      existing.push(canvas.toDataURL('image/jpeg', 0.8));
    }

    sessionStorage.setItem('capturedPhotos', JSON.stringify(existing));
    photoCount++;
  }

  async function startPhotoSequence() {
    if (isCapturing) return;
    isCapturing = true;
    sessionStorage.removeItem('capturedPhotos');
    photoCount = 0;

    if (isTwoUsers && isHost) {
      socket.emit('start-sequence');
      await sleep(600); // buffer so guest receives start-sequence before first countdown tick
    }

    for (let i = 0; i < TOTAL_PHOTOS; i++) {
      for (let t = COUNTDOWN_SECS; t >= 1; t--) {
        countdown = t;
        if (isTwoUsers && isHost) socket.emit('countdown', t);
        await sleep(1000);
      }
      if (isTwoUsers && isHost) socket.emit('take-photo');
      countdown = null;
      captureSinglePhoto();
      await sleep(PAUSE_MS);
    }

    isCapturing = false;
    if (isTwoUsers && isHost) {
      socket.emit('photos-done');
      await sleep(300); // let photos-done reach the guest before socket closes
    }
    sessionStorage.setItem('isHost', '1');
    goto('/step5');
  }

  function connectToNewUser(userID: string, stream: MediaStream) {
    if (peers[userID]) return;
    const call = myPeer.call(userID, stream);
    if (!call) return;
    const video = document.createElement('video');
    let added = false;
    call.on('stream', (remoteStream: any) => {
      if (!added) { added = true; remoteVideo = video; addVideoStream(video, remoteStream); }
      else { video.srcObject = remoteStream; }
    });
    call.on('close', () => { remoteVideo = null; video.remove(); });
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
    videoGrid?.appendChild(video);
  }

  onDestroy(() => {
    if (countdownTimer) clearInterval(countdownTimer);
    localStream?.getTracks().forEach(t => t.stop());
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
      <div class="relative isolate">
        <div
          bind:this={videoGrid}
          class="grid gap-3 mx-auto {isTwoUsers ? 'w-full max-w-2xl grid-cols-2' : 'grid-cols-1'}"
          style="grid-auto-rows: 300px; grid-template-columns: {isTwoUsers ? '' : '300px'};"
        ></div>

        {#if countdown !== null}
          <div class="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg pointer-events-none" style="will-change: transform;">
            <span class="text-white font-bold drop-shadow-lg" style="font-size: 8rem; line-height: 1;">
              {countdown}
            </span>
          </div>
        {/if}
      </div>

      <!-- Controls: Simplified logic -->
      <div class="flex flex-col items-center gap-2 mt-4">
        {#if !isTwoUsers || isHost}
          {#if isTwoUsers && !guestJoined}
            <p class="text-white/60 text-sm">Waiting for guest to join...</p>
          {/if}
          <button
            onclick={startPhotoSequence}
            disabled={isCapturing || (isTwoUsers && isHost && !guestJoined)}
            class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {isCapturing ? 'Capturing...' : 'Start'}
          </button>
        {:else}
          <!-- GUEST VIEW: Only show status text when NOT counting down -->
          {#if countdown === null}
            <p class="text-white/60 text-sm">
              {photoCount > 0 ? 'Smile! Taking the next one...' : 'Waiting for host to start...'}
            </p>
          {/if}
        {/if}
      </div>

      <canvas bind:this={canvas} class="hidden"></canvas>

    </div>
  {/if}

  <Footer />
</main>
