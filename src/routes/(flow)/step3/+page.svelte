<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  const frame = browser ? (sessionStorage.getItem('frame') ?? '1x3') : '1x3';

  const frame_styles = [
    { name: 'Design', color: '#D38A8A', page_ref: `/step3/design/${frame}-design` },
    { name: 'Color', color: '#89CDEF', page_ref: `/step3/color/${frame}-color` },
    { name: 'Character', color: '#ABCF93', page_ref: `/step3/character/${frame}-character` }
  ];

  let isTwoUsers = false;
  let roomLink = '';
  let copied = false;

  onMount(() => {
    isTwoUsers = sessionStorage.getItem('userCount') === '2';

    if (isTwoUsers) {
      const roomID = sessionStorage.getItem('roomID');
      roomLink = `${window.location.origin}/step4/${roomID}`;
    }
  });

  function copyLink() {
    navigator.clipboard.writeText(roomLink);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Step 3: Pick Strip Style
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />
   
    {#if isTwoUsers}
      <div class="flex flex-col items-center gap-3">
    
        <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Invite your partner to join
        </p>
    
        <button
          on:click={copyLink}
          class="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full transition duration-200"
        >
          {#if copied}
            ✓ Link copied!
          {:else}
            🧷 Copy Invite Link
          {/if}
        </button>
    
      </div>
    {/if}

  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-8 sm:pt-24">
    <div class="grid grid-cols-2 sm:flex sm:flex-row gap-6 sm:gap-10 justify-items-center">

      {#each frame_styles as frame}
        <a
          href={frame.page_ref}
          class="group flex flex-col items-center cursor-pointer"
        >
          <!-- Color preview box -->
          <div
          class="relative w-24 h-32 sm:w-56 sm:h-64 rounded-xl overflow-hidden
                 flex items-center justify-center 
                 transition-all duration-300 
                 group-hover:scale-105 
                 group-hover:-translate-y-1 
                 group-hover:shadow-xl
                 shadow-lg shadow-black/30 
                 border border-white/10"
          style="background-color: {frame.color};"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div class="absolute inset-0 rounded-xl ring-1 ring-white/10"></div>
        
          <p class="relative text-sm sm:text-2xl text-white text-center font-semibold">
            {frame.name}
          </p>
        </div>
        </a>
      {/each}

    </div>
  </div>

  <Footer />
</main>