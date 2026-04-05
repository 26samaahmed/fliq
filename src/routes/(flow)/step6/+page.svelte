<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

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
      Choose a background to style your photo strip.
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-center justify-center">
    <!-- Background selection UI here -->
  </div>

  <Footer />
</main>