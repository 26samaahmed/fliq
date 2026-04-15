<script lang="ts">
  import { goto } from '$app/navigation';

  function goBack() {
    if (history.length > 1) {
      history.back();
    } else {
      goto('/');
    }
  }
</script>

<button
  on:click={goBack}
  class="text-white text-base sm:text-lg font-aldrich px-3 py-2 rounded-full hover:bg-white/10 transition-colors duration-300"
>
  ← Back
</button>