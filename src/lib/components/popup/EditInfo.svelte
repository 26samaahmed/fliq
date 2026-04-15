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
  let confirmPassword = "";

  // Prefill inputs whenever modal opens
  $: if (open && $user) {
    name = $user.user_metadata?.full_name ?? "";
    email = $user.email ?? "";
  }

  async function handleSave() {
    // 1. Update name + email first
    const { data: userData, error: userError } = await supabase.auth.updateUser({
      email,
      data: {
        full_name: name
      }
    });

    if (userError) {
      console.error("Error updating user info:", userError);
      return;
    }

    // 2. Update password ONLY if user entered one
    if (password) {
      // validate first
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password
      });

      if (passwordError) {
        console.error("Error updating password:", passwordError);
        return;
      }
    }

    // 3. Update UI instantly
    if (userData?.user) {
      user.set(userData.user);
    }

    password = "";
  confirmPassword = "";
    SaveChanges();
  }

  function handleCancel() {
    password = "";
    confirmPassword = "";
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

      {#if password}
        <input
          type="password"
          placeholder="Confirm Password"
          bind:value={confirmPassword}
          class="w-full mb-6 px-4 py-2 rounded bg-[#2c2f3c] border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
        />
      {/if}

      <div class="flex gap-4">

        <button
          class="flex-1 items-center justify-center bg-[#D38A8A] text-white px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
          on:click={handleSave}
        >
          Save
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