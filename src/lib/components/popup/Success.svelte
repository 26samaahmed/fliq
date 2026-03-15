<script lang="ts">
  export let open = false;
  export let onContinue: () => void;

  export let title = "Authentication Successful";
  export let message = "You're all set! Continue to the next step.";
  export let header = "Perfect!";
</script>

{#if open}
<div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

  <div class="bg-[#333745] rounded-xl border-white text-white shadow-2xl p-8 w-[380px] text-center animate-popup">

    <div class="text-3xl mb-4 font-aldrich">{header}</div>

    <h2 class="text-2xl font-semibold mb-2">
      {title}
    </h2>

    <p class="text-gray-200 mb-6">
      {message}
    </p>

    <button
      class="w-full font-medium bg-[#DCDFF5] text-[#333745] font-aldrich px-4 py-2 rounded-full hover:bg-[#949FF2] transition duration-500"
      on:click={onContinue}
    >
      Continue
    </button>

  </div>

</div>
{/if}