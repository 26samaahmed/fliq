<script>
  import landing_frame from '$lib/assets/landing-page-frame.svg';
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
</script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="flex-1">
    <div class="text-center">
      <h1 class="font-aldrich text-2xl sm:text-4xl text-white">Welcome!</h1>
      <p class="font-arimo text-md sm:text-xl text-[#E8F1F2] mt-5 max-w-4xl mx-auto">
        <i>Create and customize photo memories with your friends in real time as fliq. brings the photo booth experience to you wherever you are.</i>
      </p>
      
      <a
        href="/step1"
        class="inline-block sm:text-md mt-10 bg-[#DCDFF5] text-[#333745] font-aldrich px-4 py-2 rounded-full hover:bg-[#949FF2] transition duration-500">
        Start Taking Pictures →
      </a>
    </div>

    <div class="mt-10">
      <img src={landing_frame} alt="Frame 1" class="mx-auto h-auto rounded-lg" />
    </div>
  </div>

  <Footer />
</main>