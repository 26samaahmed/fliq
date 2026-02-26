<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';
  import layout1 from '$lib/assets/layout1.svg';
  import layout2 from '$lib/assets/layout2.svg';
  import layout3 from '$lib/assets/layout3.svg';
  import layout4 from '$lib/assets/layout4.svg';

  const layouts = [
        {
          name: 'Layout 1',
          size: '2 x 6',
          photos: '3 Photo',
          image: layout1
        },
        {
          name: 'Layout 2',
          size: '2 x 6',
          photos: '4 Photo',
          image: layout2
        },
        {
          name: 'Layout 3',
          size: '4 x 6',
          photos: '6 Photo',
          image: layout3
        },
        {
          name: 'Layout 4',
          size: '4 x 6',
          photos: '4 Photo',
          image: layout4
        }
    ];
</script>


<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mb-4">
    <BackButton href="/step1" />
  </div>

  <div class="flex-1">
    <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center">Step 2: Choose the Layout</h1>

    <ProgressBar />

    <!-- page content -->
    <div class="mt-16 flex flex-row flex-wrap justify-center gap-20">

      {#each layouts as layout}
        <div class="flex flex-col gap1 sm:gap-2 items-center">
          <img src={layout.image} alt={layout.name} class="w-auto h-auto shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 mb-2" />
          <p class="font-aldrich text-base sm:text-xl text-white text-center">{layout.size}</p>
          <p class="font-aldrich text-base sm:text-xl text-white text-center">{layout.photos}</p>
          <Choice href="/step3" name="Choose" />
        </div>
      {/each}

      <!--Add if statement to add shareable link if the user clicked on 2 users in step 1-->
    </div>
  </div>

  <Footer />
</main>