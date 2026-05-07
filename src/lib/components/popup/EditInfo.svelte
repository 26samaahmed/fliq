<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/stores/user';

	export let open = false;
	export let SaveChanges: () => void;
	export let Cancel: () => void;

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';

	$: if (open && $user) {
		name = $user.user_metadata?.full_name ?? '';
		email = $user.email ?? '';
	}

	async function handleSave() {
		const { data: userData, error: userError } = await supabase.auth.updateUser({
			email,
			data: { full_name: name }
		});

		if (userError) {
			console.error(userError);
			return;
		}

		if (password) {
			if (password !== confirmPassword) {
				console.error('Passwords do not match');
				return;
			}

			const { error: passwordError } = await supabase.auth.updateUser({
				password
			});

			if (passwordError) {
				console.error(passwordError);
				return;
			}
		}

		if (userData?.user) user.set(userData.user);

		password = '';
		confirmPassword = '';
		SaveChanges();
	}

	function handleCancel() {
		password = '';
		confirmPassword = '';
		Cancel();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') handleSave();
		if (event.key === 'Escape') handleCancel();
	}
</script>

<Modal {open} onClose={handleCancel}>
	<div
		class="text-white w-full max-w-md flex flex-col items-center text-center gap-4"
		onkeydown={handleKeydown}
	>
		<!-- Title -->
		<div class="text-2xl font-aldrich mb-2">Edit Info</div>

		<!-- Inputs container -->
		<div class="w-full flex flex-col items-center gap-3">
			<input
				type="text"
				placeholder="Full Name"
				bind:value={name}
				class="w-full px-4 py-2 rounded bg-[#2c2f3c] border border-white/40
               focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
			/>

			<input
				type="email"
				placeholder="Email"
				bind:value={email}
				class="w-full px-4 py-2 rounded bg-[#2c2f3c] border border-white/40
               focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
			/>

			<input
				type="password"
				placeholder="New Password (optional)"
				bind:value={password}
				class="w-full px-4 py-2 rounded bg-[#2c2f3c] border border-white/40
               focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
			/>

			{#if password}
				<input
					type="password"
					placeholder="Confirm Password"
					bind:value={confirmPassword}
					class="w-full px-4 py-2 rounded bg-[#2c2f3c] border border-white/40
                 focus:outline-none focus:ring-2 focus:ring-[#DCDFF5]"
				/>
			{/if}
		</div>

		<!-- Buttons -->
		<div class="w-full flex gap-3 mt-2">
			<button
				class="flex-1 bg-[#D38A8A] text-white py-2 rounded-lg border-2 border-white
               hover:bg-[#C07070] transition duration-300"
				onclick={handleSave}
			>
				Save
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
