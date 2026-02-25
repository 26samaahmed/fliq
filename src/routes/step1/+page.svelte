<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';
  import BackButton from '$lib/components/buttons/Back.svelte';

  import one_user_icon from '$lib/assets/one-user-icon.svg';
  import two_users_icon from '$lib/assets/two-users-icon.svg';
</script>

<main class="bg-[#333745] min-h-screen flex flex-col p-6">
  <Header />

  <div class="mb-4">
    <BackButton href="/" />
  </div>

  <div class="flex-1">
    <h1 class="font-aldrich text-lg sm:text-2xl text-white text-center">
      Step 1: Number of Users
    </h1>

    <ProgressBar />

    <div class="mt-16 flex justify-center gap-24 sm:gap-64">
      <div class="flex flex-col items-center gap-4">
        <img src={one_user_icon} alt="One User Icon" class="w-16 sm:h-full sm:w-full" />
        <Choice name="1 User" href="/step2"/>
      </div>

      <!--<p class="text-white text-xl font-aldrich">OR</p>-->

      <div class="flex flex-col items-center gap-4">
        <img src={two_users_icon} alt="Two Users Icon" class="w-20 sm:h-full sm:w-full" />
        <Choice name="2 Users" href="/step2"/>
      </div>  
    </div>
  </div>

  <Footer />
</main>