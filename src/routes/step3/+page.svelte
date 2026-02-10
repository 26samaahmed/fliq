<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import BackorNext from '$lib/components/buttons/BackorNext.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';

  const frame_styles = [
          {
            name: 'pattern',
            color: '#D38A8A',
            page_ref: '/'
          },
          {
            name: 'color',
            color: '#89CDEF',
            page_ref: '/'
          },
          {
            name: 'character',
            color: '#ABCF93',
            page_ref: '/'
          },
  ]
  </script>


<main class="bg-[#333745] min-h-screen p-6">
  <Header />
  <h1 class="font-aldrich text-4xl text-white text-center">Step 3: Pick Strip Style</h1>

  <ProgressBar />

  <!-- page content -->
  <div class="mt-16 flex justify-center gap-24">
  
  {#each frame_styles as frame}
    <div class="flex flex-col gap-3 items-center">
      <p class="font-aldrich text-2xl text-white text-center">{frame.name}</p>
    </div>
  {/each}

  </div>
  <div class="flex justify-center mt-10 gap-6">
    <BackorNext href="/step2" name="Back" />
    <BackorNext href="/step4" name="Next" />
  </div>
  <Footer />
</main>