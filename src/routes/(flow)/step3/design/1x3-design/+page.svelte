<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import Base1 from '$lib/assets/Design-Frames/1x3-design-base/1x3-design-base1.svg';
  import Base2 from '$lib/assets/Design-Frames/1x3-design-base/1x3-design-base2.svg';
  import Base3 from '$lib/assets/Design-Frames/1x3-design-base/1x3-design-base3.svg';
  import Base4 from '$lib/assets/Design-Frames/1x3-design-base/1x3-design-base4.svg';
  import Base5 from '$lib/assets/Design-Frames/1x3-design-base/1x3-design-base5.svg';
  import Base6 from '$lib/assets/Design-Frames/1x3-design-base/1x3-design-base6.svg';
  import Overlay1 from '$lib/assets/Design-Frames/1x3-design-overlay/1x3-design-overlay1.svg';
  import Overlay2 from '$lib/assets/Design-Frames/1x3-design-overlay/1x3-design-overlay2.svg';
  import Overlay3 from '$lib/assets/Design-Frames/1x3-design-overlay/1x3-design-overlay3.svg';
  import Overlay4 from '$lib/assets/Design-Frames/1x3-design-overlay/1x3-design-overlay4.svg';
  import Overlay5 from '$lib/assets/Design-Frames/1x3-design-overlay/1x3-design-overlay5.svg';
  import Overlay6 from '$lib/assets/Design-Frames/1x3-design-overlay/1x3-design-overlay6.svg';

  import { browser } from '$app/environment';

  const roomID = browser ? sessionStorage.getItem('roomID') : null;
  const userCount = browser ? sessionStorage.getItem('userCount') : null;
  const href = userCount === '2' && roomID ? `/step4/${roomID}` : '/step4';
  
  const designs = [
    { base: Base1, overlay: Overlay1, id: 1 },
    { base: Base2, overlay: Overlay2, id: 2 },
    { base: Base3, overlay: Overlay3, id: 3 },
    { base: Base4, overlay: Overlay4, id: 4 },
    { base: Base5, overlay: Overlay5, id: 5 },
    { base: Base6, overlay: Overlay6, id: 6 },
  ];
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Pick Strip Style
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Select a Design
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 gap-10">

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
      {#each designs as design (design.id)}
        <a {href} class="hover:scale-105 transition-transform duration-200">
          <div class="relative w-28 sm:w-36">
            <img src={design.base} alt="Design Frame" class="w-full object-contain" />
            <img src={design.overlay} alt="Design Overlay" class="absolute inset-0 w-full h-full object-contain" />
          </div>
        </a>
      {/each}
    </div>
  </div>

  <div class="pb-10"></div>
  <Footer />
</main>
