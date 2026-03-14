<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import BaseFrame from '$lib/assets/Character-Frames/base-frames/2x2h-base-frame.svg';

  const href = '/step4';
  const designs = Array(6).fill(null).map((_, i) => ({ id: i }));
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 3: Pick Strip Style
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 gap-10">
    <h1 class="font-aldrich text-lg sm:text-2xl text-white">
      Select a Design
    </h1>

    <div class="grid grid-cols-3 gap-x-8 gap-y-8">
      {#each designs as design (design.id)}
        <a {href} class="hover:scale-105 transition-transform duration-200">
          <div class="relative w-80">
            <img src={BaseFrame} alt="Design Frame" class="w-full object-contain" />
          </div>
        </a>
      {/each}
    </div>
  </div>

  <div class="pb-10"></div>
  <Footer />
</main>
