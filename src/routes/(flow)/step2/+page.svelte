<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import layout1 from '$lib/assets/layout1.svg';
  import layout2 from '$lib/assets/layout2.svg';
  import layout3 from '$lib/assets/layout3.svg';
  import layout4 from '$lib/assets/layout4.svg';

  const layouts = [
    { name: 'Layout 1', size: '2 x 6', photos: '3 Photo', image: layout1, frame: '1x3' },
    { name: 'Layout 2', size: '2 x 6', photos: '4 Photo', image: layout2, frame: '1x4' },
    { name: 'Layout 3', size: '4 x 6', photos: '4 Photo', image: layout3, frame: '2x2v' },
    { name: 'Layout 4', size: '4 x 6', photos: '4 Photo', image: layout4, frame: '2x2h' }
  ];

  function selectLayout(frame: string) {
    sessionStorage.setItem('frame', frame);
    const userCount = sessionStorage.getItem('userCount');
    if (userCount === '2') {
      const roomID = sessionStorage.getItem('roomID');
      window.location.href = `/step3`;
    } else {
      window.location.href = '/step3';
    }
  }

// user room creation (based on selection)
  let isTwoUsers = false;
  let roomLink = '';
  let copied = false;

  onMount(() => {
    isTwoUsers = sessionStorage.getItem('userCount') === '2';
    if (isTwoUsers) {
      const roomID = sessionStorage.getItem('roomID');
      roomLink = `${window.location.origin}/step4/${roomID}`;
    }
  });

  function copyLink() {
    navigator.clipboard.writeText(roomLink);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Step 2: Choose the Layout
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    {#if isTwoUsers}
    <div class="flex flex-col items-center gap-2 mt-4">
      <p class="text-white/70 text-sm">
        Share this link with your partner to start your photo session together:
      </p>
      <button
        on:click={copyLink}
        class="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full transition duration-200">
        {#if copied}
          ✓ Copied!
        {:else}
          🧷 {roomLink}
        {/if}
      </button>
    </div>
  {/if}
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-16 sm:pt-24">
    <div class="flex flex-row flex-wrap justify-center gap-10 sm:gap-16">

      {#each layouts as layout (layout.frame)}
        <button
          on:click={() => selectLayout(layout.frame)}
          class="
            group
            flex flex-col items-center
            gap-1 sm:gap-2
            p-4 sm:p-8
            rounded-md
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
          <div class="w-28 h-40 sm:w-36 sm:h-48 mb-2 flex items-center justify-center">
            <img
              src={layout.image}
              alt={layout.name}
              class="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          <p class="text-base sm:text-xl text-white/80 text-center">
            {layout.photos}
          </p>
        </button>
      {/each}

    </div>
  </div>

  <Footer />
</main>
