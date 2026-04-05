<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
</script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="flex-1">
    <div class="text-center mt-8">
      <h1 class="font-aldrich text-2xl sm:text-3xl text-white">Here's your final strip!</h1>
      <p class="font-arimo text-base sm:text-xl text-[#D38A8A] mt-5 max-w-4xl mx-auto">
        You can export it or share it with your friends! We hope you had fun creating memories with fliq.!
      </p>

      <button class="mt-6 px-6 py-3 bg-[#D38A8A] text-white font-bold rounded-lg hover:bg-[#c77b7b] transition">
        Add to Album
      </button>
  </div>
  </div>
  <Footer />
</main>
