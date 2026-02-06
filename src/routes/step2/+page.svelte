<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import BackorNext from '$lib/components/buttons/BackorNext.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
</script>


<main class="bg-[#333745] min-h-screen p-6">
  <Header />
  <h1 class="font-aldrich text-4xl text-white text-center">Step 2: Choose the Layout</h1>

  <ProgressBar />

  <!-- page content -->
  <div class="mt-16 flex justify-center gap-24">
  </div>

  <div class="flex justify-center mt-10 gap-6">
    <BackorNext href="/step1" name="Back" />
    <BackorNext href="/step3" name="Next" />
  </div>
  <Footer />
</main>