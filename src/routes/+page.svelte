<script lang="ts">
  import landing_frame from '$lib/assets/landing-page-frame.svg';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="flex-1">
    <div class="text-center mt-8">
      <h1 class="font-aldrich text-2xl sm:text-4xl text-white">Welcome!</h1>
      <p class="font-aldrich tracking-tight text-xs sm:text-lg text-[#E8F1F2] mt-5 max-w-3xl mx-auto">
        Create and customize photo memories with your friends in real time as fliq. brings the photo booth experience to you wherever you are.
      </p>

      <a
        href="/step1"
        class="font-aldrich text-sm md:text-base inline-block mt-8 mb-5 sm:m-7 bg-[#D38A8A] text-white font-aldrich px-6 py-2 md:px-8 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300">
        Start Taking Pictures →
    </a>

    <!-- Image + Glow -->
    <div class="relative w-full flex justify-center mt-4 sm:mt-2">

      <!-- Glow -->
      <div class="absolute w-[60vw] aspect-square max-w-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-15 blur-3xl rounded-full"></div>

        <img
          src={landing_frame}
          alt="Frame preview"
          class="relative w-full animate-[float_8s_ease-in-out_infinite]"
        />
      </div>

    </div>
  </div>

  <Footer />
</main>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
</style>