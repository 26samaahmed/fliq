<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';
  const frameFormat = browser ? (sessionStorage.getItem('frame') ?? '1x3') : '1x3';
  const [cols, rows] = frameFormat.split('x').map(Number);
  const MAX_PICKS = cols * rows;

  $: roomID = $page.params.roomID || sessionStorage.getItem('roomID');

  let isTwoUsers = false;
  let isHost = false;
  let socket: any;
  let photos: string[] = [];
  let selected = new Set<number>();
  let submitted = false;
  let buildingStrip = false;
  let guestPhotos: string[] = [];
  let hostReadyToNavigate = false;
  let guestReadyToNavigate = false;
  let hostDone = false;

  onMount(async () => {
    const raw = sessionStorage.getItem('capturedPhotos');
    photos = raw ? JSON.parse(raw) : [];
    isTwoUsers = sessionStorage.getItem('userCount') === '2' || !!$page.params.roomID;

    if (isTwoUsers) {
      const { io } = await import('socket.io-client');
      socket = io(SERVER_URL);
      socket.on('is-host', () => { isHost = true; });
      socket.on('connect', () => {
        socket.emit('join-room', roomID, 'step5-' + socket.id);
      });
      socket.on('guest-photo-picks', (picks: string[]) => {
        guestPhotos = picks;
        if (hostReadyToNavigate) goto('/step6');
      });
      socket.on('host-done-picking', () => {
        hostDone = true;
        if (guestReadyToNavigate) goto('/step6');
      });
    }
  });

  function toggle(i: number) {
    if (submitted) return;
    if (selected.has(i)) {
      selected.delete(i);
    } else {
      if (selected.size >= MAX_PICKS) return;
      selected.add(i);
    }
    selected = new Set(selected);
  }

  async function buildStrip(picks: string[]): Promise<string> {
    const PHOTO_W = 400, PHOTO_H = 300, PADDING = 12;
    const canvas = document.createElement('canvas');
    canvas.width = PHOTO_W + PADDING * 2;
    canvas.height = (PHOTO_H + PADDING) * picks.length + PADDING;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#333745';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < picks.length; i++) {
      await new Promise<void>(resolve => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, PADDING, PADDING + i * (PHOTO_H + PADDING), PHOTO_W, PHOTO_H);
          resolve();
        };
        img.src = picks[i];
      });
    }
    return canvas.toDataURL('image/png').split(',')[1];
  }

  async function submit() {
    if (selected.size === 0) return;
    const picks = [...selected].map(i => photos[i]);
    submitted = true;
    buildingStrip = true;
    sessionStorage.setItem('myPhotoPicks', JSON.stringify(picks));
    const stripBase64 = await buildStrip(picks);
    sessionStorage.setItem('photoStripBase64', stripBase64);
    sessionStorage.setItem('photoStripMimeType', 'image/png');

    if (isTwoUsers && !isHost) {
      socket.emit('guest-photo-picks', picks);
      buildingStrip = false;
      guestReadyToNavigate = true;
      if (hostDone) goto('/step6'); // host already done before guest finished
    } else if (!isTwoUsers) {
      // Solo user goes straight to step 6
      buildingStrip = false;
      goto('/step6');
    } else {
      buildingStrip = false;
      hostReadyToNavigate = true;
      socket.emit('host-done-picking'); // tell guest host is done
      if (guestPhotos.length > 0) goto('/step6');
    }
  }

  onDestroy(() => socket?.disconnect());
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Step 5: Preview Your Shots
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Select the photos you want to include in your strip.
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-center justify-center">
    <!-- Preview UI here -->
     {#if photos.length === 0}
        <p class="text-white/60 text-sm">No photos found. Go back to step 4.</p>
      {:else}
        <div class="flex flex-col items-center gap-6 w-full">

          <p class="text-white/80 text-base">
            {#if buildingStrip}
              Building your strip...
            {:else if submitted}
              ✓ Locked in!{#if isTwoUsers && (!isHost ? !hostDone : !hostReadyToNavigate)} Waiting for other player...{/if}
            {:else}
              Pick up to {MAX_PICKS} photos. {selected.size}/{MAX_PICKS} selected.
            {/if}
          </p>

          <div class="grid gap-3 w-full max-w-3xl"
            style="grid-template-columns: repeat(auto-fill, 180px); grid-auto-rows: 180px; justify-content: center;">
            {#each photos as src, i}
              <button
                onclick={() => toggle(i)}
                disabled={submitted}
                class="relative rounded-lg overflow-hidden border-4 transition-all duration-200
                  {selected.has(i) ? 'border-[#D38A8A] scale-105 shadow-lg shadow-[#D38A8A]/40' : 'border-transparent opacity-70 hover:opacity-100'}
                  {submitted ? 'cursor-default' : 'cursor-pointer'}">
                <img {src} alt="Photo {i + 1}" class="w-full h-full object-cover" />
                {#if selected.has(i)}
                  <div class="absolute top-1 right-1 bg-[#D38A8A] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {[...selected].indexOf(i) + 1}
                  </div>
                {/if}
              </button>
            {/each}
          </div>

          {#if !submitted}
            <button
              onclick={submit}
              disabled={selected.size === 0}
              class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
              Lock In My Picks ({selected.size}/{MAX_PICKS})
            </button>
          {/if}

          {#if isHost && guestPhotos.length > 0}
            <div class="w-full max-w-3xl mt-4">
              <h2 class="text-white text-lg mb-3 text-center">Guest's Picks</h2>
              <div class="grid gap-3"
                style="grid-template-columns: repeat(auto-fill, 180px); grid-auto-rows: 180px; justify-content: center;">
                {#each guestPhotos as src, i}
                  <div class="rounded-lg overflow-hidden border-2 border-[#D38A8A]/60">
                    <img {src} alt="Guest photo {i + 1}" class="w-full h-full object-cover" />
                  </div>
                {/each}
              </div>
            </div>
          {/if}

        </div>
      {/if}
  </div>

  <Footer />
</main>