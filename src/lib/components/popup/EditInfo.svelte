<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/stores/user';
  import { browser } from '$app/environment';

  export let open = false;
  export let SaveChanges: () => void;
  export let Cancel: () => void;

  let name = "";
  let email = "";
  let password = "";

  // Prefill inputs whenever modal opens
  $: if (open && $user) {
    name = $user.user_metadata?.full_name ?? "";
    email = $user.email ?? "";
  }

  async function handleSave() {
    const { data, error } = await supabase.auth.updateUser({
      email,
      password: password || undefined,
      data: {
        full_name: name
      }
    });

    if (error) {
      console.error("Error updating user:", error);
      return;
    }

    // Update the store so UI refreshes instantly
    if (data?.user) {
      user.set(data.user);
    }

    password = "";

    SaveChanges();
  }

  function handleCancel() {
    password = "";
    Cancel();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleSave();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
    role="button"
    tabindex="0"
    on:click={handleCancel}
    on:keydown={handleKeydown}
  >

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="bg-[#333745] rounded-xl border border-white/40 text-white shadow-2xl p-8 w-[420px] animate-popup"
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
    >

      <div class="text-2xl font-aldrich mb-6 text-center">
        Edit Info
      </div>

      <!-- Name -->
      <input
        type="text"
        placeholder="Full Name"
        bind:value={name}
        class="w-full mb-4 px-4 py-2 rounded bg-[#2c2f3c] border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
      >

      <!-- Email -->
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full mb-4 px-4 py-2 rounded bg-[#2c2f3c] border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
      >

      <!-- Password -->
      <input
        type="password"
        placeholder="New Password (optional)"
        bind:value={password}
        class="w-full mb-6 px-4 py-2 rounded bg-[#2c2f3c] border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
      >

      <div class="flex gap-4">

        <button
          class="flex-1 font-medium bg-[#DCDFF5] text-[#333745] font-aldrich px-4 py-2 rounded-full hover:bg-[#949FF2] transition duration-300"
          on:click={handleSave}
        >
          Save
        </button>

        <button
          class="flex-1 font-medium bg-transparent border border-white text-white font-aldrich px-4 py-2 rounded-full hover:bg-white/20 transition duration-300"
          on:click={handleCancel}
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
{/if}