<script>
  import landing_frame from '$lib/assets/landing-page-frame.svg';
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
</script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="flex-1">
    <div class="text-center mt-8">
      <h1 class="font-aldrich text-2xl sm:text-4xl text-white">Welcome!</h1>
      <p class="font-b612-mono-regular tracking-tight text-base sm:text-lg text-[#E8F1F2] mt-5 max-w-4xl mx-auto">
        <i>Create and customize photo memories with your friends in real time as fliq. brings the photo booth experience to you wherever you are.</i>
      </p>
      
      <a
        href="/step1"
        class="inline-block m-5 sm:m-7 bg-[#D38A8A] text-white font-aldrich px-8 py-2 rounded-lg border-2 border-[#B87070] hover:bg-[#C07070] transition duration-300">
        Start Taking Pictures →
      </a>
    </div>

    <img src={landing_frame} alt="Frame 1" class="m-auto h-fit max-w-full" />
  </div>

  <Footer />
</main>