<script>
  import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
  import BackorNext from '$lib/components/buttons/BackorNext.svelte';
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


<main class="bg-[#333745] min-h-screen p-6">
  <Header />
  <h1 class="font-aldrich text-4xl text-white text-center">Step 2: Choose the Layout</h1>

  <ProgressBar />

  <!-- page content -->
  <div class="mt-16 flex flex-row justify-center gap-24">

    {#each layouts as layout}
      <div class="flex flex-col gap-3 items-center">
        <img src={layout.image} alt={layout.name} class="w-24 h-auto shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 mb-2" />
        <p class="font-aldrich text-2xl text-white text-center">{layout.size}</p>
        <p class="font-aldrich text-2xl text-white text-center">{layout.photos}</p>
        <Choice href="/step3" name="Choose" />
      </div>
    {/each}

  

    <!--Add if statement to add shareable link if the user clicked on 2 users in step 1-->
  </div>

  <div class="flex justify-center mt-10 gap-6">
    <BackorNext href="/step1" name="Back" />
    <BackorNext href="/step3" name="Next" />
  </div>
  <Footer />
</main>