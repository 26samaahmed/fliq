<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  let showDropdown = false;

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function download(format: string) {
    showDropdown = false;
    console.log(`Download as ${format}`);
    // TODO: Plug actual export logic here later
  }
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Here's your final strip!
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      You can export it or share it with your friends. We hope you had fun creating memories with fliq!
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col items-center justify-center">

    <div class="relative mt-8">
      <!-- Main button -->
      <button
      on:click={toggleDropdown}
      class="bg-[#D38A8A] text-white font-aldrich px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300 flex items-center gap-2"
    >
      Save as
    
      <svg
        class="w-4 h-4 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''}"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
      <!-- Dropdown -->
      {#if showDropdown}
        <div
          class="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-[#2A2D3A] border border-white/10 rounded-lg shadow-lg overflow-hidden z-10"
        >
          <button
            on:click={() => download('png')}
            class="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition"
          >
            PNG
          </button>
    
          <button
            on:click={() => download('jpg')}
            class="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition"
          >
            JPG
          </button>
    
          <button
            on:click={() => download('pdf')}
            class="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition"
          >
            PDF
          </button>
    
          <!-- Not sure if doable yet
          <button
            on:click={() => download('gif')}
            class="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition"
          >
            GIF
          </button>
          -->
        </div>
      {/if}
    </div>
  </div>

  <Footer />
</main>