<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let password = "";
  let confirmPassword = "";
  let error = "";
  let success = "";
  let showPassword = false;

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
      success = "Password updated successfully! Redirecting...";

      setTimeout(() => {
        goto('/login');
      }, 1500);
    }
  }
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="flex-1 flex flex-col items-center justify-center text-center">
    
    <!-- Title -->
    <h1 class="text-3xl sm:text-4xl text-white font-semibold">
      Reset Your Password
    </h1>

    <p class="text-white/70 text-base sm:text-lg mt-3 max-w-md">
      Enter a new password for your account.
    </p>

    <!-- Card -->
    <div class="mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-lg flex flex-col gap-5">

      <!-- New Password -->
      <div class="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          bind:value={password}
          class="w-full px-4 py-2 pr-12 rounded-md bg-white/10 text-white placeholder-white/50 ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
        />
      
        <button
          type="button"
          on:click={() => (showPassword = !showPassword)}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <!-- Confirm Password -->
      <div class="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          bind:value={confirmPassword}
          class="w-full px-4 py-2 pr-12 rounded-md bg-white/10 text-white placeholder-white/50 ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
        />
      </div>

      <!-- Hint -->
      <p class="text-xs text-white/60 -mt-2">
        Password should be at least 6 characters
      </p>

      <!-- Error -->
      {#if error}
        <p class="text-red-400 text-sm">{error}</p>
      {/if}

      <!-- Success -->
      {#if success}
        <p class="text-green-400 text-sm">{success}</p>
      {/if}

      <!-- Button -->
      <button
        on:click={handleReset}
        class="mt-2 self-center inline-flex items-center justify-center bg-[#D38A8A] text-white px-6 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
      >
        Update Password
      </button>

      <!-- Back to login -->
      <a
        href="/login"
        class="text-sm text-[#DCDFF5] underline mt-2"
      >
        Back to login
      </a>
    </div>
  </div>

  <Footer />
</div>