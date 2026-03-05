<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';

</script>

<div class="bg-[#12192F] min-h-screen flex flex-col p-6">
  <Header />

  <div class="text-start flex-1 font-aldrich m-5">
    <h1 class="text-2xl sm:text-4xl text-white pb-8">
      Your Profile
    </h1>

    <div class="flex flex-row gap-4">

      <!-- Personal Info -->
      <div class="w-full sm:w-1/2 lg:w-1/3 pb-10 px-2 text-white font-aldrich">
        <div class="flex flex-col relative rounded border-white border-2 p-8 min-h-[30rem]">
    
          <div class="absolute -top-4 left-4">
            <h2 class="text-xl bg-[#12192F] px-3">
              Personal Information
            </h2>
          </div>
    
          <div class="text-white text-base border-white rounded w-full h-full flex items-end justify-end pb-5">
             <a href="/edit-profile" class="underline text-[#AFADAD]">
              Edit
            </a>
          </div>

          <div class="flex items-center justify-between">
            <p>Full Name</p>
            <p class="text-[#DCDFF5]">John Doe</p>
          </div>
    
          <div class="h-px bg-white/30 my-4"></div>
    
          <div class="flex items-center justify-between">
            <p>Email</p>
            <p class="text-[#DCDFF5]">johndoe@gmail.com</p>
          </div>
    
          <div class="h-px bg-white/30 my-4"></div>
    
          <div class="flex items-center justify-between">
            <p>Password</p>
            <p class="text-[#DCDFF5]">pppp</p>
          </div>

          <!--Add profile picture option-->
            <div class="h-48 w-48 bg-white p-5 rounded-full mt-auto"></div>
    
        </div>
      </div>
    
      <!-- Albums -->
      <div class="w-full sm:w-1/2 lg:w-2/3 pb-8 px-2 text-white font-aldrich">
        <div class="flex flex-col relative rounded border-white border-2 p-8 min-h-[30rem]">
    
          <div class="absolute -top-4 left-4">
            <h2 class="text-xl bg-[#12192F] px-3">
              Albums
            </h2>
          </div>

          <div class="text-white text-xl border-white rounded w-full h-full flex items-center justify-center text-[#DCDFF5]">
            No albums yet.
          </div>

          <!--create album button-->
          <button class="absolute bottom-5 right-5 bg-[#949FF2] text-white px-4 py-2 rounded hover:bg-[#7A86D9] transition duration-300">
            Create Album
          </button>

    
        </div>
      </div>
    
    </div>

    </div>
  <Footer />
</div>