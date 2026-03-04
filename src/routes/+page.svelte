<script>
  import landing_frame from '$lib/assets/landing-page-frame.svg';
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
</script>


<main class="bg-[#12192F] min-h-screen flex flex-col p-6">
  <Header />

  <div class="flex-1">
    <div class="text-center mt-8">
      <h1 class="font-aldrich text-2xl sm:text-4xl text-white">Welcome!</h1>
      <p class="font-b612-mono-regular text-base sm:text-lg text-[#E8F1F2] mt-5 max-w-4xl mx-auto">
        <i>Create and customize photo memories with your friends in real time as fliq. brings the photo booth experience to you wherever you are.</i>
      </p>
      
      <a
        href="/step1"
        class="font-b612-mono-regular inline-block text-sm sm:text-base m-5 sm:m-7 bg-[#DCDFF5] text-[#333745] font-aldrich px-4 py-2 rounded-full hover:bg-[#949FF2] transition duration-500">
        Start Taking Pictures →
      </a>
    </div>

    <img src={landing_frame} alt="Frame 1" class="m-auto h-fit" />
  </div>

  <Footer />
</main>