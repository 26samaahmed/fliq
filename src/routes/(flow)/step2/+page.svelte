<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import layout1 from '$lib/assets/layout1.svg';
  import layout2 from '$lib/assets/layout2.svg';
  import layout3 from '$lib/assets/layout3.svg';
  import layout4 from '$lib/assets/layout4.svg';

  const layouts = [
    { name: 'Layout 1', size: '2 x 6', photos: '3 Photo', image: layout1 },
    { name: 'Layout 2', size: '2 x 6', photos: '4 Photo', image: layout2 },
    { name: 'Layout 3', size: '4 x 6', photos: '6 Photo', image: layout3 },
    { name: 'Layout 4', size: '4 x 6', photos: '4 Photo', image: layout4 }
  ];
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mt-4">
    <div class="flex items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 2: Choose the Layout
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-16 sm:pt-24">
    <div class="flex flex-row flex-wrap justify-center gap-10 sm:gap-16">

      {#each layouts as layout}
        <a
          href="/step3"
          class="
            group
            flex flex-col items-center
            gap-1 sm:gap-2
            p-4 sm:p-8
            rounded-lg
            border border-white/10
            bg-white/5
            hover:bg-white/10
            hover:border-white/30
            shadow-lg
            hover:shadow-xl
            transition-all duration-200
            cursor-pointer
          "
        >
          <!-- Image frame -->
          <div class="w-28 h-40 sm:w-32 sm:h-44 mb-2 flex items-center justify-center">
            <img
              src={layout.image}
              alt={layout.name}
              class="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          <p class="font-aldrich text-base sm:text-xl text-white text-center">
            {layout.size}
          </p>

          <p class="font-aldrich text-base sm:text-xl text-white/80 text-center">
            {layout.photos}
          </p>
        </a>
      {/each}

    </div>
  </div>

  <Footer />
</main>