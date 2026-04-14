<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import SuccessPopup from '$lib/components/popup/Success.svelte';

	import { user } from '$lib/stores/user';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let showPassword = false;
	let name = '';
	let email = '';
	let password = '';
	let error = '';
	let showSuccess = false;
	let popupTitle = '';
	let popupMessage = '';
	let popupHeader = '';

	async function handleSignup() {
		const { error: err, data } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: name } }
		});

		if (err) {
			error = err.message;
		} else {
			// Get the logged-in user
			const {
				data: { user: authUser },
				error: getUserErr
			} = await supabase.auth.getUser();

			if (getUserErr) {
				console.error('Error retrieving user after signup:', getUserErr);
			} else if (authUser) {
				user.set(authUser);
			}

			// Show success popup
			popupHeader = 'Account Created!';
			popupTitle = 'Signup Successful';
			popupMessage = "Your account is ready. Let's get you started.";
			showSuccess = true;
		}
	}

	function goToStep1() {
		showSuccess = false;
		goto('/step1');
	}
</script>

<div class="bg-[#333745] min-h-screen flex flex-col p-6">
	<Header />

	<div class="text-center mt-8 flex-1">
		<h1 class="font-aldrich text-2xl sm:text-4xl text-white">Sign up for Fliq!</h1>

		<p
			class="font-b612-mono-regular tracking-tight text-base sm:text-lg text-[#E8F1F2] mt-5 max-w-3xl mx-auto"
		>
			Create a free account or
			<a href="/login" class="underline text-[#DCDFF5]"> log in </a>.
		</p>

		<form
			class="mt-10 flex flex-col items-center gap-6 text-white"
			on:submit|preventDefault={handleSignup}
		>
			<!-- Name -->
			<input
				type="text"
				required
				name="full-name"
				autocomplete="name"
				placeholder="Full Name"
				bind:value={name}
				class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
			/>

			<!-- Email -->
			<input
				type="email"
				required
				name="email"
				autocomplete="email"
				placeholder="Email"
				bind:value={email}
				class="w-72 px-4 py-2 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
			/>

			<!-- Password -->
			<div class="relative w-72">
				<input
					type={showPassword ? 'text' : 'password'}
					required
					name="password"
					autocomplete="current-password"
					placeholder="Password"
					bind:value={password}
					class="w-full px-4 py-2 pr-10 rounded-md ring-2 ring-[#DCDFF5] focus:ring-2 focus:ring-[#949FF2] focus:outline-none"
				/>

				<button
					type="button"
					on:click={() => (showPassword = !showPassword)}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white"
					aria-label="Toggle password visibility"
				>
					{showPassword ? 'Hide' : 'Show'}
				</button>
			</div>

			<!-- Error message -->
			{#if error}
				<p class="text-red-400 text-sm">{error}</p>
			{/if}

			<!-- Submit -->
			<button
				type="submit"
				class="bg-[#D38A8A] text-white font-aldrich px-8 py-2 rounded-lg border-2 border-white hover:bg-[#C07070] transition duration-300"
			>
				Sign Up
			</button>
		</form>

		<SuccessPopup
			open={showSuccess}
			onContinue={goToStep1}
			header={popupHeader}
			title={popupTitle}
			message={popupMessage}
		/>
	</div>

	<Footer />
</div>
