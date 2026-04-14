<script>
  import { goto } from '$app/navigation';
  import { v4 as uuidV4 } from 'uuid';

  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  import one_user_icon from '$lib/assets/one-user-icon.svg';
  import two_users_icon from '$lib/assets/two-users-icon.svg';

  /**
	 * @param {number} count
	 */

  function selectUsers(count) {
    sessionStorage.setItem('userCount', String(count));
    if (count === 2) {
      sessionStorage.setItem('roomID', uuidV4());
    } else {
      sessionStorage.removeItem('roomID');
    }
    goto('/step2');
  }

</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mt-4">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-2">
      <BackButton />

      <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center flex-1">
        Step 1: Number of Users
      </h1>

      <div class="w-16"></div>
    </div>

    <ProgressBar />
  </div>

  <!-- Main content -->
  <div class="flex-1 flex items-start justify-center pt-16 sm:pt-24">
    <div class="flex justify-center gap-24 sm:gap-64">

      <!-- 1 User -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
          <img
            src={one_user_icon}
            alt="One User Icon"
            class="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-110"
          />
        </div>

        <button
          on:click={() => selectUsers(1)}
          class="inline-flex items-center justify-center bg-[#D38A8A] hover:bg-[#F9D0D0] active:scale-95 text-white text-sm sm:text-lg font-aldrich hover:text-[#333745] py-2 px-5 sm:px-6 border border-white hover:border-transparent rounded-full shadow-md hover:shadow-lg transition-all duration-200">
          1 User
        </button>
      </div>

      <!-- 2 Users -->
      <div class="flex flex-col items-center gap-4 group">
        <div class="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
          <img
            src={two_users_icon}
            alt="Two Users Icon"
            class="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-110"
          />
        </div>

        <button
          on:click={() => selectUsers(2)}
          class="inline-flex items-center justify-center bg-[#D38A8A] hover:bg-[#F9D0D0] active:scale-95 text-white text-sm sm:text-lg font-aldrich hover:text-[#333745] py-2 px-5 sm:px-6 border border-white hover:border-transparent rounded-full shadow-md hover:shadow-lg transition-all duration-200">
          2 Users
        </button>
      </div>

    </div>
  </div>

  <Footer />
</main>