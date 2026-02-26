<script>
    import Header from '$lib/components/header/Header.svelte';
    import Footer from '$lib/components/footer/Footer.svelte';
    import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
    import Choice from '$lib/components/buttons/Choice.svelte';
</script>
  
  
<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />
  <div class="flex-1">
    <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center">Step 3: Pick Strip Style</h1>

    <ProgressBar />

    <!-- page content -->
    <div class="mt-16 flex justify-center gap-5">

    </div>
  </div>
  <Footer />
</main>