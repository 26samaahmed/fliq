<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  const SERVER_URL = 'https://fliq-app-dv6z.onrender.com/';
  const frameMap: Record<string, number> = { '1x3': 3, '1x4': 4, '2x2v': 4, '2x2h': 4 };

  // 2-user mode: array of {self, remote} pairs (one entry per shot)
  let shots = $state<{ self: string; remote: string }[]>([]);
  // 1-user mode: flat photo array
  let soloPhotos = $state<string[]>([]);

  let selectedIndices = $state<number[]>([]); // indices into shots[] or soloPhotos[]
  let required = $state(3);
  let canProceed = $derived(selectedIndices.length === required && required > 0);

  let isTwoUsers = $state(false);
  let isHostSession = $state(false);
  let socket: any;

  $effect(() => {
    isTwoUsers = sessionStorage.getItem('userCount') === '2';
    isHostSession = sessionStorage.getItem('isHost') === '1';
    const photos: string[] = JSON.parse(sessionStorage.getItem('capturedPhotos') ?? '[]');
    const frame = sessionStorage.getItem('frame') ?? '1x3';
    required = frameMap[frame] ?? 3;

    if (isTwoUsers) {
      // capturedPhotos is interleaved [self0, remote0, self1, remote1, ...]
      const pairs: { self: string; remote: string }[] = [];
      for (let i = 0; i + 1 < photos.length; i += 2) {
        pairs.push({ self: photos[i], remote: photos[i + 1] });
      }
      shots = pairs;
    } else {
      soloPhotos = photos;
    }
  });

  onMount(async () => {
    const roomID = sessionStorage.getItem('roomID');
    if (!roomID || sessionStorage.getItem('userCount') !== '2') return;

    const { io } = await import('socket.io-client');
    socket = io(SERVER_URL);
    socket.on('connect', () => {
      socket.emit('join-selection-room', roomID);
    });

    if (sessionStorage.getItem('isHost') === '1') {
      // Guest joined before us — they'll ask for state via request-state
      socket.on('peer-joined-selection', () => {
        socket.emit('selection-update', roomID, [...selectedIndices], required);
      });
      // Guest joined first, we joined after — they noticed and asked for state
      socket.on('request-state', () => {
        socket.emit('selection-update', roomID, [...selectedIndices], required);
      });
    } else {
      // Host joined after us — ask for their current state
      socket.on('peer-joined-selection', () => {
        socket.emit('request-state', roomID);
      });
      socket.on('photos-selected', (indices: number[]) => {
        sessionStorage.setItem('selectedIndices', JSON.stringify(indices));
        goto('/step6');
      });
      socket.on('selection-update', (indices: number[], reqCount: number) => {
        selectedIndices = indices;
        if (reqCount !== undefined) required = reqCount;
      });
    }
  });

  $effect(() => {
    if (isTwoUsers && isHostSession && socket) {
      const roomID = sessionStorage.getItem('roomID');
      const indices = [...selectedIndices];
      const req = required;
      if (roomID) {
        const timer = setTimeout(() => {
          socket.emit('selection-update', roomID, indices, req);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  });

  onDestroy(() => socket?.disconnect());

  function isSelected(i: number) {
    return selectedIndices.includes(i);
  }

  function toggleSelect(i: number) {
    if (isSelected(i)) {
      selectedIndices = selectedIndices.filter(n => n !== i);
    } else if (selectedIndices.length < required) {
      selectedIndices = [...selectedIndices, i];
    }
  }

  function handleNext() {
    const sorted = [...selectedIndices].sort((a, b) => a - b);
    // Convert display indices to actual capturedPhotos indices:
    // in 2-user mode shot index N → capturedPhotos index N*2 (self-photo)
    const photoIndices = sorted.map(i => isTwoUsers ? i * 2 : i);
    sessionStorage.setItem('selectedIndices', JSON.stringify(photoIndices));
    if (isTwoUsers && socket) {
      socket.emit('broadcast-selection', sessionStorage.getItem('roomID'), photoIndices);
    }
    goto('/step6');
  }
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
      {#if isTwoUsers && !isHostSession}
        Host is selecting <span class="text-white font-bold">{required}</span> shots —
        <span class="text-white/60 text-sm">({selectedIndices.length} / {required} chosen)</span>
      {:else}
        Select <span class="text-white font-bold">{required}</span> shots for your strip.
        <span class="text-white/60 text-sm ml-1">({selectedIndices.length} / {required} selected)</span>
      {/if}
    </p>
  </div>

  <div class="flex-1 flex flex-col items-center gap-6 mt-8">

    {#if isTwoUsers}
      <!-- 2-user mode: each option is a side-by-side pair -->
      {#if shots.length === 0}
        <p class="text-white/50 mt-12">No photos found. Go back to step 4 and take your photos first.</p>
      {:else}
        <div class="grid gap-4 w-full max-w-3xl justify-center"
          style="grid-template-columns: repeat(auto-fill, 240px);">
          {#each shots as shot, i}
            {#if isHostSession}
              <button
                onclick={() => toggleSelect(i)}
                class="relative rounded-lg overflow-hidden border-4 transition-all duration-150 focus:outline-none
                  {isSelected(i) ? 'border-[#9AFFB0] scale-105' : 'border-transparent hover:border-white/30'}"
                style="width: 240px; height: 130px;"
              >
                <div class="flex h-full">
                  <img src={shot.self} alt="You" class="w-1/2 h-full object-cover" />
                  <img src={shot.remote} alt="Guest" class="w-1/2 h-full object-cover border-l-2 border-white/20" />
                </div>
                {#if isSelected(i)}
                  <div class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9AFFB0] flex items-center justify-center">
                    <span class="text-[#333745] text-xs font-bold">
                      {[...selectedIndices].sort((a, b) => a - b).indexOf(i) + 1}
                    </span>
                  </div>
                {/if}
              </button>
            {:else}
              <div
                class="relative rounded-lg overflow-hidden border-4 transition-all duration-150
                  {isSelected(i) ? 'border-[#9AFFB0] scale-105' : 'border-transparent'}"
                style="width: 240px; height: 130px;"
              >
                <div class="flex h-full">
                  <img src={shot.self} alt="You" class="w-1/2 h-full object-cover" />
                  <img src={shot.remote} alt="Host" class="w-1/2 h-full object-cover border-l-2 border-white/20" />
                </div>
                {#if isSelected(i)}
                  <div class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9AFFB0] flex items-center justify-center">
                    <span class="text-[#333745] text-xs font-bold">
                      {[...selectedIndices].sort((a, b) => a - b).indexOf(i) + 1}
                    </span>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>

        {#if isHostSession}
          <button
            onclick={handleNext}
            disabled={!canProceed}
            class="mt-4 bg-[#D38A8A] hover:bg-[#C07070] text-white px-10 py-3 rounded-lg border-2 border-white
                   transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        {/if}
      {/if}

    {:else}
      <!-- 1-user mode: flat photo grid -->
      {#if soloPhotos.length === 0}
        <p class="text-white/50 mt-12">No photos found. Go back to step 4 and take your photos first.</p>
      {:else}
        <div class="grid gap-4 w-full max-w-3xl justify-center"
          style="grid-template-columns: repeat(auto-fill, 160px);">
          {#each soloPhotos as photo, i}
            <button
              onclick={() => toggleSelect(i)}
              class="relative rounded-lg overflow-hidden border-4 transition-all duration-150 focus:outline-none
                {isSelected(i) ? 'border-[#9AFFB0] scale-105' : 'border-transparent hover:border-white/30'}"
              style="width: 160px; height: 160px;"
            >
              <img src={photo} alt="Photo {i + 1}" class="w-full h-full object-cover" />
              {#if isSelected(i)}
                <div class="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9AFFB0] flex items-center justify-center">
                  <span class="text-[#333745] text-xs font-bold">
                    {[...selectedIndices].sort((a, b) => a - b).indexOf(i) + 1}
                  </span>
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <button
          onclick={handleNext}
          disabled={!canProceed}
          class="mt-4 bg-[#D38A8A] hover:bg-[#C07070] text-white px-10 py-3 rounded-lg border-2 border-white
                 transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
          Next →
        </button>
      {/if}
    {/if}

  </div>

  <Footer />
</main>
