<script lang="ts">
  import Modal from '$lib/components/modal/Modal.svelte';

  export let open = false;
  export let onContinue: () => void;

  export let title = "Authentication Successful";
  export let message = "You're all set! Continue to the next step.";
  export let header = "Perfect!";
</script>

<Modal {open} onClose={onContinue}>

  <div class="text-white w-full max-w-sm flex flex-col items-center text-center gap-4">

    <!-- Header -->
    <div class="text-3xl">
      {header}
    </div>

    <!-- Title -->
    <h2 class="text-2xl font-semibold">
      {title}
    </h2>

    <!-- Message -->
    <p class="text-white/70">
      {message}
    </p>

    <!-- Button -->
    <button
      class="mt-2 inline-flex items-center justify-center
             bg-[#D38A8A] text-white px-8 py-2
             rounded-lg border-2 border-white
             hover:bg-[#C07070] transition duration-300"
      onclick={onContinue}
    >
      Continue
    </button>

  </div>

</Modal>