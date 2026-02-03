<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import NextButton from '$lib/components/buttons/Next.svelte';
</script>


<main class="bg-[#333745] min-h-screen p-6">
  <Header />
  <h1 class="font-aldrich text-4xl text-white text-center">Step 4: Choose Your Side</h1>
  <div class="flex justify-center mt-10 gap-6">
    <BackButton href="/step3" />
    <NextButton href="/" />
  </div>
  <Footer />
</main>