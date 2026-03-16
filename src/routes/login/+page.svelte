<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';

  let showPassword = false;
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

    <form class="mt-10 flex flex-col items-center gap-6 text-white">
      
      <!-- Email -->
      <input
        type="email"
        required
        name="email"
        autocomplete="email"
        placeholder="Email"
        class="w-full max-w-xs px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
      />

      <!-- Password -->
      <div class="relative w-full max-w-xs">
        <input
          type={showPassword ? 'text' : 'password'}
          required
          name="password"
          autocomplete="current-password"
          placeholder="Password"
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
        class="text-sm text-[#DCDFF5] underline -mt-2"
      >
        Forgot password?
      </a>

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
  </div>

  <Footer />
</div>