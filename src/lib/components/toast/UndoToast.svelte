<script lang="ts">
  export let show = false;
  export let message = '';
  export let actionLabel = 'Undo';
  export let onAction: () => void;
</script>

{#if show}
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2
           bg-[#333745] text-white
           px-5 py-3 rounded-xl
           border border-white/20
           shadow-2xl
           flex items-center gap-5
           animate-popup"
  >

    <span class="text-sm text-white/90">
      {message}
    </span>

    <button
      onclick={onAction}
      class="text-[#D38A8A] hover:text-white transition text-sm font-medium"
    >
      {actionLabel}
    </button>

  </div>
{/if}