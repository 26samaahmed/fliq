<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';

  const frame_styles = [
          {
            name: 'pattern',
            color: '#D38A8A',
            page_ref: '/step3/pattern/option1'
          },
          {
            name: 'color',
            color: '#89CDEF',
            page_ref: '/step3/pattern/option1'
          },
          {
            name: 'character',
            color: '#ABCF93',
            page_ref: '/step3/pattern/option1'
          },
  ]
  </script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mb-4">
    <BackButton href="/step2" />
  </div>

  <div class="flex-1">
    <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center">Step 3: Pick Strip Style</h1>

    <ProgressBar />

    <!-- page content -->
    <div class="mt-16 flex flex-wrap sm:flex-row justify-center gap-5">
    
      {#each frame_styles as frame}
        <a href={frame.page_ref} class="flex not-[]:items-center">
          <div class="w-32 h-36 sm:w-60 sm:h-70 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 mb-2" style="background-color: {frame.color};">
          <p class="font-aldrich text-lg sm:text-2xl text-white text-center">{frame.name}</p>
        </div>
      </a>
      {/each}
    </div>
  </div>

  <Footer />
</main>