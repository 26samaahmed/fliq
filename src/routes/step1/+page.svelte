<script>
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import ProgressBar from '$lib/components/progressbar/ProgressBar.svelte';
  import Choice from '$lib/components/buttons/Choice.svelte';

  import one_user_icon from '$lib/assets/one-user-icon.svg';
  import two_users_icon from '$lib/assets/two-users-icon.svg';
</script>

<main class="bg-[#333745] min-h-screen p-6">
  <Header />

  <h1 class="font-aldrich text-4xl text-white text-center">
    Step 1: Number of Users
  </h1>

  <ProgressBar />

  <!-- page content -->
  <div class="mt-16 flex justify-center gap-64">
    <div class="flex flex-col items-center gap-4">
      <img src="{one_user_icon}" alt="One User Icon" class="h-full w-full" />
      <Choice name="1 User" href="/step2"/>
    </div>

    <div class="flex flex-col items-center gap-4">
      <img src="{two_users_icon}" alt="Two Users Icon" class="h-full w-full" />
      <Choice name="2 Users" href="/step2"/>
    </div>  
  </div>

  <Footer />
</main>
