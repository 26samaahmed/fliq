<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';

  let mounted = false;

  import { onMount } from 'svelte';

  onMount(() => {
    mounted = true;
  });
</script>

<main class="min-h-screen flex flex-col p-6 bg-gradient-to-b from-[#2E3140] to-[#3B3F52]">
  <Header />

  <!-- Main Content -->
  <div
    class="flex-1 flex flex-col justify-start md:justify-center items-center text-center gap-6 pt-28 md:pt-0 px-2"
  >
    <h1 class="font-aldrich text-4xl sm:text-5xl text-white">
      Welcome!
    </h1>

    <p
      class="font-aldrich tracking-tight text-base sm:text-lg text-[#E8F1F2] max-w-xs sm:max-w-3xl leading-relaxed"
    >
      Create and customize photo memories with your friends in real time as
      fliq. brings the photo booth experience to you wherever you are.
    </p>

    <a
      href="/step1"
      class="font-aldrich text-sm sm:text-base bg-[#D38A8A] text-white px-6 py-3 md:px-8 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
    >
      Start Taking Pictures →
    </a>

    <!-- Hidden on mobile -->
    <img
      src="/landing-page-frame.svg"
      alt="Frame preview"
      loading="eager"
      fetchpriority="high"
      class="hidden md:block w-full max-w-7xl {mounted ? 'animate-[float_8s_ease-in-out_infinite]' : ''}"
    />
  </div>

  <Footer />
</main>

<style>
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-12px);
    }
  }
</style>