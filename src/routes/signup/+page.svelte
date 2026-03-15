<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import SuccessPopup from '$lib/components/popup/Success.svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let showPassword = false;
  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let showSuccess = false;
  let popupTitle = "";
  let popupMessage = "";
  let popupHeader = "";

  async function handleSignup() {
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });

    if (err) {
      error = err.message;
    } else {
      popupHeader = "Account Created!";
      popupTitle = "Signup Successful";
      popupMessage = "Your account is ready. Let's get you started.";

      showSuccess = true;
    }
  }
  function goToStep1() {
    goto('/step1');
  }
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="text-center mt-20 flex-1">
    <h1 class="font-aldrich text-2xl sm:text-4xl text-white">
      Sign Up for Fliq.
    </h1>

    <p class="font-arimo text-base sm:text-xl text-[#E8F1F2] mt-5 max-w-4xl mx-auto">
      Create a free account or
      <a href="/login" class="underline text-[#DCDFF5]">
        log in
      </a>.
    </p>

    <form class="mt-10 flex flex-col items-center gap-6 text-white" on:submit|preventDefault={handleSignup}>
      
      <!-- Name -->
      <input
        type="text"
        required
        name="full-name"
        autocomplete="name"
        placeholder="Name"
        bind:value={name}
        class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
      />

      <!-- Email -->
      <input
        type="email"
        required
        name="email"
        autocomplete="email"
        placeholder="Email"
        bind:value={email}
        class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
      />

      <!-- Password -->
      <div class="relative w-72">
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

      <!-- Terms -->
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          required
          id="terms"
          class="w-5 h-5 text-[#DCDFF5] bg-gray-100 rounded border-gray-300 focus:ring-[#DCDFF5] cursor-pointer"
        />
        <!--Add terms and conditions later-->
        <label for="terms" class="text-[#E8F1F2] text-sm">
          I agree to the
          <a href="#" class="underline text-[#DCDFF5]">
            Terms and Conditions
          </a>
        </label>
      </div>

      <!-- Error message -->
      {#if error}
        <p class="text-red-400 text-sm">{error}</p>
      {/if}

      <!-- Submit -->
      <button
        type="submit"
        class="bg-[#DCDFF5] text-[#333745] font-aldrich px-8 py-2 rounded-lg hover:bg-[#949FF2] transition duration-300"
      >
        Sign Up
      </button>
    </form>
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