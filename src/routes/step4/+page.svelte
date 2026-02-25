<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
</script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />
  <div class="flex-1">
    <h1 class="font-aldrich text-2xl text-white text-center">Step 4: Choose Your Side</h1>

    <ProgressBar />

    <!-- page content -->
    <div class="mt-16 flex justify-center gap-24">
    </div>
  </div>

  <Footer />
</main>