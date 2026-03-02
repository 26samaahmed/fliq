<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 3: Pick Strip Style
      </h1>

      <div class="w-16"></div> <!-- spacing to balance back button -->
    </div>

    <ProgressBar />
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-16">
    <div class="text-center">
      <h1 class="font-aldrich text-lg sm:text-2xl text-white">
        Select a Color
      </h1>
    </div>
  </div>

  <Footer />
</main>