<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  // page ref needs to be dynamic based on the option, but for now we can hardcode it to the first option of each category
  const frame_styles = [
    { name: 'Design', color: '#D38A8A', page_ref: '/step3/design/1x3-design' },
    { name: 'Color', color: '#89CDEF', page_ref: '/step3/color/1x3-color' },
    { name: 'Character', color: '#ABCF93', page_ref: '/step3/character/1x3-character' }
  ];
</script>

<main class="bg-[#12192F] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 3: Pick Strip Style
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-16 sm:pt-24">
    <div class="flex flex-wrap justify-center gap-6 sm:gap-10">

      {#each frame_styles as frame}
        <a
          href={frame.page_ref}
          class="
            group
            flex flex-col items-center
            cursor-pointer
          "
        >
          <!-- Color preview box -->
          <div
            class="
              w-32 h-40
              sm:w-56 sm:h-64
              rounded-lg
              flex items-center justify-center
              transition-transform duration-200
              group-hover:scale-105
            "
            style="background-color: {frame.color};"
          >
            <p class="font-aldrich text-lg sm:text-2xl text-white text-center">
              {frame.name}
            </p>
          </div>
        </a>
      {/each}

    </div>
  </div>

  <Footer />
</main>