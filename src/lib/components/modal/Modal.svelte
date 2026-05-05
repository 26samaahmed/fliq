<script lang="ts">
	let { open = false, onClose } = $props();

	function handleBackdropClick() {
		onClose?.();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose?.();
		}
	}
</script>

{#if open}
	<!-- BACKDROP -->
	<div
		class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="button"
		tabindex="0"
	>

		<!-- MODAL CARD -->
		<div
			class="bg-[#333745] rounded-xl border border-white/40 text-white shadow-2xl p-8 w-[420px] animate-popup"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
		>
			<slot />
		</div>

	</div>
{/if}