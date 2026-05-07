<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';

	let {
		open = false,
		onCancel,
		onConfirm
	}: {
		open: boolean;
		onCancel: () => void;
		onConfirm: () => void;
	} = $props();
</script>

<Modal {open} onClose={onCancel}>
	<div class="w-[320px]">
		<h2 class="text-lg mb-2">Delete strip?</h2>

		<p class="text-sm text-white/60 mb-6">This action cannot be undone.</p>

		<div class="flex justify-end gap-3">
			<button
				type="button"
				onclick={onCancel}
				class="px-4 py-2 text-white/70 hover:text-white transition"
			>
				Cancel
			</button>

			<button
				type="button"
				onclick={onConfirm}
				class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
			>
				Delete
			</button>
		</div>
	</div>
</Modal>
