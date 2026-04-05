<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
</script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="flex-1">
    <div class="text-center mt-8">
      <h1 class="font-aldrich text-2xl sm:text-3xl text-white">Preview Your Shots</h1>
      <p class="font-arimo text-base sm:text-xl text-[#D38A8A] mt-5 max-w-4xl mx-auto">
        Select photos to add to your strip!
      </p>
  </div>
  </div>
  <Footer />
</main>
