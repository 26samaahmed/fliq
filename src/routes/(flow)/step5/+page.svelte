<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
</script>

<main class="font-aldrich min-h-screen flex flex-col p-6 bg-gradient-to-b from-[#2E3140] to-[#3B3F52]">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Preview Your Shots
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Select the photos you want to include in your strip.
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-center justify-center">
    <!-- Preview UI here -->
  </div>

  <Footer />
</main>