<script lang="ts">
  import { supabase } from '$lib/supabase';

  export let open = false;
  export let onClose: () => void;

  let email = "";
  let message = "";
  let error = "";

  async function handleSend() {
  error = "";
  message = "";

  const redirectTo =
    window.location.origin + '/reset-password';

  const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  });

  if (err) {
    error = err.message;
  } else {
    message = "Password reset link sent! Check your email.";
    setTimeout(() => {
      onClose();
    }, 2000);
  }
}

  function handleCancel() {
    email = "";
    message = "";
    error = "";
    onClose();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") handleSend();
    if (event.key === "Escape") handleCancel();
  }
</script>

{#if open}
  <div
    class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
    on:click={handleCancel}
    on:keydown={handleKeydown}
    tabindex="0"
  >
    <div
      class="bg-[#333745] rounded-xl border border-white/40 text-white shadow-2xl p-8 w-[420px]"
      on:click|stopPropagation
    >
      <div class="text-2xl font-aldrich mb-2 text-center">
        Forgot Password
      </div>

      <p class="text-sm text-center mb-4 text-white/70">
        Enter your email and we’ll send you a reset link.
      </p>

      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full mb-4 px-4 py-2 rounded bg-[#2c2f3c] border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
      />

      {#if error}
        <p class="text-red-400 text-sm mb-2">{error}</p>
      {/if}

      {#if message}
        <p class="text-green-400 text-sm mb-2">{message}</p>
      {/if}

      <div class="flex gap-4 mt-4">
        <button
          class="flex-1 items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
          on:click={handleSend}
        >
          Send Link
        </button>

        <button
          class="flex-1 inline-flex items-center justify-center bg-white/10 text-white px-8 py-2 rounded-lg border-2 border-white/50 hover:bg-white/20 transition duration-300"
          on:click={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}