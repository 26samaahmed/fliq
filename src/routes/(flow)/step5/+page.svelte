<script lang="ts">
  import { goto } from '$app/navigation';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  const frameMap: Record<string, number> = { '1x3': 3, '1x4': 4, '2x2v': 4, '2x2h': 4 };

  let photos = $state<string[]>([]);
  let selectedIndices = $state<number[]>([]);
  let required = $state(3);
  let canProceed = $derived(selectedIndices.length === required && required > 0);

  $effect(() => {
    photos = JSON.parse(sessionStorage.getItem('capturedPhotos') ?? '[]');
    const frame = sessionStorage.getItem('frame') ?? '1x3';
    required = frameMap[frame] ?? 3;
  });

  function isSelected(index: number) {
    return selectedIndices.includes(index);
  }

  function toggleSelect(index: number) {
    if (isSelected(index)) {
      selectedIndices = selectedIndices.filter(i => i !== index);
    } else if (selectedIndices.length < required) {
      selectedIndices = [...selectedIndices, index];
    }
  }

  function handleNext() {
    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    // Store indices only — step 6 reads the actual photos from capturedPhotos by index
    sessionStorage.setItem('selectedIndices', JSON.stringify(sortedIndices));
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
      Select <span class="text-white font-bold">{required}</span> photos for your strip.
      <span class="text-white/60 text-sm ml-1">({selectedIndices.length} / {required} selected)</span>
    </p>
  </div>

  <!-- Photo grid -->
  <div class="flex-1 flex flex-col items-center gap-6 mt-8">

    {#if photos.length === 0}
      <p class="text-white/50 mt-12">No photos found. Go back to step 4 and take your photos first.</p>
    {:else}
      <div class="grid gap-4 w-full max-w-3xl justify-center"
        style="grid-template-columns: repeat(auto-fill, 160px);">
        {#each photos as photo, i}
          <button
            onclick={() => toggleSelect(i)}
            class="relative rounded-lg overflow-hidden border-4 transition-all duration-150 focus:outline-none
              {isSelected(i)
                ? 'border-[#9AFFB0] scale-105'
                : 'border-transparent hover:border-white/30'}"
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

  </div>

  <Footer />
</main>
