<script lang="ts">
  import profileIcon from '$lib/assets/profile-icon.svg';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';

  // Reactive reference to the store
  // $user automatically updates whenever the store changes
  function goToProfile() {
    goto('/profile');
  }
</script>

<div class="flex items-center justify-between mb-8">

  <a href="/" class="font-aclonica text-xl sm:text-2xl text-[#FE5F56]">
    fliq.
  </a>

  {#if $user}
    <!-- Logged-in state -->
    <button
      class="
        w-10 h-10 sm:w-11 sm:h-11
        rounded-full
        bg-white/10
        hover:bg-white/20
        flex items-center justify-center
        transition-colors
      "
      aria-label="Open profile"
      on:click={goToProfile}
    >
      <img src={profileIcon} alt="Profile" class="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  {:else}
    <!-- Logged-out state -->
    <a
      href="/login"
      class="
        flex items-center gap-2
        px-3 py-2
        rounded-full
        bg-white/10
        hover:bg-white/20
        text-white font-aldrich text-md
        transition-colors
      "
    >
      <img src={profileIcon} alt="Login" class="w-4 h-4" />
      <span class="hidden sm:inline">Login</span>
    </a>
  {/if}

</div>