<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
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

{@render children?.()}
