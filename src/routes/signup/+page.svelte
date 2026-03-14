<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';

  let showPassword = false;
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="text-center m-auto flex-1">
    <h1 class="font-aldrich text-2xl sm:text-4xl text-white">
      Sign Up for Fliq.
    </h1>

    <p class="font-b612-mono-regular text-base sm:text-lg text-[#E8F1F2] mt-5 max-w-4xl mx-auto">
      Create a free account or
      <a href="/login" class="underline text-[#DCDFF5]">
        log in
      </a>.
    </p>

    <form class="mt-10 flex flex-col items-center gap-6 text-white">
      
      <!-- Name -->
      <input
        type="text"
        required
        name="full-name"
        autocomplete="name"
        placeholder="Name"
        class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
      />

      <!-- Email -->
      <input
        type="email"
        required
        name="email"
        autocomplete="email"
        placeholder="Email"
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

      <!-- Submit -->
      <button
        type="submit"
        class="bg-[#DCDFF5] text-[#333745] font-aldrich px-8 py-2 rounded-lg hover:bg-[#949FF2] transition duration-300"
      >
        Sign Up
      </button>
    </form>
  </div>

  <Footer />
</div>