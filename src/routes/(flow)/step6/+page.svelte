<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import BackgroundChatbot from '$lib/components/chatbot/BackgroundChatbot.svelte';
  import { goto } from '$app/navigation';
  import { compositeStrip } from '$lib/utils/compositor';

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';

  let selectedPhotoDataUrls = $state<string[]>([]);
  let currentImageBase64 = $state<string | null>(null);
  let currentMimeType = $state('image/png');
  let compositing = $state(false);
  let isHostSession = $state(false);
  let isTwoUsers = $state(false);
  let selfImageBase64 = $state<string | null>(null);
  let remoteImageBase64 = $state<string | null>(null);
  let externalMessages = $state<any[]>([]);
  let socket: any;

  $effect(() => {
    isHostSession = sessionStorage.getItem('isHost') === '1';
    isTwoUsers = sessionStorage.getItem('userCount') === '2';

    if (isTwoUsers) {
      const pairs: { self: string; remote: string }[] = JSON.parse(sessionStorage.getItem('selectedPairs') ?? '[]');
      if (pairs.length === 0) return;
      selfImageBase64 = pairs[0].self.split(',')[1] ?? null;
      remoteImageBase64 = pairs[0].remote.split(',')[1] ?? null;
    }

    const photos: string[] = JSON.parse(sessionStorage.getItem('selectedPhotos') ?? '[]');
    if (photos.length === 0) return;

    selectedPhotoDataUrls = photos;
    recomposite(photos);
  });

  async function recomposite(photoDataUrls: string[]) {
    const layout = sessionStorage.getItem('frame') ?? '1x3';
    const frameBase = sessionStorage.getItem('frameBase') ?? '';
    const frameOverlay = sessionStorage.getItem('frameOverlay') ?? '';

    compositing = true;
    try {
      const dataUrl = await compositeStrip(layout, photoDataUrls, frameBase, frameOverlay);
      const [meta, base64] = dataUrl.split(',');
      currentImageBase64 = base64;
      currentMimeType = meta.match(/:(.*?);/)?.[1] ?? 'image/png';
      sessionStorage.setItem('photoStripBase64', base64);
      sessionStorage.setItem('photoStripMimeType', currentMimeType);
    } catch (err) {
      console.error('Compositing failed:', err);
    } finally {
      compositing = false;
    }
  }

  function handlePhotosUpdate(editedPhotos: string[]) {
    selectedPhotoDataUrls = editedPhotos;
    recomposite(editedPhotos);
  }

  onMount(async () => {
    const roomID = sessionStorage.getItem('roomID');
    if (!roomID || sessionStorage.getItem('userCount') !== '2') return;

    const { io } = await import('socket.io-client');
    socket = io(SERVER_URL);
    socket.on('connect', () => {
      socket.emit('join-background-room', roomID);
    });

    if (sessionStorage.getItem('isHost') !== '1') {
      socket.on('background-chat', (msg: any) => {
        externalMessages = [...externalMessages, msg];
        if (msg?.imageBase64) {
          currentImageBase64 = msg.imageBase64;
          currentMimeType = msg.mimeType ?? 'image/png';
        }
      });
    }
  });

  onDestroy(() => socket?.disconnect());

  function handleImageUpdate(imageBase64: string, mimeType: string) {
    currentImageBase64 = imageBase64;
    currentMimeType = mimeType;
    sessionStorage.setItem('photoStripBase64', imageBase64);
    sessionStorage.setItem('photoStripMimeType', mimeType);
  }

  function handleNewMessage(msg: any) {
    if (!socket || sessionStorage.getItem('isHost') !== '1') return;
    const roomID = sessionStorage.getItem('roomID');
    if (roomID) socket.emit('background-chat', roomID, msg);
  }

  function handleNext() {
    goto('/step7');
  }

</script>

<main class="bg-[#333745] h-screen flex flex-col p-6 overflow-hidden font-aldrich">
  <Header />

  <!-- Top bar -->
  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Step 6: Customize Background
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Use the AI assistant to customize the background of your photo strip.
    </p>
  </div>

  <div class="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-3 mt-8 min-h-0">

    <!-- Photo strip preview -->
    <div class="flex flex-col items-center gap-3 lg:w-[52%]">
      <div class="w-full max-w-sm flex-1 flex items-center justify-center">
        {#if compositing}
          <div class="flex flex-col items-center gap-3 text-white/60">
            <div class="w-10 h-10 border-4 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
            <p class="text-sm">Building your strip...</p>
          </div>
        {:else if currentImageBase64}
          <img
            src={`data:${currentMimeType};base64,${currentImageBase64}`}
            alt="Photo strip"
            class="max-h-[45vh] w-auto object-contain rounded-xl border border-white/10 shadow-lg transition-all duration-500"
          />
        {:else}
          <div class="w-52 flex flex-col items-center gap-3 border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
            <div class="grid grid-cols-1 gap-2 w-full">
              {#each [1, 2, 3] as _}
                <div class="w-full h-20 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <span class="text-white/20 text-2xl">⬜</span>
                </div>
              {/each}
            </div>
            <p class="font-b612 text-white/40 text-xs mt-2">
              Your photo strip will appear here after the photo capture steps.
            </p>
          </div>
        {/if}
      </div>
  
    </div>
  
    <!-- Chatbot side panel -->
    <div class="lg:w-[48%] h-[60vh] lg:h-full lg:-ml-2">
      <BackgroundChatbot
        currentImageBase64={currentImageBase64}
        currentMimeType={currentMimeType}
        onImageUpdate={handleImageUpdate}
        photos={selectedPhotoDataUrls}
        onPhotosUpdate={handlePhotosUpdate}
        disabled={isTwoUsers && !isHostSession}
        twoUsers={isTwoUsers}
        selfImageBase64={selfImageBase64}
        remoteImageBase64={remoteImageBase64}
        onNewMessage={handleNewMessage}
        externalMessages={externalMessages}
      />
    </div>
  </div>

  <div class="flex justify-end mt-4">
    <button
      onclick={handleNext}
      disabled={compositing || !currentImageBase64}
      class="bg-[#D38A8A] hover:bg-[#D38A8A]/80 text-white px-8 py-3 rounded-lg border-2 border-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
      Next →
    </button>
  </div>

  <Footer />
</main>
