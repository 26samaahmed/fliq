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
  class="self-start sm:self-auto -mt-2 sm:mt-0 mb-4 sm:mb-0 font-aldrich text-sm bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors duration-300"
>
  ← Back
</button>