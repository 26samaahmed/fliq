<script lang="ts">
  import { goto } from '$app/navigation';
  import { v4 as uuidV4 } from 'uuid';

  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  import one_user_icon from '$lib/assets/one-user-icon.svg';
  import two_users_icon from '$lib/assets/two-users-icon.svg';

  function selectUsers(count: number) {
    sessionStorage.setItem('userCount', String(count));

    if (count === 2) {
      sessionStorage.setItem('roomID', uuidV4());
    } else {
      sessionStorage.removeItem('roomID');
    }

    goto('/step2');
  }
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6 font-aldrich">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="text-lg sm:text-2xl text-white text-center flex-1">
        Choose Number of Users
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />

    <p class="text-center text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
      Select one option to continue
    </p>
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-16 sm:pt-24">
    <div class="flex justify-center gap-6 sm:gap-20 lg:gap-40">

      <!-- 1 User -->
      <div class="flex flex-col items-center gap-4">
        <div class="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
          <img src={one_user_icon} alt="One User Icon" class="w-2/3 max-h-full object-contain" />
        </div>
        <button
          on:click={() => selectUsers(1)}
          class="font-aldrich text-sm md:text-base bg-[#D38A8A] text-white px-6 py-1 md:px-8 md:py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
        >
          1 User
        </button>
      </div>

      <!-- 2 Users -->
      <div class="flex flex-col items-center gap-4">
        <div class="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
          <img src={two_users_icon} alt="Two Users Icon" class="w-full max-h-full object-contain" />
        </div>
        <button
          on:click={() => selectUsers(2)}
          class="font-aldrich text-sm md:text-base bg-[#D38A8A] text-white px-6 py-1 md:px-8 md:py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
        >
          2 Users
        </button>
      </div>

    </div>
  </div>

  <Footer />
</main>