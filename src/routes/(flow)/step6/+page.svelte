<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import BackgroundChatbot from '$lib/components/chatbot/BackgroundChatbot.svelte';
  import { goto } from '$app/navigation';

  // The photo strip image passed from step 5 (stored as base64 in sessionStorage)
  let currentImageBase64 = $state<string | null>(null);
  let currentMimeType = $state('image/png');

  $effect(() => {
    const stored = sessionStorage.getItem('photoStripBase64');
    const storedMime = sessionStorage.getItem('photoStripMimeType');
    if (stored) {
      currentImageBase64 = stored;
      currentMimeType = storedMime ?? 'image/png';
    }
  });

  function handleImageUpdate(imageBase64: string, mimeType: string) {
    currentImageBase64 = imageBase64;
    currentMimeType = mimeType;
    // Persist the latest edited version so step 7 can pick it up
    sessionStorage.setItem('photoStripBase64', imageBase64);
    sessionStorage.setItem('photoStripMimeType', mimeType);
  }

  function handleNext() {
    goto('/step7');
  }
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <!-- Top bar -->
  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 6: Customize Background
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center font-aldrich text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Use the AI assistant to customize the background of your photo strip.
    </p>
  </div>

  <div class="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-3 mt-8 min-h-0">

    <!-- Photo strip preview -->
    <div class="flex flex-col items-center gap-3 lg:w-[52%]">
      <div class="w-full max-w-sm flex-1 flex items-center justify-center">
        {#if currentImageBase64}
          <img
            src={`data:${currentMimeType};base64,${currentImageBase64}`}
            alt="Photo strip"
            class="max-h-[45vh]] w-auto object-contain rounded-xl border border-white/10 shadow-lg transition-all duration-500"
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
    <div class="lg:w-[48%] h-auto lg:-ml-2">
      <BackgroundChatbot
        currentImageBase64={currentImageBase64}
        currentMimeType={currentMimeType}
        onImageUpdate={handleImageUpdate}
      />
    </div>
  </div>

  <!-- Redesign later to match the back button (also think of user experience in terms of if the user doesn't interact with the chatbot and just wants to click next - maybe we can have a "skip chatbot and go to next step" button?) 
    <button
    onclick={handleNext}
    class="mt-2 bg-[#D38A8A] hover:bg-[#D38A8A]/80 text-white font-aldrich
          px-8 py-3 rounded-full transition-colors duration-200 text-sm sm:text-base"
  >
    Next Step →
  </button>
  -->

  <Footer />
</main>
