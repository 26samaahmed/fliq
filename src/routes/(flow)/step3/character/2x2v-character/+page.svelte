<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import BaseFrame from '$lib/assets/Character-Frames/base-frames/2x2v-base-frame.svg';
  import AvatarChar from '$lib/assets/Character-Frames/2x2v-characters/2x2v-avatar.svg';
  import GhibliChar from '$lib/assets/Character-Frames/2x2v-characters/2x2v-ghibli.svg';
  import MiffyChar from '$lib/assets/Character-Frames/2x2v-characters/2x2v-miffy.svg';
  import MilkAndMochaChar from '$lib/assets/Character-Frames/2x2v-characters/2x2v-milkandmocha.svg';
  import RilakkumaChar from '$lib/assets/Character-Frames/2x2v-characters/2x2v-rilakkuma.svg';
  import SanrioChar from '$lib/assets/Character-Frames/2x2v-characters/2x2v-sanrio.svg';

  import { browser } from '$app/environment';

  const roomID = browser ? sessionStorage.getItem('roomID') : null;
  const userCount = browser ? sessionStorage.getItem('userCount') : null;
  const href = userCount === '2' && roomID ? `/step4/${roomID}` : '/step4';
  
  const characters = [
    { src: AvatarChar, alt: 'Avatar' },
    { src: MiffyChar, alt: 'Miffy' },
    { src: SanrioChar, alt: 'Sanrio' },
    { src: RilakkumaChar, alt: 'Rilakkuma' },
    { src: GhibliChar, alt: 'Ghibli' },
    { src: MilkAndMochaChar, alt: 'Milk and Mocha' },
  ];
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

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Select a Character Design
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 gap-10">

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
      {#each characters as character (character.alt)}
        <a {href} class="hover:scale-105 transition-transform duration-200">
          <div class="relative w-40 sm:w-56">
            <img src={BaseFrame} alt="Frame" class="w-full object-contain" />
            <img src={character.src} alt={character.alt} class="absolute inset-0 w-full h-full object-contain" />
          </div>
        </a>
      {/each}
    </div>
  </div>

  <div class="pb-10"></div>
  <Footer />
</main>
