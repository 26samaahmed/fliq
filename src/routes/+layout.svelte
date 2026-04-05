<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/stores/user';

  onMount(() => {
    // Listen for auth state changes globally
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        user.set(session.user);
      } else {
        user.set(null);
      }
    });

    // Optional: check immediately if user is logged in
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) user.set(authUser);
    };
    checkUser();
  });

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Aclonica&family=Aldrich&family=Arimo:ital,wght@0,400..700;1,400..700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<slot />
