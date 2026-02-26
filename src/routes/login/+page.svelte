<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="text-center mt-20 flex-1 text-center">
    <h1 class="font-aldrich text-2xl sm:text-4xl text-white">Welcome Back!</h1>
    <p class="font-arimo text-base sm:text-xl text-[#E8F1F2] mt-5 max-w-4xl mx-auto"> 
      <i>Enter your credentials to access your account and start creating unforgettable photo memories with fliq.</i>
    </p>

    <form class="mt-10 flex flex-col items-center gap-6 text-white">
      <input type="text" placeholder="Email" class="w-60 sm:w-64 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />
      <input type="password" placeholder="Password" class="w-60 sm:w-64 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />
      <button type="submit" class="bg-[#DCDFF5] text-[#333745] font-aldrich px-8 py-2 rounded-lg hover:bg-[#949FF2] transition duration-500">
        Login
      </button>
    </form>

    <p class="text-[#E8F1F2] mt-6">
      Don't have an account? <a href="/signup" class="underline text-[#DCDFF5]">Sign Up</a>
    </p>
  </div>

  <Footer />
</div>
