<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import EditInfo from '$lib/components/popup/EditInfo.svelte';

  import { supabase } from '$lib/supabase';
  import { user } from '$lib/stores/user';
  import { get } from 'svelte/store';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  type Strip = { id: string; storage_path: string; mime_type: string; created_at: string; publicUrl: string };

  let strips: Strip[] = [];
  let stripsLoading = true;
  let showEditModal = false;

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

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

  async function loadStrips() {
    const currentUser = get(user);
    if (!currentUser) { stripsLoading = false; return; }

    const { data, error } = await supabase
      .from('strips')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error || !data) { stripsLoading = false; return; }

    strips = data.map((s: Omit<Strip, 'publicUrl'>) => {
      const { data: urlData } = supabase.storage.from('strips').getPublicUrl(s.storage_path);
      return { ...s, publicUrl: urlData.publicUrl };
    });
    stripsLoading = false;
  }

  onMount(async () => {
    await retrieveData();
    await loadStrips();
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

<div class="font-aldrich min-h-screen flex flex-col p-6 bg-gradient-to-b from-[#2E3140] to-[#3B3F52]">
  <Header />

  <div class="flex-1 text-white max-w-7xl mx-auto w-full">
    
    <h1 class="text-2xl sm:text-4xl pb-8">
      Your Profile
    </h1>

    <div class="flex flex-col lg:flex-row gap-6 items-stretch">

      <!-- Personal information -->
      <div class="w-full lg:w-1/3 mb-5">
        <div class="flex flex-col relative rounded border-white border-2 p-6 sm:p-8 h- bg-[#2c2f3c]">

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

      <!-- Recently taken strips -->
      <div class="w-full lg:w-2/3">
        <div class="flex flex-col relative rounded border-white border-2 p-6 sm:p-8 h-full bg-[#2c2f3c]">

          <div class="absolute -top-4 left-4">
            <h2 class="text-lg sm:text-xl bg-[#333745] px-3">
              Recently taken strips
            </h2>
          </div>

          {#if stripsLoading}

            <div class="flex flex-col items-center justify-center flex-1 gap-4 text-[#DCDFF5]">
              <p class="text-sm text-white/50">Loading strips...</p>
            </div>

          {:else if strips.length === 0}

            <!-- Empty state -->
            <div class="flex flex-col items-center justify-center flex-1 gap-6 text-[#DCDFF5]">

              <p class="text-lg sm:text-xl text-center">
                No Strips
              </p>

              <a href="/step1">
                <button class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300">
                  Take your first strip
                </button>
              </a>

            </div>

          {:else}

            <!-- Strips grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

              {#each strips as strip}

                <div class="bg-white p-3 rounded shadow-lg
                           hover:rotate-[1deg] hover:scale-105
                           transition duration-200 cursor-pointer">

                  <!-- Strip preview -->
                  <img
                    src={strip.publicUrl}
                    alt="Photo strip"
                    class="w-full h-auto object-contain rounded-sm"
                  />

                  <!-- Timestamp -->
                  <p class="text-center text-[#333745] mt-2 text-xs">
                    {formatDate(strip.created_at)}
                  </p>

                </div>

              {/each}

            </div>

            <div class="flex justify-center mt-10">
              <a href="/step1">
                <button class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300">
                  Take another strip
                </button>
              </a>
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