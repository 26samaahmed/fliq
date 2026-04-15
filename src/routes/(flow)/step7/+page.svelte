<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
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
    <!-- Final preview here -->

    <button class="mt-8 px-6 py-3 bg-[#D38A8A] text-white font-bold rounded-lg hover:bg-[#c77b7b] transition">
      Add to Album
    </button>
  </div>

  <Footer />
</main>