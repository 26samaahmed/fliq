<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import SuccessPopup from '$lib/components/popup/Success.svelte';

  import { user } from '$lib/stores/user';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import ForgotPassword from '$lib/components/popup/ForgotPassword.svelte';

  let showPassword = false;
  let email = '';
  let password = '';
  let error = '';
  let showSuccess = false;
  let popupTitle = "";
  let popupMessage = "";
  let popupHeader = "";
  let showForgotPassword = false;

  async function handleLogin() {
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (err) {
      error = err.message;
    } else {
      goto('/');
    }
  }


  function goToStep1() {
    showSuccess = false;
    goto('/step1');
  }

</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="text-center mt-auto flex-1">
    <h1 class="font-aldrich text-2xl sm:text-4xl text-white">
      Welcome Back!
    </h1>

    <p class="font-b612-mono-regular text-base sm:text-xl text-[#E8F1F2] mt-5 max-w-4xl mx-auto">
      <i>
        Enter your credentials to access your account and start creating unforgettable photo memories with fliq.
      </i>
    </p>

    <form
      class="mt-10 flex flex-col items-center gap-6 text-white"
      on:submit|preventDefault={handleLogin}
    >
      
      <!-- Email -->
      <input
        type="email"
        required
        name="email"
        autocomplete="email"
        placeholder="Email"
        bind:value={email}
        class="w-60 sm:w-64 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
      />

      <!-- Password -->
      <div class="relative w-full max-w-xs">
        <input
          type={showPassword ? 'text' : 'password'}
          required
          name="password"
          autocomplete="current-password"
          placeholder="Password"
          bind:value={password}
          class="w-full px-4 py-2 pr-10 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
        />
      
        <button
          type="button"
          on:click={() => (showPassword = !showPassword)}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white"
          aria-label="Toggle password visibility"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <!-- Forgot password - Implement Later -->
      <a
        href="#"
        on:click|preventDefault={() => (showForgotPassword = true)}
        class="text-sm text-[#DCDFF5] underline -mt-2"
      >
        Forgot password?
      </a>

      <!-- Error message -->
      {#if error}
        <p class="text-red-400 text-sm">{error}</p>
      {/if}

      <!-- Submit Button-->
      <button
        type="submit"
        class="bg-[#DCDFF5] text-[#333745] font-aldrich px-8 py-2 rounded-lg hover:bg-[#949FF2] transition duration-300"
      >
        Login
      </button>
    </form>

    <p class="text-[#E8F1F2] mt-6">
      Don't have an account?
      <a href="/signup" class="underline text-[#DCDFF5]">
        Sign Up
      </a>
    </p>

    <ForgotPassword
      open={showForgotPassword}
      onClose={() => (showForgotPassword = false)}
    />
    
    <SuccessPopup
      open={showSuccess}
      onContinue={goToStep1}
      header={popupHeader}
      title={popupTitle}
      message={popupMessage}
    />
  </div>

  <Footer />
</div>