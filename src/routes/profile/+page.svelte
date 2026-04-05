<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import EditInfo from '$lib/components/popup/EditInfo.svelte';

  import { supabase } from '$lib/supabase';
  import { user } from '$lib/stores/user';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  // Dummy albums data
  let albums = [
    { name: "Recents" },
    { name: "Favorites" },
    { name: "Shared with me" }
  ];

  let showEditModal = false;

  async function retrieveData() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error retrieving user:", error);
      return;
    }

    if (data?.user) {
      user.set(data.user);
    }
  }

  onMount(() => {
    retrieveData();
  });

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "auto";
    }
  });

  function openEditModal() {
    showEditModal = true;

    if (browser) {
      document.body.style.overflow = "hidden";
    }
  }

  function closeEditModal() {
    showEditModal = false;

    if (browser) {
      document.body.style.overflow = "auto";
    }
  }

</script>

<div class="bg-[#333745] min-h-screen flex flex-col px-4 sm:px-6 py-6">
  <Header />

  <div class="flex-1 font-aldrich text-white max-w-7xl mx-auto w-full">
    
    <h1 class="text-2xl sm:text-4xl pb-8">
      Your Profile
    </h1>


    <div class="flex flex-col lg:flex-row gap-6">

      <!-- Personal information -->
      <div class="w-full lg:w-1/3 mb-5">
        <div class="flex flex-col relative rounded border-white border-2 p-6 sm:p-8 min-h-[18rem] sm:min-h-[24rem] h-full bg-[#2c2f3c]">

          <div class="absolute -top-4 left-4">
            <h2 class="text-lg sm:text-xl bg-[#333745] px-3">
              Personal Information
            </h2>
          </div>

          <div class="flex justify-end pb-6">
            <button
              class="underline text-[#AFADAD] hover:text-white transition"
              on:click={openEditModal}
            >
              Edit
            </button>
          </div>

          <div class="flex flex-col w-full text-sm sm:text-base">

            <div class="flex justify-between">
              <p>Full Name</p>
              <p class="text-[#DCDFF5]">{$user?.user_metadata?.full_name ?? "Loading..."}</p>
            </div>

            <div class="h-px bg-white/30 my-4"></div>

            <div class="flex justify-between break-all">
              <p>Email</p>
              <p class="text-[#DCDFF5]">{$user?.email ?? "Loading..."}</p>
            </div>

            <div class="h-px bg-white/30 my-4"></div>

            <div class="flex justify-between">
              <p>Password</p>
              <p class="text-[#DCDFF5]">••••••••</p>
            </div>

          </div>

        </div>
      </div>

      <!-- Albums -->
      <div class="w-full lg:w-2/3">
        <div class="flex flex-col relative rounded border-white border-2 p-6 sm:p-8 sm:min-h-[24rem] bg-[#2c2f3c]">

          <div class="absolute -top-4 left-4">
            <h2 class="text-lg sm:text-xl bg-[#333745] px-3">
              Albums
            </h2>
          </div>

          {#if albums.length === 0}

            <!-- If no albums have been created (note: a recents album should be added by default right after the user takes their first photobooth strip) -->
            <div class="flex flex-col items-center justify-center flex-1 gap-6 text-[#DCDFF5]">

              <p class="text-lg sm:text-xl text-center">
                No albums yet!
              </p>

              <button class="bg-[#949FF2] px-5 py-2 rounded hover:bg-[#7A86D9] transition">
                Create your first album
              </button>

            </div>

          {:else}

            <!-- Album grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

              {#each albums as album}

                <div class="bg-white p-3 rounded shadow-lg 
                           hover:rotate-[1deg] hover:scale-105
                           transition duration-200 cursor-pointer">

                  <!-- Photo preview -->
                  <div class="bg-gray-300 aspect-square w-full rounded-sm"></div>

                  <!-- Album name -->
                  <p class="text-center text-[#333745] mt-3 font-semibold text-sm sm:text-base">
                    {album.name}
                  </p>

                </div>

              {/each}

            </div>

            <!-- Create Album -->
            <div class="flex justify-center mt-10">
              <button class="bg-[#949FF2] px-5 py-2 rounded hover:bg-[#7A86D9] transition">
                Create Album
              </button>
            </div>

          {/if}

        </div>
      </div>

    </div>
    <EditInfo
      open={showEditModal}
      SaveChanges={closeEditModal}
      Cancel={closeEditModal}
    />

  </div>

  <Footer />
</div>