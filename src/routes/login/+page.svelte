<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="text-center mt-20">
    <h1 class="font-aldrich text-4xl text-white">Welcome Back!</h1>
    <p class="font-arimo text-xl text-[#E8F1F2] mt-5 w-230 mx-auto"> 
      <i>Enter your credentials to access your account and start creating unforgettable photo memories with fliq.</i>
    </p>

    <form class="mt-10 flex flex-col items-center gap-6 text-white">
      <input type="text" placeholder="Email" class="w-64 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />
      <input type="password" placeholder="Password" class="w-64 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5]" />
      <button type="submit" class="bg-[#DCDFF5] text-[#333745] font-aldrich px-8 py-2 rounded-lg hover:bg-[#949FF2] transition duration-500">
        Login
      </button>
    </form>
  </div>

  <Footer />
</div>
