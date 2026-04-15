<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let password = "";
  let confirmPassword = "";
  let error = "";
  let success = "";

  async function handleReset() {
    error = "";
    success = "";

    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    const { error: err } = await supabase.auth.updateUser({
      password
    });

    if (err) {
      error = err.message;
    } else {
      success = "Password updated successfully!";
      
      setTimeout(() => {
        goto('/login');
      }, 1500);
    }
  }
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="text-center mt-auto flex-1">
    <h1 class="text-2xl sm:text-4xl text-white">
      Reset Your Password
    </h1>

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-3xl mx-auto">
      Enter a new password for your account.
    </p>

    <div class="mt-10 flex flex-col items-center gap-6 text-white">

      <!-- New Password -->
      <input
        type="password"
        placeholder="New Password"
        bind:value={password}
        class="w-60 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]"
      />

      <!-- Confirm Password -->
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        class="w-60 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]"
      />

      {#if error}
        <p class="text-red-400 text-sm">{error}</p>
      {/if}

      {#if success}
        <p class="text-green-400 text-sm">{success}</p>
      {/if}

      <button
        on:click={handleReset}
        class="bg-[#DCDFF5] text-[#333745] px-8 py-2 rounded-lg hover:bg-[#949FF2]"
      >
        Update Password
      </button>
    </div>
  </div>

  <Footer />
</div>