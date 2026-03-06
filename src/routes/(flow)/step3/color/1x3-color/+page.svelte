<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import YellowFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3yellow.svg';
  import GreenFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3green.png';
  import CyanFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3cyan.png';
  import PeriwinkleFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3periwinkle.png';
  import LavenderFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3lavender.png';
  import PinkFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3pink.svg';
  import WhiteFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3white.png';
  import BlackFrame from '$lib/assets/color-frames/1x3/1x3-frames/1x3black.png';


  const href = '/step4';
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
      <div class="w-16"></div>

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 3: Pick Strip Style
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col items-center justify-start pt-16 sm:pt-24 gap-10">
    <h1 class="font-aldrich text-lg sm:text-2xl text-white">
      Select a Color
    </h1>

    <div class="flex flex-nowrap justify-center gap-8">
      {#each frames as frame (frame.alt)}
        <a {href} class="hover:scale-105 transition-transform duration-200">
          <img src={frame.src} alt="{frame.alt} Frame" class="w-23 object-contain rounded" />
        </a>
      {/each}
    </div>
  </div>

  <div class="flex justify-center py-6">
    <BackButton />
  </div>

  <Footer />
</main>