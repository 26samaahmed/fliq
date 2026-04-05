<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  import one_user_icon from '$lib/assets/one-user-icon.svg';
  import two_users_icon from '$lib/assets/two-users-icon.svg';
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

        <Choice name="1 User" href="/step2" />
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

        <Choice name="2 Users" href="/step2" />
      </div>

    </div>
  </div>

  <Footer />
</main>