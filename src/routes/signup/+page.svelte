<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />
  <div class="text-center mt-20 flex-1">
    <h1 class="font-aldrich text-2xl sm:text-4xl text-white">Sign Up for Fliq.</h1>
    <p class="font-arimo text-xl text-[#E8F1F2] mt-5 max-w-4xl mx-auto">Create a free account or <span class="underline text-[#DCDFF5] cursor-pointer"><a href="/login">log in</a></span>.</p>

    <form class="mt-10 flex flex-col items-center gap-6 text-white">
      <input type="text" placeholder="Name" class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />

      <input type="text" placeholder="Email" class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />

      <input type="password" placeholder="Password" class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />

      <!-- Have option to sign in via google-->
      <span class="text-[#E8F1F2]">OR</span>
      <button class="text-[#E8F1F2] font-aldrich hover:bg-[#949FF2] transition duration-500">
        Sign Up with Google
      </button>

      <div class="flex items-center gap-2">
        <input type="checkbox" id="terms" class="w-5 h-5 text-[#DCDFF5] bg-gray-100 rounded border-gray-300 focus:ring-[#DCDFF5]">
        <label for="terms" class="text-[#E8F1F2] text-sm">I agree to the <a href="#" class="underline text-[#DCDFF5]">Terms and Conditions</a></label>
      </div>


      <button type="submit" class="bg-[#DCDFF5] text-[#333745] font-aldrich px-8 py-2 rounded-lg hover:bg-[#949FF2] transition duration-500">
        Sign Up
      </button>
    </form>

  </div>
  <Footer />
</div>

