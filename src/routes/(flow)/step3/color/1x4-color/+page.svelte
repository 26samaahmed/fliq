<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import YellowFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x3yellow.png';
  import GreenFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4green.png';
  import CyanFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4cyan.png';
  import PeriwinkleFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4periwinkle.png';
  import LavenderFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4lavender.png';
  import PinkFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4pink.png';
  import WhiteFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4white.png';
  import BlackFrame from '$lib/assets/color-frames/1x4-frames/1x4/1x4black.png';

  import { browser } from '$app/environment';

  const roomID = browser ? sessionStorage.getItem('roomID') : null;
  const userCount = browser ? sessionStorage.getItem('userCount') : null;
  const href = userCount === '2' && roomID ? `/step4/${roomID}` : '/step4';
  
  const frames = [
    { src: YellowFrame, alt: 'Yellow' },
    { src: GreenFrame, alt: 'Green' },
    { src: CyanFrame, alt: 'Cyan' },
    { src: PeriwinkleFrame, alt: 'Periwinkle' },
    { src: LavenderFrame, alt: 'Lavender' },
    { src: PinkFrame, alt: 'Pink' },
    { src: WhiteFrame, alt: 'White' },
    { src: BlackFrame, alt: 'Black' },
  ];
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
      Select a Color
    </h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
      {#each frames as frame (frame.alt)}
        <a {href} class="hover:scale-105 transition-transform duration-200">
          <img src={frame.src} alt={`${frame.alt} Frame`} class="w-28 object-contain rounded" />
        </a>
      {/each}
    </div>
  </div>

  <Footer />
</main>
