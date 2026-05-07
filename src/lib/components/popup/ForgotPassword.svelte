<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import { supabase } from '$lib/supabase';

	export let open = false;
	export let onClose: () => void;

	let email = '';
	let message = '';
	let error = '';

	async function handleSend() {
		error = '';
		message = '';

		const redirectTo = window.location.origin + '/reset-password';

		const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo
		});

		if (err) {
			error = err.message;
			return;
		}

		message = 'Password reset link sent! Check your email.';

		setTimeout(() => {
			onClose();
		}, 2000);
	}

	function handleCancel() {
		email = '';
		message = '';
		error = '';
		onClose();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') handleSend();
		if (event.key === 'Escape') handleCancel();
	}
</script>

<Modal {open} onClose={handleCancel}>
	<div
		class="text-white w-full max-w-md flex flex-col items-center text-center gap-4"
		onkeydown={handleKeydown}
	>
		<!-- Title -->
		<div class="text-2xl font-aldrich">Forgot Password</div>

		<p class="text-sm text-white/70">Enter your email and we’ll send you a reset link.</p>

		<!-- Input -->
		<input
			type="email"
			placeholder="Email"
			bind:value={email}
			class="w-full px-4 py-2 rounded bg-[#2c2f3c] border border-white/40
             focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
		/>

		<!-- Messages -->
		{#if error}
			<p class="text-red-400 text-sm">{error}</p>
		{/if}

		{#if message}
			<p class="text-green-400 text-sm">{message}</p>
		{/if}

		<!-- Buttons -->
		<div class="w-full flex gap-3 mt-2">
			<button
				class="flex-1 bg-[#D38A8A] text-white py-2 rounded-lg border-2 border-white
               hover:bg-[#C07070] transition duration-300"
				onclick={handleSend}
			>
				Send Link
			</button>

			<button
				class="flex-1 bg-white/10 text-white py-2 rounded-lg border-2 border-white/50
               hover:bg-white/20 transition duration-300"
				onclick={handleCancel}
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>
