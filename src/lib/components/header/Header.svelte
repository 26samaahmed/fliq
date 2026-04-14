<script lang="ts">
  import profileIcon from '$lib/assets/profile-icon.svg';
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let showDropdown = false;

  function goToProfile() {
    showDropdown = false;
    goto('/profile');
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    user.set(null);
    showDropdown = false;
    goto('/');
  }

  // Close dropdown when clicking outside
  onMount(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest('.dropdown')) {
        showDropdown = false;
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
</script>

<div class="flex items-center justify-between mb-8">
  
  <a href="/" class="font-aclonica text-xl sm:text-2xl text-[#FE5F56]">
    fliq.
  </a>

  {#if $user}
    <div class="relative flex items-center dropdown">

      <!-- Profile Button -->
      <button
        class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        on:click={() => (showDropdown = !showDropdown)}
      >
        <img src={profileIcon} alt="Profile" class="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <!-- Dropdown -->
      {#if showDropdown}
        <div
          class="absolute right-0 top-full mt-2 w-44 bg-[#2c2f3c] border border-white/20 rounded-lg shadow-xl z-50"
        >
          <button
            class="w-full text-left px-4 py-2 hover:bg-white/10 transition rounded-md text-white"
            on:click={goToProfile}
          >
            Profile
          </button>
      
          <hr class="border-white/10 my-1" />
      
          <button
            class="w-full text-left px-4 py-2 hover:bg-white/10 transition rounded-md text-red-400"
            on:click={logout}
          >
            Logout
          </button>
        </div>
      {/if}

    </div>

  {:else}

    <!-- Logged-out state -->
    <a
      href="/login"
      class="bg-[#D38A8A] text-white font-aldrich px-8 py-2 rounded-lg border-2 border-[#B87070] hover:bg-[#C07070] transition duration-300"
    >
      Login
    </a>

  {/if}

</div>