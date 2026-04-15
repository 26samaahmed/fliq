<script lang="ts">
  export let open = false;
  export let onContinue: () => void;

  export let title = "Authentication Successful";
  export let message = "You're all set! Continue to the next step.";
  export let header = "Perfect!";
</script>

{#if open}
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 font-aldrich">

    <div class="bg-[#333745] rounded-xl border-white text-white shadow-2xl p-8 w-[380px] text-center animate-popup">

      <div class="text-3xl mb-4">{header}</div>

      <h2 class="text-2xl font-semibold mb-2">
        {title}
      </h2>

      <p class="text-gray-200 mb-6">
        {message}
      </p>

      <button
        class="inline-flex items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
        on:click={onContinue}
      >
        Continue
      </button>

    </div>

  </div>
{/if}